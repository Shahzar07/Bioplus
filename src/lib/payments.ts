/**
 * Payment methods, modelled on WooCommerce's gateway layer.
 *
 * A gateway declares how it is offered at checkout and what the customer is
 * told once the order exists. Direct bank transfer (BACS) is the only one
 * enabled: the order is recorded, held as awaiting payment, and the account
 * details plus the order number as the reference are issued automatically —
 * nobody re-types them, and nothing is settled by emailing a screenshot.
 *
 * Deliberately free of `server-only` and of any database import: the seed
 * script and client components both read from it.
 */

import type { PaymentMethod } from "@/generated/prisma";

export type PaymentGateway = {
  id: PaymentMethod;
  /** What the radio at checkout is labelled. */
  title: string;
  /** Shown under the radio once the method is selected. */
  description: string;
  /** Offered at checkout. A disabled gateway is still valid on past orders. */
  enabled: boolean;
};

export const PAYMENT_GATEWAYS: PaymentGateway[] = [
  {
    id: "BANK_TRANSFER",
    title: "Direct bank transfer",
    description:
      "Pay straight into our UK business account. Your order is placed now and held for you; the account details and your payment reference appear on the next screen and in your confirmation email. We dispatch as soon as the transfer clears — usually the same working day.",
    enabled: true,
  },
  {
    id: "CARD",
    title: "Card payment",
    description: "Card payments are not available yet.",
    enabled: false,
  },
];

export const ENABLED_GATEWAYS = PAYMENT_GATEWAYS.filter((g) => g.enabled);

export const DEFAULT_GATEWAY: PaymentMethod = "BANK_TRANSFER";

/** Whether a submitted payment method is one we actually offer. */
export function isEnabledGateway(value: string): value is PaymentMethod {
  return ENABLED_GATEWAYS.some((g) => g.id === value);
}

export function gatewayTitle(id: PaymentMethod): string {
  return PAYMENT_GATEWAYS.find((g) => g.id === id)?.title ?? "Bank transfer";
}

// ------------------------------------------------------------------ BACS

export type BankTransferSettings = {
  accountName: string;
  bankName: string;
  sortCode: string;
  accountNumber: string;
  /** Optional, for transfers from outside the UK. */
  iban: string;
  bic: string;
  instructions: string;
};

/**
 * The client's account, as supplied. Held here rather than in a page so the
 * dashboard's Settings → Bank transfer form is the single place it is edited;
 * these values are only the starting point a fresh install is seeded with.
 */
export const BANK_TRANSFER_DEFAULTS: BankTransferSettings = {
  accountName: "Alessandro Iannelli",
  bankName: "Tide Business",
  sortCode: "04-06-05",
  accountNumber: "32437300",
  iban: "",
  bic: "",
  instructions:
    "Please quote your order number as the payment reference — it is how we match your transfer to your order. Orders are dispatched once payment clears, usually the same working day.",
};

/** "040605" and "04 06 05" both mean 04-06-05. */
export function formatSortCode(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length !== 6) return raw.trim();
  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4, 6)}`;
}

/** Bank details are only usable once there is an account to pay into. */
export function hasBankDetails(bank: BankTransferSettings): boolean {
  return Boolean(bank.accountNumber && bank.sortCode);
}

export type PaymentDetailRow = {
  label: string;
  value: string;
  /** The payment reference — the one field a customer must not mistype. */
  emphasise?: boolean;
};

/**
 * The rows shown on the payment page, in the confirmation email and in the
 * Research Hub, built once so the three never drift apart.
 */
export function bankTransferRows(
  bank: BankTransferSettings,
  reference: string,
): PaymentDetailRow[] {
  const rows: PaymentDetailRow[] = [{ label: "Account name", value: bank.accountName }];
  if (bank.bankName) rows.push({ label: "Bank", value: bank.bankName });
  rows.push(
    { label: "Sort code", value: formatSortCode(bank.sortCode) },
    { label: "Account number", value: bank.accountNumber },
  );
  if (bank.iban) rows.push({ label: "IBAN", value: bank.iban });
  if (bank.bic) rows.push({ label: "BIC / SWIFT", value: bank.bic });
  rows.push({ label: "Payment reference", value: reference, emphasise: true });
  return rows;
}

/** The order's own payment page — WooCommerce's order-received URL. */
export function orderReceivedPath(orderNumber: string, accessKey: string): string {
  return `/checkout/order-received/${encodeURIComponent(orderNumber)}?key=${encodeURIComponent(accessKey)}`;
}
