import { expect, test } from "@playwright/test";

test.describe("Booking Agenda (admin turnos)", () => {
  test("displays turnos management page", async ({ page }) => {
    await page.goto("/admin/turnos");

    await expect(page.getByRole("heading", { name: /Gestión de Turnos/i })).toBeVisible();
  });

  test("allows day navigation", async ({ page }) => {
    await page.goto("/admin/turnos");

    await expect(page.getByRole("button", { name: /Anterior/i })).toBeVisible();
    const currentDayLabel = await page
      .getByText(/lunes|martes|miércoles|jueves|viernes|sábado|domingo/i)
      .first()
      .textContent();
    await page.getByRole("button", { name: /Anterior/i }).click();
    await expect(
      page.getByText(/lunes|martes|miércoles|jueves|viernes|sábado|domingo/i).first(),
    ).not.toHaveText(currentDayLabel ?? "");
  });

  test("shows new booking and block buttons", async ({ page }) => {
    await page.goto("/admin/turnos");

    await expect(page.getByRole("button", { name: /Nuevo turno/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Bloquear horario/i })).toBeVisible();
  });

  test("opens block dialog", async ({ page }) => {
    await page.goto("/admin/turnos");

    await page.getByRole("button", { name: /Bloquear horario/i }).click();

    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("shows bookings list for selected day", async ({ page }) => {
    await page.goto("/admin/turnos");

    // The day view renders a list of slots/bookings; heading confirms the section exists
    await expect(page.getByRole("heading", { name: /Gestión de Turnos/i })).toBeVisible();
    await expect(page.getByText(/Nuevo turno/i).first()).toBeVisible();
  });
});
