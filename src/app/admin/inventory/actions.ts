"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { CATALOGUE_TAG } from "@/lib/catalog";

export type StockResult = { ok?: string; error?: string } | undefined;

/**
 * Adjusts stock by a delta rather than setting an absolute figure.
 *
 * Two people counting the same shelf at the same time would otherwise
 * overwrite each other; a delta applied atomically composes correctly.
 */
export async function adjustStock(_prev: StockResult, formData: FormData): Promise<StockResult> {
  const staff = await requireStaff();
  const variantId = String(formData.get("variantId") ?? "");
  const delta = Number.parseInt(String(formData.get("delta") ?? ""), 10);
  const note = String(formData.get("note") ?? "").trim();

  if (!Number.isFinite(delta) || delta === 0) {
    return { error: "Enter how many vials to add or remove." };
  }

  const variant = await db.variant.findUnique({
    where: { id: variantId },
    include: { product: { select: { slug: true } } },
  });
  if (!variant) return { error: "That option no longer exists." };

  if (variant.stockQty + delta < 0) {
    return { error: `Only ${variant.stockQty} in stock — cannot remove ${Math.abs(delta)}.` };
  }

  const updated = await db.variant.update({
    where: { id: variantId },
    data: { stockQty: { increment: delta } },
  });

  await db.stockMovement.create({
    data: {
      variantId,
      delta,
      resulting: updated.stockQty,
      reason: delta > 0 ? "RESTOCK" : "MANUAL_ADJUSTMENT",
      note: note || null,
      actorId: staff.id,
    },
  });

  // Restocking a sold-out SKU puts it back on sale; emptying one takes it off.
  if (updated.stockQty === 0 && updated.availability === "IN_STOCK") {
    await db.variant.update({ where: { id: variantId }, data: { availability: "OUT_OF_STOCK" } });
  } else if (updated.stockQty > 0 && updated.availability === "OUT_OF_STOCK") {
    await db.variant.update({ where: { id: variantId }, data: { availability: "IN_STOCK" } });
  }

  revalidateTag(CATALOGUE_TAG);
  revalidatePath("/admin/inventory");
  revalidatePath(`/product/${variant.product.slug}`);
  revalidatePath("/shop");

  return { ok: `${variant.sku}: ${delta > 0 ? "+" : ""}${delta} → ${updated.stockQty} in stock.` };
}
