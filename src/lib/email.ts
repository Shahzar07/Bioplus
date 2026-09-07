import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { formatGBP } from "@/lib/cn";
import { SITE } from "@/lib/site";
import type { BankTransferSettings } from "@/lib/settings";

/**
 * Transactional email.
 *
 * Delivery goes through the shop's own mailbox over SMTP when SMTP_PASSWORD is
 * set — that is the client's customerservice@ mailbox, so notifications land
 * in the same inbox the team already reads and replies come back to it. Resend
 * remains as a fallback for a deployment that would rather use an API key.
 * With neither configured nothing is sent and the intent is logged instead, so
 * the shop works end to end before mail is set up and order placement is never
 * blocked by a mail failure.
 */

/** cPanel defaults for the biopluslabs.co.uk mailbox; overridable per deploy. */
const SMTP = {
  host: process.env.SMTP_HOST ?? "mail.biopluslabs.co.uk",
  port: Number(process.env.SMTP_PORT ?? 465),
  user: process.env.SMTP_USER ?? "customerservice@biopluslabs.co.uk",
  password: process.env.SMTP_PASSWORD ?? "",
};

/**
 * Mailbox providers reject, or quietly spam-folder, a From that is not the
 * account that authenticated — so when SMTP is configured the sender defaults
 * to that mailbox rather than to the old orders@ address.
 */
const FROM =
  process.env.ORDER_EMAIL_FROM ??
  (SMTP.password ? `BioPlus Labs <${SMTP.user}>` : "BioPlus Labs <orders@biopluslabs.co.uk>");

type SendArgs = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  /** Set on staff notifications so a reply goes to the customer. */
  replyTo?: string;
};

/**
 * One transporter for the process.
 *
 * Built lazily and reused so a burst of orders shares a pooled connection
 * rather than opening a fresh TLS session per email.
 */
let transporter: Transporter | null = null;

function smtpTransport(): Transporter {
  transporter ??= nodemailer.createTransport({
    host: SMTP.host,
    port: SMTP.port,
    // 465 is implicit TLS; 587 starts plain and upgrades with STARTTLS.
    secure: SMTP.port === 465,
    auth: { user: SMTP.user, pass: SMTP.password },
    pool: true,
    maxConnections: 2,
    // A checkout waits on this send, so fail fast rather than sitting on
    // nodemailer's multi-minute defaults if the mail server is unreachable.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  return transporter;
}

async function sendViaSmtp(
  recipients: string[],
  { subject, html, text, replyTo }: Omit<SendArgs, "to">,
): Promise<boolean> {
  try {
    await smtpTransport().sendMail({
      from: FROM,
      to: recipients,
      subject,
      html,
      text,
      ...(replyTo ? { replyTo } : {}),
    });
    return true;
  } catch (error) {
    console.error(`[email] SMTP send failed: "${subject}"`, error);
    return false;
  }
}

async function sendViaResend(
  apiKey: string,
  recipients: string[],
  { subject, html, text, replyTo }: Omit<SendArgs, "to">,
): Promise<boolean> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: recipients,
        subject,
        html,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
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

async function send({ to, ...message }: SendArgs): Promise<boolean> {
  const recipients = (Array.isArray(to) ? to : [to]).filter(Boolean);
  if (recipients.length === 0) {
    console.warn(`[email] skipped (no recipient): "${message.subject}"`);
    return false;
  }

  if (SMTP.password) return sendViaSmtp(recipients, message);

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) return sendViaResend(apiKey, recipients, message);

  console.info(
    `[email] skipped (no SMTP_PASSWORD or RESEND_API_KEY): "${message.subject}" → ${recipients.join(", ")}`,
  );
  return false;
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

  const bankBlock =
    bank.sortCode && bank.accountNumber
      ? `<table style="width:100%;font-size:14px;margin-top:8px">
           <tr><td style="padding:4px 0;color:#565c68">Account name</td><td align="right">${escapeHtml(bank.accountName)}</td></tr>
           <tr><td style="padding:4px 0;color:#565c68">Sort code</td><td align="right">${escapeHtml(bank.sortCode)}</td></tr>
           <tr><td style="padding:4px 0;color:#565c68">Account number</td><td align="right">${escapeHtml(bank.accountNumber)}</td></tr>
           <tr><td style="padding:4px 0;color:#565c68">Reference</td><td align="right"><strong>${escapeHtml(order.number)}</strong></td></tr>
         </table>`
      : `<p style="font-size:14px">We'll follow up with the account details. Please quote <strong>${escapeHtml(order.number)}</strong> as your payment reference.</p>`;

  return send({
    to: order.email,
    subject: `Order ${order.number} received — BioPlus Labs`,
    text: `Thank you for your order ${order.number}. Total ${formatGBP(order.total)}. Payment is by bank transfer using ${order.number} as the reference. ${bank.instructions}`,
    html: layout(
      `Thank you, ${escapeHtml(order.firstName)}`,
      `<p style="font-size:14px;line-height:1.6">Your order <strong>${escapeHtml(order.number)}</strong> has been received and is awaiting payment.</p>
       <table style="width:100%;font-size:14px;border-top:1px solid #dee0e5;border-bottom:1px solid #dee0e5;margin:16px 0">${rows}</table>
       <p style="font-size:16px;font-weight:700">Total ${formatGBP(order.total)}</p>
       <h2 style="font-size:15px;margin:24px 0 4px">Payment by bank transfer</h2>
       ${bankBlock}
       <p style="font-size:13px;color:#565c68;line-height:1.6;margin-top:12px">${escapeHtml(bank.instructions)}</p>`,
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

export type NewOrderAlertData = OrderEmailData & {
  orderId: string;
  lastName: string;
  phone: string | null;
  organisation: string | null;
  address: string[];
  subtotal: number;
  shipping: number;
  discount: number;
  discountCode: string | null;
  customerNote: string | null;
  placedAt: Date;
};

/**
 * Internal "a customer has placed an order" notification.
 *
 * Goes to the addresses configured under Settings → Store, so the team learns
 * about an order without watching the dashboard. It carries everything needed
 * to act on it — customer, delivery address, lines and totals — and replies go
 * to the customer rather than to the shop's own from-address.
 */
export async function sendNewOrderAlert(
  order: NewOrderAlertData,
  recipients: string[],
): Promise<boolean> {
  const customer = `${order.firstName} ${order.lastName}`.trim();

  const rows = order.items
    .map(
      (item) =>
        `<tr><td style="padding:6px 0">${item.qty} × ${escapeHtml(item.name)} <span style="color:#565c68">${escapeHtml(item.label)}</span></td><td align="right" style="padding:6px 0">${formatGBP(item.lineTotal)}</td></tr>`,
    )
    .join("");

  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 0;color:#565c68">${escapeHtml(label)}</td><td align="right">${escapeHtml(value)}</td></tr>`;

  const delivery = order.shipping === 0 ? "Free" : formatGBP(order.shipping);
  const discountLabel = `Discount${order.discountCode ? ` (${order.discountCode})` : ""}`;

  const totals = [
    row("Subtotal", formatGBP(order.subtotal)),
    row("Delivery", delivery),
    order.discount > 0 ? row(discountLabel, `−${formatGBP(order.discount)}`) : "",
  ].join("");

  const placed = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/London",
  }).format(order.placedAt);

  const adminUrl = `https://${SITE.domain}/admin/orders/${order.orderId}`;

  const text = [
    `New order ${order.number} — ${formatGBP(order.total)}`,
    `Placed ${placed}`,
    `Customer: ${customer} <${order.email}>${order.phone ? ` · ${order.phone}` : ""}`,
    order.organisation ? `Organisation: ${order.organisation}` : "",
    `Deliver to: ${order.address.join(", ")}`,
    "",
    ...order.items.map(
      (item) => `${item.qty} × ${item.name} ${item.label} — ${formatGBP(item.lineTotal)}`,
    ),
    "",
    `Subtotal ${formatGBP(order.subtotal)} · Delivery ${delivery}${
      order.discount > 0 ? ` · ${discountLabel} −${formatGBP(order.discount)}` : ""
    }`,
    `Total ${formatGBP(order.total)} — bank transfer, awaiting payment.`,
    order.customerNote ? `Customer note: ${order.customerNote}` : "",
    "",
    `Manage the order: ${adminUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  return send({
    to: recipients,
    replyTo: order.email,
    subject: `New order ${order.number} — ${formatGBP(order.total)} — ${customer}`,
    text,
    html: layout(
      `New order ${order.number}`,
      `<p style="font-size:14px;line-height:1.6">${escapeHtml(customer)} placed an order for <strong>${formatGBP(order.total)}</strong> on ${escapeHtml(placed)}. It is awaiting a bank transfer quoting <strong>${escapeHtml(order.number)}</strong>.</p>
       <table style="width:100%;font-size:14px;border-top:1px solid #dee0e5;border-bottom:1px solid #dee0e5;margin:16px 0">${rows}</table>
       <table style="width:100%;font-size:14px">${totals}
         <tr><td style="padding:8px 0;font-size:16px;font-weight:700">Total</td><td align="right" style="padding:8px 0;font-size:16px;font-weight:700">${formatGBP(order.total)}</td></tr>
       </table>
       <h2 style="font-size:15px;margin:24px 0 4px">Customer</h2>
       <table style="width:100%;font-size:14px">
         ${row("Name", customer)}
         ${row("Email", order.email)}
         ${order.phone ? row("Phone", order.phone) : ""}
         ${order.organisation ? row("Organisation", order.organisation) : ""}
       </table>
       <h2 style="font-size:15px;margin:24px 0 4px">Deliver to</h2>
       <p style="font-size:14px;line-height:1.6;margin:0">${order.address.map(escapeHtml).join("<br>")}</p>
       ${
         order.customerNote
           ? `<h2 style="font-size:15px;margin:24px 0 4px">Customer note</h2>
              <p style="font-size:14px;line-height:1.6;margin:0">${escapeHtml(order.customerNote)}</p>`
           : ""
       }
       <p style="margin:24px 0 0"><a href="${adminUrl}" style="display:inline-block;background:#f85000;color:#fff;font-size:14px;font-weight:700;text-decoration:none;padding:10px 18px;border-radius:999px">Open in the dashboard</a></p>`,
    ),
  });
}
