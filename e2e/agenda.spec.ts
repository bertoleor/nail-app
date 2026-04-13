import { expect, test } from "@playwright/test";

test.describe("Booking Agenda", () => {
  test("displays calendar", async ({ page }) => {
    await page.goto("/agenda");

    await expect(page.getByRole("heading", { name: /agenda/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /calendario/i })).toBeVisible();
  });

  test("allows month navigation", async ({ page }) => {
    await page.goto("/agenda");

    const nextButtons = await page.locator('button').filter({ has: page.locator('svg') }).all();
    if (nextButtons.length >= 2) {
      await nextButtons[1].click();
      await expect(page.getByText(/febrero|marzo|abril/i)).toBeVisible();
    }
  });

  test("allows day selection", async ({ page }) => {
    await page.goto("/agenda");

    const dayButtons = await page.locator('button').filter({ hasText: /^\d+$/ }).all();
    if (dayButtons.length > 10) {
      await dayButtons[10].click();
      await expect(page.getByText(/Sin turnos|turnos del día/i)).toBeVisible();
    }
  });

  test("shows booking form button", async ({ page }) => {
    await page.goto("/agenda");

    await expect(page.getByRole("button", { name: /nuevo turno/i })).toBeVisible();
  });

  test("opens booking form dialog", async ({ page }) => {
    await page.goto("/agenda");

    await page.click('text=Nuevo turno');

    await expect(page.getByRole("dialog")).toBeVisible();
  });
});
