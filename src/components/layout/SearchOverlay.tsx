"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { searchProducts, PRODUCTS, priceRangeLabel } from "@/lib/products";
import { ProductImage } from "@/components/product/ProductImage";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");

  useEffect(() => {
    if (open) setQ("");
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => (q ? searchProducts(q) : PRODUCTS.slice(0, 6)), [q]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[95]">
      <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="animate-fade-up relative mx-auto mt-[8vh] w-full max-w-2xl px-4">
        <div className="overflow-hidden rounded-2xl bg-white shadow-pop">
          <div className="flex items-center gap-3 border-b border-line px-5 py-4">
            <Search size={20} className="text-ink-500" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search peptides, blends, SKUs…"
              className="flex-1 bg-transparent text-base outline-none placeholder:text-ink-500"
            />
            <button onClick={onClose} className="rounded-full p-1.5 text-ink-500 hover:bg-haze" aria-label="Close search">
              <X size={20} />
            </button>
          </div>
          <div className="scroll-slim max-h-[55vh] overflow-y-auto p-2">
            <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
              {q ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Popular products"}
            </p>
            {results.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-ink-500">No products match &ldquo;{q}&rdquo;.</p>
            ) : (
              <ul>
                {results.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/product/${p.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-mist"
                    >
                      <span className="flex h-12 w-10 items-center justify-center rounded-lg bg-white">
                        <ProductImage slug={p.slug} name={p.name} className="h-11 w-auto" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{p.name}</span>
                        <span className="block truncate text-xs text-ink-500">{p.tagline}</span>
                      </span>
                      <span className="text-sm font-bold text-brand-700">{priceRangeLabel(p)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
