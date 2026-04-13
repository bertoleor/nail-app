import { expect, test } from "@playwright/test";

test.describe("Price Calculator", () => {
  test("displays calculator form", async ({ page }) => {
    await page.goto("/calculator");

    await expect(page.getByRole("heading", { name: /calculadora/i })).toBeVisible();
  });

  test("allows service selection", async ({ page }) => {
    await page.goto("/calculator");

    await page.click('text=Seleccioná un servicio');
    await page.click('text=Manicura clásica');

    await expect(page.getByText(/ARS 2.500/)).toBeVisible();
  });

  test("shows total with addons", async ({ page }) => {
    await page.goto("/calculator");

    await page.click('text=Seleccioná un servicio');
    await page.click('text=Manicura clásica');

    await page.click('text=Diseño artístico');

    await expect(page.getByText(/ARS 3.000/)).toBeVisible();
  });

  test("shows duration", async ({ page }) => {
    await page.goto("/calculator");

    await page.click('text=Seleccioná un servicio');
    await page.click('text=Manicura clásica');

    await expect(page.getByText(/60 minutos/)).toBeVisible();
  });
});
