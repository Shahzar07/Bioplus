"use client";

import Link from "next/link";
import { Plus, ArrowRight } from "lucide-react";
import {
  type Product,
  priceRangeLabel,
  productAvailability,
  AVAILABILITY_LABEL,
} from "@/lib/products";
import { ProductImage } from "./ProductImage";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/cn";

export function ProductCard({ product }: { product: Product; index?: number }) {
  const { add } = useCart();
  const availability = productAvailability(product);
  const buyableVariant = product.variants.find((v) => v.availability === "in-stock");
  const single = product.variants.length === 1;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-pop">
      {/* accent rule that fills on hover */}
      <span className="brand-gradient absolute inset-x-0 top-0 z-10 h-[3px] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />

      {/* badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
        {product.bestSeller && (
          <span className="rounded-md bg-ink-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            Best Seller
          </span>
        )}
        {product.isNew && (
          <span className="brand-gradient rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            New
          </span>
        )}
      </div>

      {availability !== "in-stock" && (
        <span
          className={cn(
            "absolute right-3 top-3 z-10 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
            availability === "arriving-soon" ? "bg-brand-600 text-white" : "bg-ink-700 text-white",
          )}
        >
          {AVAILABILITY_LABEL[availability]}
        </span>
      )}

      <Link
        href={`/product/${product.slug}`}
        className={cn(
          "relative flex h-60 items-center justify-center border-b border-line bg-mist",
          availability === "out-of-stock" && "opacity-70",
        )}
      >
        <ProductImage
          slug={product.slug}
          name={product.name}
          imageUrl={product.imageUrl}
          className="h-52 w-auto transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-display text-lg font-bold leading-tight text-ink-900 transition-colors group-hover:text-brand-700">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink-600">{product.tagline}</p>

        <div className="mt-3 flex items-center gap-2 text-[11px] font-medium text-ink-500">
          <span>
            {product.variants.length} option{product.variants.length > 1 ? "s" : ""}
          </span>
          <span className="h-1 w-1 rounded-full bg-ink-500/40" />
          <span
            className={cn(
              availability === "in-stock" && "text-emerald-600",
              availability === "arriving-soon" && "text-brand-600",
            )}
          >
            {AVAILABILITY_LABEL[availability]}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <div>
            <span className="block text-[11px] text-ink-500">
              {single ? "per vial" : "from"}
            </span>
            <span className="font-display text-xl font-bold text-ink-900">{priceRangeLabel(product)}</span>
          </div>
          {single && buyableVariant ? (
            <button
              onClick={() => add(buyableVariant.sku, 1)}
              className="brand-gradient inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-white transition hover:brightness-110"
            >
              <Plus size={16} /> Add
            </button>
          ) : (
            <Link
              href={`/product/${product.slug}`}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-ink-900/15 px-4 text-sm font-semibold text-ink-800 transition hover:border-brand-500 hover:text-brand-700"
            >
              {availability === "in-stock" ? "Select" : "View"} <ArrowRight size={15} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
