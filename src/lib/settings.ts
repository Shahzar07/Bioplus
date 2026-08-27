import "server-only";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { BANK_TRANSFER_DEFAULTS, type BankTransferSettings } from "@/lib/payments";

/**
 * Store configuration held in the Setting table so the dashboard can change it
 * without a deploy. Reads are cached under the `settings` tag; the admin
 * settings form revalidates that tag on save.
 */

export const SETTINGS_TAG = "settings";

export type ShippingSettings = {
  freeThreshold: number;
  flatRate: number;
  countries: string[];
};

export type { BankTransferSettings };

export type StoreSettings = {
  email: string;
  hours: string;
  lowStockThreshold: number;
};

const DEFAULTS = {
  shipping: { freeThreshold: 250, flatRate: 12, countries: ["GB", "IE"] } satisfies ShippingSettings,
  bankTransfer: BANK_TRANSFER_DEFAULTS,
  store: {
    email: "customerservice@biopluslabs.co.uk",
    hours: "Monday – Friday, 9:00 – 18:00",
    lowStockThreshold: 5,
  } satisfies StoreSettings,
};

export type SettingsKey = keyof typeof DEFAULTS;

async function readSettings() {
  const rows = await db.setting.findMany();
  const stored = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  // Merge over the defaults so a key added in a later release still resolves
  // for a store seeded before it existed.
  return {
    shipping: { ...DEFAULTS.shipping, ...(stored.shipping as object) } as ShippingSettings,
    bankTransfer: {
      ...DEFAULTS.bankTransfer,
      ...(stored.bankTransfer as object),
    } as BankTransferSettings,
    store: { ...DEFAULTS.store, ...(stored.store as object) } as StoreSettings,
  };
}

export const getSettings = unstable_cache(readSettings, ["settings"], { tags: [SETTINGS_TAG] });

/** Delivery cost for a subtotal, per the configured rules. */
export function shippingFor(subtotal: number, shipping: ShippingSettings): number {
  if (subtotal <= 0) return 0;
  return subtotal >= shipping.freeThreshold ? 0 : shipping.flatRate;
}

export { DEFAULTS as SETTING_DEFAULTS };
