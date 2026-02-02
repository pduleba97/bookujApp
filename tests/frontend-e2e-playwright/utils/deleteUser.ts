import { Browser } from "@playwright/test";
import { API_URL } from "../test-data/admin-data";

export default async function deleteUser(
  browser: Browser,
  authToken: string,
  email: string,
): Promise<void> {
  const context = await browser.newContext({
    ignoreHTTPSErrors: true, // Ignore certificate error
  });
  const newPage = await context.newPage();

  const deleteResponse = await newPage.request.delete(
    `${API_URL}/users/delete?email=${email}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
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
