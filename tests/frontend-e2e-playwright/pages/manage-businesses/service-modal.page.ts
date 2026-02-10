import { expect, Locator, Page } from "@playwright/test";

export class ServiceModalPage {
  header: Locator;
  name: Locator;
  hours: Locator;
  minutes: Locator;
  price: Locator;
  description: Locator;

  errorToast: Locator;

  addButton: Locator;
  closeButton: Locator;

  constructor(private page: Page) {
    this.header = this.page.locator("#service-modal-header");
    this.name = this.page.locator("#service-name-input");
    this.hours = this.page.locator("#service-hours-input");
    this.minutes = this.page.locator("#service-minutes-input");
    this.price = this.page.locator("#service-price-input");
    this.description = this.page.locator("#service-description-input");

    this.errorToast = this.page.locator(".Toastify__toast--error");

    this.addButton = this.page.locator("#service-modal-add");
    this.closeButton = this.page.locator("#service-modal-close");
  }

  async addNewServiceDuringBusinessCreation(serviceData: {
    name: string;
    durationHours: string;
    durationMinutes: string;
    price: string;
  }): Promise<void> {
    await expect(this.header).toHaveText("Add Service");
    await this.name.fill(serviceData.name);
    await this.hours.selectOption(serviceData.durationHours);
    await this.minutes.selectOption(serviceData.durationMinutes);
    await this.price.fill(serviceData.price);
    await this.addButton.click();
  }
}
