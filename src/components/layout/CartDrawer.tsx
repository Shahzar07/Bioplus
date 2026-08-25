"use client";

import Link from "next/link";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatGBP } from "@/lib/cn";
import { ProductImage } from "@/components/product/ProductImage";
import { variantBySku } from "@/lib/products";

export function CartDrawer() {
  const { drawerOpen, setDrawerOpen, detailedLines, subtotal, setQty, remove, count } = useCart();

  return (
    <>
      <div
        aria-hidden
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 z-[90] bg-ink-950/50 backdrop-blur-sm transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-[91] flex h-full w-full max-w-md flex-col bg-white shadow-pop transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-brand-700" />
            <h2 className="font-display text-lg font-bold">Your Cart</h2>
            <span className="rounded-full bg-haze px-2 py-0.5 text-xs font-semibold text-ink-700">{count}</span>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="rounded-full p-2 text-ink-600 transition hover:bg-haze"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {detailedLines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-haze">
              <ShoppingBag size={26} className="text-ink-500" />
            </div>
            <p className="text-ink-600">Your cart is empty.</p>
            <Link
              href="/shop"
              onClick={() => setDrawerOpen(false)}
              className="brand-gradient rounded-full px-6 py-3 text-sm font-semibold text-white"
            >
              Browse Catalogue
            </Link>
          </div>
        ) : (
          <>
            <div className="scroll-slim flex-1 overflow-y-auto px-4 py-4">
              <ul className="space-y-3">
                {detailedLines.map((l) => {
                  const found = variantBySku(l.sku);
                  return (
                    <li key={l.sku} className="flex gap-3 rounded-xl border border-line p-3">
                      <Link
                        href={`/product/${l.slug}`}
                        onClick={() => setDrawerOpen(false)}
                        className="flex h-20 w-16 shrink-0 items-center justify-center rounded-lg bg-white"
                      >
                        {found && <ProductImage slug={found.product.slug} name={l.name} className="h-16 w-auto" />}
                      </Link>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/product/${l.slug}`}
                            onClick={() => setDrawerOpen(false)}
                            className="text-sm font-semibold leading-tight hover:text-brand-700"
                          >
                            {l.name}
                          </Link>
                          <button
                            onClick={() => remove(l.sku)}
                            className="rounded p-1 text-ink-500 hover:text-red-600"
                            aria-label="Remove"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <p className="mt-0.5 text-xs text-ink-500">{l.label}</p>
                        <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-ink-500">
                          SKU {l.sku}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="inline-flex items-center rounded-full border border-line">
                            <button
                              onClick={() => setQty(l.sku, l.qty - 1)}
                              className="grid h-7 w-7 place-items-center text-ink-600 hover:text-brand-700"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-7 text-center text-sm font-semibold">{l.qty}</span>
                            <button
                              onClick={() => setQty(l.sku, l.qty + 1)}
                              className="grid h-7 w-7 place-items-center text-ink-600 hover:text-brand-700"
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <span className="text-sm font-bold">{formatGBP(l.lineTotal)}</span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="border-t border-line px-6 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-600">Subtotal</span>
                <span className="font-display text-xl font-bold">{formatGBP(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-ink-500">Delivery calculated at checkout. UK prices include VAT where applicable.</p>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/checkout"
                  onClick={() => setDrawerOpen(false)}
                  className="brand-gradient flex h-12 items-center justify-center rounded-full text-sm font-bold text-white"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setDrawerOpen(false)}
                  className="flex h-11 items-center justify-center rounded-full border border-ink-900/15 text-sm font-semibold text-ink-800 hover:border-brand-500"
                >
                  View Cart
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
