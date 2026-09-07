"use server";

import { headers } from "next/headers";
import { db } from "@/lib/db";
import { sendContactEnquiry } from "@/lib/email";
import { limitFromEnv, pruneRateLimits, rateLimit } from "@/lib/rate-limit";

/**
 * The contact form.
 *
 * Every enquiry is written to the database first and emailed second: mail can
 * fail or be deleted, and an enquiry that only ever existed as an email is an
 * enquiry that can be lost. The dashboard reads from the table.
 */

export type ContactState =
  | { status: "idle" }
  | { status: "error"; error: string }
  | { status: "sent" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE = 5000;

export async function submitContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  pruneRateLimits();
  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = rateLimit(`contact:${ip}`, {
    limit: limitFromEnv("CONTACT_RATE_LIMIT", 5),
    windowMs: 60 * 60_000,
  });
  if (!limit.ok) {
    return {
      status: "error",
      error: "You've sent several messages already. Please email us directly instead.",
    };
  }

  const value = (key: string) => String(formData.get(key) ?? "").trim();

  const firstName = value("firstName");
  const lastName = value("lastName");
  const email = value("email").toLowerCase();
  const subject = value("subject");
  const message = value("message");

  if (!firstName) return { status: "error", error: "Enter your first name." };
  if (!lastName) return { status: "error", error: "Enter your last name." };
  if (!EMAIL_RE.test(email)) return { status: "error", error: "Enter a valid email address." };
  if (message.length < 10) {
    return { status: "error", error: "Please write a little more so we can help." };
  }
  if (message.length > MAX_MESSAGE) {
    return { status: "error", error: "That message is too long — please shorten it." };
  }

  const record = await db.contactMessage.create({
    data: { firstName, lastName, email, subject: subject || null, message },
  });

  // Emailed after the row exists, and the outcome recorded so the dashboard can
  // show which enquiries were not successfully notified.
  const notified = await sendContactEnquiry({
    name: `${firstName} ${lastName}`,
    email,
    subject,
    message,
  });
  if (notified) {
    await db.contactMessage.update({ where: { id: record.id }, data: { notified: true } });
  }

  return { status: "sent" };
}
