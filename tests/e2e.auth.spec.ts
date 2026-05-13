import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();

test.describe("Auth: login and admin", () => {
  test("logs in via UI and opens /admin", async ({ page }) => {
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;
    if (!email || !password) {
      throw new Error("Please set TEST_USER_EMAIL and TEST_USER_PASSWORD environment variables.");
    }

    // Navigate to admin (app should redirect to login if needed)
    await page.goto("/admin");
    // If a login form is present, fill and submit it. Accept common button texts.
    const emailInput = page.locator('input[type="email"]');
    if ((await emailInput.count()) > 0) {
      await emailInput.fill(email);
      const passInput = page.locator('input[type="password"]');
      await passInput.fill(password);
      const submit = page
        .locator(
          'button:has-text("Sign in"), button:has-text("Sign In"), button:has-text("Login"), button:has-text("Log in")',
        )
        .first();
      await submit.click();
      await page.waitForLoadState("networkidle");
    }

    // Verify we are on an admin page
    await expect(page).toHaveURL(/\/admin/);
    // Basic smoke check for admin UI elements
    await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();
    console.log(await page.content());
  });
});
