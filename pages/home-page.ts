/**
 * Home Page Object — interactions for the main landing page.
 *
 * Provides navigation to login, products, cart, and contact pages,
 * plus verification that a user is logged in.
 */

import { expect } from "@playwright/test";

import { BasePage } from "./base-page";

export class HomePage extends BasePage {
  // Locators
  readonly SIGNUP_LOGIN_BTN = "a[href='/login']";
  readonly LOGGED_IN_USER = "//a[contains(text(),'Logged in as')]";
  readonly PRODUCTS_BTN = "a[href='/products']";
  readonly CART_BTN = "a[href='/view_cart']";
  readonly CONTACT_US_BTN = "a[href='/contact_us']";

  readonly BASE_URL = "https://automationexercise.com";

  /**
   * Click the Sign Up / Login link to open the auth page.
   *
   * Falls back to direct navigation if the login form does not
   * appear within a few seconds (e.g. when an ad overlay blocks the click).
   */
  async navigateToLogin(): Promise<void> {
    await this.click(this.SIGNUP_LOGIN_BTN);

    const loginEmail = this.page.locator("input[data-qa='login-email']");
    try {
      await loginEmail.waitFor({ state: "visible", timeout: 10_000 });
    } catch {
      console.warn("Login form not visible after click — navigating directly to /login");
      await this.page.goto(`${this.BASE_URL}/login`, {
        waitUntil: "domcontentloaded",
      });
      await loginEmail.waitFor({ state: "visible", timeout: 15_000 });
    }
  }

  /**
   * Assert that the page shows 'Logged in as <username>'.
   */
  async verifyLoggedIn(username: string): Promise<void> {
    await expect(this.page.locator(this.LOGGED_IN_USER)).toContainText(username);
  }

  /** Open the Products listing page. */
  async navigateToProducts(): Promise<void> {
    await this.click(this.PRODUCTS_BTN);
  }

  /** Open the Shopping Cart page. */
  async navigateToCart(): Promise<void> {
    await this.click(this.CART_BTN);
  }

  /** Open the Contact Us page. */
  async navigateToContactUs(): Promise<void> {
    await this.click(this.CONTACT_US_BTN);
  }
}
