import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { BusinessesListPage } from "../../pages/manage-businesses/businesses-list.page";
import { userOwnerData } from "../../test-data/login-data";
import { BusinessAddPage } from "../../pages/manage-businesses/business-add.page";

test.describe("Add business tests", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.LoginAsUser(
      userOwnerData.userEmail,
      userOwnerData.userPassword,
    );
  });

  test("", async ({ page }) => {
    const manageBusinessesPage = new BusinessesListPage(page);

    await manageBusinessesPage.navManageBusinessesButton.click();
  });

  test("Owner can add new business @happypath", async ({ page }) => {
    const businessListPage = new BusinessesListPage(page);
    const businessAddPage = new BusinessAddPage(page);
    const businessName = `Test Business ${Date.now()}`;
    const businessCategory = "Hair Salon";
    const businessEmail = `business${Date.now()}@test.com`;
    const businessPhone = "300400500";
    const businessAddress = "pl. Defilad 1";
    const businessCity = "Warsaw";
    const businessPostalCode = "00-901";

    // Navigate to manage businesses page and click "Add business" button
    await businessListPage.navManageBusinessesButton.click();
    await businessListPage.addBusinessButton.click();

    // Fill in business details step and proceed to the next step
    await businessAddPage.fillBusinessDetailsStep(
      businessName,
      businessCategory,
      businessEmail,
      businessPhone,
    );
    await businessAddPage.nextButton.click();

    // Fill in business address step and proceed to the next step
    await businessAddPage.fillBusinessAddressStep(
      businessAddress,
      businessCity,
      businessPostalCode,
    );
    await businessAddPage.nextButton.click();

    // Proceed with default values for opening hours and services, and create the business
    await businessAddPage.nextButton.click();
    await businessAddPage.nextButton.click();
    await businessAddPage.createBusinessButton.click();
    await page.waitForURL("**/manage-businesses");

    const businessRow = businessListPage.businessRowByName(businessName);
    await expect(businessRow.name).toHaveText(businessName);
    await expect(businessRow.category).toHaveText(businessCategory);
    await expect(businessRow.city).toHaveText(businessCity);
    await expect(businessRow.address).toHaveText(businessAddress);
    await expect(businessRow.status).toHaveText("❌");
    await expect(businessRow.enterButton).toBeVisible();
    await expect(businessRow.previewButton).toBeVisible();
    await expect(businessRow.removeButton).toBeVisible();
  });
});
