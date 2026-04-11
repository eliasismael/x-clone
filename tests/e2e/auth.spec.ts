import { expect, test } from "@playwright/test";

test("user can register, sign out, and sign back in", async ({ page }) => {
  const uniqueId = `${Date.now()}`;
  const email = `elias+${uniqueId}@example.com`;
  const username = `elias_${uniqueId.slice(-6)}`;
  const password = "Hola123@";

  await page.goto("/register");

  await page.getByLabel("Display name").fill("Elias Pereyra");
  await page.getByLabel("Username").fill(username);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Confirm password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/home$/);
  await expect(page.getByText("Signed in as")).toContainText("Elias Pereyra");
  await expect(page.getByText(`@${username}`).first()).toBeVisible();

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/home$/);
  await expect(page.getByText(`@${username}`).first()).toBeVisible();
});
