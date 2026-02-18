/**
 * Custom Playwright fixtures — TypeScript equivalent of Python conftest.py.
 *
 * Provides pre-initialised page objects and ad-blocker route setup
 * so tests can be concise and declarative.
 */

import { test as base, type Page } from "@playwright/test";

import { CartPage } from "./pages/cart-page";
import { CheckoutPage } from "./pages/checkout-page";
import { HomePage } from "./pages/home-page";
import { LoginPage } from "./pages/login-page";
import { PaymentPage } from "./pages/payment-page";
import { ProductPage } from "./pages/product-page";

// ---------------------------------------------------------------------------
// Fixture type declarations
// ---------------------------------------------------------------------------

type Fixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  paymentPage: PaymentPage;
};

// ---------------------------------------------------------------------------
// Ad / consent blocker (mirrors Python conftest route blocking)
// ---------------------------------------------------------------------------

const AD_PATTERNS = [
  "**/googleads**",
  "**/googlesyndication**",
  "**/doubleclick**",
  "**/adservice**",
  "**/fc.yahoo.com**",
  "**/fundingchoicesmessages**",
  "**/pagead**",
  "**/*.ads.**",
];

async function blockAds(page: Page): Promise<void> {
  for (const pattern of AD_PATTERNS) {
    await page.route(pattern, (route) => route.abort());
  }
}

// ---------------------------------------------------------------------------
// Extended test with fixtures
// ---------------------------------------------------------------------------

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await blockAds(page);
    await page.goto("https://automationexercise.com", {
      waitUntil: "domcontentloaded",
    });
    await use(new HomePage(page));
  },

  loginPage: async ({ page }, use) => {
    await blockAds(page);
    await use(new LoginPage(page));
  },

  productPage: async ({ page }, use) => {
    await blockAds(page);
    await use(new ProductPage(page));
  },

  cartPage: async ({ page }, use) => {
    await blockAds(page);
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await blockAds(page);
    await use(new CheckoutPage(page));
  },

  paymentPage: async ({ page }, use) => {
    await blockAds(page);
    await use(new PaymentPage(page));
  },
});

export { expect } from "@playwright/test";
