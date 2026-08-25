import Link from "next/link";
import type { Metadata } from "next";
import { Users, Search } from "lucide-react";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { formatGBP } from "@/lib/cn";
import { formatOrderDate } from "@/lib/order-status";
import { REVENUE_STATUSES } from "@/lib/admin-stats";
import { EmptyState, Panel, TableWrap, Td, Th } from "@/components/admin/ui";
import type { Prisma } from "@/generated/prisma";

export const metadata: Metadata = { title: "Customers" };

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireStaff();
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const where: Prisma.UserWhereInput = query
    ? {
        OR: [
          { email: { contains: query, mode: "insensitive" } },
          { name: { contains: query, mode: "insensitive" } },
          { organisation: { contains: query, mode: "insensitive" } },
        ],
      }
    : {};

  const users = await db.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      orders: {
        select: { total: true, status: true, placedAt: true },
        orderBy: { placedAt: "desc" },
      },
    },
  });

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">
            Customers
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-500">
            {users.length} {users.length === 1 ? "account" : "accounts"}
            {query ? ` matching “${query}”` : ""}
          </p>
        </div>
        <form action="/admin/customers" className="relative">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-500"
          />
          <input
            name="q"
            defaultValue={query}
            placeholder="Name, email or lab"
            aria-label="Search customers"
            className="h-9 w-[260px] max-w-full rounded-full border border-line bg-white pl-9 pr-3 text-[13px] outline-none transition focus:border-brand-500"
          />
        </form>
      </header>

      <Panel>
        {users.length === 0 ? (
          <EmptyState icon={Users} title="No accounts yet">
            Customers appear here when they register. Guest orders are listed under Orders.
          </EmptyState>
        ) : (
          <TableWrap>
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr>
                  <Th>Customer</Th>
                  <Th>Role</Th>
                  <Th className="text-right">Orders</Th>
                  <Th className="text-right">Lifetime spend</Th>
                  <Th>Last order</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const paid = user.orders.filter((o) =>
                    (REVENUE_STATUSES as readonly string[]).includes(o.status),
                  );
                  const spend = paid.reduce((sum, o) => sum + Number(o.total), 0);
                  const last = user.orders[0];

                  return (
                    <tr key={user.id} className="transition hover:bg-mist">
                      <Td>
                        <Link
                          href={`/admin/customers/${user.id}`}
                          className="font-semibold text-brand-700 hover:underline"
                        >
                          {user.name ?? user.email}
                        </Link>
                        <span className="block text-[12px] text-ink-500">{user.email}</span>
                        {user.organisation && (
                          <span className="block text-[12px] text-ink-500">{user.organisation}</span>
                        )}
                      </Td>
                      <Td>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${
                            user.role === "CUSTOMER"
                              ? "bg-haze text-ink-600"
                              : "bg-brand-50 text-brand-700"
                          }`}
                        >
                          {user.role.toLowerCase()}
                        </span>
                      </Td>
                      <Td className="text-right">{user.orders.length}</Td>
                      <Td className="text-right font-semibold">{formatGBP(spend)}</Td>
                      <Td className="whitespace-nowrap text-ink-600">
                        {last ? formatOrderDate(last.placedAt) : "—"}
                      </Td>
                      <Td>
                        {user.status === "ACTIVE" ? (
                          <span className="text-[12.5px] font-semibold text-emerald-700">Active</span>
                        ) : (
                          <span className="text-[12.5px] font-semibold text-red-600">Suspended</span>
                        )}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableWrap>
        )}
      </Panel>
    </div>
  );
}
