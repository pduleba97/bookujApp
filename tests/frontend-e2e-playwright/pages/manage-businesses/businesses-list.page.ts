import { Locator, Page } from "@playwright/test";
import { BusinessRow } from "./business-row";

export class BusinessesListPage {
  navManageBusinessesButton: Locator;
  addBusinessButton: Locator;

  constructor(private page: Page) {
    this.navManageBusinessesButton = this.page.locator(
      "#nav-manage-businesses",
    );
    this.addBusinessButton = this.page.locator("#manage-businesses-add-button");
  }

  businessRowByName(businessName: string): BusinessRow {
    const row = this.page.locator("tbody tr", { hasText: businessName });
    return new BusinessRow(row);
  }
}
