import { Locator } from "@playwright/test";

export class ServiceRow {
  name: Locator;
  duration: Locator;
  price: Locator;
  chevronButton: Locator;
  deleteButton: Locator;

  constructor(public readonly row: Locator) {
    this.name = this.row.locator("#service-name");
    this.duration = this.row.locator("#service-duration");
    this.price = this.row.locator("#service-price");
    this.chevronButton = this.row.locator("#service-chevron");
    this.deleteButton = this.row.locator("#service-remove");
  }
}
