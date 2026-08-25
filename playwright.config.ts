import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests run against a production build so the checks cover the same
 * caching and server-rendering behaviour that ships.
 * Start the app separately (npm run build && npm run start) or let the
 * webServer block below do it.
 */
export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  reporter: [["list"]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Use the Chromium already present in the environment rather than
        // downloading one; PLAYWRIGHT_CHROMIUM_PATH overrides it elsewhere.
        launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
          ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
          : {},
      },
    },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "npm run start",
        url: "http://localhost:3000",
        reuseExistingServer: false,
        timeout: 120_000,
        env: {
          // The suite signs in far more often than a person would, so the
          // production throttle would reject it. The limiter itself is still
          // covered by its own test.
          LOGIN_RATE_LIMIT: "1000",
          REGISTER_RATE_LIMIT: "1000",
          CHECKOUT_RATE_LIMIT: "1000",
        },
      },
});
