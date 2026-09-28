import { expect, test } from "@playwright/test";

test.describe("Price Calculator", () => {
  test("displays calculator form", async ({ page }) => {
    await page.goto("/calculator");

    await expect(
      page.getByRole("heading", { name: /Calculadora de Precios/i })
    ).toBeVisible();
  });

  test("allows service selection", async ({ page }) => {
    await page.goto("/calculator");

    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: /Manicura clásica/i }).click();

    await expect(page.getByText(/ARS 3\.500/)).toBeVisible();
  });

  test("shows total with addons", async ({ page }) => {
    await page.goto("/calculator");

    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: /Manicura clásica/i }).click();

    await page.getByRole("button", { name: /Diseño artístico/i }).click();

    await expect(page.getByText(/ARS 4\.300/)).toBeVisible();
  });

  test("shows duration", async ({ page }) => {
    await page.goto("/calculator");

    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: /Manicura clásica/i }).click();

    await expect(page.getByText(/60 minutos/)).toBeVisible();
  });
});
