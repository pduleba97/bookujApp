import { expect, Locator, Page } from "@playwright/test";

export class ProfilePage {
  navProfileButton: Locator;
  editSaveProfileButton: Locator;
  cancelEditProfileButton: Locator;
  changeRoleButton: Locator;

  userFirstNameInput: Locator;
  userLastNameInput: Locator;
  userEmailInput: Locator;
  userPhoneInput: Locator;

  userFirstName: Locator;
  userLastName: Locator;
  userEmail: Locator;
  userPhoneNumber: Locator;
  userRole: Locator;

  successToast: Locator;
  infoToast: Locator;

  constructor(private page: Page) {
    this.navProfileButton = this.page.locator("#nav-profile");
    this.editSaveProfileButton = this.page.locator(
      "#user-profile-edit-save-button",
    );
    this.cancelEditProfileButton = this.page.locator(
      "#user-profile-cancel-edit-button",
    );
    this.changeRoleButton = this.page.locator(
      "#user-profile-change-role-button",
    );

    this.userFirstName = this.page.locator("#user-profile-firstName");
    this.userLastName = this.page.locator("#user-profile-lastName");
    this.userEmail = this.page.locator("#user-profile-email");
    this.userPhoneNumber = this.page.locator("#user-profile-phoneNumber");
    this.userRole = this.page.locator("#user-profile-role");

    this.userFirstNameInput = this.page.getByRole("textbox", {
      name: "First name",
    });
    this.userLastNameInput = this.page.getByRole("textbox", {
      name: "Last name",
    });
    this.userEmailInput = this.page.getByRole("textbox", { name: "Email" });
    this.userPhoneInput = this.page.getByRole("textbox", { name: "Phone" });

    this.successToast = this.page.locator(".Toastify__toast--success");
    this.infoToast = this.page.locator(".Toastify__toast--info");
  }

  async enterEditMode() {
    await expect(this.editSaveProfileButton).toHaveText("Edit");
    await this.editSaveProfileButton.click();
  }

  async saveProfile() {
    await expect(this.editSaveProfileButton).toHaveText("Save");
    await this.editSaveProfileButton.click();
  }

  async fillProfileInputs(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
  ) {
    await this.userFirstNameInput.fill(firstName);
    await this.userLastNameInput.fill(lastName);
    await this.userEmailInput.fill(email);
    await this.userPhoneInput.fill(phone);
  }

  async expectProfileData(
    expectedFirstName: string,
    expectedLastName: string,
    expectedEmail: string,
    expectedPhone: string,
  ) {
    await expect(this.userFirstName).toHaveText(expectedFirstName);
    await expect(this.userLastName).toHaveText(expectedLastName);
    await expect(this.userEmail).toHaveText(expectedEmail);
    await expect(this.userPhoneNumber).toHaveText(expectedPhone);
  }

  async expectSuccessToast(text: string) {
    await expect(this.successToast.filter({ hasText: text })).toBeVisible();
  }

  async expectInfoToast(text: string) {
    await expect(this.infoToast.filter({ hasText: text })).toBeVisible();
  }
}
