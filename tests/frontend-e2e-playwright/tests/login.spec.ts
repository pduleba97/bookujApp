import { test, expect } from "@playwright/test";
import { userData } from "../test-data/login-data";

test.describe("Login tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("");
    await page.getByRole("link", { name: "Login" }).click();
  });

  test("successful login with correct credentials - request is sent", async ({
    page,
  }) => {
    const userEmail = userData.userEmail;
    const userPassword = userData.userPassword;
    let requestSent = false;

    await page.locator("#login-email").fill(userEmail);
    await page.locator("#login-password").fill(userPassword);
    try {
      const requestPromise = page.waitForRequest(
        (request) =>
          request.url().includes("/api/users/login") &&
          request.method() === "POST",
        { timeout: 1000 },
      );
      await page.locator("#login-submit").click();

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
    let requestSent = false;

    try {
      const requestPromise = page.waitForRequest(
        (request) =>
          request.url().includes("/api/users/login") &&
          request.method() === "POST",
        { timeout: 1000 },
      );
      await page.locator("#login-submit").click();

      await requestPromise;
      requestSent = true;
    } catch {
      requestSent = false;
    }

    expect(requestSent).toBe(false);
  });

  test("unsuccessful login with incorrect email", async ({ page }) => {
    const userEmail = "wrongemail@gmail.com";
    const userPassword = userData.userPassword;

    await page.locator("#login-email").fill(userEmail);
    await page.locator("#login-password").fill(userPassword);
    await page.locator("#login-submit").click();

    await expect(page.locator("#login-failed")).toHaveText(
      "Incorrect login or password",
    );
  });

  test("unsuccessful login with incorrect password", async ({ page }) => {
    const userEmail = userData.userEmail;
    const userPassword = "123";

    await page.locator("#login-email").fill(userEmail);
    await page.locator("#login-password").fill(userPassword);
    await page.locator("#login-submit").click();

    await expect(page.locator("#login-failed")).toHaveText(
      "Incorrect login or password",
    );
  });

  test("Successful logout", async ({ page }) => {
    const userEmail = userData.userEmail;
    const userPassword = userData.userPassword;

    await page.locator("#login-email").fill(userEmail);
    await page.locator("#login-password").fill(userPassword);
    await page.locator("#login-submit").click();
    await page.locator("#nav-logout").click();

    await expect(page.locator("#nav-profile")).toBeHidden();
    await expect(page.locator("#nav-login")).toBeVisible();
  });
});
