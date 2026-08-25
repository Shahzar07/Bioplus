import Link from "next/link";
import type { Metadata } from "next";
import { Package, Plus, Copy, Eye, EyeOff } from "lucide-react";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { formatGBP } from "@/lib/cn";
import { EmptyState, Panel, TableWrap, Td, Th } from "@/components/admin/ui";
import { AvailabilityToggle } from "@/components/admin/AvailabilityToggle";
import { duplicateProduct, setProductStatus } from "./actions";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage() {
  await requireStaff();

  const products = await db.product.findMany({
    orderBy: [{ status: "asc" }, { sortOrder: "asc" }],
    include: { variants: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">Products</h1>
          <p className="mt-1 text-[13.5px] text-ink-500">
            {products.length} products · changes appear on the storefront immediately.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="brand-gradient inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold text-white transition hover:brightness-110"
        >
          <Plus size={15} /> Add product
        </Link>
      </header>

      <Panel>
        {products.length === 0 ? (
          <EmptyState icon={Package} title="No products yet">
            Add your first product to start selling.
          </EmptyState>
        ) : (
          <TableWrap>
            <table className="w-full min-w-[860px] border-collapse">
              <thead>
                <tr>
                  <Th>Product</Th>
                  <Th>Options &amp; stock</Th>
                  <Th className="text-right">Price</Th>
                  <Th>Visibility</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const prices = product.variants.map((v) => Number(v.price));
                  const low = prices.length ? Math.min(...prices) : 0;
                  const high = prices.length ? Math.max(...prices) : 0;

                  return (
                    <tr key={product.id} className="align-top transition hover:bg-mist">
                      <Td>
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="font-semibold text-ink-900 hover:text-brand-700"
                        >
                          {product.name}
                        </Link>
                        <span className="mt-0.5 block text-[12px] text-ink-500">{product.tagline}</span>
                        <span className="mt-1 flex flex-wrap gap-1.5">
                          {product.bestSeller && (
                            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-brand-700">
                              Best seller
                            </span>
                          )}
                          {product.isNew && (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-emerald-700">
                              New
                            </span>
                          )}
                        </span>
                      </Td>

                      <Td>
                        <ul className="space-y-1.5">
                          {product.variants.map((variant) => (
                            <li key={variant.id} className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-[12px] text-ink-600">{variant.sku}</span>
                              <span className="text-[12.5px] text-ink-500">{variant.label}</span>
                              <span
                                className={`text-[12px] font-semibold ${
                                  variant.stockQty === 0
                                    ? "text-red-600"
                                    : variant.stockQty <= variant.lowStockAt
                                      ? "text-amber-600"
                                      : "text-ink-600"
                                }`}
                              >
                                {variant.stockQty} in stock
                              </span>
                              <AvailabilityToggle
                                variantId={variant.id}
                                sku={variant.sku}
                                availability={variant.availability}
                              />
                            </li>
                          ))}
                        </ul>
                      </Td>

                      <Td className="whitespace-nowrap text-right font-semibold">
                        {low === high ? formatGBP(low) : `${formatGBP(low)} – ${formatGBP(high)}`}
                      </Td>

                      <Td>
                        <form action={setProductStatus}>
                          <input type="hidden" name="id" value={product.id} />
                          <input
                            type="hidden"
                            name="status"
                            value={product.status === "ACTIVE" ? "DRAFT" : "ACTIVE"}
                          />
                          <button
                            type="submit"
                            data-testid={`visibility-${product.slug}`}
                            aria-label={
                              product.status === "ACTIVE"
                                ? `${product.name} is live — hide from the storefront`
                                : `${product.name} is ${product.status.toLowerCase()} — publish to the storefront`
                            }
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset transition ${
                              product.status === "ACTIVE"
                                ? "bg-emerald-100 text-emerald-800 ring-emerald-200 hover:bg-emerald-200"
                                : product.status === "DRAFT"
                                  ? "bg-haze text-ink-600 ring-line hover:bg-line"
                                  : "bg-red-50 text-red-700 ring-red-200"
                            }`}
                            title={
                              product.status === "ACTIVE"
                                ? "Hide from the storefront"
                                : "Publish to the storefront"
                            }
                          >
                            {product.status === "ACTIVE" ? <Eye size={12} /> : <EyeOff size={12} />}
                            {product.status === "ACTIVE" ? "Live" : product.status.toLowerCase()}
                          </button>
                        </form>
                      </Td>

                      <Td className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/product/${product.slug}`}
                            target="_blank"
                            className="rounded-full border border-line px-3 py-1.5 text-[12.5px] font-semibold text-ink-700 transition hover:border-brand-500 hover:text-brand-700"
                          >
                            View
                          </Link>
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="rounded-full border border-line px-3 py-1.5 text-[12.5px] font-semibold text-ink-700 transition hover:border-brand-500 hover:text-brand-700"
                          >
                            Edit
                          </Link>
                          <form action={duplicateProduct}>
                            <input type="hidden" name="id" value={product.id} />
                            <button
                              type="submit"
                              title="Duplicate as a draft"
                              className="rounded-full border border-line p-1.5 text-ink-600 transition hover:border-brand-500 hover:text-brand-700"
                            >
                              <Copy size={14} />
                            </button>
                          </form>
                        </div>
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
