import { Browser } from "@playwright/test";
import { adminData, API_URL } from "../test-data/admin-data";

export default async function getAuthToken(browser: Browser): Promise<string> {
  const context = await browser.newContext({
    ignoreHTTPSErrors: true, // Ignore certificate error
  });
  const newPage = await context.newPage();

  const loginResponse = await newPage.request.post(`${API_URL}/users/login`, {
    data: {
      email: adminData.email,
      password: adminData.password,
    },
  });
  const loginData = await loginResponse.json();

  return loginData.accessToken;
}
