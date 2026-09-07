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

/**
 * A stored blank is not an answer.
 *
 * Merging a stored `""` over a default would hide it — which is how a store
 * seeded before the bank details existed ended up telling customers we would
 * email the account "shortly" while a perfectly good default sat unused. Only
 * values that say something override the defaults.
 */
function withDefaults<T extends object>(defaults: T, stored: unknown): T {
  if (!stored || typeof stored !== "object") return defaults;
  const meaningful = Object.fromEntries(
    Object.entries(stored as Record<string, unknown>).filter(
      ([, value]) => !(typeof value === "string" && value.trim() === ""),
    ),
  );
  return { ...defaults, ...meaningful } as T;
}

async function readSettings() {
  const rows = await db.setting.findMany();
  const stored = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  // Merge over the defaults so a key added in a later release still resolves
  // for a store seeded before it existed.
  return {
    shipping: withDefaults(DEFAULTS.shipping, stored.shipping),
    bankTransfer: withDefaults(DEFAULTS.bankTransfer, stored.bankTransfer),
    store: withDefaults(DEFAULTS.store, stored.store),
  };
}

/**
 * Cached under the `settings` tag, which the admin form revalidates on save.
 * The TTL is the safety net for writes the app never sees — a migration or a
 * direct database edit — which would otherwise stay invisible for ever, since
 * Vercel's data cache survives a deployment.
 */
export const getSettings = unstable_cache(readSettings, ["settings"], {
  tags: [SETTINGS_TAG],
  revalidate: 60,
});

/** Delivery cost for a subtotal, per the configured rules. */
export function shippingFor(subtotal: number, shipping: ShippingSettings): number {
  if (subtotal <= 0) return 0;
  return subtotal >= shipping.freeThreshold ? 0 : shipping.flatRate;
}

export { DEFAULTS as SETTING_DEFAULTS };
