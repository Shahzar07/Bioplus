import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { formatGBP } from "@/lib/cn";
import { bankTransferRows, hasBankDetails, orderReceivedPath } from "@/lib/payments";
import type { BankTransferSettings } from "@/lib/settings";

/**
 * Transactional email.
 *
 * Sent over SMTP from the store's own mailbox when SMTP_PASSWORD is set —
 * everything else has a working default, so that one secret is all a deployment
 * needs. Resend is kept as a fallback for anyone using it, and with neither
 * configured the intent is logged rather than sent: the shop works end to end
 * before email is configured, and order placement is never blocked by a mail
 * failure.
 */

const SMTP = {
  host: process.env.SMTP_HOST ?? "de9000-r.dnsiaas.com",
  port: Number(process.env.SMTP_PORT ?? 465),
  user: process.env.SMTP_USER ?? "alex@biopluslabs.co.uk",
  password: process.env.SMTP_PASSWORD ?? "",
};

/** Port 465 is implicit TLS; 587 upgrades with STARTTLS. */
const SMTP_SECURE = process.env.SMTP_SECURE
  ? process.env.SMTP_SECURE === "true"
  : SMTP.port === 465;

/**
 * The envelope sender defaults to the mailbox we authenticate as.
 *
 * A From that does not match the authenticated account is what gets mail
 * refused by the server or filed as spam by the recipient, so overriding this
 * is only safe when the domain's SPF and DKIM cover the address used.
 */
const FROM = process.env.ORDER_EMAIL_FROM ?? `BioPlus Labs <${SMTP.user}>`;

let transporter: Transporter | null = null;

function smtpTransport(): Transporter | null {
  if (!SMTP.password) return null;
  transporter ??= nodemailer.createTransport({
    host: SMTP.host,
    port: SMTP.port,
    secure: SMTP_SECURE,
    auth: { user: SMTP.user, pass: SMTP.password },
  });
  return transporter;
}

/**
 * Absolute base for links in email. Vercel sets the production URL; locally
 * SITE_URL covers a tunnel or a different port.
 */
function siteOrigin(): string {
  const configured = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "https://biopluslabs.co.uk";
}

type SendArgs = { to: string; subject: string; html: string; text: string };

async function send({ to, subject, html, text }: SendArgs): Promise<boolean> {
  const smtp = smtpTransport();
  if (smtp) {
    try {
      const info = await smtp.sendMail({
        from: FROM,
        to,
        subject,
        text,
        html,
        // Replies belong with the people who read the shop inbox.
        replyTo: process.env.ORDER_EMAIL_REPLY_TO ?? SMTP.user,
      });
      console.info(`[email] sent via SMTP: "${subject}" → ${to} (${info.messageId})`);
      return true;
    } catch (error) {
      console.error("[email] SMTP send failed", error);
      // Fall through to Resend if it is configured, rather than losing the mail.
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (!smtp) {
      console.info(`[email] skipped (no SMTP_PASSWORD and no RESEND_API_KEY): "${subject}" → ${to}`);
    }
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to, subject, html, text }),
    });
    if (!res.ok) {
      console.error(`[email] failed (${res.status}): ${await res.text()}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[email] request failed", error);
    return false;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function layout(heading: string, body: string): string {
  return `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#0d0e11">
  <div style="background:linear-gradient(120deg,#cc3d02,#f85000 45%,#ff8038);padding:20px 24px;border-radius:12px 12px 0 0">
    <p style="margin:0;color:#fff;font-size:18px;font-weight:700">BioPlus Labs</p>
  </div>
  <div style="border:1px solid #dee0e5;border-top:0;border-radius:0 0 12px 12px;padding:24px">
    <h1 style="margin:0 0 16px;font-size:20px">${escapeHtml(heading)}</h1>
    ${body}
    <p style="margin-top:24px;font-size:12px;color:#565c68;line-height:1.6">
      Research Use Only. All products are supplied strictly for laboratory research and are not for
      human or animal consumption.
    </p>
  </div>
</div>`;
}

export type OrderEmailData = {
  number: string;
  accessKey: string;
  email: string;
  firstName: string;
  total: number;
  items: { name: string; label: string; qty: number; lineTotal: number }[];
};

export async function sendOrderConfirmation(
  order: OrderEmailData,
  bank: BankTransferSettings,
): Promise<boolean> {
  const rows = order.items
    .map(
      (item) =>
        `<tr><td style="padding:6px 0">${item.qty} × ${escapeHtml(item.name)} <span style="color:#565c68">${escapeHtml(item.label)}</span></td><td align="right" style="padding:6px 0">${formatGBP(item.lineTotal)}</td></tr>`,
    )
    .join("");

  const details = bankTransferRows(bank, order.number);
  const bankBlock = hasBankDetails(bank)
    ? `<table style="width:100%;font-size:14px;margin-top:8px">${details
        .map(
          (row) =>
            `<tr><td style="padding:4px 0;color:#565c68">${escapeHtml(row.label)}</td><td align="right">${
              row.emphasise ? `<strong>${escapeHtml(row.value)}</strong>` : escapeHtml(row.value)
            }</td></tr>`,
        )
        .join("")}</table>`
    : `<p style="font-size:14px">We'll follow up with the account details. Please quote <strong>${escapeHtml(order.number)}</strong> as your payment reference.</p>`;

  // The same page the customer saw after checking out, so the details survive
  // a closed tab and never need to be re-sent by hand.
  const paymentUrl = `${siteOrigin()}${orderReceivedPath(order.number, order.accessKey)}`;

  return send({
    to: order.email,
    subject: `Order ${order.number} received — BioPlus Labs`,
    text: [
      `Thank you for your order ${order.number}. Total ${formatGBP(order.total)}.`,
      `Payment is by direct bank transfer, quoting ${order.number} as the reference:`,
      ...details.map((row) => `  ${row.label}: ${row.value}`),
      bank.instructions,
      `Payment details and order status: ${paymentUrl}`,
    ].join("\n"),
    html: layout(
      `Thank you, ${escapeHtml(order.firstName)}`,
      `<p style="font-size:14px;line-height:1.6">Your order <strong>${escapeHtml(order.number)}</strong> has been received and is awaiting payment.</p>
       <table style="width:100%;font-size:14px;border-top:1px solid #dee0e5;border-bottom:1px solid #dee0e5;margin:16px 0">${rows}</table>
       <p style="font-size:16px;font-weight:700">Total ${formatGBP(order.total)}</p>
       <h2 style="font-size:15px;margin:24px 0 4px">Payment by bank transfer</h2>
       ${bankBlock}
       <p style="font-size:13px;color:#565c68;line-height:1.6;margin-top:12px">${escapeHtml(bank.instructions)}</p>
       <p style="margin:20px 0 0"><a href="${paymentUrl}" style="display:inline-block;background:#f85000;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:11px 20px;border-radius:999px">View payment details</a></p>`,
    ),
  });
}

export async function sendShippedEmail(order: {
  number: string;
  email: string;
  firstName: string;
  trackingCarrier: string | null;
  trackingNumber: string | null;
}): Promise<boolean> {
  const tracking = order.trackingNumber
    ? `<p style="font-size:14px">Tracking: <strong>${escapeHtml(
        [order.trackingCarrier, order.trackingNumber].filter(Boolean).join(" "),
      )}</strong></p>`
    : "";

  return send({
    to: order.email,
    subject: `Order ${order.number} has shipped — BioPlus Labs`,
    text: `Your order ${order.number} has shipped.${
      order.trackingNumber ? ` Tracking: ${order.trackingNumber}` : ""
    }`,
    html: layout(
      "Your order is on its way",
      `<p style="font-size:14px;line-height:1.6">Order <strong>${escapeHtml(order.number)}</strong> has been dispatched.</p>${tracking}`,
    ),
  });
}
