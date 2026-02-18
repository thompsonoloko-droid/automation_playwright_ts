/**
 * Payment Page Object — interactions for the payment / card details page.
 *
 * Provides methods to fill card details, submit payment, and verify
 * order confirmation.
 */

import { expect } from "@playwright/test";

import { BasePage } from "./base-page";

/** Card details dictionary shape. */
export interface CardDetails {
  name: string;
  number: string;
  cvc: string;
  month: string;
  year: string;
}

export class PaymentPage extends BasePage {
  readonly INPUT_NAME_ON_CARD = "input[name='name_on_card']";
  readonly INPUT_CARD_NUMBER = "input[name='card_number']";
  readonly INPUT_CVC = "input[data-qa='cvc']";
  readonly INPUT_EXPIRY_MONTH = "input[data-qa='expiry-month']";
  readonly INPUT_EXPIRY_YEAR = "input[data-qa='expiry-year']";
  readonly BTN_PAY = "button[data-qa='pay-button']";
  readonly ORDER_CONFIRMATION = "#form";
  readonly CONFIRMATION_TEXT = "Congratulations! Your order has been confirmed!";
  readonly LINK_CONTINUE = "a[data-qa='continue-button'], a:has-text('Continue')";
  readonly LINK_LOGOUT = "a[href='/logout']";

  readonly BASE_URL = "https://automationexercise.com";

  /**
   * Fill all card detail fields from a CardDetails object.
   */
  async fillCardDetails(card: CardDetails): Promise<void> {
    await this.fill(this.INPUT_NAME_ON_CARD, card.name);
    await this.fill(this.INPUT_CARD_NUMBER, card.number);
    await this.fill(this.INPUT_CVC, card.cvc);
    await this.fill(this.INPUT_EXPIRY_MONTH, card.month);
    await this.fill(this.INPUT_EXPIRY_YEAR, card.year);
  }

  /**
   * Click 'Pay and Confirm Order' and verify the confirmation message.
   */
  async payAndConfirm(): Promise<void> {
    await this.click(this.BTN_PAY);
    await expect(this.page.locator(this.ORDER_CONFIRMATION)).toContainText(this.CONFIRMATION_TEXT);
  }

  /** Click 'Continue' after successful payment. */
  async continueAfterPayment(): Promise<void> {
    await this.page.locator(this.LINK_CONTINUE).click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  /**
   * Logout after payment, handling WebKit session-drop gracefully.
   */
  async logout(): Promise<void> {
    const logoutLink = this.page.locator(this.LINK_LOGOUT);
    try {
      if (await logoutLink.isVisible({ timeout: 5000 })) {
        await logoutLink.click();
        await this.page.waitForLoadState("domcontentloaded");
        return;
      }
    } catch {
      /* fall through */
    }
    // Session already expired — navigate directly
    await this.page.goto(`${this.BASE_URL}/login`, {
      waitUntil: "domcontentloaded",
    });
  }

  /** Verify we landed on the login/signup page after logout. */
  async verifyOnLoginPage(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: "Login to your account" })).toBeVisible();
    await expect(this.page.getByRole("heading", { name: "New User Signup!" })).toBeVisible();
  }
}
