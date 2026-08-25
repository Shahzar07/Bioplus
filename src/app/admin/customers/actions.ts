"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { hashPassword, requireAdmin, requireStaff } from "@/lib/auth";
import type { Role } from "@/generated/prisma";

export type CustomerResult = { ok?: string; error?: string } | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Suspending blocks sign-in; existing orders are untouched. */
export async function setUserStatus(formData: FormData): Promise<void> {
  const staff = await requireStaff();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (status !== "ACTIVE" && status !== "SUSPENDED") return;

  // Nobody locks themselves out of their own dashboard.
  if (id === staff.id) return;

  const user = await db.user.update({ where: { id }, data: { status } });
  await db.activityLog.create({
    data: {
      actorId: staff.id,
      action: "user.status",
      entity: "User",
      entityId: id,
      detail: `${user.email} → ${status}`,
    },
  });

  revalidatePath("/admin/customers");
  revalidatePath(`/admin/customers/${id}`);
}

/** Role changes are ADMIN-only — staff cannot promote themselves. */
export async function setUserRole(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const role = String(formData.get("role") ?? "") as Role;
  if (!["ADMIN", "STAFF", "CUSTOMER"].includes(role)) return;
  if (id === admin.id) return;

  const user = await db.user.update({ where: { id }, data: { role } });
  await db.activityLog.create({
    data: {
      actorId: admin.id,
      action: "user.role",
      entity: "User",
      entityId: id,
      detail: `${user.email} → ${role}`,
    },
  });

  revalidatePath("/admin/customers");
  revalidatePath(`/admin/customers/${id}`);
}

export async function saveCustomerNote(
  _prev: CustomerResult,
  formData: FormData,
): Promise<CustomerResult> {
  await requireStaff();
  const id = String(formData.get("id") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();

  await db.user.update({ where: { id }, data: { notes: notes || null } });
  revalidatePath(`/admin/customers/${id}`);
  return { ok: "Note saved." };
}

export async function createCustomer(
  _prev: CustomerResult,
  formData: FormData,
): Promise<CustomerResult> {
  const admin = await requireAdmin();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "CUSTOMER") as Role;

  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email address." };
  if (!name) return { error: "Enter a name." };
  if (password.length < 10) return { error: "Choose a password of at least 10 characters." };
  if (!["ADMIN", "STAFF", "CUSTOMER"].includes(role)) return { error: "Choose a valid role." };

  if (await db.user.findUnique({ where: { email } })) {
    return { error: "An account with that email already exists." };
  }

  const user = await db.user.create({
    data: { email, name, role, passwordHash: await hashPassword(password) },
  });

  // Any guest orders on that address become visible to the new account.
  await db.order.updateMany({ where: { email, userId: null }, data: { userId: user.id } });

  await db.activityLog.create({
    data: {
      actorId: admin.id,
      action: "user.create",
      entity: "User",
      entityId: user.id,
      detail: `${email} (${role})`,
    },
  });

  revalidatePath("/admin/customers");
  return { ok: `${email} created.` };
}
