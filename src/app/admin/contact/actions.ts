"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";

/** Marking an enquiry read or archived from the dashboard. */
export async function setContactStatus(formData: FormData): Promise<void> {
  const staff = await requireStaff();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["NEW", "READ", "ARCHIVED"].includes(status)) return;

  await db.contactMessage.update({
    where: { id },
    data: {
      status: status as "NEW" | "READ" | "ARCHIVED",
      readAt: status === "NEW" ? null : new Date(),
    },
  });
  await db.activityLog.create({
    data: {
      actorId: staff.id,
      action: `contact.${status.toLowerCase()}`,
      entity: "ContactMessage",
      entityId: id,
    },
  });

  revalidatePath("/admin/contact");
  revalidatePath("/admin", "layout");
}
