import { Locator } from "@playwright/test";
import { OpeningHourModalPage } from "./opening-hour-modal.page";

export class OpeningHourRow {
  info: Locator;
  switch: Locator;
  chevronButton: Locator;

  constructor(private row: Locator) {
    this.switch = this.row.locator(".opening-hours-group-toggle-day input");
    this.info = this.row.locator(".opening-hours-group-hours-info");
    this.chevronButton = this.row.locator(".opening-hours-group-hours-chevron");
  }

  async toggleSwitch() {
    await this.switch.locator("..").click();
  }

  async openModal(): Promise<OpeningHourModalPage> {
    await this.chevronButton.click();
    return new OpeningHourModalPage(this.row.page());
  }
}
