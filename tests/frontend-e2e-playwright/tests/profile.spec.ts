import { test, expect } from "@playwright/test";
import { userData } from "../test-data/login-data";

test.describe("User profile tests", () => {
  const firstName = "Test";
  const lastName = "Account";
  const phoneNumber = "300400500";

  test.beforeAll(async () => {});

  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.locator("#login-email").fill(userData.userEmail);
    await page.locator("#login-password").fill(userData.userPassword);
    await page.locator("#login-submit").click();
    await page.locator("#nav-profile").click();
  });

  test.afterAll(async () => {});

  test("User sees correct profile data after login", async ({ page }) => {
    const userRole = "Client";

    await expect(page.locator("#user-profile-firstName")).toHaveText(firstName);
    await expect(page.locator("#user-profile-lastName")).toHaveText(lastName);

    await expect(page.locator("#user-profile-email")).toHaveText(
      userData.userEmail,
    );
    await expect(page.locator("#user-profile-phoneNumber")).toHaveText(
      phoneNumber,
    );

    await expect(page.locator("#user-profile-role")).toHaveText(userRole);
  });

  test("User can change account type to Business Owner and back to Client", async ({
    page,
  }) => {
    const clientUserRole = "Client";
    const ownerUserRole = "Owner";
    const toast = `Your account status has been successfully changed to `;

    await page.locator("#user-profile-change-role-button").click();

    await expect(page.locator("#user-profile-role")).toHaveText(ownerUserRole);
    await expect(
      page.locator(".Toastify__toast--success", {
        hasText: toast + ownerUserRole,
      }),
    ).toBeVisible();

    await page.locator("#user-profile-change-role-button").click();

    await expect(page.locator("#user-profile-role")).toHaveText(clientUserRole);
    await expect(
      page.locator(".Toastify__toast--success", {
        hasText: toast + clientUserRole,
      }),
    ).toBeVisible();
  });
});
