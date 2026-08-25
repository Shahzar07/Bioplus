import type { OrderStatus, PaymentStatus } from "@/generated/prisma";

/**
 * One definition of how each order status is named and coloured, shared by the
 * customer's Research Hub (dark panels) and the admin dashboard (light).
 */

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  AWAITING_PAYMENT: "Awaiting payment",
  PAID: "Paid",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

/** Classes for the dark Research Hub panels. */
export const ORDER_STATUS_DARK: Record<OrderStatus, string> = {
  AWAITING_PAYMENT: "bg-amber-500/15 text-amber-300",
  PAID: "bg-emerald-500/15 text-emerald-300",
  PROCESSING: "bg-brand-500/15 text-brand-300",
  SHIPPED: "bg-sky-500/15 text-sky-300",
  DELIVERED: "bg-emerald-500/15 text-emerald-300",
  CANCELLED: "bg-white/10 text-white/60",
  REFUNDED: "bg-white/10 text-white/60",
};

/** Classes for the light admin dashboard. */
export const ORDER_STATUS_LIGHT: Record<OrderStatus, string> = {
  AWAITING_PAYMENT: "bg-amber-100 text-amber-800 ring-amber-200",
  PAID: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  PROCESSING: "bg-brand-50 text-brand-700 ring-brand-200",
  SHIPPED: "bg-sky-100 text-sky-800 ring-sky-200",
  DELIVERED: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  CANCELLED: "bg-ink-100 text-ink-600 ring-ink-200",
  REFUNDED: "bg-ink-100 text-ink-600 ring-ink-200",
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  REFUNDED: "Refunded",
  FAILED: "Failed",
};

/** Statuses an order can move to from where it is now. */
export const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  AWAITING_PAYMENT: ["PAID", "CANCELLED"],
  PAID: ["PROCESSING", "SHIPPED", "CANCELLED", "REFUNDED"],
  PROCESSING: ["SHIPPED", "CANCELLED", "REFUNDED"],
  SHIPPED: ["DELIVERED", "REFUNDED"],
  DELIVERED: ["REFUNDED"],
  CANCELLED: [],
  REFUNDED: [],
};

/** Cancelling or refunding these returns their stock to the shelf. */
export const STOCK_HOLDING_STATUSES: OrderStatus[] = [
  "AWAITING_PAYMENT",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

export function formatOrderDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
