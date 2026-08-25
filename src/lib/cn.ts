import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatGBP(n: number): string {
  return n.toLocaleString("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 0 });
}
