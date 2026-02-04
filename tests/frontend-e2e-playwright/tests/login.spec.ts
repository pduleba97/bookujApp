import { test, expect } from "@playwright/test";
import { userData } from "../test-data/login-data";
import { LoginPage } from "../pages/login.page";

test.describe("Login tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("");
    await page.getByRole("link", { name: "Login" }).click();
  });

  test("successful login with correct credentials - request is sent", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const userEmail = userData.userEmail;
    const userPassword = userData.userPassword;
    let requestSent = false;

    await loginPage.emailInput.fill(userEmail);
    await loginPage.passwordInput.fill(userPassword);
    try {
      const requestPromise = page.waitForRequest(
        (request) =>
          request.url().includes("/api/users/login") &&
          request.method() === "POST",
        { timeout: 5000 },
      );
      await loginPage.signInButton.click();

      await requestPromise;
      requestSent = true;
    } catch {
      requestSent = false;
    }

    expect(requestSent).toBe(true);
    await expect(page).toHaveURL(""); //Home page
    await expect(page.locator("#nav-profile")).toBeVisible();
  });

  test("unsuccessful login with missing email and password - request not sent", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    let requestSent = false;

    try {
      const requestPromise = page.waitForRequest(
        (request) =>
          request.url().includes("/api/users/login") &&
          request.method() === "POST",
        { timeout: 5000 },
      );
      await loginPage.signInButton.click();

      await requestPromise;
      requestSent = true;
    } catch {
      requestSent = false;
    }

    expect(requestSent).toBe(false);
  });

  test("unsuccessful login with incorrect email", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const userEmail = "wrongemail@gmail.com";
    const userPassword = userData.userPassword;

    await loginPage.emailInput.fill(userEmail);
    await loginPage.passwordInput.fill(userPassword);
    await loginPage.signInButton.click();

    await expect(loginPage.loginFailedPrompt).toHaveText(
      "Incorrect login or password",
    );
  });

  test("unsuccessful login with incorrect password", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const userEmail = userData.userEmail;
    const userPassword = "123";

    await loginPage.emailInput.fill(userEmail);
    await loginPage.passwordInput.fill(userPassword);
    await loginPage.signInButton.click();

    await expect(loginPage.loginFailedPrompt).toHaveText(
      "Incorrect login or password",
    );
  });

  test("Successful logout", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const userEmail = userData.userEmail;
    const userPassword = userData.userPassword;

    await loginPage.LoginAsUser(userEmail, userPassword);
    await page.locator("#nav-logout").click();

    await expect(page.locator("#nav-profile")).toBeHidden();
    await expect(page.locator("#nav-login")).toBeVisible();
  });
});
