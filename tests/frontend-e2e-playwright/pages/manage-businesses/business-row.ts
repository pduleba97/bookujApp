import { Locator } from "@playwright/test";

export class BusinessRow {
  name: Locator;
  category: Locator;
  city: Locator;
  address: Locator;
  status: Locator;
  enterButton: Locator;
  previewButton: Locator;
  removeButton: Locator;

  constructor(private row: Locator) {
    this.name = this.row.locator("#manage-businesses-table-business-name");
    this.category = this.row.locator(
      "#manage-businesses-table-business-category",
    );
    this.city = this.row.locator("#manage-businesses-table-business-city");
    this.address = this.row.locator(
      "#manage-businesses-table-business-address",
    );
    this.status = this.row.locator("#manage-businesses-table-business-status");
    this.enterButton = this.row.locator(
      "#manage-businesses-table-business-enter",
    );
    this.previewButton = this.row.locator(
      "#manage-businesses-table-business-preview",
    );
    this.removeButton = this.row.locator(
      "#manage-businesses-table-business-delete",
    );
  }
}
