import { expect, Locator, Page } from "@playwright/test";

export class EditServiceModalPage {
  header: Locator;
  name: Locator;
  hours: Locator;
  minutes: Locator;
  price: Locator;
  description: Locator;

  errorToast: Locator;

  editButton: Locator;
  deleteButton: Locator;
  closeButton: Locator;

  constructor(private page: Page) {
    this.header = this.page.locator("#edit-service-modal-header");
    this.name = this.page.locator("#edit-service-name-input");
    this.hours = this.page.locator("#edit-service-hours-input");
    this.minutes = this.page.locator("#edit-service-minutes-input");
    this.price = this.page.locator("#edit-service-price-input");
    this.description = this.page.locator("#edit-service-description-input");

    this.errorToast = this.page.locator(".Toastify__toast--error");

    this.editButton = this.page.locator("#edit-service-modal-edit");
    this.deleteButton = this.page.locator("#edit-service-modal-delete-button");
    this.closeButton = this.page.locator("#edit-service-modal-close");
  }

  async clearAllInputs(): Promise<void> {
    await this.name.fill("");
    await this.hours.selectOption("");
    await this.minutes.selectOption("");
    await this.price.fill("");
    await this.description.fill("");
  }
}
