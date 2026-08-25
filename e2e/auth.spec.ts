import { test, expect } from "@playwright/test";
import { acceptAgeGate, mainForm as form } from "./helpers";

test.beforeEach(async ({ context }) => {
  await acceptAgeGate(context);
});

const ADMIN = { email: "admin@biopluslabs.co.uk", password: "devpassword123" };

/** Registrations persist, so each run needs its own address. */
function newCustomer() {
  return {
    email: `researcher-${Date.now()}-${Math.floor(Math.random() * 1000)}@lab.ac.uk`,
    password: "customer-password-1",
    name: "Dr A. Whitfield",
  };
}

async function registerCustomer(page: import("@playwright/test").Page) {
  const customer = newCustomer();
  await page.goto("/register");
  await form(page).getByLabel("Full name").fill(customer.name);
  await form(page).getByLabel("Email address").fill(customer.email);
  await form(page).getByLabel("Password", { exact: true }).fill(customer.password);
  await form(page).getByRole("button", { name: "Create account" }).click();
  return customer;
}

test.describe("authentication", () => {
  test("anonymous visitors are sent to sign in", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login\?next=%2Fadmin/);

    await page.goto("/account");
    await expect(page).toHaveURL(/\/login\?next=%2Faccount/);
  });

  test("a wrong password is rejected without revealing the account", async ({ page }) => {
    await page.goto("/login");
    await form(page).getByLabel("Email address").fill(ADMIN.email);
    await form(page).getByLabel("Password", { exact: true }).fill("definitely-not-the-password");
    await form(page).getByRole("button", { name: "Sign in" }).click();
    await expect(form(page).getByRole("alert")).toHaveText(/Email or password is incorrect/);
  });

  test("an admin signs in and reaches the dashboard", async ({ page }) => {
    await page.goto("/login");
    await form(page).getByLabel("Email address").fill(ADMIN.email);
    await form(page).getByLabel("Password", { exact: true }).fill(ADMIN.password);
    await form(page).getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/admin/);
  });

  test("a customer registers, lands in the hub, and cannot reach /admin", async ({ page }) => {
    await registerCustomer(page);

    await expect(page).toHaveURL(/\/account/);
    await expect(page.getByText("Dr A. Whitfield").first()).toBeVisible();

    await page.goto("/admin");
    await expect(page).toHaveURL("/");
  });

  test("a registered email cannot be reused", async ({ page }) => {
    const customer = await registerCustomer(page);
    await expect(page).toHaveURL(/\/account/);

    await page.getByRole("button", { name: "Log out" }).first().click();
    await expect(page).toHaveURL("/");

    await page.goto("/register");
    await form(page).getByLabel("Full name").fill("Duplicate");
    await form(page).getByLabel("Email address").fill(customer.email);
    await form(page).getByLabel("Password", { exact: true }).fill("another-password-1");
    await form(page).getByRole("button", { name: "Create account" }).click();
    await expect(form(page).getByRole("alert")).toHaveText(/already exists/);
  });

  test("signing out ends the session", async ({ page }) => {
    const customer = await registerCustomer(page);
    await expect(page).toHaveURL(/\/account/);

    await page.getByRole("button", { name: "Log out" }).first().click();
    await expect(page).toHaveURL("/");

    // Signing back in with the same credentials must work.
    await page.goto("/login");
    await form(page).getByLabel("Email address").fill(customer.email);
    await form(page).getByLabel("Password", { exact: true }).fill(customer.password);
    await form(page).getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/account/);

    await page.getByRole("button", { name: "Log out" }).first().click();
    await expect(page).toHaveURL("/");

    await page.goto("/account");
    await expect(page).toHaveURL(/\/login/);
  });
});
