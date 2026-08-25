"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { hashPassword, requireUser, verifyPassword } from "@/lib/auth";

export type FormResult = { ok?: string; error?: string } | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function updateProfile(_prev: FormResult, formData: FormData): Promise<FormResult> {
  const user = await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const organisation = String(formData.get("organisation") ?? "").trim();

  if (!name) return { error: "Enter your name." };
  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email address." };

  if (email !== user.email) {
    const taken = await db.user.findUnique({ where: { email } });
    if (taken) return { error: "That email address is already in use." };
  }

  await db.user.update({
    where: { id: user.id },
    data: { name, email, phone: phone || null, organisation: organisation || null },
  });

  revalidatePath("/account");
  return { ok: "Account details saved." };
}

export async function updatePassword(_prev: FormResult, formData: FormData): Promise<FormResult> {
  const user = await requireUser();

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!user.passwordHash) return { error: "This account has no password set." };
  if (!(await verifyPassword(current, user.passwordHash))) {
    return { error: "Your current password is incorrect." };
  }
  if (next.length < 10) return { error: "Choose a new password of at least 10 characters." };
  if (next !== confirm) return { error: "The new passwords do not match." };

  await db.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(next) },
  });

  return { ok: "Password updated." };
}

export async function saveResearchAddress(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const user = await requireUser();

  const value = (key: string) => String(formData.get(key) ?? "").trim();
  const firstName = value("firstName");
  const lastName = value("lastName");
  const line1 = value("line1");
  const city = value("city");
  const postcode = value("postcode");

  if (!firstName || !lastName) return { error: "Enter a first and last name." };
  if (!line1) return { error: "Enter the first line of the address." };
  if (!city) return { error: "Enter a town or city." };
  if (!postcode) return { error: "Enter a postcode." };

  const data = {
    org: value("org") || null,
    firstName,
    lastName,
    line1,
    line2: value("line2") || null,
    city,
    county: value("county") || null,
    postcode: postcode.toUpperCase(),
    country: value("country") || "GB",
  };

  const existing = await db.address.findFirst({
    where: { userId: user.id, isDefault: true },
  });

  if (existing) {
    await db.address.update({ where: { id: existing.id }, data });
  } else {
    await db.address.create({ data: { ...data, userId: user.id, isDefault: true } });
  }

  revalidatePath("/account/research-address");
  return { ok: "Research address saved." };
}
