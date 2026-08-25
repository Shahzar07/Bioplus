"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { CATALOGUE_TAG } from "@/lib/catalog";
import type { Availability, ProductStatus } from "@/generated/prisma";

export type ProductActionResult = { ok?: string; error?: string; id?: string } | undefined;

const AVAILABILITY_VALUES: Availability[] = ["IN_STOCK", "OUT_OF_STOCK", "ARRIVING_SOON"];

/** Every catalogue write goes through here so the storefront is never stale. */
async function publishCatalogue(paths: string[] = []) {
  revalidateTag(CATALOGUE_TAG);
  revalidatePath("/", "layout");
  for (const path of paths) revalidatePath(path);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type VariantInput = {
  id?: string;
  sku: string;
  label: string;
  strength: string;
  price: number;
  availability: Availability;
  stockQty: number;
  lowStockAt: number;
};

/** Variants arrive as repeated form fields; this reassembles them in order. */
function parseVariants(formData: FormData): { variants: VariantInput[]; error?: string } {
  const skus = formData.getAll("variantSku").map(String);
  const ids = formData.getAll("variantId").map(String);
  const labels = formData.getAll("variantLabel").map(String);
  const strengths = formData.getAll("variantStrength").map(String);
  const prices = formData.getAll("variantPrice").map(String);
  const availabilities = formData.getAll("variantAvailability").map(String);
  const stocks = formData.getAll("variantStock").map(String);
  const thresholds = formData.getAll("variantLowStock").map(String);

  const variants: VariantInput[] = [];
  for (let i = 0; i < skus.length; i++) {
    const sku = skus[i]?.trim().toUpperCase();
    if (!sku) continue;

    const price = Number.parseFloat(prices[i] ?? "");
    if (!Number.isFinite(price) || price < 0) {
      return { variants: [], error: `Enter a valid price for ${sku}.` };
    }
    const label = labels[i]?.trim();
    if (!label) return { variants: [], error: `Enter an option label for ${sku}.` };

    const availability = availabilities[i] as Availability;
    variants.push({
      id: ids[i] || undefined,
      sku,
      label,
      strength: strengths[i]?.trim() || label,
      price,
      availability: AVAILABILITY_VALUES.includes(availability) ? availability : "OUT_OF_STOCK",
      stockQty: Math.max(0, Number.parseInt(stocks[i] ?? "0", 10) || 0),
      lowStockAt: Math.max(0, Number.parseInt(thresholds[i] ?? "5", 10) || 0),
    });
  }

  if (variants.length === 0) return { variants: [], error: "Add at least one option." };

  const duplicates = variants.filter((v, i) => variants.findIndex((o) => o.sku === v.sku) !== i);
  if (duplicates.length > 0) {
    return { variants: [], error: `Duplicate SKU: ${duplicates[0].sku}.` };
  }
  return { variants };
}

export async function saveProduct(
  _prev: ProductActionResult,
  formData: FormData,
): Promise<ProductActionResult> {
  const staff = await requireStaff();

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const tagline = String(formData.get("tagline") ?? "").trim();
  const blurb = String(formData.get("blurb") ?? "").trim();
  const form = String(formData.get("form") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "") || name);
  const status = String(formData.get("status") ?? "ACTIVE") as ProductStatus;
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();

  if (!name) return { error: "Enter a product name." };
  if (!slug) return { error: "Enter a URL slug." };
  if (!tagline) return { error: "Enter a tagline — it appears under the name on the shop." };
  if (!blurb) return { error: "Enter a description." };

  const highlights = String(formData.get("highlights") ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const { variants, error } = parseVariants(formData);
  if (error) return { error };

  // Slugs are the product's public URL, and SKUs must be unique shop-wide.
  const slugOwner = await db.product.findUnique({ where: { slug }, select: { id: true } });
  if (slugOwner && slugOwner.id !== id) {
    return { error: `The URL slug “${slug}” is already used by another product.` };
  }
  const clashingSkus = await db.variant.findMany({
    where: { sku: { in: variants.map((v) => v.sku) }, ...(id ? { productId: { not: id } } : {}) },
    select: { sku: true },
  });
  if (clashingSkus.length > 0) {
    return { error: `SKU ${clashingSkus[0].sku} is already used by another product.` };
  }

  const data = {
    slug,
    name,
    tagline,
    blurb,
    form: form || "Lyophilised powder",
    highlights,
    status,
    imageUrl: imageUrl || null,
    bestSeller: formData.get("bestSeller") === "on",
    isNew: formData.get("isNew") === "on",
  };

  let productId = id;

  if (id) {
    await db.product.update({ where: { id }, data });

    // Options removed in the editor are deleted; those kept are updated in place
    // so their stock and history survive.
    const keptIds = variants.map((v) => v.id).filter(Boolean) as string[];
    await db.variant.deleteMany({ where: { productId: id, id: { notIn: keptIds } } });
  } else {
    const created = await db.product.create({
      data: { ...data, sortOrder: (await db.product.count()) + 1 },
    });
    productId = created.id;
  }

  for (const [index, variant] of variants.entries()) {
    const shared = {
      label: variant.label,
      strength: variant.strength,
      price: variant.price,
      availability: variant.availability,
      lowStockAt: variant.lowStockAt,
      sortOrder: index,
    };

    if (variant.id) {
      const before = await db.variant.findUnique({ where: { id: variant.id } });
      await db.variant.update({
        where: { id: variant.id },
        data: { ...shared, sku: variant.sku, stockQty: variant.stockQty },
      });
      if (before && before.stockQty !== variant.stockQty) {
        await db.stockMovement.create({
          data: {
            variantId: variant.id,
            delta: variant.stockQty - before.stockQty,
            resulting: variant.stockQty,
            reason: "MANUAL_ADJUSTMENT",
            note: "Set in the product editor",
            actorId: staff.id,
          },
        });
      }
    } else {
      const created = await db.variant.create({
        data: { ...shared, sku: variant.sku, stockQty: variant.stockQty, productId },
      });
      if (variant.stockQty > 0) {
        await db.stockMovement.create({
          data: {
            variantId: created.id,
            delta: variant.stockQty,
            resulting: variant.stockQty,
            reason: "RESTOCK",
            note: "Opening stock",
            actorId: staff.id,
          },
        });
      }
    }
  }

  await db.activityLog.create({
    data: {
      actorId: staff.id,
      action: id ? "product.update" : "product.create",
      entity: "Product",
      entityId: productId,
      detail: name,
    },
  });

  await publishCatalogue([`/product/${slug}`, "/shop", "/admin/products"]);

  if (!id) redirect(`/admin/products/${productId}?created=1`);
  return { ok: "Product saved and published.", id: productId };
}

/** The one-click stock toggle on the product list. */
export async function setVariantAvailability(formData: FormData): Promise<void> {
  const staff = await requireStaff();
  const variantId = String(formData.get("variantId") ?? "");
  const availability = String(formData.get("availability") ?? "") as Availability;
  if (!AVAILABILITY_VALUES.includes(availability)) return;

  const variant = await db.variant.update({
    where: { id: variantId },
    data: { availability },
    include: { product: { select: { slug: true, name: true } } },
  });

  await db.activityLog.create({
    data: {
      actorId: staff.id,
      action: "variant.availability",
      entity: "Variant",
      entityId: variantId,
      detail: `${variant.sku} → ${availability}`,
    },
  });

  await publishCatalogue([`/product/${variant.product.slug}`, "/shop", "/admin/products"]);
}

export async function setProductStatus(formData: FormData): Promise<void> {
  const staff = await requireStaff();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as ProductStatus;
  if (!["DRAFT", "ACTIVE", "ARCHIVED"].includes(status)) return;

  const product = await db.product.update({ where: { id }, data: { status } });
  await db.activityLog.create({
    data: {
      actorId: staff.id,
      action: "product.status",
      entity: "Product",
      entityId: id,
      detail: `${product.name} → ${status}`,
    },
  });

  await publishCatalogue([`/product/${product.slug}`, "/shop", "/admin/products"]);
}

/** Copies a product as a draft, so a near-identical listing is quick to add. */
export async function duplicateProduct(formData: FormData): Promise<void> {
  const staff = await requireStaff();
  const id = String(formData.get("id") ?? "");

  const source = await db.product.findUnique({ where: { id }, include: { variants: true } });
  if (!source) return;

  let slug = `${source.slug}-copy`;
  let suffix = 2;
  while (await db.product.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${source.slug}-copy-${suffix++}`;
  }

  const copy = await db.product.create({
    data: {
      slug,
      name: `${source.name} (copy)`,
      tagline: source.tagline,
      blurb: source.blurb,
      highlights: source.highlights,
      form: source.form,
      imageUrl: source.imageUrl,
      status: "DRAFT",
      sortOrder: source.sortOrder + 1,
      variants: {
        create: source.variants.map((v, index) => ({
          // SKUs are unique, so the copy needs its own.
          sku: `${v.sku}-C${index + 1}`,
          label: v.label,
          strength: v.strength,
          price: v.price,
          availability: "OUT_OF_STOCK" as Availability,
          stockQty: 0,
          lowStockAt: v.lowStockAt,
          sortOrder: index,
        })),
      },
    },
  });

  await db.activityLog.create({
    data: {
      actorId: staff.id,
      action: "product.duplicate",
      entity: "Product",
      entityId: copy.id,
      detail: `Copied from ${source.name}`,
    },
  });

  redirect(`/admin/products/${copy.id}`);
}
