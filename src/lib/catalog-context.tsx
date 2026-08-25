"use client";

import { createContext, useContext, useMemo } from "react";
import type { Product } from "@/lib/products";
import {
  priceRangeLabel,
  searchProducts,
  variantBySku,
  type Variant,
} from "@/lib/products";

/**
 * The catalogue, made available to client components.
 *
 * The cart, cart drawer, search overlay and checkout all need product data in
 * the browser but cannot read the database. The root layout (a server
 * component) fetches the catalogue once and hands it down through this
 * provider, so those components always see current prices and stock without a
 * client-side fetch.
 *
 * The whole catalogue is a few KB of JSON — small enough to ship with the page.
 */

const CatalogContext = createContext<Product[] | null>(null);

export function CatalogProvider({
  catalogue,
  children,
}: {
  catalogue: Product[];
  children: React.ReactNode;
}) {
  return <CatalogContext.Provider value={catalogue}>{children}</CatalogContext.Provider>;
}

export function useCatalogue(): Product[] {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalogue must be used within CatalogProvider");
  return ctx;
}

/** Resolve a cart line's SKU against the live catalogue. */
export function useVariantBySku(): (
  sku: string,
) => { product: Product; variant: Variant } | undefined {
  const catalogue = useCatalogue();
  return useMemo(() => (sku: string) => variantBySku(catalogue, sku), [catalogue]);
}

/** Search bound to the live catalogue, for the header search overlay. */
export function useProductSearch(): (query: string) => Product[] {
  const catalogue = useCatalogue();
  return useMemo(() => (query: string) => searchProducts(catalogue, query), [catalogue]);
}

export { priceRangeLabel };
