"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { CATALOGUE_TAG } from "@/lib/catalog";
import { NEXT_STATUSES, ORDER_STATUS_LABEL, STOCK_HOLDING_STATUSES } from "@/lib/order-status";
import { sendShippedEmail } from "@/lib/email";
import type { OrderStatus } from "@/generated/prisma";

export type ActionResult = { ok?: string; error?: string } | undefined;

async function logActivity(actorId: string, action: string, entityId: string, detail?: string) {
  await db.activityLog.create({
    data: { actorId, action, entity: "Order", entityId, detail },
  });
}

/**
 * Moves an order along its lifecycle.
 *
 * Only transitions listed in NEXT_STATUSES are accepted, so an order cannot
 * jump from delivered back to awaiting payment. Cancelling or refunding an
 * order that still holds stock returns those vials to the shelf.
 */
export async function updateOrderStatus(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const staff = await requireStaff();
  const orderId = String(formData.get("orderId") ?? "");
  const status = String(formData.get("status") ?? "") as OrderStatus;

  const order = await db.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order) return { error: "Order not found." };

  if (!NEXT_STATUSES[order.status].includes(status)) {
    return { error: `An order that is ${ORDER_STATUS_LABEL[order.status].toLowerCase()} cannot move to ${ORDER_STATUS_LABEL[status].toLowerCase()}.` };
  }

  const now = new Date();
  const returnsStock =
    (status === "CANCELLED" || status === "REFUNDED") &&
    STOCK_HOLDING_STATUSES.includes(order.status);

  await db.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: {
        status,
        ...(status === "PAID" ? { paymentStatus: "PAID", paidAt: order.paidAt ?? now } : {}),
        ...(status === "SHIPPED" ? { shippedAt: order.shippedAt ?? now } : {}),
        ...(status === "DELIVERED" ? { deliveredAt: order.deliveredAt ?? now } : {}),
        ...(status === "CANCELLED" ? { cancelledAt: now } : {}),
        ...(status === "REFUNDED" ? { paymentStatus: "REFUNDED" } : {}),
      },
    });

    if (returnsStock) {
      for (const item of order.items) {
        if (!item.variantId) continue;
        const variant = await tx.variant.update({
          where: { id: item.variantId },
          data: { stockQty: { increment: item.qty } },
        });
        await tx.stockMovement.create({
          data: {
            variantId: item.variantId,
            delta: item.qty,
            resulting: variant.stockQty,
            reason: "ORDER_CANCELLED",
            orderId: order.id,
            actorId: staff.id,
            note: `${ORDER_STATUS_LABEL[status]} — ${order.number}`,
          },
        });
        // A variant taken off sale when it hit zero comes back automatically.
        if (variant.availability === "OUT_OF_STOCK" && variant.stockQty > 0) {
          await tx.variant.update({
            where: { id: variant.id },
            data: { availability: "IN_STOCK" },
          });
        }
      }
    }

    await tx.orderEvent.create({
      data: {
        orderId,
        type:
          status === "PAID"
            ? "PAYMENT_RECEIVED"
            : status === "CANCELLED"
              ? "CANCELLED"
              : status === "REFUNDED"
                ? "REFUNDED"
                : "STATUS_CHANGED",
        message: `Marked ${ORDER_STATUS_LABEL[status].toLowerCase()}${returnsStock ? " — stock returned" : ""}.`,
        actorId: staff.id,
      },
    });
  });

  if (returnsStock) revalidateTag(CATALOGUE_TAG);
  await logActivity(staff.id, `order.${status.toLowerCase()}`, orderId, order.number);

  if (status === "SHIPPED") {
    const shipped = await db.order.findUniqueOrThrow({ where: { id: orderId } });
    if (await sendShippedEmail(shipped)) {
      await db.orderEvent.create({
        data: {
          orderId,
          type: "EMAIL_SENT",
          message: "Dispatch notification emailed to the customer.",
          actorId: staff.id,
        },
      });
    }
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { ok: `Order marked ${ORDER_STATUS_LABEL[status].toLowerCase()}.` };
}

export async function saveTracking(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const staff = await requireStaff();
  const orderId = String(formData.get("orderId") ?? "");
  const carrier = String(formData.get("carrier") ?? "").trim();
  const trackingNumber = String(formData.get("trackingNumber") ?? "").trim();

  if (!trackingNumber) return { error: "Enter a tracking number." };

  const order = await db.order.update({
    where: { id: orderId },
    data: { trackingCarrier: carrier || null, trackingNumber },
  });

  await db.orderEvent.create({
    data: {
      orderId,
      type: "TRACKING_ADDED",
      message: `Tracking added: ${carrier ? `${carrier} ` : ""}${trackingNumber}`,
      actorId: staff.id,
    },
  });
  await logActivity(staff.id, "order.tracking", orderId, order.number);

  revalidatePath(`/admin/orders/${orderId}`);
  return { ok: "Tracking saved." };
}

export async function addOrderNote(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const staff = await requireStaff();
  const orderId = String(formData.get("orderId") ?? "");
  const note = String(formData.get("note") ?? "").trim();
  if (!note) return { error: "Enter a note." };

  await db.orderEvent.create({
    data: { orderId, type: "NOTE", message: note, actorId: staff.id },
  });
  await db.order.update({ where: { id: orderId }, data: { internalNote: note } });

  revalidatePath(`/admin/orders/${orderId}`);
  return { ok: "Note added." };
}
