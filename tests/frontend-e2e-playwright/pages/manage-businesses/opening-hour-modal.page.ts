import { Locator, Page } from "@playwright/test";

export class OpeningHourModalPage {
  header: Locator;
  openingHour: Locator;
  closingHour: Locator;

  errorToast: Locator;

  saveButton: Locator;
  closeButton: Locator;

  constructor(private page: Page) {
    this.header = this.page.locator("#opening-hour-modal-header");
    this.openingHour = this.page.locator("#opening-hour-modal-select-openHour");
    this.closingHour = this.page.locator(
      "#opening-hour-modal-select-closeHour",
    );

    this.errorToast = this.page.locator(".Toastify__toast--error");

    this.saveButton = this.page.locator("#opening-hour-modal-save");
    this.closeButton = this.page.locator("#opening-hour-modal-close");
  }

  async setOpeningHours(openingHour: string, closingHour: string) {
    await this.openingHour.selectOption(openingHour);
    await this.closingHour.selectOption(closingHour);
  }
}
