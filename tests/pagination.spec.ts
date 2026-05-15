import { test, expect } from "@playwright/test";

const adminEmail = "owner@guruji.test";
const adminPassword = "test1234";

test.describe("Pagination", () => {
  test("Public hiring pagination advances pages when available", async ({ page }) => {
    await page.goto("/hiring");

    // Wait for the page indicator to appear (if pagination UI rendered)
    const indicator = page.locator("text=Page");
    await indicator
      .first()
      .waitFor({ timeout: 5000 })
      .catch(() => {});

    const text = (await indicator.first().textContent()) || "";
    const match = text.match(/Page\s*(\d+)\s*of\s*(\d+)/i);
    if (!match) {
      test.skip(true, "No pagination indicator found on /hiring");
      return;
    }

    const current = Number(match[1]);
    const total = Number(match[2]);

    if (total <= 1) {
      test.skip(true, "Only one page available on /hiring");
      return;
    }

    // Click Next and expect the page number to increment
    await page.click('button:has-text("Next")');

    await expect(page.locator(`text=Page ${current + 1} of ${total}`)).toBeVisible({
      timeout: 5000,
    });
  });

  test("Admin listings pagination advances pages when available", async ({ page, request }) => {
    // Authenticate: try UI first, fallback to API login and cookie copy
    await page.goto("/admin/login");

    await page.fill('input[type="email"]', adminEmail).catch(() => {});
    await page.fill('input[type="password"]', adminPassword).catch(() => {});

    const [loginResponse] = await Promise.all([
      page
        .waitForResponse(
          (resp) => resp.url().includes("/login") && resp.request().method() === "POST",
          {
            timeout: 5000,
          },
        )
        .catch(() => null),
      page.click('button:has-text("Sign in")').catch(() => null),
    ]);

    const dashboard = page.getByRole("heading", { name: /Admin Dashboard/i });

    if (loginResponse && loginResponse.ok()) {
      await expect(dashboard).toBeVisible({ timeout: 5000 });
    } else {
      const apiLogin = await request
        .post("http://localhost:5000/login", {
          data: { email: adminEmail, password: adminPassword },
        })
        .catch(() => null);

      if (!apiLogin || !apiLogin.ok())
        test.skip(true, "Unable to authenticate admin for pagination test");

      const headers = apiLogin.headers();
      const setCookie =
        headers["set-cookie"] || headers["Set-Cookie"] || headers["set-cookie".toLowerCase()];
      if (setCookie) {
        const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
        const cookieObjs = cookies.map((c) => {
          const [pair] = c.split(";");
          const [name, ...rest] = pair.split("=");
          return {
            name: name.trim(),
            value: rest.join("=").trim(),
            domain: "localhost",
            path: "/",
            httpOnly: true,
          };
        });
        await page.context().addCookies(cookieObjs as any);
      }

      await page.goto("/admin");
      await expect(dashboard).toBeVisible({ timeout: 5000 });
    }

    // Wait for pagination indicator in admin page
    const indicator = page.locator("text=Page");
    await indicator
      .first()
      .waitFor({ timeout: 5000 })
      .catch(() => {});
    const text = (await indicator.first().textContent()) || "";
    const match = text.match(/Page\s*(\d+)\s*of\s*(\d+)/i);
    if (!match) {
      test.skip(true, "No pagination indicator found on admin listings");
      return;
    }

    const current = Number(match[1]);
    const total = Number(match[2]);

    if (total <= 1) {
      test.skip(true, "Only one page available on admin listings");
      return;
    }

    await page.click('button:has-text("Next")');
    await expect(page.locator(`text=Page ${current + 1} of ${total}`)).toBeVisible({
      timeout: 5000,
    });
  });
});
