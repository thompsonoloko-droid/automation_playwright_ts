/**
 * Cart Page Object — interactions for the shopping cart.
 *
 * Provides methods to count cart items, proceed to checkout,
 * and check if the cart is empty.
 */

import { expect } from "@playwright/test";

import { BasePage } from "./base-page";

export class CartPage extends BasePage {
  // Locators
  readonly CART_ITEMS = "#cart_items tbody tr";
  readonly PROCEED_TO_CHECKOUT = ".check_out";
  readonly CART_EMPTY_MSG = "//p[contains(text(),'Cart is empty')]";

  readonly BASE_URL = "https://automationexercise.com";

  /** Return the number of product rows in the cart (0 if empty). */
  async getCartItemsCount(): Promise<number> {
    return await this.page.locator(this.CART_ITEMS).count();
  }

  /** Click the 'Proceed To Checkout' button. */
  async proceedToCheckout(): Promise<void> {
    await this.click(this.PROCEED_TO_CHECKOUT);
  }

  /** Return true if the 'Cart is empty' message is visible. */
  async isCartEmpty(): Promise<boolean> {
    return (await this.page.locator(this.CART_EMPTY_MSG).count()) > 0;
  }

  /** Navigate directly to the cart page. */
  async navigateToCart(): Promise<void> {
    await this.page.goto(`${this.BASE_URL}/view_cart`, {
      waitUntil: "domcontentloaded",
    });
  }

  /**
   * Verify the cart contains at least one product row.
   *
   * If items are not visible on the first attempt, reloads the page
   * once and retries — works around a Firefox timing issue.
   *
   * @param timeout - Max time to wait for cart items to appear.
   */
  async verifyHasItems(timeout = 15_000): Promise<void> {
    const cartRow = this.page.locator(this.CART_ITEMS).first();
    try {
      await expect(cartRow).toBeVisible({ timeout });
    } catch {
      console.warn("Cart items not visible — reloading page and retrying");
      await this.page.reload({ waitUntil: "domcontentloaded" });
      await expect(cartRow).toBeVisible({ timeout });
    }
  }
}
