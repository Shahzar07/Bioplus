import { test, expect, type Page } from "@playwright/test";
import { acceptAgeGate, seedCart, mainForm as form } from "./helpers";

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

test("the overview shows live figures", async ({ page }) => {
  await signInAsAdmin(page);
  await expect(page.getByRole("heading", { name: /Welcome back/ })).toBeVisible();
  await expect(page.getByText("Revenue today").first()).toBeVisible();
  await expect(page.getByText("Awaiting payment").first()).toBeVisible();
  await expect(page.getByText("Recent orders").first()).toBeVisible();
});

test("orders can be searched and filtered", async ({ page }) => {
  await signInAsAdmin(page);
  await page.goto("/admin/orders");
  await expect(page.getByRole("heading", { name: "Orders" })).toBeVisible();

  await page.getByRole("link", { name: "Awaiting payment" }).first().click();
  await expect(page).toHaveURL(/status=AWAITING_PAYMENT/);

  await page.getByLabel("Search orders").fill("BPL-100001");
  await page.getByLabel("Search orders").press("Enter");
  await expect(page.getByRole("link", { name: "BPL-100001" })).toBeVisible();
});

test("an order can be marked paid, tracked and shipped", async ({ page, context }) => {
  // Place a fresh order to work with.
  await seedCart(context, [{ sku: "BPL-GHK50", qty: 1 }]);
  await page.goto("/checkout");
  await form(page).getByLabel("Email address").fill("fulfilment@lab.ac.uk");
  await form(page).getByLabel("First name").fill("Fulfil");
  await form(page).getByLabel("Last name").fill("Ment");
  await form(page).getByLabel("Address line 1").fill("1 Test Street");
  await form(page).getByLabel("Town / City").fill("Edinburgh");
  await form(page).getByLabel("Postcode").fill("EH1 1AA");
  await form(page).getByRole("checkbox").check();
  await form(page).getByRole("button", { name: /Place order/ }).click();
  await expect(page.getByRole("heading", { name: "Order received" })).toBeVisible({ timeout: 15_000 });

  const orderNumber = (await page.getByRole("strong").filter({ hasText: /^BPL-\d+$/ }).first().textContent()) ?? "";
  expect(orderNumber).toMatch(/^BPL-\d+$/);

  await signInAsAdmin(page);
  await page.goto("/admin/orders");
  await page.getByRole("link", { name: orderNumber }).click();

  await expect(page.getByRole("heading", { name: orderNumber })).toBeVisible();
  await expect(page.getByText("Research-use declaration accepted")).toBeVisible();

  // Awaiting payment -> paid
  await page.getByRole("button", { name: "Mark paid" }).click();
  await expect(page.getByText("Order marked paid.")).toBeVisible();

  // Tracking
  await page.getByLabel("Carrier").fill("Royal Mail");
  await page.getByLabel("Tracking number").fill("AB123456789GB");
  await page.getByRole("button", { name: "Save tracking" }).click();
  await expect(page.getByText("Tracking saved.")).toBeVisible();

  // Paid -> shipped
  await page.getByRole("button", { name: "Mark shipped" }).click();
  await expect(page.getByText("Order marked shipped.")).toBeVisible();

  // The timeline records each step.
  await expect(page.getByText("Marked paid.")).toBeVisible();
  await expect(page.getByText(/Tracking added: Royal Mail AB123456789GB/)).toBeVisible();
});

test("cancelling an order returns its stock", async ({ page, context }) => {
  await seedCart(context, [{ sku: "BPL-MOTS10", qty: 3 }]);
  await page.goto("/checkout");
  await form(page).getByLabel("Email address").fill("cancel@lab.ac.uk");
  await form(page).getByLabel("First name").fill("Can");
  await form(page).getByLabel("Last name").fill("Cel");
  await form(page).getByLabel("Address line 1").fill("2 Test Street");
  await form(page).getByLabel("Town / City").fill("Edinburgh");
  await form(page).getByLabel("Postcode").fill("EH1 1AA");
  await form(page).getByRole("checkbox").check();
  await form(page).getByRole("button", { name: /Place order/ }).click();
  await expect(page.getByRole("heading", { name: "Order received" })).toBeVisible({ timeout: 15_000 });
  const orderNumber = (await page.getByRole("strong").filter({ hasText: /^BPL-\d+$/ }).first().textContent()) ?? "";

  await signInAsAdmin(page);
  await page.goto("/admin/inventory");
  const before = await page.getByTestId("stock-BPL-MOTS10").textContent();

  await page.goto("/admin/orders");
  await page.getByRole("link", { name: orderNumber }).click();
  await page.getByRole("button", { name: "Mark cancelled" }).click();
  await expect(page.getByText(/Order marked cancelled/)).toBeVisible();

  await page.goto("/admin/inventory");
  const after = await page.getByTestId("stock-BPL-MOTS10").textContent();
  expect(Number(after)).toBe(Number(before) + 3);
});

test("a new order reaches an open dashboard without a refresh", async ({ page, browser }) => {
  await signInAsAdmin(page);
  await page.goto("/admin/orders");

  // A second, separate visitor places an order.
  const shopper = await browser.newContext();
  await acceptAgeGate(shopper);
  await seedCart(shopper, [{ sku: "BPL-TB10", qty: 1 }]);
  const shopperPage = await shopper.newPage();
  await shopperPage.goto("/checkout");
  await mainFormOf(shopperPage).getByLabel("Email address").fill("realtime@lab.ac.uk");
  await mainFormOf(shopperPage).getByLabel("First name").fill("Real");
  await mainFormOf(shopperPage).getByLabel("Last name").fill("Time");
  await mainFormOf(shopperPage).getByLabel("Address line 1").fill("3 Test Street");
  await mainFormOf(shopperPage).getByLabel("Town / City").fill("Edinburgh");
  await mainFormOf(shopperPage).getByLabel("Postcode").fill("EH1 1AA");
  await mainFormOf(shopperPage).getByRole("checkbox").check();
  await mainFormOf(shopperPage).getByRole("button", { name: /Place order/ }).click();
  await expect(shopperPage.getByRole("heading", { name: "Order received" })).toBeVisible({
    timeout: 15_000,
  });

  // The dashboard, untouched, raises a toast for it.
  await expect(page.getByText(/New order BPL-\d+/)).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText("Real Time").first()).toBeVisible();

  await shopper.close();
});

function mainFormOf(page: Page) {
  return page.locator("main form");
}
