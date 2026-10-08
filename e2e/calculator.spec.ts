import { expect, test } from "@playwright/test";

test.describe("Price Calculator", () => {
  test("displays calculator form", async ({ page }) => {
    await page.goto("/calculator");

    await expect(page.getByRole("heading", { name: /Calculadora de Precios/i })).toBeVisible();
  });

  test("allows service selection", async ({ page }) => {
    await page.goto("/calculator");

    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: /Manicura clásica/i }).click();

    // NAIL-M2: formatPrice emits "$3.500" in BOTH the select option list and
    // the price summary. Scope to the summary (last match in DOM order) so
    // strict mode does not see the dropdown option duplicate.
    await expect(page.getByText(/\$3\.500/).last()).toBeVisible();
  });

  test("shows total with addons", async ({ page }) => {
    await page.goto("/calculator");

    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: /Manicura clásica/i }).click();

    await page.getByRole("button", { name: /Diseño artístico/i }).click();

    await expect(page.getByText(/\$4\.300/).last()).toBeVisible();
  });

  test("shows duration", async ({ page }) => {
    await page.goto("/calculator");

    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: /Manicura clásica/i }).click();

    await expect(page.getByText(/60 minutos/)).toBeVisible();
  });
});
