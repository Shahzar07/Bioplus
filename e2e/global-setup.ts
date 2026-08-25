import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";
import { SEED_PRODUCTS } from "../prisma/seed-data";

/**
 * Puts the shop back to a known state before the suite runs.
 *
 * The tests place real orders, so stock, prices and visibility drift between
 * runs; without this the suite passes once and then fails on depleted stock.
 *
 * Guarded to a local database: a stray DATABASE_URL must never let a test run
 * rewrite a live catalogue.
 */

const LOCAL_HOSTS = ["localhost", "127.0.0.1", "::1"];

function isLocalDatabase(url: string | undefined): boolean {
  if (!url) return false;
  try {
    return LOCAL_HOSTS.includes(new URL(url).hostname);
  } catch {
    return false;
  }
}

export default async function globalSetup() {
  const url = process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL;

  if (!isLocalDatabase(url)) {
    console.warn(
      "[e2e] DATABASE_URL is not local — skipping the catalogue reset. Tests that consume stock may fail.",
    );
    return;
  }

  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

  try {
    // Remove anything earlier runs created.
    await db.variant.deleteMany({ where: { sku: { startsWith: "BPL-TEST" } } });
    await db.product.deleteMany({ where: { slug: { startsWith: "test-peptide" } } });

    for (const product of SEED_PRODUCTS) {
      await db.product.updateMany({ where: { slug: product.slug }, data: { status: "ACTIVE" } });
      for (const variant of product.variants) {
        await db.variant.updateMany({
          where: { sku: variant.sku },
          data: {
            price: variant.price,
            availability:
              variant.availability === "in-stock"
                ? "IN_STOCK"
                : variant.availability === "arriving-soon"
                  ? "ARRIVING_SOON"
                  : "OUT_OF_STOCK",
            stockQty: variant.availability === "in-stock" ? 100 : 0,
          },
        });
      }
    }
    console.log("[e2e] catalogue reset to seeded state");
  } finally {
    await db.$disconnect();
  }
}
