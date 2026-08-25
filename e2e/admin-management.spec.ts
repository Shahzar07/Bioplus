import { test, expect, type Page } from "@playwright/test";
import { acceptAgeGate, seedCart, signInAsAdmin, mainForm as form } from "./helpers";

test.beforeEach(async ({ context }) => {
  await acceptAgeGate(context);
});

test("a customer's orders and spend are visible to staff", async ({ page }) => {
  await signInAsAdmin(page);
  await page.goto("/admin/customers");
  await expect(page.getByRole("heading", { name: "Customers" })).toBeVisible();

  // The seeded admin is itself an account.
  await page.getByLabel("Search customers").fill("admin@biopluslabs.co.uk");
  await page.getByLabel("Search customers").press("Enter");
  await page.getByRole("link", { name: /admin/i }).first().click();

  await expect(page.getByText("Lifetime spend")).toBeVisible();
  await expect(page.getByText("Order history")).toBeVisible();
  // Staff cannot suspend their own account.
  await expect(page.getByText(/locking yourself out/)).toBeVisible();
});

test("a suspended customer cannot sign in", async ({ page, browser }) => {
  const email = `suspended-${Date.now()}@lab.ac.uk`;
  const password = "suspend-me-please";

  // Register a customer.
  await page.goto("/register");
  await form(page).getByLabel("Full name").fill("Suspend Me");
  await form(page).getByLabel("Email address").fill(email);
  await form(page).getByLabel("Password", { exact: true }).fill(password);
  await form(page).getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/account/);
  await page.getByRole("button", { name: "Log out" }).first().click();
  await page.waitForURL("/");

  // Suspend them.
  await signInAsAdmin(page);
  await page.goto("/admin/customers");
  await page.getByLabel("Search customers").fill(email);
  await page.getByLabel("Search customers").press("Enter");
  await page.getByRole("link", { name: "Suspend Me" }).click();
  await page.getByRole("button", { name: `Suspend ${email}` }).click();
  await expect(page.getByRole("button", { name: `Reactivate ${email}` })).toBeVisible();

  // They can no longer sign in.
  const visitor = await browser.newContext();
  await acceptAgeGate(visitor);
  const visitorPage = await visitor.newPage();
  await visitorPage.goto("/login");
  await visitorPage.locator("main form").getByLabel("Email address").fill(email);
  await visitorPage.locator("main form").getByLabel("Password", { exact: true }).fill(password);
  await visitorPage.locator("main form").getByRole("button", { name: "Sign in" }).click();
  await expect(visitorPage.locator("main form").getByRole("alert")).toContainText(/suspended/i);
  await visitor.close();
});

test("a discount code is created and applied at checkout", async ({ page, context }) => {
  const code = `TEST${Date.now().toString().slice(-6)}`;

  await signInAsAdmin(page);
  await page.goto("/admin/discounts");
  await page.getByLabel("Code").fill(code);
  await page.getByLabel("Value").fill("10");
  await page.getByRole("button", { name: "Create code" }).click();
  await expect(page.getByText(`${code} created.`)).toBeVisible();

  // Apply it on the storefront: BPC-157 at £25, 10% off, plus £12 delivery.
  await seedCart(context, [{ sku: "BPL-BPC10", qty: 1 }]);
  await page.goto("/checkout");
  await page.getByLabel("Discount code").fill(code);
  await page.getByRole("button", { name: "Apply" }).click();

  await expect(page.getByText(`${code} applied`)).toBeVisible();
  await expect(page.getByText("−£2.50")).toBeVisible();
  await expect(page.getByText("£34.50").first()).toBeVisible();
});

test("an unknown discount code is rejected", async ({ page, context }) => {
  await seedCart(context, [{ sku: "BPL-BPC10", qty: 1 }]);
  await page.goto("/checkout");
  await page.getByLabel("Discount code").fill("NOPE-NOT-REAL");
  await page.getByRole("button", { name: "Apply" }).click();
  await expect(page.getByText("That discount code is not valid.")).toBeVisible();
});

test("delivery rules set in settings apply at checkout", async ({ page, context }) => {
  await signInAsAdmin(page);
  await page.goto("/admin/settings");

  await page.getByLabel("Delivery charge below that (£)").fill("9.99");
  await page
    .locator("form", { has: page.getByLabel("Delivery charge below that (£)") })
    .getByRole("button", { name: "Save" })
    .click();
  await expect(page.getByText("Delivery rules saved.")).toBeVisible();

  await seedCart(context, [{ sku: "BPL-BPC10", qty: 1 }]);
  await page.goto("/checkout");
  await expect(page.getByText("£9.99")).toBeVisible();

  // Restore.
  await page.goto("/admin/settings");
  await page.getByLabel("Delivery charge below that (£)").fill("12");
  await page
    .locator("form", { has: page.getByLabel("Delivery charge below that (£)") })
    .getByRole("button", { name: "Save" })
    .click();
  await expect(page.getByText("Delivery rules saved.")).toBeVisible();
});

test("bank details set in settings show on the order confirmation", async ({ page, context }) => {
  await signInAsAdmin(page);
  await page.goto("/admin/settings");

  const bankForm = page.locator("form", { has: page.getByLabel("Account number") });
  await bankForm.getByLabel("Sort code").fill("04-00-75");
  await bankForm.getByLabel("Account number").fill("87654321");
  await bankForm.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText(/Payment details saved/)).toBeVisible();

  await seedCart(context, [{ sku: "BPL-BPC10", qty: 1 }]);
  await page.goto("/checkout");
  await form(page).getByLabel("Email address").fill("bank@lab.ac.uk");
  await form(page).getByLabel("First name").fill("Bank");
  await form(page).getByLabel("Last name").fill("Details");
  await form(page).getByLabel("Address line 1").fill("9 Test Street");
  await form(page).getByLabel("Town / City").fill("Edinburgh");
  await form(page).getByLabel("Postcode").fill("EH1 1AA");
  await form(page).getByRole("checkbox").check();
  await form(page).getByRole("button", { name: /Place order/ }).click();

  await expect(page.getByRole("heading", { name: "Order received" })).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByText("04-00-75")).toBeVisible();
  await expect(page.getByText("87654321")).toBeVisible();
});
