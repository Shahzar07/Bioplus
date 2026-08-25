import { test, expect, type Page } from "@playwright/test";
import { acceptAgeGate, mainForm as form } from "./helpers";

const ADMIN = { email: "admin@biopluslabs.co.uk", password: "devpassword123" };

async function signInAsAdmin(page: Page) {
  await page.goto("/login");
  await form(page).getByLabel("Email address").fill(ADMIN.email);
  await form(page).getByLabel("Password", { exact: true }).fill(ADMIN.password);
  await form(page).getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin/);
}

test.beforeEach(async ({ context }) => {
  await acceptAgeGate(context);
});

/**
 * These tests mutate the catalogue, so each one puts the product it touches
 * back the way it found it — and normalises the state first, in case a
 * previous failed run left it half-changed.
 */
async function ensureLive(page: Page, slug: string) {
  await page.goto("/admin/products");
  const toggle = page.getByTestId(`visibility-${slug}`);
  const label = (await toggle.getAttribute("aria-label")) ?? "";
  if (!label.includes("is live")) {
    await toggle.click();
    await expect(page.getByTestId(`visibility-${slug}`)).toHaveAttribute(
      "aria-label",
      /is live/,
    );
  }
}

async function setPrice(page: Page, productName: string, price: string) {
  await page.goto("/admin/products");
  await page.getByRole("link", { name: productName }).first().click();
  await page.getByLabel("Price (£)").fill(price);
  await page.getByRole("button", { name: "Save & publish" }).click();
  await expect(page.getByText("Product saved and published.")).toBeVisible();
}

test("toggling stock is reflected on the storefront", async ({ page }) => {
  await signInAsAdmin(page);
  await ensureLive(page, "tesamorelin");
  await page.goto("/admin/inventory");

  // Tesamorelin is in stock in the seeded catalogue.
  const toggle = page.getByTestId("availability-BPL-TES10");
  await expect(toggle).toContainText("In stock");

  await toggle.click();
  await expect(toggle).toContainText("Out of stock");

  // The storefront reflects it without a rebuild.
  await page.goto("/product/tesamorelin");
  await expect(page.getByText("Out of stock").first()).toBeVisible();

  // Put it back.
  await page.goto("/admin/inventory");
  const restored = page.getByTestId("availability-BPL-TES10");
  await restored.click();
  await expect(restored).toContainText("Arriving soon");
  await restored.click();
  await expect(restored).toContainText("In stock");

  await page.goto("/product/tesamorelin");
  await expect(page.getByText("In stock").first()).toBeVisible();
});

test("a new product is created and appears on the shop", async ({ page }) => {
  const stamp = Date.now();
  const name = `Test Peptide ${stamp}`;
  const slug = `test-peptide-${stamp}`;
  const sku = `BPL-TEST${stamp}`;

  await signInAsAdmin(page);
  await page.goto("/admin/products/new");

  await page.getByLabel("Product name").fill(name);
  await page.getByLabel("URL slug").fill(slug);
  await page.getByLabel("Tagline").fill("A compound added from the dashboard");
  await page.getByLabel("Description").fill("Created by the end-to-end test to prove the editor writes through to the storefront.");
  await page.getByLabel("Highlights").fill("First highlight\nSecond highlight");

  await page.getByLabel("SKU").fill(sku);
  await page.getByLabel("Option label").fill("15 mg vial");
  await page.getByLabel("Strength").fill("15 mg");
  await page.getByLabel("Price (£)").fill("42");
  await page.getByLabel("Stock on hand").fill("7");

  await page.getByRole("button", { name: "Save & publish" }).click();
  await expect(page).toHaveURL(/\/admin\/products\/[a-z0-9]+/);

  // Live on the storefront.
  await page.goto("/shop");
  await expect(page.getByText(name).first()).toBeVisible();

  await page.goto(`/product/${slug}`);
  await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
  await expect(page.getByText("£42").first()).toBeVisible();

  // Highlights live under the Research Usage tab.
  await page.getByRole("button", { name: "Research", exact: true }).click();
  await expect(page.getByText("First highlight")).toBeVisible();

  // And buyable.
  await page.getByRole("button", { name: /Add to cart/ }).click();
  const stored = await page.evaluate(() => window.localStorage.getItem("bioplus-cart-v1"));
  expect(stored).toContain(sku);
});

test("a price edit reaches the storefront", async ({ page }) => {
  await signInAsAdmin(page);
  await ensureLive(page, "tesamorelin");

  await setPrice(page, "Tesamorelin", "47.50");
  await page.goto("/product/tesamorelin");
  await expect(page.getByText("£47.50").first()).toBeVisible();

  // Restore the seeded price.
  await setPrice(page, "Tesamorelin", "45");
  await page.goto("/product/tesamorelin");
  await expect(page.getByText("£45").first()).toBeVisible();
});

test("a draft product is hidden from the shop", async ({ page }) => {
  await signInAsAdmin(page);
  await ensureLive(page, "tesamorelin");

  await page.getByTestId("visibility-tesamorelin").click();
  await expect(page.getByTestId("visibility-tesamorelin")).toHaveAttribute(
    "aria-label",
    /is draft/,
  );

  await page.goto("/shop");
  await expect(page.getByRole("link", { name: /Tesamorelin/ })).toHaveCount(0);

  // Publish it again.
  await ensureLive(page, "tesamorelin");
  await page.goto("/shop");
  await expect(page.getByRole("link", { name: /Tesamorelin/ }).first()).toBeVisible();
});

test("stock adjustments are recorded with an audit trail", async ({ page }) => {
  await signInAsAdmin(page);
  await page.goto("/admin/inventory");

  const before = Number(await page.getByTestId("stock-BPL-KLOW80").textContent());

  await page.getByLabel("Adjustment amount for BPL-KLOW80").fill("5");
  await page.getByLabel("Add stock to BPL-KLOW80").click();

  await expect(page.getByText(`BPL-KLOW80: +5 → ${before + 5} in stock.`)).toBeVisible();
  await expect(page.getByTestId("stock-BPL-KLOW80")).toHaveText(String(before + 5));

  // The movement is logged.
  await expect(page.getByText("restock").first()).toBeVisible();
});

test("stock cannot be driven negative", async ({ page }) => {
  await signInAsAdmin(page);
  await page.goto("/admin/inventory");

  await page.getByLabel("Adjustment amount for BPL-KLOW80").fill("9999");
  await page.getByLabel("Remove stock from BPL-KLOW80").click();

  await expect(page.getByText(/cannot remove 9999/)).toBeVisible();
});
