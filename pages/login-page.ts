/**
 * Login Page Object — interactions for the login and signup forms.
 *
 * Provides methods to log in with existing credentials or
 * register a new user account.
 */

import { BasePage } from "./base-page";

export class LoginPage extends BasePage {
  // Login form locators
  readonly EMAIL_INPUT = "input[data-qa='login-email']";
  readonly PASSWORD_INPUT = "input[data-qa='login-password']";
  readonly LOGIN_BTN = "button[data-qa='login-button']";

  // Signup form locators
  readonly SIGNUP_NAME_INPUT = "input[data-qa='signup-name']";
  readonly SIGNUP_EMAIL_INPUT = "input[data-qa='signup-email']";
  readonly SIGNUP_BTN = "button[data-qa='signup-button']";

  /**
   * Submit the login form with the given credentials.
   *
   * @param email    - User's email address.
   * @param password - User's password.
   */
  async login(email: string, password: string): Promise<void> {
    await this.fill(this.EMAIL_INPUT, email);
    await this.fill(this.PASSWORD_INPUT, password);
    await this.click(this.LOGIN_BTN);
  }

  /**
   * Submit the signup form with name and email.
   *
   * @param name  - Full name for the new account.
   * @param email - Email address for the new account.
   */
  async registerNewUser(name: string, email: string): Promise<void> {
    await this.fill(this.SIGNUP_NAME_INPUT, name);
    await this.fill(this.SIGNUP_EMAIL_INPUT, email);
    await this.click(this.SIGNUP_BTN);
  }
}
