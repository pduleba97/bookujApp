import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { BusinessesListPage } from "../../pages/manage-businesses/businesses-list.page";
import { userOwnerData } from "../../test-data/login-data";
import { BusinessAddPage } from "../../pages/manage-businesses/business-add.page";
import {
  goToOpeningHoursStep,
  goToServicesStep,
} from "../helpers/business-flows";
import { ServiceModalPage } from "../../pages/manage-businesses/service-modal.page";
import { ServiceRow } from "../../pages/manage-businesses/service-row";
import { EditServiceModalPage } from "../../pages/manage-businesses/edit-service-modal.page";

test.describe("Add business tests", () => {
  const businessData = {
    name: `Test Business ${Date.now()}`,
    category: "Hair Salon",
    email: `business${Date.now()}@test.com`,
    phone: "300400500",
    address: "pl. Defilad 1",
    city: "Warsaw",
    postalCode: "00-901",
  };

  const serviceData = {
    name: "Beard trim",
    durationHours: "0h",
    durationMinutes: "45min",
    price: "60",
  };

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.LoginAsUser(
      userOwnerData.userEmail,
      userOwnerData.userPassword,
    );
  });

  test("Owner can add new business @happypath", async ({ page }) => {
    const businessListPage = new BusinessesListPage(page);
    const businessAddPage = new BusinessAddPage(page);

    // Navigate to manage businesses page and click "Add business" button
    await businessListPage.navManageBusinessesButton.click();
    await businessListPage.addBusinessButton.click();

    // Fill in business details step and proceed to the next step
    await businessAddPage.fillBusinessDetailsStep(
      businessData.name,
      businessData.category,
      businessData.email,
      businessData.phone,
    );
    await businessAddPage.nextButton.click();

    // Fill in business address step and proceed to the next step
    await businessAddPage.fillBusinessAddressStep(
      businessData.address,
      businessData.city,
      businessData.postalCode,
    );
    await businessAddPage.nextButton.click();

    // Proceed with default values for opening hours and services, and create the business
    await businessAddPage.nextButton.click();
    await businessAddPage.nextButton.click();
    await businessAddPage.createBusinessButton.click();
    await expect(page).toHaveURL("/manage-businesses");

    const businessRow = businessListPage.businessRowByName(businessData.name);
    await expect(businessRow.name).toHaveText(businessData.name);
    await expect(businessRow.category).toHaveText(businessData.category);
    await expect(businessRow.city).toHaveText(businessData.city);
    await expect(businessRow.address).toHaveText(businessData.address);
    await expect(businessRow.status).toHaveText("❌");
    await expect(businessRow.enterButton).toBeVisible();
    await expect(businessRow.previewButton).toBeVisible();
    await expect(businessRow.removeButton).toBeVisible();

    // Clean-up - remove the newly created business
    await businessRow.removeButton.click();
    await expect(businessRow.name).toBeHidden();
  });

  test("Owner cannot proceed if they doesn't provide required fields", async ({
    page,
  }) => {
    const detailsFormHeader = "About You";
    const addressFormHeader = "Confirm Your Address";
    const businessListPage = new BusinessesListPage(page);
    const businessAddPage = new BusinessAddPage(page);

    // Navigate to manage businesses page and click "Add business" button
    await businessListPage.navManageBusinessesButton.click();
    await businessListPage.addBusinessButton.click();

    // Click next with all fields empty - user should stay on About You view
    await businessAddPage.nextButton.click();
    await expect(businessAddPage.header).toContainText(detailsFormHeader);

    // Fill in business details step and proceed to the next step - user should be able to see Confirm Your Address view
    await businessAddPage.fillBusinessDetailsStep(
      businessData.name,
      businessData.category,
      businessData.email,
      businessData.phone,
    );
    await businessAddPage.nextButton.click();
    await expect(businessAddPage.header).toContainText(addressFormHeader);

    // Click next with all fields empty - user should stay on Confirm Your Address view
    await businessAddPage.nextButton.click();
    await expect(businessAddPage.header).toContainText(addressFormHeader);

    // Fill in business address step and proceed to the next step - user should be able to see Describe Your Business view
    await businessAddPage.fillBusinessAddressStep(
      businessData.address,
      businessData.city,
      businessData.postalCode,
    );
    await businessAddPage.nextButton.click();
    await expect(businessAddPage.header).toContainText(
      "Describe Your Business",
    );
  });

  test("Owner can view default opening hours and toggle them", async ({
    page,
  }) => {
    const defaultWeekDays = [
      { name: "Monday", working: true, start: "10:00", end: "18:00" },
      { name: "Tuesday", working: true, start: "10:00", end: "18:00" },
      { name: "Wednesday", working: true, start: "10:00", end: "18:00" },
      { name: "Thursday", working: true, start: "10:00", end: "18:00" },
      { name: "Friday", working: true, start: "10:00", end: "18:00" },
      { name: "Saturday", working: false, start: "10:00", end: "18:00" },
      { name: "Sunday", working: false, start: "10:00", end: "18:00" },
    ];

    // Skip to Opening Hours step
    const businessAddPage = await goToOpeningHoursStep(page, businessData);

    // Verify default states
    for (const day of defaultWeekDays) {
      const openingHourRow = businessAddPage.openingHourRowByDay(day.name);
      await expect(openingHourRow.switch).toBeChecked({
        checked: day.working,
      });
      await expect(openingHourRow.info).toHaveText(
        day.working ? `${day.start} - ${day.end}` : "Closed",
      );
    }

    // Toggle all switches
    for (const day of defaultWeekDays) {
      const openingHourRow = businessAddPage.openingHourRowByDay(day.name);
      await openingHourRow.toggleSwitch();
    }

    // Verify toggled states
    for (const day of defaultWeekDays) {
      const openingHourRow = businessAddPage.openingHourRowByDay(day.name);
      await expect(openingHourRow.switch).toBeChecked({
        checked: !day.working,
      });
      await expect(openingHourRow.info).toHaveText(
        !day.working ? `${day.start} - ${day.end}` : "Closed",
      );
    }
  });

  test("Owner can change opening hours via modal", async ({ page }) => {
    const day = {
      name: "Sunday",
      working: false,
      openingHour: "10:00",
      closingHour: "18:00",
    };
    const newOpeningHour = "14:00";
    const newClosingHour = "22:00";

    // Skip to Opening Hours step
    const businessAddPage = await goToOpeningHoursStep(page, businessData);

    const dayRow = businessAddPage.openingHourRowByDay(day.name);
    await expect(dayRow.info).toHaveText(`Closed`);

    // Toggle switch and check if default opening and closing hours are displayed
    await dayRow.toggleSwitch();
    await expect(dayRow.info).toHaveText(
      `${day.openingHour} - ${day.closingHour}`,
    );

    // Click to open a modal and check if the modal displays default values for the selected day
    const openingHourModalPage = await dayRow.openModal();
    await expect(openingHourModalPage.header).toHaveText(day.name);
    await expect(openingHourModalPage.openingHour).toHaveValue(day.openingHour);
    await expect(openingHourModalPage.closingHour).toHaveValue(day.closingHour);

    // Set opening hours to valid ones and check if modal displays new values
    await openingHourModalPage.setOpeningHours(newOpeningHour, newClosingHour);
    await expect(openingHourModalPage.openingHour).toHaveValue(newOpeningHour);
    await expect(openingHourModalPage.closingHour).toHaveValue(newClosingHour);

    // Click save button and expect to see the new opening and closing hours in the selected day row
    await openingHourModalPage.saveButton.click();
    await expect(dayRow.info).toHaveText(
      `${newOpeningHour} - ${newClosingHour}`,
    );
  });

  test("Owner can cancel opening hours edit without saving changes", async ({
    page,
  }) => {
    const day = {
      name: "Sunday",
      working: false,
      openingHour: "10:00",
      closingHour: "18:00",
    };
    const newOpeningHour = "14:00";
    const newClosingHour = "22:00";

    // Skip to Opening Hours step
    const businessAddPage = await goToOpeningHoursStep(page, businessData);

    const dayRow = businessAddPage.openingHourRowByDay(day.name);
    await expect(dayRow.info).toHaveText(`Closed`);

    // Toggle switch and check if default opening and closing hours are displayed
    await dayRow.toggleSwitch();
    await expect(dayRow.info).toHaveText(
      `${day.openingHour} - ${day.closingHour}`,
    );

    // Click to open a modal and check if the modal displays default values for the selected day
    const openingHourModalPage = await dayRow.openModal();
    await expect(openingHourModalPage.header).toHaveText(day.name);
    await expect(openingHourModalPage.openingHour).toHaveValue(day.openingHour);
    await expect(openingHourModalPage.closingHour).toHaveValue(day.closingHour);

    // Set opening hours to valid ones and check if modal displays new values
    await openingHourModalPage.setOpeningHours(newOpeningHour, newClosingHour);
    await expect(openingHourModalPage.openingHour).toHaveValue(newOpeningHour);
    await expect(openingHourModalPage.closingHour).toHaveValue(newClosingHour);

    // Click close button and expect to see the default opening and closing hours in the selected day row
    await openingHourModalPage.closeButton.click();
    await expect(dayRow.info).toHaveText(
      `${day.openingHour} - ${day.closingHour}`,
    );
  });

  test("Owner cannot set close time before open time", async ({ page }) => {
    const day = {
      name: "Sunday",
      working: false,
      openingHour: "10:00",
      closingHour: "18:00",
    };
    const newOpeningHour = "22:00";
    const newClosingHour = "14:00";
    const toastErrorMessage = "Opening time must be earlier than closing time!";

    // Skip to Opening Hours step
    const businessAddPage = await goToOpeningHoursStep(page, businessData);

    const dayRow = businessAddPage.openingHourRowByDay(day.name);
    await expect(dayRow.info).toHaveText(`Closed`);

    // Toggle switch and check if default opening and closing hours are displayed
    await dayRow.toggleSwitch();
    await expect(dayRow.info).toHaveText(
      `${day.openingHour} - ${day.closingHour}`,
    );

    // Click to open a modal and check if the modal displays default values for the selected day
    const openingHourModalPage = await dayRow.openModal();
    await expect(openingHourModalPage.header).toHaveText(day.name);
    await expect(openingHourModalPage.openingHour).toHaveValue(day.openingHour);
    await expect(openingHourModalPage.closingHour).toHaveValue(day.closingHour);

    // Set opening hours to invalid ones and check if modal displays new values
    await openingHourModalPage.setOpeningHours(newOpeningHour, newClosingHour);
    await expect(openingHourModalPage.openingHour).toHaveValue(newOpeningHour);
    await expect(openingHourModalPage.closingHour).toHaveValue(newClosingHour);

    // Click save to close the modal and expect to see an error
    await openingHourModalPage.saveButton.click();
    await expect(openingHourModalPage.errorToast).toContainText(
      toastErrorMessage,
    );
  });

  test("Owner can add a service to business during business creation", async ({
    page,
  }) => {
    // Skip to Services step
    const businessAddPage = await goToServicesStep(page, businessData);
    const servicesModalPage = new ServiceModalPage(page);

    // At the begining user should see a header No services added yet
    await expect(businessAddPage.header).toHaveText("No services added yet");

    await businessAddPage.clickAddServiceModal();
    // The modal should have a header Add Service
    await expect(servicesModalPage.header).toHaveText("Add Service");

    // Fill add service form and click add
    await servicesModalPage.name.fill(serviceData.name);
    await servicesModalPage.hours.selectOption(serviceData.durationHours);
    await servicesModalPage.minutes.selectOption(serviceData.durationMinutes);
    await servicesModalPage.price.fill(serviceData.price);
    await servicesModalPage.addButton.click();

    // When at least one service is in the list user should see Your Services header instead of the previous one
    await expect(businessAddPage.header).toHaveText("Your services");

    // A new row should be visible representing a data that user provided when adding a new service
    const serviceRow = new ServiceRow(page.getByTestId("service-0"));
    await expect(serviceRow.name).toHaveText(serviceData.name);
    await expect(serviceRow.duration).toContainText(
      serviceData.durationMinutes,
    );
    await expect(serviceRow.price).toContainText(serviceData.price);
  });

  test("Owner cannot add a service without filling required fields", async ({
    page,
  }) => {
    // Skip to Services step
    const businessAddPage = await goToServicesStep(page, businessData);
    const servicesModalPage = new ServiceModalPage(page);
    const serviceNameMissingErrorToast = "A valid Service Name is required.";
    const durationErrorToast = "Service cannot last 0 minutes!";
    const priceErrorToast = "Price cannot be set to 0.";

    // Click "Add new service" to open Add Service Modal
    await businessAddPage.clickAddServiceModal();

    // Try to add a service without filling all required fields
    await servicesModalPage.addButton.click();

    // Owner is not able to add a new service without providing service name
    await expect(
      servicesModalPage.errorToast.filter({
        hasText: serviceNameMissingErrorToast,
      }),
    ).toBeVisible();

    // Fill service name
    await servicesModalPage.name.fill(serviceData.name);

    // Click add button two times, first to auto-fill duration hours and minutes to 0h and 0min, second to try to add a service
    await servicesModalPage.addButton.click();
    await servicesModalPage.addButton.click();

    // Owner is not able to add a new service without providing a valid service duration
    await expect(
      servicesModalPage.errorToast.filter({ hasText: durationErrorToast }),
    ).toBeVisible();

    // Fill duration minutes
    await servicesModalPage.minutes.selectOption(serviceData.durationMinutes);

    // Try to add a service without filling all required fields
    await servicesModalPage.addButton.click();

    // Owner is not able to add a new service without setting price to value greater than 0
    await expect(
      servicesModalPage.errorToast.filter({ hasText: priceErrorToast }),
    ).toBeVisible();

    // Fill price
    await servicesModalPage.price.fill(serviceData.price);

    // Try to add a service with all required fields filled
    await servicesModalPage.addButton.click();

    // Owner is able to finally add a service
    const serviceRow = new ServiceRow(page.getByTestId("service-0"));
    await expect(serviceRow.row).toHaveCount(1);
  });

  test("Owner can remove previously added service from a business during business creation", async ({
    page,
  }) => {
    // Skip to Services step
    const businessAddPage = await goToServicesStep(page, businessData);
    const servicesModalPage = new ServiceModalPage(page);

    // Click "Add new service" to open Add Service Modal
    await businessAddPage.clickAddServiceModal();

    // Add a new service to services list
    await servicesModalPage.addNewServiceDuringBusinessCreation(serviceData);

    await expect(businessAddPage.header).toHaveText("Your services");
    const serviceRow = new ServiceRow(page.getByTestId("service-0"));
    await expect(serviceRow.name).toHaveText(serviceData.name);

    // Click on a trash icon in the list in the service row to remove a newly added service
    await serviceRow.deleteButton.click();

    // After deleting the newly added service, the service should be removed from the list
    await expect(serviceRow.row).toHaveCount(0);

    // When the service list is empty user should see again No services added yet header.
    await expect(businessAddPage.header).toHaveText("No services added yet");
  });

  test("Owner can edit previously added service during business creation", async ({
    page,
  }) => {
    const newServiceData = {
      name: "Basic haircut",
      durationHours: "0h",
      durationMinutes: "30min",
      price: "50",
    };

    // Skip to Services step
    const businessAddPage = await goToServicesStep(page, businessData);
    const servicesModalPage = new ServiceModalPage(page);
    const editServicesModalPage = new EditServiceModalPage(page);

    // Click "Add new service" to open Add Service Modal
    await businessAddPage.clickAddServiceModal();

    // Add a new service to services list
    await servicesModalPage.addNewServiceDuringBusinessCreation(serviceData);

    // A new row should be visible representing a data that user provided when adding a new service
    const serviceRow = new ServiceRow(page.getByTestId("service-0"));
    await expect(serviceRow.name).toHaveText(serviceData.name);
    await expect(serviceRow.duration).toContainText(
      serviceData.durationMinutes,
    );
    await expect(serviceRow.price).toContainText(serviceData.price);

    // Click on chevron to open edit service modal
    await serviceRow.chevronButton.click();

    // The edit modal should have a header Edit Service
    await expect(editServicesModalPage.header).toHaveText("Edit Service");

    // Fill edit service form and click edit
    await editServicesModalPage.name.fill(newServiceData.name);
    await editServicesModalPage.hours.selectOption(
      newServiceData.durationHours,
    );
    await editServicesModalPage.minutes.selectOption(
      newServiceData.durationMinutes,
    );
    await editServicesModalPage.price.fill(newServiceData.price);
    await editServicesModalPage.editButton.click();

    // The service row should be visible representing a data that user provided when editing the service
    await expect(serviceRow.name).toHaveText(newServiceData.name);
    await expect(serviceRow.duration).toContainText(
      newServiceData.durationMinutes,
    );
    await expect(serviceRow.price).toContainText(newServiceData.price);
  });

  test("Owner cannot edit a service without filling required fields", async ({
    page,
  }) => {
    const newServiceData = {
      name: "Basic haircut",
      durationHours: "0h",
      durationMinutes: "30min",
      price: "50",
    };

    // Skip to Services step
    const businessAddPage = await goToServicesStep(page, businessData);

    const servicesModalPage = new ServiceModalPage(page);
    const editServiceModalPage = new EditServiceModalPage(page);
    const serviceNameMissingErrorToast = "A valid Service Name is required.";
    const durationErrorToast = "Service cannot last 0 minutes!";
    const priceErrorToast = "Price cannot be set to 0.";

    // Click "Add new service" to open Add Service Modal
    await businessAddPage.clickAddServiceModal();

    // Add a new service to services list
    await servicesModalPage.addNewServiceDuringBusinessCreation(serviceData);

    // A new row should be visible in services list
    const serviceRow = new ServiceRow(page.getByTestId("service-0"));
    await expect(serviceRow.name).toHaveText(serviceData.name);

    // Click on chevron icon to open Edit Service modal and clear all inputs
    await serviceRow.chevronButton.click();
    await editServiceModalPage.clearAllInputs();

    // Click on edit button to try to edit the service
    editServiceModalPage.editButton.click();

    // Owner is not able to edit the service without providing a valid service name
    await expect(
      editServiceModalPage.errorToast.filter({
        hasText: serviceNameMissingErrorToast,
      }),
    ).toBeVisible();

    // Owner fills required service name field
    await editServiceModalPage.name.fill(newServiceData.name);

    // Click on edit button to try to edit the service
    await editServiceModalPage.editButton.click();

    // Owner is not able to edit the service without providing a valid service duration
    await expect(
      editServiceModalPage.errorToast.filter({
        hasText: durationErrorToast,
      }),
    ).toBeVisible();

    // Owner fills required duration minutes field
    await editServiceModalPage.minutes.selectOption(
      newServiceData.durationMinutes,
    );

    // Click on edit button to try to edit the service
    await editServiceModalPage.editButton.click();

    // Owner is not able to edit the service without providing a valid service price
    await expect(
      editServiceModalPage.errorToast.filter({
        hasText: priceErrorToast,
      }),
    ).toBeVisible();

    // Owner fills required price field
    await editServiceModalPage.price.fill(newServiceData.price);

    // Click on edit button to try to edit the service
    await editServiceModalPage.editButton.click();

    // Owner is able to finally edit the service
    await expect(serviceRow.name).toHaveText(newServiceData.name);
    await expect(serviceRow.duration).toContainText(
      newServiceData.durationMinutes,
    );
    await expect(serviceRow.price).toContainText(newServiceData.price);
  });

  test("Owner can remove previously added service from edit service modal view during business creation", async ({
    page,
  }) => {
    // Skip to Services step
    const businessAddPage = await goToServicesStep(page, businessData);
    const servicesModalPage = new ServiceModalPage(page);
    const editServicesModalPage = new EditServiceModalPage(page);

    // Click "Add new service" to open Add Service Modal
    await businessAddPage.clickAddServiceModal();

    // Add a new service to services list
    await servicesModalPage.addNewServiceDuringBusinessCreation(serviceData);

    // A new row should be visible in services list
    const serviceRow = new ServiceRow(page.getByTestId("service-0"));
    await expect(serviceRow.name).toHaveText(serviceData.name);

    // Click on chevron to open Edit Service modal
    await serviceRow.chevronButton.click();

    // Click on trash icon to remove the service
    await editServicesModalPage.deleteButton.click();

    // After deleting the newly added service, the service should be removed from the list
    await expect(serviceRow.row).toHaveCount(0);

    // When the service list is empty user should see again No services added yet header.
    await expect(businessAddPage.header).toHaveText("No services added yet");
  });
});
