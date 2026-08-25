/* ============================================================
   BioPlus Labs — Product types and catalogue helpers.

   The catalogue itself lives in Postgres and is edited from the admin
   dashboard; see src/lib/catalog.ts for the server-side reads and
   src/lib/catalog-context.tsx for the client-side copy.

   Everything here is pure: types, labels, and functions over a catalogue that
   is handed in. That keeps these helpers usable from both server and client
   components.

   Prices are GBP PER VIAL. Research Use Only — not for human or animal
   consumption.
   ============================================================ */

/** Availability drives the badge, the buy button and the shop filters. */
export type Availability = "in-stock" | "out-of-stock" | "arriving-soon";

export type Variant = {
  sku: string; // Catalogue No.
  label: string; // human label
  strength: string; // per-vial strength
  price: number; // GBP per vial
  availability: Availability;
};

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  blurb: string;
  highlights: string[];
  form: string;
  bestSeller?: boolean;
  isNew?: boolean;
  /** Set when an image has been uploaded from the dashboard; otherwise the
   *  /products/vial-<slug>.webp convention applies. */
  imageUrl?: string | null;
  variants: Variant[];
};

/* ----------------------------- helpers ----------------------------- */

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  "in-stock": "In stock",
  "out-of-stock": "Out of stock",
  "arriving-soon": "Arriving soon",
};

export function getProduct(catalogue: Product[], slug: string): Product | undefined {
  return catalogue.find((p) => p.slug === slug);
}

export function lowestPrice(p: Product): number {
  return Math.min(...p.variants.map((v) => v.price));
}

export function highestPrice(p: Product): number {
  return Math.max(...p.variants.map((v) => v.price));
}

function money(n: number): string {
  return Number.isInteger(n) ? `£${n}` : `£${n.toFixed(2)}`;
}

export function priceRangeLabel(p: Product): string {
  const lo = lowestPrice(p);
  const hi = highestPrice(p);
  return lo === hi ? money(lo) : `${money(lo)} – ${money(hi)}`;
}

/** A product is buyable when at least one variant is in stock. */
export function productAvailability(p: Product): Availability {
  if (p.variants.some((v) => v.availability === "in-stock")) return "in-stock";
  if (p.variants.some((v) => v.availability === "arriving-soon")) return "arriving-soon";
  return "out-of-stock";
}

export function isBuyable(p: Product): boolean {
  return productAvailability(p) === "in-stock";
}

export function variantBySku(
  catalogue: Product[],
  sku: string,
): { product: Product; variant: Variant } | undefined {
  for (const product of catalogue) {
    const variant = product.variants.find((v) => v.sku === sku);
    if (variant) return { product, variant };
  }
  return undefined;
}

export function searchProducts(catalogue: Product[], query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return catalogue.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.blurb.toLowerCase().includes(q) ||
      p.variants.some((v) => v.sku.toLowerCase().includes(q)),
  );
}

/* --------------------- derived catalogue slices --------------------- */

export function bestSellers(catalogue: Product[]): Product[] {
  return catalogue.filter((p) => p.bestSeller);
}

export function newArrivals(catalogue: Product[]): Product[] {
  return catalogue.filter((p) => p.isNew);
}

/** Pre-blended multi-compound research vials. */
export function stacks(catalogue: Product[]): Product[] {
  return catalogue.filter((p) => p.slug === "glow" || p.slug === "klow");
}

/** Single-compound best-sellers and new arrivals (excludes blends). */
export function bestSellingPeptides(catalogue: Product[]): Product[] {
  return catalogue.filter(
    (p) => (p.bestSeller || p.isNew) && p.slug !== "glow" && p.slug !== "klow",
  );
}
