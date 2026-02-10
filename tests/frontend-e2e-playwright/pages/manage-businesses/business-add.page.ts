import { expect, Locator, Page } from "@playwright/test";
import { OpeningHourRow } from "./opening-hour-row";
import { ServiceModalPage } from "./service-modal.page";

export class BusinessAddPage {
  // readonly weekDays = [
  //   "Monday",
  //   "Thursday",
  //   "Wednesday",
  //   "Thursday",
  //   "Friday",
  //   "Saturday",
  //   "Sunday",
  // ];

  header: Locator;
  nameInput: Locator;
  categorySelect: Locator;
  emailInput: Locator;
  phoneInput: Locator;
  addressInput: Locator;
  cityInput: Locator;
  postalCodeInput: Locator;
  descriptionInput: Locator;
  openingHourSwitchMonday: Locator;
  openingHourSwitchTuesday: Locator;
  openingHourSwitchWednesday: Locator;
  openingHourSwitchThursday: Locator;
  openingHourSwitchFriday: Locator;
  openingHourSwitchSaturday: Locator;
  openingHourSwitchSunday: Locator;
  openingHourModalSelectOpenHour: Locator;
  openingHourModalSelectCloseHour: Locator;
  nextButton: Locator;
  cancelButton: Locator;
  servicesAddButton: Locator;
  createBusinessButton: Locator;

  constructor(private page: Page) {
    this.header = this.page.locator("#create-business-header");
    this.nameInput = this.page.locator("#business-name");
    this.categorySelect = this.page.locator("#business-category");
    this.emailInput = this.page.locator("#business-email");
    this.phoneInput = this.page.locator("#business-phoneNumber");

    this.addressInput = this.page.locator("#business-address");
    this.cityInput = this.page.locator("#business-city");
    this.postalCodeInput = this.page.locator("#business-postalCode");
    this.descriptionInput = this.page.locator("#business-description");

    this.openingHourSwitchMonday = this.page.locator(
      `input[name=opening-hours-switch-Monday]`,
    );
    this.openingHourSwitchTuesday = this.page.locator(
      `input[name=opening-hours-switch-Tuesday]`,
    );
    this.openingHourSwitchWednesday = this.page.locator(
      `input[name=opening-hours-switch-Wednesday]`,
    );
    this.openingHourSwitchThursday = this.page.locator(
      `input[name=opening-hours-switch-Thursday]`,
    );
    this.openingHourSwitchFriday = this.page.locator(
      `input[name=opening-hours-switch-Friday]`,
    );
    this.openingHourSwitchSaturday = this.page.locator(
      `input[name=opening-hours-switch-Saturday]`,
    );
    this.openingHourSwitchSunday = this.page.locator(
      `input[name=opening-hours-switch-Sunday]`,
    );

    this.openingHourModalSelectOpenHour = this.page.locator(
      "#opening-hours-modal-select-openHour",
    );
    this.openingHourModalSelectCloseHour = this.page.locator(
      "#opening-hour-modal-select-closeHour",
    );

    this.nextButton = this.page.locator("#business-form-next");
    this.cancelButton = this.page.locator("#business-form-cancel");
    this.servicesAddButton = this.page.locator(
      "#business-services-form-add-button",
    );
    this.createBusinessButton = this.page.locator("#business-form-create");
  }

  openingHoursSwitch(day: string): Locator {
    return this.page.locator(`input[name="opening-hours-switch-${day}"]`);
  }

  async toggleOpeningHoursSwitch(day: string) {
    await this.openingHoursSwitch(day).locator("..").click();
  }

  openingHourRowByDay(openingHourDay: string): OpeningHourRow {
    const row = this.page.locator(".opening-hours-group", {
      hasText: openingHourDay,
    });
    return new OpeningHourRow(row);
  }

  async fillBusinessDetailsStep(
    businessName: string,
    businessCategory: string,
    businessEmail: string,
    businessPhone: string,
  ) {
    await this.nameInput.fill(businessName);
    await this.categorySelect.selectOption(businessCategory);
    await this.emailInput.fill(businessEmail);
    await this.phoneInput.fill(businessPhone);
  }

  async fillBusinessAddressStep(
    businessAddress: string,
    businessCity: string,
    businessPostalCode: string,
  ) {
    await this.addressInput.fill(businessAddress);
    await this.cityInput.fill(businessCity);
    await this.postalCodeInput.fill(businessPostalCode);
  }

  async fillInAllRequiredFields(
    businessName: string,
    businessCategory: string,
    businessEmail: string,
    businessPhone: string,
    businessAddress: string,
    businessCity: string,
    businessPostalCode: string,
  ) {
    await this.fillBusinessDetailsStep(
      businessName,
      businessCategory,
      businessEmail,
      businessPhone,
    );
    await this.nextButton.click();

    await this.fillBusinessAddressStep(
      businessAddress,
      businessCity,
      businessPostalCode,
    );
    await this.nextButton.click();
  }

  async clickAddServiceModal() {
    await this.servicesAddButton.click();
  }
}
