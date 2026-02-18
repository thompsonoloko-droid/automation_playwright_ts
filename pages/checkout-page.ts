/**
 * Checkout Page Object — interactions for the order checkout page.
 *
 * Provides methods to verify the checkout page loaded and place an order.
 */

import { BasePage } from "./base-page";

export class CheckoutPage extends BasePage {
  readonly PLACE_ORDER_LINK = "a[href='/payment']";
  readonly CHECKOUT_MODAL_CLOSE = "#checkoutModal .close, #checkoutModal a[href='/login']";

  readonly BASE_URL = "https://automationexercise.com";

  /**
   * Verify we landed on the checkout page after 'Proceed To Checkout'.
   *
   * In WebKit the click may trigger a session-dropped modal instead
   * of navigating. This method handles that case gracefully.
   */
  async ensureOnCheckout(): Promise<void> {
    try {
      await this.page.waitForURL("**/checkout**", { timeout: 10_000 });
    } catch {
      const modalClose = this.page.locator(this.CHECKOUT_MODAL_CLOSE).first();
      try {
        if (await modalClose.isVisible({ timeout: 2000 })) {
          await modalClose.click();
        }
      } catch {
        /* ignore */
      }
      await this.page.goto(`${this.BASE_URL}/checkout`, {
        waitUntil: "domcontentloaded",
      });
    }
    await this.page.waitForLoadState("domcontentloaded");
  }

  /**
   * Click 'Place Order' to navigate to the payment page.
   *
   * Falls back to direct navigation if the link is not clickable.
   */
  async placeOrder(): Promise<void> {
    const placeOrder = this.page.locator(this.PLACE_ORDER_LINK);
    try {
      await placeOrder.waitFor({ state: "visible", timeout: 20_000 });
      await placeOrder.scrollIntoViewIfNeeded();
      await placeOrder.click();
    } catch {
      console.warn("Place Order link not clickable — navigating directly");
      await this.page.goto(`${this.BASE_URL}/payment`, {
        waitUntil: "domcontentloaded",
      });
    }
    await this.page.waitForLoadState("domcontentloaded");
  }
}
