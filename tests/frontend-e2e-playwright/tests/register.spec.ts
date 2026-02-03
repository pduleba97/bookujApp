import { test, expect } from "@playwright/test";
import deleteUser from "../utils/deleteUser";
import getAuthToken from "../utils/authHelper";

test.describe("Register tests", () => {
  const userEmail = `test${Date.now()}@test.com`;
  const userPassword = "123456";
  const firstName = "John";
  const lastName = "Doe";
  const phoneNumber = "400500600";

  let authToken: string;

  test.beforeAll(async () => {
    // For those tests a valid admin account credentials are required.
    authToken = await getAuthToken();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("");
    await page.getByRole("link", { name: "Register" }).click();
  });

  test.afterAll(async () => {
    await deleteUser(authToken, userEmail);
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

    await expect(
      page.locator(".Toastify__toast--success", {
        hasText: "Registration successful!",
      }),
    ).toBeVisible();
  });

  test("unsuccessful register - user email address already registered", async ({
    page,
  }) => {
    const alreadyRegisteredEmail = "admin@admin.com";

    await page.locator("#register-email").fill(alreadyRegisteredEmail);
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
    await expect(page.locator("#register-value-email")).toHaveText(
      alreadyRegisteredEmail,
    );
    await expect(page.locator("#register-value-phoneNumber")).toHaveText(
      phoneNumber,
    );
    await page.locator("#register-submit").click();

    await expect(
      page.locator(".Toastify__toast--error", {
        hasText: "Email is already registered.",
      }),
    ).toBeVisible();
  });
});
