import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Whole amounts read as £25; anything else gets both decimal places.
 *
 * Without pinning maximumFractionDigits, Intl trims trailing zeros and £47.50
 * renders as "£47.5" — money should never show a single decimal place.
 */
export function formatGBP(n: number): string {
  const fractionDigits = Number.isInteger(n) ? 0 : 2;
  return n.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}
