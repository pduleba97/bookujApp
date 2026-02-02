import { test, expect } from "@playwright/test";
import deleteUser from "../utils/deleteUser";
import getAuthToken from "../utils/authHelper";

test.describe("Register tests", () => {
  const userEmail = `test${Date.now()}@test.com`;
  const userPassword = "123456";
  const firstName = "John";
  const lastName = "Doe";
  const phoneNumber = "400500600";

  test.beforeEach(async ({ page }) => {
    await page.goto("");
    await page.getByRole("link", { name: "Register" }).click();
  });

  test.afterEach(async ({ browser }) => {
    // For those tests a valid admin account credentials are required.
    const authToken = await getAuthToken(browser);
    await deleteUser(browser, authToken, userEmail);
  });

  test("successful register", async ({ page }) => {
    await page.locator("#register-email").fill(userEmail);
    await page.locator("#register-password").fill(userPassword);
    await page.locator("#register-confirmPassword").fill(userPassword);
    await page.locator("#register-submit").click();

    await page.locator("#register-firstName").fill(firstName);
    await page.locator("#register-lastName").fill(lastName);
    await page.locator("#register-phoneNumber").fill(phoneNumber);
    await page.locator("#register-submit").click();

    await expect(page.locator("#register-value-firstName")).toHaveText(
      firstName,
    );
    await expect(page.locator("#register-value-lastName")).toHaveText(lastName);
    await expect(page.locator("#register-value-email")).toHaveText(userEmail);
    await expect(page.locator("#register-value-phoneNumber")).toHaveText(
      phoneNumber,
    );
    await page.locator("#register-submit").click();

    await expect(
      page.getByRole("heading", { name: "Thank you for your submission" }),
    ).toBeVisible();
  });
});
