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
    this.name = this.row.locator("#business-name");
    this.category = this.row.locator("#business-category");
    this.city = this.row.locator("#business-city");
    this.address = this.row.locator("#business-address");
    this.status = this.row.locator("#business-status");
    this.enterButton = this.row.locator("#business-enter");
    this.previewButton = this.row.locator("#business-preview");
    this.removeButton = this.row.locator("#business-delete");
  }
}
