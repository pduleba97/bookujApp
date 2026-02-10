import { Page, expect } from "@playwright/test";
import { BusinessAddPage } from "../../pages/manage-businesses/business-add.page";
import { BusinessesListPage } from "../../pages/manage-businesses/businesses-list.page";

export async function goToOpeningHoursStep(
  page: Page,
  business: {
    name: string;
    category: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  },
): Promise<BusinessAddPage> {
  const businessListPage = new BusinessesListPage(page);
  const businessAddPage = new BusinessAddPage(page);

  await businessListPage.navManageBusinessesButton.click();
  await businessListPage.addBusinessButton.click();

  await businessAddPage.fillInAllRequiredFields(
    business.name,
    business.category,
    business.email,
    business.phone,
    business.address,
    business.city,
    business.postalCode,
  );

  await businessAddPage.nextButton.click();
  await expect(businessAddPage.header).toContainText("Your Business Hours");

  return businessAddPage;
}

export async function goToServicesStep(
  page: Page,
  business: {
    name: string;
    category: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  },
): Promise<BusinessAddPage> {
  const businessListPage = new BusinessesListPage(page);
  const businessAddPage = new BusinessAddPage(page);

  await businessListPage.navManageBusinessesButton.click();
  await businessListPage.addBusinessButton.click();

  await businessAddPage.fillInAllRequiredFields(
    business.name,
    business.category,
    business.email,
    business.phone,
    business.address,
    business.city,
    business.postalCode,
  );

  await businessAddPage.nextButton.click();
  await businessAddPage.nextButton.click();
  await expect(businessAddPage.header).toContainText("No services added yet");

  return businessAddPage;
}
