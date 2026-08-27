"use server";

import { headers } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import { limitFromEnv, pruneRateLimits, rateLimit } from "@/lib/rate-limit";
import { placeOrder, resolveDiscount, type CartLineInput } from "@/lib/orders";
import { db } from "@/lib/db";
import { getSettings, shippingFor } from "@/lib/settings";
import { DEFAULT_GATEWAY, isEnabledGateway, orderReceivedPath } from "@/lib/payments";
import { multiplyMoney, round2, sumMoney } from "@/lib/money";

export type CheckoutState =
  | { status: "idle" }
  | { status: "error"; error: string }
  /** Where the browser is sent next: the order's own payment page. */
  | { status: "placed"; orderNumber: string; redirectTo: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseLines(raw: FormDataEntryValue | null): CartLineInput[] {
  try {
    const parsed = JSON.parse(String(raw ?? "[]"));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((l) => typeof l?.sku === "string" && Number.isFinite(l?.qty))
      .map((l) => ({ sku: String(l.sku), qty: Math.floor(Number(l.qty)) }));
  } catch {
    return [];
  }
}

export async function submitOrder(
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  // Checkout is necessarily open to guests, so throttle it per IP: without
  // this, orders could be flooded to reserve — and so deny — stock.
  pruneRateLimits();
  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = rateLimit(`checkout:${ip}`, {
    limit: limitFromEnv("CHECKOUT_RATE_LIMIT", 10),
    windowMs: 10 * 60_000,
  });
  if (!limit.ok) {
    return {
      status: "error",
      error: `Too many orders from this connection. Try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minutes, or email customerservice@biopluslabs.co.uk.`,
    };
  }

  const value = (key: string) => String(formData.get(key) ?? "").trim();

  const email = value("email").toLowerCase();
  if (!EMAIL_RE.test(email)) return { status: "error", error: "Enter a valid email address." };

  const required: Array<[string, string]> = [
    ["firstName", "first name"],
    ["lastName", "last name"],
    ["line1", "address"],
    ["city", "town or city"],
    ["postcode", "postcode"],
  ];
  for (const [field, label] of required) {
    if (!value(field)) return { status: "error", error: `Enter your ${label}.` };
  }

  if (formData.get("ruo") !== "on") {
    return { status: "error", error: "Please confirm the research-use declaration." };
  }

  // Only a gateway we actually offer can be selected; a tampered field falls
  // back to bank transfer rather than recording a method we cannot take money by.
  const submittedMethod = value("paymentMethod");
  const paymentMethod = isEnabledGateway(submittedMethod) ? submittedMethod : DEFAULT_GATEWAY;

  const user = await getCurrentUser();

  const result = await placeOrder({
    lines: parseLines(formData.get("lines")),
    contact: {
      email,
      phone: value("phone"),
      organisation: value("organisation"),
      firstName: value("firstName"),
      lastName: value("lastName"),
      line1: value("line1"),
      line2: value("line2"),
      city: value("city"),
      county: value("county"),
      postcode: value("postcode"),
      country: value("country") || "GB",
    },
    discountCode: value("discountCode") || undefined,
    customerNote: value("customerNote") || undefined,
    paymentMethod,
    userId: user?.id ?? null,
    ruoAccepted: true,
  });

  if (!result.ok) return { status: "error", error: result.error };
  return {
    status: "placed",
    orderNumber: result.orderNumber,
    redirectTo: orderReceivedPath(result.orderNumber, result.accessKey),
  };
}

export type QuoteResult = {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  discountCode?: string;
  error?: string;
};

/**
 * Server-authoritative totals for the checkout summary.
 *
 * The page could add up prices itself, but then a stale cart would show a
 * total that differs from what is charged. Quoting from the database keeps the
 * figure on screen the figure in the order.
 */
export async function quoteCart(
  lines: CartLineInput[],
  discountCode?: string,
): Promise<QuoteResult> {
  const settings = await getSettings();
  const wanted = lines.filter((l) => l.qty > 0);

  const variants = wanted.length
    ? await db.variant.findMany({ where: { sku: { in: wanted.map((l) => l.sku) } } })
    : [];

  const subtotal = sumMoney(
    wanted.map((line) => {
      const variant = variants.find((v) => v.sku === line.sku);
      return variant ? multiplyMoney(Number(variant.price), line.qty) : 0;
    }),
  );

  const { discount, error } = await resolveDiscount(discountCode, subtotal);
  const shipping = shippingFor(subtotal, settings.shipping);

  return {
    subtotal,
    shipping,
    discount: discount?.amount ?? 0,
    total: round2(subtotal + shipping - (discount?.amount ?? 0)),
    discountCode: discount?.code,
    error,
  };
}
