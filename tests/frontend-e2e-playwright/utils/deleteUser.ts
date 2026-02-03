import { request } from "@playwright/test";
import { API_URL } from "../test-data/admin-data";

export default async function deleteUser(
  authToken: string,
  email: string,
): Promise<void> {
  const apiContext = await request.newContext({
    ignoreHTTPSErrors: true, // Ignore certificate error
    baseURL: API_URL,
    extraHTTPHeaders: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  const deleteResponse = await apiContext.delete(
    `/api/users/delete?email=${email}`,
  );

  if (!deleteResponse.ok()) {
    if (deleteResponse.status() === 404) {
      console.log(`User ${email} does not exist, skipping deletion.`);
      return;
    }

    throw new Error(`Failed to delete user: ${email}`);
  }

  console.log(`User ${email} deleted successfully`);
}
