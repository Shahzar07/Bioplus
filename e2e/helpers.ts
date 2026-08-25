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
