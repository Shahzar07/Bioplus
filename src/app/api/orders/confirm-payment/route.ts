import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { sendPaymentConfirmedAlert } from "@/lib/email";

/**
 * The customer's own "I have paid" — it stops their countdown and tells the
 * shop to go and look at the bank.
 *
 * It never marks the order paid: only money arriving does that, and only staff
 * record it. A screenshot must already be attached, so the confirmation always
 * arrives with something to check it against.
 */
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { number?: string; key?: string };
  const number = String(body.number ?? "").trim();
  const key = String(body.key ?? "");

  const order = number ? await db.order.findUnique({ where: { number } }) : null;
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  const user = await getCurrentUser();
  const permitted =
    (key !== "" && key === order.accessKey) ||
    (user !== null && (order.userId === user.id || isStaff(user)));
  if (!permitted) return NextResponse.json({ error: "Not authorised." }, { status: 403 });

  if (!order.paymentProofUploadedAt) {
    return NextResponse.json(
      { error: "Upload your payment screenshot first." },
      { status: 409 },
    );
  }

  // Already confirmed: report success rather than logging a second event, so a
  // double click or a retry is harmless.
  if (order.paymentConfirmedAt) {
    return NextResponse.json({ ok: true, confirmedAt: order.paymentConfirmedAt.toISOString() });
  }

  const confirmedAt = new Date();
  await db.$transaction([
    db.order.update({ where: { id: order.id }, data: { paymentConfirmedAt: confirmedAt } }),
    db.orderEvent.create({
      data: {
        orderId: order.id,
        type: "NOTE",
        message: "Customer confirmed they have paid and attached a screenshot.",
      },
    }),
  ]);

  void sendPaymentConfirmedAlert({
    number: order.number,
    customerEmail: order.email,
    total: Number(order.total),
  });

  return NextResponse.json({ ok: true, confirmedAt: confirmedAt.toISOString() });
}
