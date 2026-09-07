import "server-only";
import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { CATALOGUE_TAG } from "@/lib/catalog";
import { getSettings, orderNotificationRecipients, shippingFor } from "@/lib/settings";
import { sendNewOrderAlert, sendOrderConfirmation } from "@/lib/email";
import { multiplyMoney, round2, sumMoney } from "@/lib/money";
import type { Order, Prisma } from "@/generated/prisma";

/**
 * Order placement.
 *
 * The browser sends SKUs and quantities and nothing else that matters: prices,
 * availability, delivery cost and any discount are all resolved from the
 * database here. A tampered cart cannot change what is charged.
 */

export type CartLineInput = { sku: string; qty: number };

export type PlaceOrderInput = {
  lines: CartLineInput[];
  contact: {
    email: string;
    phone?: string;
    organisation?: string;
    firstName: string;
    lastName: string;
    line1: string;
    line2?: string;
    city: string;
    county?: string;
    postcode: string;
    country: string;
  };
  discountCode?: string;
  customerNote?: string;
  userId?: string | null;
  ruoAccepted: boolean;
};

export type PlaceOrderResult =
  | { ok: true; orderNumber: string; orderId: string }
  | { ok: false; error: string };

const MAX_QTY_PER_LINE = 99;

/**
 * Sequential order numbers.
 *
 * The counter is incremented inside the order transaction, so two checkouts
 * landing at once cannot be handed the same number — the row update
 * serialises them.
 */
async function nextOrderNumber(tx: Prisma.TransactionClient): Promise<string> {
  const counter = await tx.counter.upsert({
    where: { key: "order_number" },
    create: { key: "order_number", value: 100001 },
    update: { value: { increment: 1 } },
  });
  return `BPL-${counter.value}`;
}

export type ResolvedDiscount = {
  code: string;
  amount: number;
  id: string;
};

/** Validates a code against its window, spend floor and usage cap. */
export async function resolveDiscount(
  code: string | undefined,
  subtotal: number,
): Promise<{ discount: ResolvedDiscount | null; error?: string }> {
  if (!code?.trim()) return { discount: null };

  const record = await db.discount.findUnique({
    where: { code: code.trim().toUpperCase() },
  });
  if (!record || !record.active) return { discount: null, error: "That discount code is not valid." };

  const now = new Date();
  if (record.startsAt && record.startsAt > now) {
    return { discount: null, error: "That discount code is not active yet." };
  }
  if (record.endsAt && record.endsAt < now) {
    return { discount: null, error: "That discount code has expired." };
  }
  if (record.usageLimit !== null && record.usedCount >= record.usageLimit) {
    return { discount: null, error: "That discount code has been fully redeemed." };
  }
  if (record.minSpend && subtotal < Number(record.minSpend)) {
    return {
      discount: null,
      error: `That code requires a subtotal of at least £${Number(record.minSpend).toFixed(2)}.`,
    };
  }

  const raw =
    record.type === "PERCENT"
      ? (subtotal * Number(record.value)) / 100
      : Number(record.value);

  // Never discount below zero.
  const amount = round2(Math.min(raw, subtotal));
  return { discount: { code: record.code, amount, id: record.id } };
}

export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  if (!input.ruoAccepted) {
    return { ok: false, error: "The research-use declaration must be accepted." };
  }

  const lines = input.lines.filter((l) => l.qty > 0);
  if (lines.length === 0) return { ok: false, error: "Your cart is empty." };
  if (lines.some((l) => l.qty > MAX_QTY_PER_LINE)) {
    return { ok: false, error: `A maximum of ${MAX_QTY_PER_LINE} vials per line can be ordered online.` };
  }

  const settings = await getSettings();

  // Prices and availability come from the database, never from the request.
  const variants = await db.variant.findMany({
    where: { sku: { in: lines.map((l) => l.sku) } },
    include: { product: true },
  });

  type PricedLine = {
    variant: (typeof variants)[number];
    qty: number;
    unitPrice: number;
    lineTotal: number;
  };
  const priced: PricedLine[] = [];
  for (const line of lines) {
    const variant = variants.find((v) => v.sku === line.sku);
    if (!variant || variant.product.status !== "ACTIVE") {
      return { ok: false, error: `${line.sku} is no longer available. Please remove it from your cart.` };
    }
    if (variant.availability !== "IN_STOCK") {
      return { ok: false, error: `${variant.product.name} (${variant.label}) is out of stock.` };
    }
    if (variant.stockQty < line.qty) {
      return {
        ok: false,
        error: `Only ${variant.stockQty} × ${variant.product.name} (${variant.label}) remain in stock.`,
      };
    }
    const unitPrice = Number(variant.price);
    priced.push({
      variant,
      qty: line.qty,
      unitPrice,
      lineTotal: multiplyMoney(unitPrice, line.qty),
    });
  }

  const subtotal = sumMoney(priced.map((p) => p.lineTotal));
  const { discount, error: discountError } = await resolveDiscount(input.discountCode, subtotal);
  if (discountError) return { ok: false, error: discountError };

  const shipping = shippingFor(subtotal, settings.shipping);
  const total = round2(subtotal + shipping - (discount?.amount ?? 0));

  try {
    const order = await db.$transaction(async (tx) => {
      const number = await nextOrderNumber(tx);

      const created = await tx.order.create({
        data: {
          number,
          userId: input.userId ?? null,
          email: input.contact.email.toLowerCase(),
          phone: input.contact.phone || null,
          organisation: input.contact.organisation || null,
          firstName: input.contact.firstName,
          lastName: input.contact.lastName,
          line1: input.contact.line1,
          line2: input.contact.line2 || null,
          city: input.contact.city,
          county: input.contact.county || null,
          postcode: input.contact.postcode.toUpperCase(),
          country: input.contact.country,
          status: "AWAITING_PAYMENT",
          paymentStatus: "PENDING",
          paymentMethod: "BANK_TRANSFER",
          subtotal,
          shipping,
          discount: discount?.amount ?? 0,
          total,
          discountCode: discount?.code ?? null,
          customerNote: input.customerNote || null,
          ruoAcceptedAt: new Date(),
          items: {
            create: priced.map((p) => ({
              variantId: p.variant.id,
              sku: p.variant.sku,
              name: p.variant.product.name,
              label: p.variant.label,
              slug: p.variant.product.slug,
              unitPrice: p.unitPrice,
              qty: p.qty,
              lineTotal: p.lineTotal,
            })),
          },
          events: {
            create: {
              type: "PLACED",
              message: `Order placed — £${total.toFixed(2)}, awaiting bank transfer.`,
            },
          },
        },
      });

      // Reserve stock. The conditional update means a variant that sold out
      // between validation and here fails rather than going negative.
      for (const p of priced) {
        const claimed = await tx.variant.updateMany({
          where: { id: p.variant.id, stockQty: { gte: p.qty } },
          data: { stockQty: { decrement: p.qty } },
        });
        if (claimed.count === 0) {
          throw new OutOfStockError(`${p.variant.product.name} (${p.variant.label})`);
        }

        const after = await tx.variant.findUniqueOrThrow({
          where: { id: p.variant.id },
          select: { stockQty: true },
        });

        await tx.stockMovement.create({
          data: {
            variantId: p.variant.id,
            delta: -p.qty,
            resulting: after.stockQty,
            reason: "ORDER_PLACED",
            orderId: created.id,
            note: `Order ${number}`,
          },
        });

        // Selling the last vial takes the variant off sale automatically.
        if (after.stockQty === 0) {
          await tx.variant.update({
            where: { id: p.variant.id },
            data: { availability: "OUT_OF_STOCK" },
          });
        }
      }

      if (discount) {
        await tx.discount.update({
          where: { id: discount.id },
          data: { usedCount: { increment: 1 } },
        });
      }

      return created;
    });

    // Stock changed, so the storefront's cached catalogue is stale.
    revalidateTag(CATALOGUE_TAG);

    // The order is already safe in the database and neither send throws, so a
    // mail failure can only be logged — it can never undo a placed order.
    await sendOrderEmails(order, priced, settings);

    return { ok: true, orderNumber: order.number, orderId: order.id };
  } catch (error) {
    if (error instanceof OutOfStockError) {
      return { ok: false, error: `${error.item} sold out while you were checking out.` };
    }
    console.error("placeOrder failed", error);
    return { ok: false, error: "We could not place your order. Please try again." };
  }
}

/**
 * The customer's confirmation and the shop's new-order notification.
 *
 * Awaited rather than left running in the background: a serverless instance is
 * free to stop executing the moment the action returns, and the notification
 * the team relies on to know an order exists must not be what gets dropped.
 * Both sends swallow their own failures, so this can only ever cost the time
 * of two HTTP calls, made together.
 */
async function sendOrderEmails(
  order: Order,
  priced: {
    variant: { product: { name: string }; label: string };
    qty: number;
    lineTotal: number;
  }[],
  settings: Awaited<ReturnType<typeof getSettings>>,
): Promise<void> {
  try {
    await dispatch(order, priced, settings);
  } catch (error) {
    // Belt and braces: the order is committed, so nothing that happens while
    // telling people about it may surface as a failed checkout.
    console.error(`order emails for ${order.number} failed`, error);
  }
}

async function dispatch(
  order: Order,
  priced: {
    variant: { product: { name: string }; label: string };
    qty: number;
    lineTotal: number;
  }[],
  settings: Awaited<ReturnType<typeof getSettings>>,
): Promise<void> {
  const confirmation = {
    number: order.number,
    email: order.email,
    firstName: order.firstName,
    total: Number(order.total),
    items: priced.map((p) => ({
      name: p.variant.product.name,
      label: p.variant.label,
      qty: p.qty,
      lineTotal: p.lineTotal,
    })),
  };

  const recipients = orderNotificationRecipients(settings.store);

  const [confirmed, notified] = await Promise.all([
    sendOrderConfirmation(confirmation, settings.bankTransfer),
    sendNewOrderAlert(
      {
        ...confirmation,
        orderId: order.id,
        lastName: order.lastName,
        phone: order.phone,
        organisation: order.organisation,
        address: [
          `${order.firstName} ${order.lastName}`.trim(),
          order.line1,
          order.line2,
          order.city,
          order.county,
          order.postcode,
          order.country,
        ].filter((part): part is string => Boolean(part?.trim())),
        subtotal: Number(order.subtotal),
        shipping: Number(order.shipping),
        discount: Number(order.discount),
        discountCode: order.discountCode,
        customerNote: order.customerNote,
        placedAt: order.placedAt,
      },
      recipients,
    ),
  ]);

  const events: string[] = [];
  if (confirmed) events.push("Order confirmation emailed to the customer.");
  if (notified) events.push(`New-order notification emailed to ${recipients.join(", ")}.`);
  if (events.length === 0) return;

  await db.orderEvent.createMany({
    data: events.map((message) => ({ orderId: order.id, type: "EMAIL_SENT" as const, message })),
  });
}

class OutOfStockError extends Error {
  constructor(readonly item: string) {
    super(`out of stock: ${item}`);
    this.name = "OutOfStockError";
  }
}
