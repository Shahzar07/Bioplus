import "server-only";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import type { Availability, Product } from "@/lib/products";

/**
 * Server-side catalogue reads.
 *
 * Results are cached under the `products` tag; every admin mutation calls
 * revalidateCatalogue(), so the storefront serves static-fast pages that still
 * reflect a stock toggle or a price edit within a second of it being made.
 */

export const CATALOGUE_TAG = "products";

const AVAILABILITY_FROM_DB: Record<string, Availability> = {
  IN_STOCK: "in-stock",
  OUT_OF_STOCK: "out-of-stock",
  ARRIVING_SOON: "arriving-soon",
};

export const AVAILABILITY_TO_DB = {
  "in-stock": "IN_STOCK",
  "out-of-stock": "OUT_OF_STOCK",
  "arriving-soon": "ARRIVING_SOON",
} as const;

async function readCatalogue(): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: { status: "ACTIVE" },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: {
      variants: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
    },
  });

  return rows.map((p) => ({
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    blurb: p.blurb,
    highlights: p.highlights,
    form: p.form,
    bestSeller: p.bestSeller,
    isNew: p.isNew,
    imageUrl: p.imageUrl,
    variants: p.variants.map((v) => ({
      sku: v.sku,
      label: v.label,
      strength: v.strength,
      // Decimal -> number: catalogue prices are small GBP amounts, well inside
      // the safe range, and the storefront formats them as numbers.
      price: Number(v.price),
      availability: AVAILABILITY_FROM_DB[v.availability] ?? "out-of-stock",
    })),
  }));
}

/**
 * The published catalogue, as the storefront renders it.
 * Shape matches the original hardcoded PRODUCTS array exactly.
 */
export const getCatalogue = unstable_cache(readCatalogue, ["catalogue"], {
  tags: [CATALOGUE_TAG],
});

export async function getCatalogueProduct(slug: string): Promise<Product | undefined> {
  const catalogue = await getCatalogue();
  return catalogue.find((p) => p.slug === slug);
}
