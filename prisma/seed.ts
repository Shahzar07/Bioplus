import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient, type Availability } from "../src/generated/prisma";
import { SEED_PRODUCTS } from "./seed-data";
import { BANK_TRANSFER_DEFAULTS } from "../src/lib/payments";

/**
 * Seeds the catalogue exactly as it shipped on the hardcoded storefront, plus
 * the first admin account and default store settings.
 *
 * Safe to re-run: products are upserted by slug and variants by SKU, so
 * seeding never duplicates rows or clobbers stock counts that the dashboard
 * has since corrected.
 */

const AVAILABILITY_TO_DB: Record<string, Availability> = {
  "in-stock": "IN_STOCK",
  "out-of-stock": "OUT_OF_STOCK",
  "arriving-soon": "ARRIVING_SOON",
};

/** Opening stock for a fresh install; the owner corrects these in Inventory. */
const OPENING_STOCK: Record<Availability, number> = {
  IN_STOCK: 25,
  OUT_OF_STOCK: 0,
  ARRIVING_SOON: 0,
};

const db = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL,
  }),
});

async function seedCatalogue() {
  for (const [index, p] of SEED_PRODUCTS.entries()) {
    const product = await db.product.upsert({
      where: { slug: p.slug },
      create: {
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        blurb: p.blurb,
        highlights: p.highlights,
        form: p.form,
        bestSeller: p.bestSeller ?? false,
        isNew: p.isNew ?? false,
        status: "ACTIVE",
        sortOrder: index,
      },
      update: {
        name: p.name,
        tagline: p.tagline,
        blurb: p.blurb,
        highlights: p.highlights,
        form: p.form,
        bestSeller: p.bestSeller ?? false,
        isNew: p.isNew ?? false,
        sortOrder: index,
      },
    });

    for (const [vIndex, v] of p.variants.entries()) {
      const availability = AVAILABILITY_TO_DB[v.availability];
      await db.variant.upsert({
        where: { sku: v.sku },
        create: {
          productId: product.id,
          sku: v.sku,
          label: v.label,
          strength: v.strength,
          price: v.price,
          availability,
          stockQty: OPENING_STOCK[availability],
          sortOrder: vIndex,
        },
        // Stock is deliberately not touched on re-seed — it is live data.
        update: {
          productId: product.id,
          label: v.label,
          strength: v.strength,
          price: v.price,
          availability,
          sortOrder: vIndex,
        },
      });
    }
  }
  const count = await db.product.count();
  console.log(`  catalogue: ${count} products`);
}

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@biopluslabs.co.uk").toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`  admin: ${email} already exists`);
    return;
  }
  if (!password) {
    console.log("  admin: skipped (set ADMIN_EMAIL and ADMIN_PASSWORD to create one)");
    return;
  }
  await db.user.create({
    data: {
      email,
      name: process.env.ADMIN_NAME ?? "BioPlus Admin",
      passwordHash: await bcrypt.hash(password, 12),
      role: "ADMIN",
    },
  });
  console.log(`  admin: created ${email}`);
}

async function seedSettings() {
  // Mirrors the values the storefront previously hardcoded.
  const defaults: Record<string, unknown> = {
    shipping: { freeThreshold: 250, flatRate: 12, countries: ["GB", "IE"] },
    bankTransfer: BANK_TRANSFER_DEFAULTS,
    store: {
      email: "customerservice@biopluslabs.co.uk",
      hours: "Monday – Friday, 9:00 – 18:00",
      lowStockThreshold: 5,
    },
  };

  for (const [key, value] of Object.entries(defaults)) {
    await db.setting.upsert({
      where: { key },
      create: { key, value: value as object },
      update: {},
    });
  }

  console.log(`  settings: ${Object.keys(defaults).length} keys`);
}

async function seedCounters() {
  await db.counter.upsert({
    where: { key: "order_number" },
    // Order numbers start at BPL-100001 so they never look like a test run.
    create: { key: "order_number", value: 100000 },
    update: {},
  });
}

async function main() {
  console.log("Seeding BioPlus Labs…");
  await seedCatalogue();
  await seedAdmin();
  await seedSettings();
  await seedCounters();
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
