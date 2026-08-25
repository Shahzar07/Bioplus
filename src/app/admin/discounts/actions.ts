"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import type { DiscountType } from "@/generated/prisma";

export type DiscountResult = { ok?: string; error?: string } | undefined;

export async function saveDiscount(
  _prev: DiscountResult,
  formData: FormData,
): Promise<DiscountResult> {
  const staff = await requireStaff();

  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const type = String(formData.get("type") ?? "PERCENT") as DiscountType;
  const value = Number.parseFloat(String(formData.get("value") ?? ""));
  const minSpendRaw = String(formData.get("minSpend") ?? "").trim();
  const usageLimitRaw = String(formData.get("usageLimit") ?? "").trim();
  const startsAt = String(formData.get("startsAt") ?? "").trim();
  const endsAt = String(formData.get("endsAt") ?? "").trim();

  if (!/^[A-Z0-9-]{3,32}$/.test(code)) {
    return { error: "Codes are 3–32 characters: letters, numbers and hyphens." };
  }
  if (!Number.isFinite(value) || value <= 0) return { error: "Enter a discount value above zero." };
  if (type === "PERCENT" && value > 100) return { error: "A percentage cannot exceed 100." };

  if (await db.discount.findUnique({ where: { code } })) {
    return { error: `${code} already exists.` };
  }

  await db.discount.create({
    data: {
      code,
      type,
      value,
      minSpend: minSpendRaw ? Number.parseFloat(minSpendRaw) : null,
      usageLimit: usageLimitRaw ? Number.parseInt(usageLimitRaw, 10) : null,
      startsAt: startsAt ? new Date(startsAt) : null,
      endsAt: endsAt ? new Date(endsAt) : null,
    },
  });

  await db.activityLog.create({
    data: { actorId: staff.id, action: "discount.create", entity: "Discount", detail: code },
  });

  revalidatePath("/admin/discounts");
  return { ok: `${code} created.` };
}

export async function toggleDiscount(formData: FormData): Promise<void> {
  const staff = await requireStaff();
  const id = String(formData.get("id") ?? "");

  const current = await db.discount.findUnique({ where: { id } });
  if (!current) return;

  await db.discount.update({ where: { id }, data: { active: !current.active } });
  await db.activityLog.create({
    data: {
      actorId: staff.id,
      action: "discount.toggle",
      entity: "Discount",
      entityId: id,
      detail: `${current.code} → ${!current.active ? "active" : "paused"}`,
    },
  });

  revalidatePath("/admin/discounts");
}
