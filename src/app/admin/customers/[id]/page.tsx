import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Mail, Building2, Phone, MapPin } from "lucide-react";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { formatGBP } from "@/lib/cn";
import { formatOrderDate } from "@/lib/order-status";
import { REVENUE_STATUSES } from "@/lib/admin-stats";
import { Panel, PanelHead, StatCard, StatusBadge, TableWrap, Td, Th } from "@/components/admin/ui";
import { CustomerControls } from "@/components/admin/CustomerControls";
import { ShoppingCart, Banknote } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const user = await db.user.findUnique({ where: { id }, select: { name: true, email: true } });
  return { title: user?.name ?? user?.email ?? "Customer" };
}

export default async function CustomerDetail({ params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaff();
  const { id } = await params;

  const user = await db.user.findUnique({
    where: { id },
    include: {
      addresses: true,
      orders: { orderBy: { placedAt: "desc" }, include: { items: { select: { qty: true } } } },
    },
  });
  if (!user) notFound();

  const paid = user.orders.filter((o) =>
    (REVENUE_STATUSES as readonly string[]).includes(o.status),
  );
  const spend = paid.reduce((sum, o) => sum + Number(o.total), 0);

  return (
    <div className="space-y-5">
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink-700 hover:text-brand-700"
      >
        <ArrowLeft size={15} /> All customers
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">
            {user.name ?? user.email}
          </h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13.5px] text-ink-500">
            <span className="inline-flex items-center gap-1.5">
              <Mail size={14} /> {user.email}
            </span>
            {user.phone && (
              <span className="inline-flex items-center gap-1.5">
                <Phone size={14} /> {user.phone}
              </span>
            )}
            {user.organisation && (
              <span className="inline-flex items-center gap-1.5">
                <Building2 size={14} /> {user.organisation}
              </span>
            )}
          </p>
          <p className="mt-1 text-[12.5px] text-ink-500">
            Joined {formatOrderDate(user.createdAt)}
            {user.lastLoginAt ? ` · last signed in ${formatOrderDate(user.lastLoginAt)}` : ""}
          </p>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Orders" value={String(user.orders.length)} icon={ShoppingCart} />
        <StatCard label="Lifetime spend" value={formatGBP(spend)} icon={Banknote} />
        <StatCard
          label="Average order"
          value={formatGBP(paid.length > 0 ? spend / paid.length : 0)}
          icon={Banknote}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Panel>
          <PanelHead title="Order history" />
          {user.orders.length === 0 ? (
            <p className="px-5 py-8 text-center text-[13.5px] text-ink-500">No orders yet.</p>
          ) : (
            <TableWrap>
              <table className="w-full min-w-[520px] border-collapse">
                <thead>
                  <tr>
                    <Th>Order</Th>
                    <Th>Placed</Th>
                    <Th>Items</Th>
                    <Th>Status</Th>
                    <Th className="text-right">Total</Th>
                  </tr>
                </thead>
                <tbody>
                  {user.orders.map((order) => (
                    <tr key={order.id} className="transition hover:bg-mist">
                      <Td>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-semibold text-brand-700 hover:underline"
                        >
                          {order.number}
                        </Link>
                      </Td>
                      <Td className="whitespace-nowrap text-ink-600">
                        {formatOrderDate(order.placedAt)}
                      </Td>
                      <Td className="text-ink-600">
                        {order.items.reduce((sum, item) => sum + item.qty, 0)}
                      </Td>
                      <Td>
                        <StatusBadge status={order.status} />
                      </Td>
                      <Td className="text-right font-semibold">{formatGBP(Number(order.total))}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          )}
        </Panel>

        <div className="space-y-5">
          <CustomerControls
            userId={user.id}
            email={user.email}
            role={user.role}
            status={user.status}
            notes={user.notes ?? ""}
            isSelf={user.id === staff.id}
            canChangeRole={staff.role === "ADMIN"}
          />

          {user.addresses.length > 0 && (
            <Panel>
              <PanelHead title="Research address" />
              <div className="p-5">
                {user.addresses.map((address) => (
                  <address
                    key={address.id}
                    className="flex items-start gap-2 not-italic text-[13.5px] leading-relaxed text-ink-700"
                  >
                    <MapPin size={15} className="mt-0.5 shrink-0 text-ink-500" />
                    <span>
                      {address.org && <span className="block">{address.org}</span>}
                      <span className="block font-semibold text-ink-900">
                        {address.firstName} {address.lastName}
                      </span>
                      <span className="block">{address.line1}</span>
                      {address.line2 && <span className="block">{address.line2}</span>}
                      <span className="block">
                        {address.city}
                        {address.county ? `, ${address.county}` : ""} {address.postcode}
                      </span>
                    </span>
                  </address>
                ))}
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
