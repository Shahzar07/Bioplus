import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { rateLimit, pruneRateLimits } from "@/lib/rate-limit";
import { PAYMENT_PROOF_MAX_BYTES, PAYMENT_PROOF_TYPES } from "@/lib/payments";

/**
 * The screenshot of a bank transfer, uploaded by the customer from their
 * order's payment page and read back by them and by staff.
 *
 * Stored in the database, so the feature needs nothing configured to work.
 * Authorised by the order's own access key — the same unguessable value that
 * lets a guest see the payment page — so no account is needed, and knowing an
 * order number is not enough to attach anything to an order or read it back.
 */
export const dynamic = "force-dynamic";

type Authorised =
  | { ok: true; order: { id: string; number: string; accessKey: string } }
  | { ok: false; response: NextResponse };

async function authorise(number: string, key: string): Promise<Authorised> {
  const order = number
    ? await db.order.findUnique({
        where: { number },
        select: { id: true, number: true, accessKey: true, userId: true },
      })
    : null;
  if (!order) {
    return { ok: false, response: NextResponse.json({ error: "Order not found." }, { status: 404 }) };
  }

  const user = await getCurrentUser();
  const permitted =
    (key !== "" && key === order.accessKey) ||
    (user !== null && (order.userId === user.id || isStaff(user)));
  if (!permitted) {
    return { ok: false, response: NextResponse.json({ error: "Not authorised." }, { status: 403 }) };
  }
  return { ok: true, order };
}

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
  const auth = await authorise(
    String(formData.get("number") ?? "").trim(),
    String(formData.get("key") ?? ""),
  );
  if (!auth.ok) return auth.response;

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No screenshot received." }, { status: 400 });
  }
  // Images only: this is a screenshot of a payment, not a document.
  if (!PAYMENT_PROOF_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Upload a screenshot image — JPEG, PNG, WebP or HEIC." },
      { status: 415 },
    );
  }
  if (file.size > PAYMENT_PROOF_MAX_BYTES) {
    return NextResponse.json(
      { error: "That screenshot is too large even after resizing. Try a cropped one." },
      { status: 413 },
    );
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const existing = await db.order.findUnique({
      where: { id: auth.order.id },
      select: { paymentProofUploadedAt: true },
    });

    await db.$transaction([
      db.order.update({
        where: { id: auth.order.id },
        data: {
          paymentProofData: bytes,
          paymentProofType: file.type,
          paymentProofUploadedAt: new Date(),
        },
      }),
      db.orderEvent.create({
        data: {
          orderId: auth.order.id,
          type: "NOTE",
          message: existing?.paymentProofUploadedAt
            ? "Customer replaced their payment screenshot."
            : "Customer uploaded a payment screenshot.",
        },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("payment proof upload failed", error);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 502 });
  }
}

/** Serves the stored screenshot back to the customer or to staff. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const auth = await authorise(
    (url.searchParams.get("number") ?? "").trim(),
    url.searchParams.get("key") ?? "",
  );
  if (!auth.ok) return auth.response;

  const order = await db.order.findUnique({
    where: { id: auth.order.id },
    select: { paymentProofData: true, paymentProofType: true },
  });
  if (!order?.paymentProofData) {
    return NextResponse.json({ error: "No screenshot on this order." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(order.paymentProofData), {
    headers: {
      "content-type": order.paymentProofType ?? "image/jpeg",
      // Personal to one order: never cached by a shared proxy.
      "cache-control": "private, max-age=0, must-revalidate",
    },
  });
}
