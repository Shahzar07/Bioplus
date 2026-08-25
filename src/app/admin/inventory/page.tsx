import Link from "next/link";
import type { Metadata } from "next";
import { Boxes } from "lucide-react";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { formatGBP } from "@/lib/cn";
import { EmptyState, Panel, PanelHead, TableWrap, Td, Th } from "@/components/admin/ui";
import { AvailabilityToggle } from "@/components/admin/AvailabilityToggle";
import { StockAdjuster } from "@/components/admin/StockAdjuster";

export const metadata: Metadata = { title: "Inventory" };

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  await requireStaff();
  const { filter } = await searchParams;
  const lowOnly = filter === "low";

  const variants = await db.variant.findMany({
    where: { product: { status: { not: "ARCHIVED" } } },
    include: { product: { select: { id: true, name: true, slug: true, status: true } } },
    orderBy: [{ stockQty: "asc" }, { sku: "asc" }],
  });

  const visible = lowOnly ? variants.filter((v) => v.stockQty <= v.lowStockAt) : variants;
  const stockValue = variants.reduce((sum, v) => sum + Number(v.price) * v.stockQty, 0);

  const movements = await db.stockMovement.findMany({
    orderBy: { createdAt: "desc" },
    take: 12,
    include: {
      variant: { select: { sku: true } },
      actor: { select: { name: true, email: true } },
    },
  });

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">
            Inventory
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-500">
            {variants.length} SKUs · {formatGBP(stockValue)} of stock at retail value
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/inventory"
            className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${
              lowOnly
                ? "border border-line bg-white text-ink-700 hover:border-brand-500"
                : "brand-gradient text-white"
            }`}
          >
            All SKUs
          </Link>
          <Link
            href="/admin/inventory?filter=low"
            className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${
              lowOnly
                ? "brand-gradient text-white"
                : "border border-line bg-white text-ink-700 hover:border-brand-500"
            }`}
          >
            Low stock
          </Link>
        </div>
      </header>

      <Panel>
        {visible.length === 0 ? (
          <EmptyState icon={Boxes} title="Nothing low on stock">
            Every SKU is above its alert threshold.
          </EmptyState>
        ) : (
          <TableWrap>
            <table className="w-full min-w-[820px] border-collapse">
              <thead>
                <tr>
                  <Th>SKU</Th>
                  <Th>Product</Th>
                  <Th>Availability</Th>
                  <Th className="text-right">In stock</Th>
                  <Th className="text-right">Alert at</Th>
                  <Th className="text-right">Adjust</Th>
                </tr>
              </thead>
              <tbody>
                {visible.map((variant) => (
                  <tr key={variant.id} className="transition hover:bg-mist">
                    <Td className="font-mono text-[12.5px] font-semibold text-ink-800">
                      {variant.sku}
                    </Td>
                    <Td>
                      <Link
                        href={`/admin/products/${variant.product.id}`}
                        className="font-semibold text-ink-900 hover:text-brand-700"
                      >
                        {variant.product.name}
                      </Link>
                      <span className="block text-[12px] text-ink-500">
                        {variant.label}
                        {variant.product.status !== "ACTIVE" && " · draft"}
                      </span>
                    </Td>
                    <Td>
                      <AvailabilityToggle
                        variantId={variant.id}
                        sku={variant.sku}
                        availability={variant.availability}
                      />
                    </Td>
                    <Td
                      data-testid={`stock-${variant.sku}`}
                      className={`text-right font-bold ${
                        variant.stockQty === 0
                          ? "text-red-600"
                          : variant.stockQty <= variant.lowStockAt
                            ? "text-amber-600"
                            : "text-ink-900"
                      }`}
                    >
                      {variant.stockQty}
                    </Td>
                    <Td className="text-right text-ink-500">{variant.lowStockAt}</Td>
                    <Td className="text-right">
                      <StockAdjuster variantId={variant.id} sku={variant.sku} />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        )}
      </Panel>

      <Panel>
        <PanelHead title="Recent stock movements" subtitle="Every change, and who made it." />
        {movements.length === 0 ? (
          <EmptyState icon={Boxes} title="No movements yet" />
        ) : (
          <TableWrap>
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr>
                  <Th>When</Th>
                  <Th>SKU</Th>
                  <Th>Change</Th>
                  <Th>Reason</Th>
                  <Th>By</Th>
                </tr>
              </thead>
              <tbody>
                {movements.map((movement) => (
                  <tr key={movement.id}>
                    <Td className="whitespace-nowrap text-ink-600">
                      {new Intl.DateTimeFormat("en-GB", {
                        dateStyle: "short",
                        timeStyle: "short",
                      }).format(movement.createdAt)}
                    </Td>
                    <Td className="font-mono text-[12.5px]">{movement.variant.sku}</Td>
                    <Td
                      className={`font-semibold ${movement.delta > 0 ? "text-emerald-700" : "text-red-600"}`}
                    >
                      {movement.delta > 0 ? "+" : ""}
                      {movement.delta} → {movement.resulting}
                    </Td>
                    <Td className="text-ink-600">
                      {movement.reason.replace(/_/g, " ").toLowerCase()}
                      {movement.note ? ` · ${movement.note}` : ""}
                    </Td>
                    <Td className="text-ink-600">
                      {movement.actor?.name ?? movement.actor?.email ?? "Storefront"}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        )}
      </Panel>
    </div>
  );
}
