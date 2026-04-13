import { expect, test } from "@playwright/test";

test.describe("Home Page", () => {
  test("displays hero section", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /nail-app/i })).toBeVisible();
  });

  test("has navigation to calculator", async ({ page }) => {
    await page.goto("/");

    await page.click('text=Calculadora');
    await expect(page).toHaveURL(/calculator/);
  });

  test("has navigation to agenda", async ({ page }) => {
    await page.goto("/");

    await page.click('text=Agenda');
    await expect(page).toHaveURL(/agenda/);
  });
});
