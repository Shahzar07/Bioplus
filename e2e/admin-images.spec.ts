import { test, expect } from "@playwright/test";
import { acceptAgeGate, signInAsAdmin } from "./helpers";

test.beforeEach(async ({ context }) => {
  await acceptAgeGate(context);
});

/** A 1x1 red PNG — enough to prove the round trip without a fixture file. */
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

/**
 * Uploads run against the database when BLOB_READ_WRITE_TOKEN is unset, which
 * is the case locally and on any deployment without a Blob store. The point of
 * this test is the whole round trip: the dashboard accepts the file, the URL it
 * gets back actually serves the bytes, and the storefront renders it instead of
 * the bundled vial photograph.
 */
test("an uploaded product image is served and reaches the storefront", async ({ page }) => {
  await signInAsAdmin(page);

  await page.goto("/admin/products");
  await page.getByRole("link", { name: "Tesamorelin" }).first().click();

  await page.getByRole("button", { name: /Upload image/ }).isVisible;
  await page.locator('input[type="file"]').setInputFiles({
    name: "tesamorelin.png",
    mimeType: "image/png",
    buffer: PNG,
  });

  // The preview appears once the upload resolves to a URL.
  const preview = page.getByAltText("Product");
  await expect(preview).toBeVisible();

  const src = await preview.getAttribute("src");
  expect(src).toBeTruthy();
  expect(src).toMatch(/^\/api\/media\/|^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//);

  // The URL serves the actual bytes back, as an image.
  const served = await page.request.get(src!);
  expect(served.status()).toBe(200);
  expect(served.headers()["content-type"]).toContain("image/png");
  expect((await served.body()).length).toBe(PNG.length);

  await page.getByRole("button", { name: "Save & publish" }).click();
  await expect(page.getByText("Product saved and published.")).toBeVisible();

  // The storefront uses it in place of the bundled photography.
  await page.goto("/product/tesamorelin");
  const shown = page.locator('main img[alt*="Tesamorelin"]').first();
  await expect(shown).toBeVisible();
  expect(await shown.getAttribute("src")).toContain(encodeURIComponent(src!));

  // Put the product back to the bundled image for the next run.
  await page.goto("/admin/products");
  await page.getByRole("link", { name: "Tesamorelin" }).first().click();
  await page.getByRole("button", { name: "Remove image" }).click();
  await page.getByRole("button", { name: "Save & publish" }).click();
  await expect(page.getByText("Product saved and published.")).toBeVisible();
});

/**
 * The dashboard is staff-only and has its own sidebar, so it should not carry
 * the shop's header, footer or age gate — only a way back to the storefront.
 */
test("the dashboard drops the storefront chrome and offers a way home", async ({ page }) => {
  await signInAsAdmin(page);
  await page.goto("/admin");

  await expect(page.getByRole("banner")).toHaveCount(0);
  await expect(page.getByRole("contentinfo")).toHaveCount(0);
  await expect(page.getByRole("main")).toHaveCount(1);

  const home = page.getByRole("link", { name: "Back to Home" });
  await expect(home).toBeVisible();
  await home.click();
  await expect(page).toHaveURL(/\/$/);

  // The storefront itself still has both.
  await expect(page.getByRole("banner")).toHaveCount(1);
  await expect(page.getByRole("contentinfo")).toHaveCount(1);
});
