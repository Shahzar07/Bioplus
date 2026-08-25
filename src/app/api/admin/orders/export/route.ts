import { db } from "@/lib/db";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { ORDER_STATUS_LABEL } from "@/lib/order-status";
import type { OrderStatus } from "@/generated/prisma";

/** Orders as CSV, for accounting and shipping tools. */
export const dynamic = "force-dynamic";

/** Escapes a value for CSV, guarding against spreadsheet formula injection. */
function csvCell(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  const guarded = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${guarded.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!isStaff(user)) return new Response("Not authorised", { status: 403 });

  const status = new URL(request.url).searchParams.get("status");

  const orders = await db.order.findMany({
    where: status && status in ORDER_STATUS_LABEL ? { status: status as OrderStatus } : {},
    orderBy: { placedAt: "desc" },
    include: { items: true },
    take: 5000,
  });

  const header = [
    "Order",
    "Placed",
    "Status",
    "Payment",
    "Customer",
    "Email",
    "Phone",
    "Organisation",
    "Address",
    "City",
    "County",
    "Postcode",
    "Country",
    "Items",
    "Subtotal",
    "Discount",
    "Delivery",
    "Total",
    "Tracking",
  ];

  const rows = orders.map((order) =>
    [
      order.number,
      order.placedAt.toISOString(),
      ORDER_STATUS_LABEL[order.status],
      order.paymentStatus,
      `${order.firstName} ${order.lastName}`,
      order.email,
      order.phone ?? "",
      order.organisation ?? "",
      [order.line1, order.line2].filter(Boolean).join(", "),
      order.city,
      order.county ?? "",
      order.postcode,
      order.country,
      order.items.map((i) => `${i.qty}x ${i.sku}`).join("; "),
      Number(order.subtotal).toFixed(2),
      Number(order.discount).toFixed(2),
      Number(order.shipping).toFixed(2),
      Number(order.total).toFixed(2),
      [order.trackingCarrier, order.trackingNumber].filter(Boolean).join(" "),
    ].map(csvCell),
  );

  const csv = [header.map(csvCell), ...rows].map((row) => row.join(",")).join("\r\n");
  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(`﻿${csv}`, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="bioplus-orders-${stamp}.csv"`,
      "cache-control": "no-store",
    },
  });
}
