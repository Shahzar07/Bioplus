import Link from "next/link";
import { ShoppingCart, Search, Download } from "lucide-react";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { formatGBP } from "@/lib/cn";
import { ORDER_STATUS_LABEL, formatOrderDate } from "@/lib/order-status";
import type { OrderStatus, Prisma } from "@/generated/prisma";
import { EmptyState, Panel, StatusBadge, TableWrap, Td, Th } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Orders" };

const TABS: { label: string; status?: OrderStatus }[] = [
  { label: "All" },
  { label: ORDER_STATUS_LABEL.AWAITING_PAYMENT, status: "AWAITING_PAYMENT" },
  { label: ORDER_STATUS_LABEL.PAID, status: "PAID" },
  { label: ORDER_STATUS_LABEL.PROCESSING, status: "PROCESSING" },
  { label: ORDER_STATUS_LABEL.SHIPPED, status: "SHIPPED" },
  { label: ORDER_STATUS_LABEL.DELIVERED, status: "DELIVERED" },
  { label: ORDER_STATUS_LABEL.CANCELLED, status: "CANCELLED" },
];

const PAGE_SIZE = 25;

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  await requireStaff();
  const { status, q, page } = await searchParams;

  const currentPage = Math.max(1, Number.parseInt(page ?? "1", 10) || 1);
  const query = q?.trim() ?? "";

  const where: Prisma.OrderWhereInput = {
    ...(status && status in ORDER_STATUS_LABEL ? { status: status as OrderStatus } : {}),
    ...(query
      ? {
          OR: [
            { number: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { lastName: { contains: query, mode: "insensitive" } },
            { postcode: { contains: query, mode: "insensitive" } },
            { items: { some: { sku: { contains: query, mode: "insensitive" } } } },
          ],
        }
      : {}),
  };

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      orderBy: { placedAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { items: { select: { id: true, qty: true } } },
    }),
    db.order.count({ where }),
  ]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const linkFor = (next: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { status, q: query || undefined, ...next };
    for (const [key, value] of Object.entries(merged)) {
      if (value) params.set(key, value);
    }
    const search = params.toString();
    return `/admin/orders${search ? `?${search}` : ""}`;
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">Orders</h1>
          <p className="mt-1 text-[13.5px] text-ink-500">
            {total} {total === 1 ? "order" : "orders"}
            {status ? ` · ${ORDER_STATUS_LABEL[status as OrderStatus]}` : ""}
            {query ? ` · matching “${query}”` : ""}
          </p>
        </div>
        <a
          href={`/api/admin/orders/export${status ? `?status=${status}` : ""}`}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-white px-4 text-[13px] font-semibold text-ink-800 transition hover:border-brand-500 hover:text-brand-700"
        >
          <Download size={15} /> Export CSV
        </a>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((tab) => {
          const active = (tab.status ?? "") === (status ?? "");
          return (
            <Link
              key={tab.label}
              href={linkFor({ status: tab.status, page: undefined })}
              className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${
                active
                  ? "brand-gradient text-white"
                  : "border border-line bg-white text-ink-700 hover:border-brand-500 hover:text-brand-700"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}

        <form action="/admin/orders" className="ml-auto flex items-center gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-500"
            />
            <input
              name="q"
              defaultValue={query}
              placeholder="Order, email, SKU, postcode"
              aria-label="Search orders"
              className="h-9 w-[260px] max-w-full rounded-full border border-line bg-white pl-9 pr-3 text-[13px] outline-none transition focus:border-brand-500"
            />
          </div>
        </form>
      </div>

      <Panel>
        {orders.length === 0 ? (
          <EmptyState icon={ShoppingCart} title="No orders here">
            {query || status
              ? "Try a different filter or search."
              : "Orders placed on the storefront appear here instantly."}
          </EmptyState>
        ) : (
          <TableWrap>
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr>
                  <Th>Order</Th>
                  <Th>Customer</Th>
                  <Th>Placed</Th>
                  <Th>Items</Th>
                  <Th>Payment</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Total</Th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="transition hover:bg-mist">
                    <Td>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-semibold text-brand-700 hover:underline"
                      >
                        {order.number}
                      </Link>
                    </Td>
                    <Td>
                      {order.firstName} {order.lastName}
                      <span className="block text-[12px] text-ink-500">{order.email}</span>
                    </Td>
                    <Td className="whitespace-nowrap text-ink-600">
                      {formatOrderDate(order.placedAt)}
                    </Td>
                    <Td className="text-ink-600">
                      {order.items.reduce((sum, item) => sum + item.qty, 0)}
                    </Td>
                    <Td className="text-ink-600">
                      {order.paymentStatus === "PAID" ? (
                        <span className="font-semibold text-emerald-700">Paid</span>
                      ) : order.paymentStatus === "REFUNDED" ? (
                        "Refunded"
                      ) : (
                        <span className="font-semibold text-amber-700">Pending</span>
                      )}
                    </Td>
                    <Td>
                      <StatusBadge status={order.status} />
                    </Td>
                    <Td className="whitespace-nowrap text-right font-semibold">
                      {formatGBP(Number(order.total))}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        )}
      </Panel>

      {pageCount > 1 && (
        <nav className="flex items-center justify-between text-[13px]">
          <span className="text-ink-500">
            Page {currentPage} of {pageCount}
          </span>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link
                href={linkFor({ page: String(currentPage - 1) })}
                className="rounded-full border border-line bg-white px-4 py-1.5 font-semibold text-ink-700 hover:border-brand-500"
              >
                Previous
              </Link>
            )}
            {currentPage < pageCount && (
              <Link
                href={linkFor({ page: String(currentPage + 1) })}
                className="rounded-full border border-line bg-white px-4 py-1.5 font-semibold text-ink-700 hover:border-brand-500"
              >
                Next
              </Link>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
