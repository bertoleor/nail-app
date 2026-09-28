import { expect, test } from "@playwright/test";

test.describe("Home Page", () => {
  test("displays hero section", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /^NailApp$/ })
    ).toBeVisible();
  });

  test("has navigation to calculator (Soy Clienta)", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Reservar turno" }).click();
    await expect(page).toHaveURL(/\/reservar/);
  });

  test("has navigation to manicurista panel", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Ir al panel" }).click();
    await expect(page).toHaveURL(/\/admin/);
  });
});
