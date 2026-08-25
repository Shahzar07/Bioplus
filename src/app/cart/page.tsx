"use client";

import Link from "next/link";
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, ArrowLeft, Lock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useCart } from "@/lib/cart-context";
import { formatGBP } from "@/lib/cn";
import { ProductImage } from "@/components/product/ProductImage";
import { useVariantBySku } from "@/lib/catalog-context";

export default function CartPage() {
  const { detailedLines, subtotal, setQty, remove, count } = useCart();
  const variantBySku = useVariantBySku();
  const freeShipThreshold = 250;
  const remaining = Math.max(0, freeShipThreshold - subtotal);

  return (
    <Container className="py-12">
      <h1 className="font-display text-4xl font-extrabold tracking-tight">Your Cart</h1>
      <p className="mt-2 text-ink-600">{count} item{count === 1 ? "" : "s"} · Research Use Only</p>

      {detailedLines.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center gap-5 rounded-2xl border border-line bg-mist py-20 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-white shadow-card">
            <ShoppingBag size={26} className="text-ink-500" />
          </div>
          <div>
            <p className="font-display text-lg font-bold">Your cart is empty</p>
            <p className="mt-1 text-sm text-ink-600">Browse the catalogue to add research compounds.</p>
          </div>
          <Link href="/shop" className="brand-gradient rounded-full px-6 py-3 text-sm font-bold text-white">
            Shop the catalogue
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.7fr_1fr]">
          <div>
            <ul className="space-y-3">
              {detailedLines.map((l) => {
                const found = variantBySku(l.sku);
                return (
                  <li key={l.sku} className="relative flex gap-4 overflow-hidden rounded-xl border border-line bg-white p-4 shadow-card">
                    <span className="brand-gradient absolute inset-y-0 left-0 w-[3px]" />
                    <Link
                      href={`/product/${l.slug}`}
                      className="ml-1 flex h-28 w-24 shrink-0 items-center justify-center rounded-lg bg-mist"
                    >
                      {found && <ProductImage slug={found.product.slug} name={l.name} className="h-24 w-auto" />}
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link href={`/product/${l.slug}`} className="font-display text-lg font-bold hover:text-brand-700">
                            {l.name}
                          </Link>
                          <p className="text-[13px] text-ink-600">{l.label}</p>
                          <p className="text-[11px] font-medium uppercase tracking-wide text-ink-500">SKU {l.sku}</p>
                        </div>
                        <button onClick={() => remove(l.sku)} className="rounded p-1.5 text-ink-500 hover:text-red-600" aria-label="Remove">
                          <Trash2 size={17} />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="inline-flex items-center rounded-full border border-line">
                          <button onClick={() => setQty(l.sku, l.qty - 1)} className="grid h-9 w-9 place-items-center text-ink-700 hover:text-brand-700" aria-label="Decrease">
                            <Minus size={15} />
                          </button>
                          <span className="w-9 text-center font-semibold">{l.qty}</span>
                          <button onClick={() => setQty(l.sku, l.qty + 1)} className="grid h-9 w-9 place-items-center text-ink-700 hover:text-brand-700" aria-label="Increase">
                            <Plus size={15} />
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="font-display text-lg font-bold">{formatGBP(l.lineTotal)}</span>
                          <span className="block text-[11px] text-ink-500">{formatGBP(l.price)} each</span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <Link href="/shop" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-700 hover:text-brand-700">
              <ArrowLeft size={16} /> Continue shopping
            </Link>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <h2 className="font-display text-xl font-bold">Order Summary</h2>

              {remaining > 0 ? (
                <div className="mt-4 rounded-xl bg-brand-50 p-3 text-[12.5px] text-brand-800">
                  Add <strong>{formatGBP(remaining)}</strong> more to qualify for free UK delivery.
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-brand-100">
                    <div className="brand-gradient h-full rounded-full" style={{ width: `${Math.min(100, (subtotal / freeShipThreshold) * 100)}%` }} />
                  </div>
                </div>
              ) : (
                <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-[12.5px] font-medium text-emerald-700">
                  You&apos;ve qualified for free UK delivery.
                </p>
              )}

              <dl className="mt-5 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-600">Subtotal</dt>
                  <dd className="font-semibold">{formatGBP(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-600">Delivery</dt>
                  <dd className="text-ink-500">Calculated at checkout</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-3 text-base">
                  <dt className="font-bold">Estimated total</dt>
                  <dd className="font-display text-xl font-bold">{formatGBP(subtotal)}</dd>
                </div>
              </dl>

              <Link href="/checkout" className="brand-gradient mt-5 flex h-12 items-center justify-center gap-2 rounded-full text-sm font-bold text-white">
                Secure checkout <ArrowRight size={17} />
              </Link>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-ink-500">
                <Lock size={12} /> SSL-encrypted · Major cards accepted
              </p>
            </div>
          </aside>
        </div>
      )}
    </Container>
  );
}
