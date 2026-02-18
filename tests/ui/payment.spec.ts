/**
 * End-to-end order flow: login → add to cart → checkout → payment → logout.
 *
 * Converted from tests/ui/test_payment.py.
 * All credentials loaded from environment variables — never hardcoded.
 */

import { test } from "../../fixtures";
import type { CardDetails } from "../../pages/payment-page";

// ---------------------------------------------------------------------------
// Data helpers
// ---------------------------------------------------------------------------

function validUser(): { name: string; email: string; password: string } {
  const user = {
    name: process.env.TEST_USER_NAME ?? "",
    email: process.env.TEST_USER_EMAIL ?? "",
    password: process.env.TEST_USER_PASSWORD ?? "",
  };
  const missing = Object.entries(user)
    .filter(([, v]) => !v)
    .map(([k]) => `TEST_USER_${k.toUpperCase()}`);
  if (missing.length) {
    test.skip(true, `Missing env vars: ${missing.join(", ")}`);
  }
  return user;
}

function cardDetails(): CardDetails {
  const card: CardDetails = {
    name: process.env.CARD_NAME ?? "",
    number: process.env.CARD_NUMBER ?? "",
    cvc: process.env.CARD_CVC ?? "",
    month: process.env.CARD_EXPIRY_MONTH ?? "",
    year: process.env.CARD_EXPIRY_YEAR ?? "",
  };
  const missing = Object.entries(card)
    .filter(([, v]) => !v)
    .map(([k]) => `CARD_${k.toUpperCase()}`);
  if (missing.length) {
    test.skip(true, `Missing card env vars: ${missing.join(", ")}`);
  }
  return card;
}

// ---------------------------------------------------------------------------
// Test
// ---------------------------------------------------------------------------

test.describe("Order Flow @smoke @regression @checkout", () => {
  test("end-to-end order placement", async ({
    homePage,
    loginPage,
    productPage,
    cartPage,
    checkoutPage,
    paymentPage,
  }) => {
    const user = validUser();
    const card = cardDetails();

    // --- Login ---
    await homePage.navigateToLogin();
    await loginPage.login(user.email, user.password);

    // --- Add product to cart via detail page ---
    await productPage.addProductViaDetailPage(33);

    // --- Verify cart and proceed to checkout ---
    await cartPage.navigateToCart();
    await cartPage.verifyHasItems();
    await cartPage.proceedToCheckout();

    // --- Checkout → Place Order ---
    await checkoutPage.ensureOnCheckout();
    await checkoutPage.placeOrder();

    // --- Payment ---
    await paymentPage.fillCardDetails(card);
    await paymentPage.payAndConfirm();

    // --- Logout and verify ---
    await paymentPage.continueAfterPayment();
    await paymentPage.logout();
    await paymentPage.verifyOnLoginPage();
  });
});
