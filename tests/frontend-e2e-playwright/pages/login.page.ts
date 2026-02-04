import { Locator, Page } from "@playwright/test";

export class LoginPage {
  emailInput: Locator;
  passwordInput: Locator;

  signInButton: Locator;

  loginFailedPrompt: Locator;

  constructor(private page: Page) {
    this.emailInput = this.page.locator("#login-email");
    this.passwordInput = this.page.locator("#login-password");

    this.signInButton = this.page.locator("#login-submit");

    this.loginFailedPrompt = this.page.locator("#login-failed");
  }

  async LoginAsUser(userEmail: string, userPassword: string) {
    await this.page.goto("/login");
    await this.emailInput.fill(userEmail);
    await this.passwordInput.fill(userPassword);
    await this.signInButton.click();
  }
}
