import { test, expect } from "@playwright/test";
import { userData } from "../test-data/login-data";
import { ProfilePage } from "../pages/profile.page";
import { LoginPage } from "../pages/login.page";

test.describe.serial("User profile tests", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.LoginAsUser(userData.userEmail, userData.userPassword);
    await page.locator("#nav-profile").click();
  });

  test("User sees correct profile data after login", async ({ page }) => {
    const profilePage = new ProfilePage(page);
    const userRole = "Client";

    await profilePage.expectProfileData(
      userData.userFirstName,
      userData.userLastName,
      userData.userEmail,
      userData.userPhoneNumber,
    );

    await expect(profilePage.userRole).toHaveText(userRole);
  });

  test("User can edit their profile data", async ({ page }) => {
    const profilePage = new ProfilePage(page);
    const newFirstName = "John";
    const newLastName = "Doe";
    const newEmail = `john${Date.now()}@doe.com`;
    const newPhone = "999999999";
    const successToastMessage = "Your profile was updated!";

    // Precondition: verify initial profile data
    await profilePage.expectProfileData(
      userData.userFirstName,
      userData.userLastName,
      userData.userEmail,
      userData.userPhoneNumber,
    );

    // Enter edit mode and update user profile data
    await profilePage.enterEditMode();
    await profilePage.fillProfileInputs(
      newFirstName,
      newLastName,
      newEmail,
      newPhone,
    );
    await profilePage.saveProfile();
    await profilePage.expectSuccessToast(successToastMessage);

    // Verify that updated profile data is displayed correctly
    await profilePage.expectProfileData(
      newFirstName,
      newLastName,
      newEmail,
      newPhone,
    );

    // Cleanup: restore original profile data
    await profilePage.enterEditMode();
    await profilePage.fillProfileInputs(
      userData.userFirstName,
      userData.userLastName,
      userData.userEmail,
      userData.userPhoneNumber,
    );
    await profilePage.saveProfile();
    await profilePage.expectSuccessToast(successToastMessage);

    // Verify that profile data was restored to initial state
    await profilePage.expectProfileData(
      userData.userFirstName,
      userData.userLastName,
      userData.userEmail,
      userData.userPhoneNumber,
    );
  });

  test("User can cancel editing their profile data", async ({ page }) => {
    const profilePage = new ProfilePage(page);
    const newFirstName = "John";
    const newLastName = "Doe";
    const newEmail = `john${Date.now()}@doe.com`;
    const newPhone = "999999999";
    const infoToastMessage = "Your profile update was canceled.";

    // Precondition: verify initial profile data
    await profilePage.expectProfileData(
      userData.userFirstName,
      userData.userLastName,
      userData.userEmail,
      userData.userPhoneNumber,
    );

    // Enter edit mode and modify profile data without saving
    await profilePage.enterEditMode();
    await profilePage.fillProfileInputs(
      newFirstName,
      newLastName,
      newEmail,
      newPhone,
    );
    await expect(profilePage.cancelEditProfileButton).toBeVisible();
    await expect(profilePage.cancelEditProfileButton).toHaveText("Cancel");
    await profilePage.cancelEditProfileButton.click();
    await profilePage.expectInfoToast(infoToastMessage);
    await expect(profilePage.editSaveProfileButton).toHaveText("Edit");

    // Verify that the profile data was not changed
    await profilePage.expectProfileData(
      userData.userFirstName,
      userData.userLastName,
      userData.userEmail,
      userData.userPhoneNumber,
    );
  });

  test("User can change account type to Business Owner and back to Client", async ({
    page,
  }) => {
    const profilePage = new ProfilePage(page);
    const ownerUserRole = "Owner";
    const toastClient = `Your account status has been successfully changed to ${userData.userRole}`;
    const toastOwner = `Your account status has been successfully changed to ${ownerUserRole}`;

    await profilePage.changeRoleButton.click();
    await expect(profilePage.userRole).toHaveText(ownerUserRole);
    await expect(page.locator("#nav-manage-businesses")).toBeVisible();
    await profilePage.expectSuccessToast(toastOwner);

    await profilePage.changeRoleButton.click();
    await expect(profilePage.userRole).toHaveText(userData.userRole);
    await expect(page.locator("#nav-manage-businesses")).toBeHidden();
    await profilePage.expectSuccessToast(toastClient);
  });
});
