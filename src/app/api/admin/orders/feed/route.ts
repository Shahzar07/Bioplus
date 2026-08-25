import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isStaff } from "@/lib/auth";

/**
 * The dashboard's live order feed.
 *
 * Polled by the client rather than streamed: a persistent SSE connection holds
 * a serverless function open for the whole session, which on a dashboard left
 * open all day costs roughly a function-hour per hour. A 3-second poll of this
 * endpoint costs a few thousand short invocations a day and is
 * indistinguishable to the person watching it.
 *
 * Pass ?after=<orderId> to get orders placed since that one.
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!isStaff(user)) {
    return NextResponse.json({ error: "Not authorised" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const after = searchParams.get("after");

  const since = after
    ? await db.order.findUnique({ where: { id: after }, select: { placedAt: true } })
    : null;

  const [newOrders, awaitingPayment, latest] = await Promise.all([
    since
      ? db.order.findMany({
          where: { placedAt: { gt: since.placedAt } },
          orderBy: { placedAt: "desc" },
          take: 10,
          select: {
            id: true,
            number: true,
            total: true,
            firstName: true,
            lastName: true,
            placedAt: true,
          },
        })
      : Promise.resolve([]),
    db.order.count({ where: { status: "AWAITING_PAYMENT" } }),
    db.order.findFirst({ orderBy: { placedAt: "desc" }, select: { id: true } }),
  ]);

  return NextResponse.json(
    {
      latestOrderId: latest?.id ?? null,
      awaitingPayment,
      orders: newOrders.map((o) => ({
        id: o.id,
        number: o.number,
        total: Number(o.total),
        customer: `${o.firstName} ${o.lastName}`.trim(),
        placedAt: o.placedAt.toISOString(),
      })),
    },
    { headers: { "cache-control": "no-store" } },
  );
}
