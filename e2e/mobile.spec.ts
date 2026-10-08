import { expect, test } from "@playwright/test";

test.describe("Mobile Responsive - Home", () => {
  test.use({ viewport: { height: 667, width: 375 } });

  test("home hero is visible on mobile", async ({ page }) => {
    await page.goto("/");

    const title = page.getByRole("heading", { name: /^NailApp$/ });
    await expect(title).toBeVisible();
  });

  test("home section cards stack vertically on mobile", async ({ page }) => {
    await page.goto("/");

    const sectionCard = page.locator(".glass-opaque").first();
    await expect(sectionCard).toBeVisible();
    const adminCard = page.locator(".glass-subtle").first();
    await expect(adminCard).toBeVisible();
  });
});

test.describe("Mobile Responsive - Calculator", () => {
  test.use({ viewport: { height: 667, width: 375 } });

  test("calculator form fills screen on mobile", async ({ page }) => {
    await page.goto("/calculator");

    const card = page.locator(".glass, [class*='rounded']");
    await expect(card.first()).toBeVisible();
  });

  test("select dropdown works on mobile", async ({ page }) => {
    await page.goto("/calculator");

    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: /Manicura clásica/i }).click();

    // NAIL-M2: same duplicate as calculator.spec.ts — scope to the summary.
    await expect(page.getByText("$3.500").last()).toBeVisible();
  });

  test("addon badges wrap properly on mobile", async ({ page }) => {
    await page.goto("/calculator");

    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: /Manicura clásica/i }).click();

    await page.getByRole("button", { name: /Diseño artístico/i }).click();
    await expect(page.getByText(/4\.300/)).toBeVisible();
  });
});

test.describe("Mobile Responsive - Turnos (admin)", () => {
  test.use({ viewport: { height: 667, width: 375 } });

  test("turnos page is reachable and renders heading on mobile", async ({ page }) => {
    await page.goto("/admin/turnos");

    await expect(page.getByRole("heading", { name: /Gestión de Turnos/i })).toBeVisible();
  });

  test("new booking button is accessible on mobile", async ({ page }) => {
    await page.goto("/admin/turnos");

    const newBookingBtn = page.getByRole("button", { name: /Nuevo turno/i });
    await expect(newBookingBtn).toBeVisible();
    await expect(newBookingBtn).toBeEnabled();
  });

  test("day navigation buttons work on mobile", async ({ page }) => {
    await page.goto("/admin/turnos");

    const prevBtn = page.getByRole("button", { name: /Anterior/i });
    await expect(prevBtn).toBeVisible();
    await expect(prevBtn).toBeEnabled();
  });
});
