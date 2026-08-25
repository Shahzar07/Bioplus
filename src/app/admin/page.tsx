import Link from "next/link";
import {
  Banknote,
  ShoppingCart,
  Clock,
  TrendingUp,
  Users,
  AlertTriangle,
  Package,
} from "lucide-react";
import { requireStaff } from "@/lib/auth";
import { getDashboardStats } from "@/lib/admin-stats";
import { formatGBP } from "@/lib/cn";
import { formatOrderDate } from "@/lib/order-status";
import { RevenueChart } from "@/components/admin/RevenueChart";
import {
  EmptyState,
  Panel,
  PanelHead,
  StatCard,
  StatusBadge,
  TableWrap,
  Td,
  Th,
} from "@/components/admin/ui";

export default async function AdminOverview() {
  const user = await requireStaff();
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">
          Welcome back, {(user.name ?? user.email).split(" ")[0]}
        </h1>
        <p className="mt-1 text-[13.5px] text-ink-500">
          Live view of orders, revenue and stock across BioPlus Labs.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Revenue today"
          value={formatGBP(stats.today.revenue)}
          hint={`${stats.today.orders} paid ${stats.today.orders === 1 ? "order" : "orders"}`}
          icon={Banknote}
        />
        <StatCard
          label="Last 30 days"
          value={formatGBP(stats.month.revenue)}
          hint={`${stats.month.orders} orders · ${formatGBP(stats.month.averageOrder)} average`}
          icon={TrendingUp}
        />
        <StatCard
          label="Awaiting payment"
          value={String(stats.awaiting.count)}
          hint={`${formatGBP(stats.awaiting.value)} pending`}
          icon={Clock}
          href="/admin/orders?status=AWAITING_PAYMENT"
          tone={stats.awaiting.count > 0 ? "warn" : "default"}
        />
        <StatCard
          label="Low stock"
          value={String(stats.lowStock.length)}
          hint={stats.lowStock.length > 0 ? "SKUs at or below threshold" : "All SKUs healthy"}
          icon={AlertTriangle}
          href="/admin/inventory?filter=low"
          tone={stats.lowStock.length > 0 ? "warn" : "default"}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Panel>
          <PanelHead
            title="Revenue — last 30 days"
            subtitle="Paid orders only; awaiting-payment orders are excluded."
          />
          <RevenueChart series={stats.series} />
        </Panel>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <StatCard
            label="Total orders"
            value={String(stats.totalOrders)}
            icon={ShoppingCart}
            href="/admin/orders"
          />
          <StatCard
            label="Customers"
            value={String(stats.customers)}
            icon={Users}
            href="/admin/customers"
          />
        </div>
      </div>

      <Panel>
        <PanelHead
          title="Recent orders"
          action={
            <Link href="/admin/orders" className="text-[13px] font-semibold text-brand-700 hover:underline">
              View all
            </Link>
          }
        />
        {stats.recentOrders.length === 0 ? (
          <EmptyState icon={ShoppingCart} title="No orders yet">
            Orders placed on the storefront appear here the moment they are made.
          </EmptyState>
        ) : (
          <TableWrap>
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr>
                  <Th>Order</Th>
                  <Th>Customer</Th>
                  <Th>Placed</Th>
                  <Th>Items</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Total</Th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
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
                    <Td className="whitespace-nowrap text-ink-600">{formatOrderDate(order.placedAt)}</Td>
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

      {stats.lowStock.length > 0 && (
        <Panel>
          <PanelHead
            title="Low stock"
            subtitle="At or below the per-SKU threshold."
            action={
              <Link href="/admin/inventory" className="text-[13px] font-semibold text-brand-700 hover:underline">
                Manage inventory
              </Link>
            }
          />
          <TableWrap>
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr>
                  <Th>Product</Th>
                  <Th>SKU</Th>
                  <Th>Option</Th>
                  <Th className="text-right">In stock</Th>
                  <Th className="text-right">Threshold</Th>
                </tr>
              </thead>
              <tbody>
                {stats.lowStock.map((variant) => (
                  <tr key={variant.id} className="transition hover:bg-mist">
                    <Td className="font-semibold">
                      <span className="inline-flex items-center gap-2">
                        <Package size={15} className="text-ink-500" />
                        {variant.product.name}
                      </span>
                    </Td>
                    <Td className="font-mono text-[12.5px] text-ink-600">{variant.sku}</Td>
                    <Td className="text-ink-600">{variant.label}</Td>
                    <Td
                      className={`text-right font-bold ${variant.stockQty === 0 ? "text-red-600" : "text-amber-600"}`}
                    >
                      {variant.stockQty}
                    </Td>
                    <Td className="text-right text-ink-500">{variant.lowStockAt}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </Panel>
      )}
    </div>
  );
}
