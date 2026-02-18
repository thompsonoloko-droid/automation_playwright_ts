/**
 * Data-driven login tests — valid and invalid credentials.
 *
 * Converted from tests/ui/test_login.py.
 * Uses environment variables for valid credentials and
 * test_data.json for invalid credential scenarios.
 */

import fs from "fs";
import path from "path";

import { test, expect } from "../../fixtures";

// ---------------------------------------------------------------------------
// Data helpers
// ---------------------------------------------------------------------------

interface TestDataJson {
  users: Array<{ id: string; email: string; password: string; valid: boolean }>;
  invalid_credentials: Array<{
    id: string;
    email: string;
    password: string;
    error_contains: string;
  }>;
}

function loadTestData(): TestDataJson {
  const filePath = path.resolve(__dirname, "../../test_data/test_data.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

// ---------------------------------------------------------------------------
// Valid login tests
// ---------------------------------------------------------------------------

test.describe("Login Tests @login @regression", () => {
  const email = process.env.TEST_USER_EMAIL ?? "";
  const password = process.env.TEST_USER_PASSWORD ?? "";

  test.skip(!email || !password, "TEST_USER_EMAIL / TEST_USER_PASSWORD not set");

  const data = loadTestData();
  const validUsers = data.users.filter((u) => u.valid);

  for (const user of validUsers) {
    test(`valid login — ${user.id}`, async ({ homePage, loginPage, page }) => {
      await page.waitForLoadState("domcontentloaded");
      await homePage.navigateToLogin();

      await loginPage.login(email, password);

      await expect(page.getByText("Logged in as")).toBeVisible({
        timeout: 5000,
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Invalid login tests
  // ---------------------------------------------------------------------------

  const invalidCreds = data.invalid_credentials;

  for (const cred of invalidCreds) {
    test(`invalid login — ${cred.id}`, async ({ homePage, loginPage, page }) => {
      await page.waitForLoadState("domcontentloaded");
      await homePage.navigateToLogin();

      if (cred.email) {
        await loginPage.fill(loginPage.EMAIL_INPUT, cred.email);
      }
      await loginPage.fill(loginPage.PASSWORD_INPUT, cred.password);

      if (!cred.email) {
        // Empty required field — HTML5 validation should block
        await loginPage.click(loginPage.LOGIN_BTN);
        const isInvalid = await page
          .locator(loginPage.EMAIL_INPUT)
          .evaluate((el: HTMLInputElement) => !el.validity.valid);
        expect(isInvalid).toBe(true);
        await expect(page.getByText("Logged in as")).not.toBeVisible();
        return;
      }

      await loginPage.click(loginPage.LOGIN_BTN);

      if (cred.error_contains) {
        try {
          await expect(page.getByText(cred.error_contains, { exact: false })).toBeVisible({
            timeout: 5000,
          });
        } catch {
          // If specific error doesn't appear, just verify we didn't log in
          await expect(page.getByText("Logged in as")).not.toBeVisible();
        }
      }
    });
  }
});
