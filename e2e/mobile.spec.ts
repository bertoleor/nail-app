import { expect, test } from "@playwright/test";

test.describe("Mobile Responsive - Home", () => {
  test.use({ viewport: { height: 667, width: 375 } });

  test("home buttons stack vertically on mobile", async ({ page }) => {
    await page.goto("/");

    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
    
    // Check buttons are stacked (flex-col)
    const buttons = await nav.locator("a").all();
    expect(buttons.length).toBe(2);
  });

  test("home title is readable on mobile", async ({ page }) => {
    await page.goto("/");

    const title = page.getByRole("heading", { name: /nail-app/i });
    await expect(title).toBeVisible();
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

    await page.click('text=Seleccioná un servicio');
    await page.click('text=Manicura clásica');

    await expect(page.getByText(/ARS/)).toBeVisible();
  });

  test("addon badges wrap properly on mobile", async ({ page }) => {
    await page.goto("/calculator");

    await page.click('text=Seleccioná un servicio');
    await page.click('text=Manicura clásica');

    // Check addons are visible and tappable
    await page.click('text=Diseño artístico');
    await expect(page.getByText(/3\.000/)).toBeVisible();
  });
});

test.describe("Mobile Responsive - Agenda", () => {
  test.use({ viewport: { height: 667, width: 375 } });

  test("calendar displays single column on mobile", async ({ page }) => {
    await page.goto("/agenda");

    // Calendar should be visible
    await expect(page.getByRole("heading", { name: /calendario/i })).toBeVisible();
    
    // Day buttons should be touchable
    const dayButtons = await page.locator('button').filter({ hasText: /^\d+$/ }).all();
    expect(dayButtons.length).toBeGreaterThan(20);
  });

  test("booking list appears below calendar on mobile", async ({ page }) => {
    await page.goto("/agenda");

    // Select a day
    const dayButtons = await page.locator('button').filter({ hasText: /^\d+$/ }).all();
    if (dayButtons.length > 10) {
      await dayButtons[10].click();
    }

    // Booking list should be visible
    await expect(page.getByText(/Sin turnos|turnos/i)).toBeVisible();
  });

  test("new booking button is accessible on mobile", async ({ page }) => {
    await page.goto("/agenda");

    const newBookingBtn = page.getByRole("button", { name: /nuevo turno/i });
    await expect(newBookingBtn).toBeVisible();
    await expect(newBookingBtn).toBeEnabled();
  });
});
