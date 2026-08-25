"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { SETTINGS_TAG } from "@/lib/settings";

export type SettingsResult = { ok?: string; error?: string } | undefined;

async function writeSetting(key: string, value: object) {
  await db.setting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
  revalidateTag(SETTINGS_TAG);
  revalidatePath("/admin/settings");
  // Delivery rules and contact details are shown on the storefront too.
  revalidatePath("/", "layout");
}

export async function saveShipping(
  _prev: SettingsResult,
  formData: FormData,
): Promise<SettingsResult> {
  const staff = await requireStaff();

  const freeThreshold = Number.parseFloat(String(formData.get("freeThreshold") ?? ""));
  const flatRate = Number.parseFloat(String(formData.get("flatRate") ?? ""));

  if (!Number.isFinite(freeThreshold) || freeThreshold < 0) {
    return { error: "Enter a free-delivery threshold of zero or more." };
  }
  if (!Number.isFinite(flatRate) || flatRate < 0) {
    return { error: "Enter a delivery charge of zero or more." };
  }

  await writeSetting("shipping", { freeThreshold, flatRate, countries: ["GB", "IE"] });
  await db.activityLog.create({
    data: { actorId: staff.id, action: "settings.shipping", entity: "Setting" },
  });

  return { ok: "Delivery rules saved." };
}

export async function saveBankTransfer(
  _prev: SettingsResult,
  formData: FormData,
): Promise<SettingsResult> {
  const staff = await requireStaff();
  const value = (key: string) => String(formData.get(key) ?? "").trim();

  await writeSetting("bankTransfer", {
    accountName: value("accountName"),
    bankName: value("bankName"),
    sortCode: value("sortCode"),
    accountNumber: value("accountNumber"),
    instructions: value("instructions"),
  });
  await db.activityLog.create({
    data: { actorId: staff.id, action: "settings.bank", entity: "Setting" },
  });

  return { ok: "Payment details saved — they now show on the order confirmation." };
}

export async function saveStore(
  _prev: SettingsResult,
  formData: FormData,
): Promise<SettingsResult> {
  const staff = await requireStaff();

  const email = String(formData.get("email") ?? "").trim();
  const hours = String(formData.get("hours") ?? "").trim();
  const lowStockThreshold = Number.parseInt(String(formData.get("lowStockThreshold") ?? ""), 10);

  if (!email) return { error: "Enter a contact email address." };

  await writeSetting("store", {
    email,
    hours,
    lowStockThreshold: Number.isFinite(lowStockThreshold) ? lowStockThreshold : 5,
  });
  await db.activityLog.create({
    data: { actorId: staff.id, action: "settings.store", entity: "Setting" },
  });

  return { ok: "Store details saved." };
}
