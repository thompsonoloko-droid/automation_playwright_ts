/**
 * Critical-path smoke tests — homepage, registration, add-to-cart.
 *
 * Converted from tests/ui/test_smoke.py.
 */

import { test, expect } from "../../fixtures";

const API_BASE = "https://automationexercise.com/api";

test.describe("Smoke Tests @smoke @regression", () => {
  /** Track emails registered during this describe block for API cleanup. */
  let registeredEmail: string | null = null;

  test.afterEach(async ({ request }) => {
    // Teardown: delete any user created during registration tests
    if (registeredEmail) {
      try {
        await request.delete(`${API_BASE}/deleteAccount`, {
          form: { email: registeredEmail, password: "TestPassword123!" },
        });
      } catch {
        // Best-effort cleanup — don't fail teardown
      }
      registeredEmail = null;
    }
  });

  test("homepage loads", async ({ homePage: _homePage, page }) => {
    await expect(page).toHaveTitle("Automation Exercise", { timeout: 15_000 });
    await expect(page.locator("img[alt='Website for automation practice']")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("user registration flow", async ({ homePage, loginPage, page }) => {
    const timestamp = Date.now();
    const uniqueName = `Test User_${timestamp}`;
    const uniqueEmail = `testuser_${timestamp}@example.com`;

    // Store for afterEach cleanup
    registeredEmail = uniqueEmail;

    await homePage.navigateToLogin();
    await loginPage.registerNewUser(uniqueName, uniqueEmail);

    const currentUrl = page.url();
    expect(currentUrl).toContain("automationexercise.com");
  });

  test("add to cart flow @cart", async ({ productPage, cartPage }) => {
    await productPage.addProductViaDetailPage(1);
    await cartPage.navigateToCart();
    await cartPage.verifyHasItems();

    const count = await cartPage.getCartItemsCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});
