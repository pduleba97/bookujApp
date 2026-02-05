import { Locator, Page } from "@playwright/test";

export class BusinessAddPage {
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
  serviceModalServiceNameInput: Locator;
  serviceModalServiceHours: Locator;
  serviceModalServiceMinutes: Locator;
  serviceModalServicePriceInput: Locator;
  serviceModalServiceDescriptionInput: Locator;
  editServiceModalServiceNameInput: Locator;
  editServiceModalServiceHours: Locator;
  editServiceModalServiceMinutes: Locator;
  editServiceModalServicePriceInput: Locator;
  editServiceModalServiceDescriptionInput: Locator;

  nextButton: Locator;
  cancelButton: Locator;
  openingHourModalSaveButton: Locator;
  openingHourModalCloseButton: Locator;
  servicesAddButton: Locator;
  serviceModalAddButton: Locator;
  serviceModalCloseButton: Locator;
  editServiceModalEditButton: Locator;
  editServiceModalDeleteButton: Locator;
  editServiceModalCloseButton: Locator;
  createBusinessButton: Locator;

  constructor(private page: Page) {
    this.nameInput = this.page.locator("#business-name");
    this.categorySelect = this.page.locator("#business-category");
    this.emailInput = this.page.locator("#business-email");
    this.phoneInput = this.page.locator("#business-phoneNumber");

    this.addressInput = this.page.locator("#business-address");
    this.cityInput = this.page.locator("#business-city");
    this.postalCodeInput = this.page.locator("#business-postalCode");
    this.descriptionInput = this.page.locator("#business-description");

    this.openingHourSwitchMonday = this.page.locator(
      "#opening-hours-switch-Monday",
    );
    this.openingHourSwitchTuesday = this.page.locator(
      "#opening-hours-switch-Tuesday",
    );
    this.openingHourSwitchWednesday = this.page.locator(
      "#opening-hours-switch-Wednesday",
    );
    this.openingHourSwitchThursday = this.page.locator(
      "#opening-hours-switch-Thursday",
    );
    this.openingHourSwitchFriday = this.page.locator(
      "#opening-hours-switch-Friday",
    );
    this.openingHourSwitchSaturday = this.page.locator(
      "#opening-hours-switch-Saturday",
    );
    this.openingHourSwitchSunday = this.page.locator(
      "#opening-hours-switch-Sunday",
    );

    this.openingHourModalSelectOpenHour = this.page.locator(
      "#opening-hours-modal-select-openHour",
    );
    this.openingHourModalSelectCloseHour = this.page.locator(
      "#opening-hour-modal-select-closeHour",
    );
    this.serviceModalServiceNameInput = this.page.locator("#service-name");
    this.serviceModalServiceHours = this.page.locator("#service-hours");
    this.serviceModalServiceMinutes = this.page.locator("#service-minutes");
    this.serviceModalServicePriceInput = this.page.locator("#service-price");
    this.serviceModalServiceDescriptionInput = this.page.locator(
      "#service-description",
    );
    this.editServiceModalServiceNameInput =
      this.page.locator("#edit-service-name");
    this.editServiceModalServiceHours = this.page.locator(
      "#edit-service-hours",
    );
    this.editServiceModalServiceMinutes = this.page.locator(
      "#edit-service-minutes",
    );
    this.editServiceModalServicePriceInput = this.page.locator(
      "#edit-service-price",
    );
    this.editServiceModalServiceDescriptionInput = this.page.locator(
      "#edit-service-description",
    );

    this.nextButton = this.page.locator("#business-form-next");
    this.cancelButton = this.page.locator("#business-form-cancel");
    this.openingHourModalSaveButton = this.page.locator(
      "#opening-hour-modal-save",
    );
    this.openingHourModalCloseButton = this.page.locator(
      "#opening-hour-modal-close",
    );
    this.servicesAddButton = this.page.locator(
      "#business-services-form-add-button",
    );
    this.serviceModalCloseButton = this.page.locator("#service-modal-close");
    this.serviceModalAddButton = this.page.locator("#service-modal-add-button");
    this.editServiceModalEditButton = this.page.locator(
      "#edit-service-modal-edit",
    );
    this.editServiceModalDeleteButton = this.page.locator(
      "#edit-service-remove-box",
    );
    this.editServiceModalCloseButton = this.page.locator(
      "#edit-service-modal-close",
    );
    this.createBusinessButton = this.page.locator("#business-form-create");
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
}
