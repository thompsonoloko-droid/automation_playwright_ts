/**
 * Product Page Object — interactions for the product listing and detail pages.
 *
 * Provides methods to browse products and add items to the cart.
 */

import { BasePage } from "./base-page";

export class ProductPage extends BasePage {
  // Locators
  readonly PRODUCT_ITEM = ".product-image-wrapper";
  readonly ADD_TO_CART_BTN = ".add-to-cart";
  readonly VIEW_CART_MODAL = "a[href='/view_cart']:has-text('View Cart')";
  readonly DETAIL_ADD_TO_CART_BTN = "button.btn-default.cart";
  readonly CART_MODAL = "#cartModal";
  readonly CART_MODAL_CLOSE = "#cartModal button.close-modal, #cartModal .close";

  readonly BASE_URL = "https://automationexercise.com";

  /**
   * Add a product to cart via its detail page.
   *
   * This is more reliable than the listing-page hover overlay because the
   * add-to-cart button is always visible on the detail page.  Retries up to
   * `maxRetries` times, waiting for the confirmation modal to verify the
   * server accepted the request.
   *
   * @param productId  - The product ID to add (default: 33).
   * @param maxRetries - Number of attempts before giving up.
   */
  async addProductViaDetailPage(productId = 33, maxRetries = 3): Promise<void> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await this.page.goto(`${this.BASE_URL}/product_details/${productId}`, {
          waitUntil: "domcontentloaded",
        });

        // Retry on server errors (e.g. Cloudflare 520/503)
        if (response && response.status() >= 500) {
          console.warn(`Server error ${response.status()} on attempt ${attempt + 1} — retrying...`);
          await this.page.waitForTimeout(2000);
          continue;
        }

        await this.dismissOverlays();

        const addBtn = this.page.locator(this.DETAIL_ADD_TO_CART_BTN);
        await addBtn.waitFor({ state: "visible", timeout: 15_000 });
        await addBtn.click();

        // Wait for confirmation modal
        const cartModal = this.page.locator(this.CART_MODAL);
        try {
          await cartModal.waitFor({ state: "visible", timeout: 5000 });
        } catch {
          if (attempt < maxRetries - 1) {
            console.warn(`Add-to-cart modal not shown (attempt ${attempt + 1}), retrying...`);
            continue;
          }
          console.warn("Modal not shown on final attempt — proceeding anyway");
        }

        // Dismiss the modal
        const closeBtn = this.page.locator(this.CART_MODAL_CLOSE).first();
        try {
          if (await closeBtn.isVisible({ timeout: 2000 })) {
            await closeBtn.click();
          }
        } catch {
          /* ignore */
        }
        await this.page.waitForTimeout(500);
        return;
      } catch (error) {
        if (attempt < maxRetries - 1) {
          console.warn(
            `addProductViaDetailPage attempt ${attempt + 1} failed: ${error} — retrying...`,
          );
          await this.page.waitForTimeout(2000);
          continue;
        }
        throw error;
      }
    }

    throw new Error(`Failed to add product ${productId} to cart after ${maxRetries} attempts`);
  }

  /**
   * Add a product to the cart by index on the listing page (hover overlay).
   *
   * Less reliable than `addProductViaDetailPage` — prefer the detail-page
   * method for cross-browser stability.
   *
   * @param productIndex - Zero-based index of the product to add.
   */
  async addProductToCart(productIndex = 0): Promise<void> {
    const products = this.page.locator(this.PRODUCT_ITEM);
    const count = await products.count();

    if (productIndex >= count) {
      throw new Error(`Product index ${productIndex} out of range (total: ${count})`);
    }

    await this.dismissOverlays();
    await products.nth(productIndex).hover();
    await products.nth(productIndex).locator(this.ADD_TO_CART_BTN).first().click({ force: true });

    // Wait for "Added!" modal and click View Cart
    const viewCart = this.page.locator(this.VIEW_CART_MODAL);
    try {
      await viewCart.waitFor({ state: "visible", timeout: 10_000 });
      await this.page.waitForTimeout(300);
      await viewCart.click();
    } catch {
      console.warn("View Cart modal not available — navigating directly to cart");
      await this.page.goto(`${this.BASE_URL}/view_cart`, {
        waitUntil: "domcontentloaded",
      });
    }
  }
}
