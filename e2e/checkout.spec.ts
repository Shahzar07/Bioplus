import { test, expect, type Page } from "@playwright/test";
import { acceptAgeGate, seedCart, mainForm as form, CART_KEY } from "./helpers";

test.beforeEach(async ({ context }) => {
  await acceptAgeGate(context);
});

async function fillDeliveryDetails(page: Page, email: string) {
  await form(page).getByLabel("Email address").fill(email);
  await form(page).getByLabel("First name").fill("Guest");
  await form(page).getByLabel("Last name").fill("Buyer");
  await form(page).getByLabel("Address line 1").fill("14 Nicolson Square");
  await form(page).getByLabel("Town / City").fill("Edinburgh");
  await form(page).getByLabel("Postcode").fill("EH8 9BX");
  await form(page).getByRole("checkbox").check();
}

test("adding to the cart from a product page works", async ({ page, context }) => {
  await page.goto("/product/bpc-157");
  await page.getByRole("button", { name: /Add to cart/ }).click();
  await expect(page.getByText("BPC-157").first()).toBeVisible();

  const stored = await page.evaluate((key) => window.localStorage.getItem(key), CART_KEY);
  expect(stored).toContain("BPL-BPC10");
});

test("a guest can place an order and receives a reference", async ({ page, context }) => {
  await seedCart(context, [{ sku: "BPL-BPC10", qty: 2 }]);
  await page.goto("/checkout");

  // £25 × 2 = £50, plus £12 delivery under the £250 free threshold.
  await expect(page.getByText("£62").first()).toBeVisible();

  await fillDeliveryDetails(page, "guest-buyer@lab.ac.uk");
  await form(page).getByRole("button", { name: /Place order/ }).click();

  await expect(page.getByRole("heading", { name: "Order received" })).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByRole("strong").filter({ hasText: /^BPL-\d+$/ }).first()).toBeVisible();

  // The cart is emptied only after the order is safely recorded.
  const stored = await page.evaluate((key) => window.localStorage.getItem(key), CART_KEY);
  expect(stored).toBe("[]");
});

test("an unknown SKU in the cart is refused", async ({ page, context }) => {
  await seedCart(context, [{ sku: "BPL-DOES-NOT-EXIST", qty: 1 }]);
  await page.goto("/checkout");
  await fillDeliveryDetails(page, "tamper@lab.ac.uk");
  await form(page).getByRole("button", { name: /Place order/ }).click();

  await expect(form(page).getByRole("alert")).toContainText(/no longer available/);
});

test("ordering more than the stock on hand is refused", async ({ page, context }) => {
  await seedCart(context, [{ sku: "BPL-BPC10", qty: 99 }]);
  await page.goto("/checkout");
  await fillDeliveryDetails(page, "greedy@lab.ac.uk");
  await form(page).getByRole("button", { name: /Place order/ }).click();

  await expect(form(page).getByRole("alert")).toContainText(/remain in stock/);
});

test("an out-of-stock variant cannot be ordered", async ({ page, context }) => {
  // GLOW is out of stock in the seeded catalogue.
  await seedCart(context, [{ sku: "BPL-GLOW70", qty: 1 }]);
  await page.goto("/checkout");
  await fillDeliveryDetails(page, "oos@lab.ac.uk");
  await form(page).getByRole("button", { name: /Place order/ }).click();

  await expect(form(page).getByRole("alert")).toContainText(/out of stock/i);
});

test("the research-use declaration is required", async ({ page, context }) => {
  await seedCart(context, [{ sku: "BPL-BPC10", qty: 1 }]);
  await page.goto("/checkout");
  await expect(form(page).getByRole("button", { name: /Place order/ })).toBeDisabled();
});

test("an empty cart cannot check out", async ({ page, context }) => {
  await seedCart(context, []);
  await page.goto("/checkout");
  await expect(page.getByRole("heading", { name: "Your cart is empty" })).toBeVisible();
});

test("the payment page is a durable URL that survives a reload", async ({ page, context }) => {
  await seedCart(context, [{ sku: "BPL-BPC10", qty: 1 }]);
  await page.goto("/checkout");

  // Direct bank transfer is offered as a payment method and preselected.
  await expect(form(page).getByRole("radio", { name: "Direct bank transfer" })).toBeChecked();

  await fillDeliveryDetails(page, "durable@lab.ac.uk");
  await form(page).getByRole("button", { name: /Place order/ }).click();

  await expect(page.getByRole("heading", { name: "Order received" })).toBeVisible({
    timeout: 15_000,
  });

  // Checkout hands over to the order's own page, keyed so a guest can return.
  await expect(page).toHaveURL(/\/checkout\/order-received\/BPL-\d+\?key=/);
  const orderNumber =
    (await page.getByRole("strong").filter({ hasText: /^BPL-\d+$/ }).first().textContent()) ?? "";
  expect(orderNumber).toMatch(/^BPL-\d+$/);

  const paymentUrl = page.url();
  await expect(page.getByRole("heading", { name: "Pay by direct bank transfer" })).toBeVisible();
  await expect(page.getByText("Sort code", { exact: true })).toBeVisible();
  await expect(page.getByText("Payment reference", { exact: true })).toBeVisible();

  // The details are issued by the store, so coming back to them is a reload —
  // not a request for someone to send them again.
  await page.goto(paymentUrl);
  await expect(page.getByRole("heading", { name: "Order received" })).toBeVisible();
  await expect(page.getByText(orderNumber).first()).toBeVisible();

  // The key is what grants a guest access; without it the order is not exposed.
  await page.goto(`/checkout/order-received/${orderNumber}`);
  await expect(page.getByRole("heading", { name: "Order received" })).toBeHidden();
});
