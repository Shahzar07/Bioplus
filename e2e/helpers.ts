import type { Page, BrowserContext } from "@playwright/test";

/**
 * The storefront opens with an 18+ age gate that covers the page until it is
 * accepted. Seeding the flag it writes lets tests reach the page underneath,
 * exactly as a returning visitor would.
 */
export const AGE_GATE_KEY = "bioplus-access-verified-v1";

export async function acceptAgeGate(context: BrowserContext) {
  await context.addInitScript(
    ([key]) => {
      try {
        window.localStorage.setItem(key, "yes");
      } catch {
        /* private mode — the gate will simply show */
      }
    },
    [AGE_GATE_KEY],
  );
}

/** The page's own form — the footer newsletter signup also has an email field. */
export const mainForm = (page: Page) => page.locator("main form");

export const CART_KEY = "bioplus-cart-v1";

/**
 * Seeds the cart before any page script runs.
 *
 * Setting localStorage after navigating races the cart provider, which writes
 * its (empty) state back on hydration and can clobber the seeded value.
 */
export async function seedCart(
  context: BrowserContext,
  lines: { sku: string; qty: number }[],
) {
  await context.addInitScript(
    ([key, value]) => {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        /* private mode */
      }
    },
    [CART_KEY, JSON.stringify(lines)] as [string, string],
  );
}
