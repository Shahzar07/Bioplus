import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { rateLimit, pruneRateLimits } from "@/lib/rate-limit";
import { PAYMENT_PROOF_MAX_BYTES, PAYMENT_PROOF_TYPES } from "@/lib/payments";

/**
 * Proof of a bank transfer, uploaded by the customer from their order's
 * payment page.
 *
 * Authorised by the order's own access key — the same unguessable value that
 * lets a guest see the page at all — so no account is needed, and knowing an
 * order number is not enough to attach anything to it.
 */
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  pruneRateLimits();
  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = rateLimit(`payment-proof:${ip}`, { limit: 20, windowMs: 10 * 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many uploads from this connection. Please wait a moment." },
      { status: 429 },
    );
  }

  const formData = await request.formData();
  const number = String(formData.get("number") ?? "").trim();
  const key = String(formData.get("key") ?? "");
  const file = formData.get("file");

  const order = number ? await db.order.findUnique({ where: { number } }) : null;
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  const user = await getCurrentUser();
  const permitted =
    (key !== "" && key === order.accessKey) ||
    (user !== null && (order.userId === user.id || isStaff(user)));
  if (!permitted) return NextResponse.json({ error: "Not authorised." }, { status: 403 });

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No screenshot received." }, { status: 400 });
  }
  if (file.size > PAYMENT_PROOF_MAX_BYTES) {
    return NextResponse.json({ error: "Screenshots must be 8 MB or smaller." }, { status: 413 });
  }
  // Images only: this is a screenshot of a payment, not a document.
  if (!PAYMENT_PROOF_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Upload a screenshot image — JPEG, PNG, WebP or HEIC." },
      { status: 415 },
    );
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Uploads are not configured on this store. Your transfer still reaches us — no screenshot is needed.",
      },
      { status: 501 },
    );
  }

  try {
    const blob = await put(`payment-proof/${order.number}-${Date.now()}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });

    const alreadyHadOne = Boolean(order.paymentProofUrl);
    await db.$transaction([
      db.order.update({
        where: { id: order.id },
        data: { paymentProofUrl: blob.url, paymentProofUploadedAt: new Date() },
      }),
      db.orderEvent.create({
        data: {
          orderId: order.id,
          type: "NOTE",
          message: alreadyHadOne
            ? "Customer replaced their payment screenshot."
            : "Customer uploaded a payment screenshot.",
        },
      }),
    ]);

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("payment proof upload failed", error);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 502 });
  }
}
