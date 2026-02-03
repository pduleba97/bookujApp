import { request } from "@playwright/test";
import { adminData, API_URL } from "../test-data/admin-data";

export default async function getAuthToken(): Promise<string> {
  const apiContext = await request.newContext({
    ignoreHTTPSErrors: true, // Ignore certificate error
    baseURL: API_URL,
  });

  const loginResponse = await apiContext.post(`/api/users/login`, {
    data: {
      email: adminData.email,
      password: adminData.password,
    },
  });

  if (!loginResponse.ok()) {
    throw new Error(`Login failed with status ${loginResponse.status()}`);
  }

  const loginData = await loginResponse.json();

  return loginData.accessToken;
}
