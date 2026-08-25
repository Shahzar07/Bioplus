import "server-only";
import { db } from "@/lib/db";
import { round2 } from "@/lib/money";

/**
 * Dashboard figures.
 *
 * Revenue counts orders that have been paid for — an order still awaiting a
 * bank transfer is a commitment, not income — and excludes cancellations and
 * refunds. Awaiting-payment value is reported separately so the owner can see
 * what is pending.
 */

export const REVENUE_STATUSES = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] as const;

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function daysAgo(days: number): Date {
  const date = startOfDay(new Date());
  date.setDate(date.getDate() - days);
  return date;
}

export async function getDashboardStats() {
  const today = startOfDay(new Date());
  const last7 = daysAgo(6);
  const last30 = daysAgo(29);

  const paid = { status: { in: [...REVENUE_STATUSES] } };

  const [
    todayAgg,
    weekAgg,
    monthAgg,
    awaitingAgg,
    totalOrders,
    lowStock,
    customers,
    recentOrders,
    dailyRows,
  ] = await Promise.all([
    db.order.aggregate({ where: { ...paid, placedAt: { gte: today } }, _sum: { total: true }, _count: true }),
    db.order.aggregate({ where: { ...paid, placedAt: { gte: last7 } }, _sum: { total: true }, _count: true }),
    db.order.aggregate({ where: { ...paid, placedAt: { gte: last30 } }, _sum: { total: true }, _count: true }),
    db.order.aggregate({ where: { status: "AWAITING_PAYMENT" }, _sum: { total: true }, _count: true }),
    db.order.count(),
    db.variant.findMany({
      where: { product: { status: "ACTIVE" } },
      include: { product: { select: { name: true, slug: true } } },
      orderBy: { stockQty: "asc" },
      take: 60,
    }),
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.order.findMany({
      orderBy: { placedAt: "desc" },
      take: 8,
      include: { items: { select: { id: true, qty: true } } },
    }),
    db.$queryRaw<{ day: Date; total: number; orders: bigint }[]>`
      SELECT date_trunc('day', "placedAt") AS day,
             COALESCE(SUM("total"), 0)::float8 AS total,
             COUNT(*) AS orders
      FROM "Order"
      WHERE "placedAt" >= ${last30}
        AND "status" = ANY(ARRAY['PAID','PROCESSING','SHIPPED','DELIVERED']::"OrderStatus"[])
      GROUP BY 1
      ORDER BY 1
    `,
  ]);

  const monthRevenue = Number(monthAgg._sum.total ?? 0);

  // Fill the gaps so the chart has a bar for every day, not just days with sales.
  const byDay = new Map(
    dailyRows.map((row) => [startOfDay(new Date(row.day)).getTime(), Number(row.total)]),
  );
  const series: { date: Date; total: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = daysAgo(i);
    series.push({ date, total: byDay.get(date.getTime()) ?? 0 });
  }

  return {
    today: { revenue: round2(Number(todayAgg._sum.total ?? 0)), orders: todayAgg._count },
    week: { revenue: round2(Number(weekAgg._sum.total ?? 0)), orders: weekAgg._count },
    month: {
      revenue: round2(monthRevenue),
      orders: monthAgg._count,
      averageOrder: monthAgg._count > 0 ? round2(monthRevenue / monthAgg._count) : 0,
    },
    awaiting: {
      value: round2(Number(awaitingAgg._sum.total ?? 0)),
      count: awaitingAgg._count,
    },
    totalOrders,
    customers,
    lowStock: lowStock.filter((v) => v.stockQty <= v.lowStockAt),
    recentOrders,
    series,
  };
}
