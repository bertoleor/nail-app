import { expect, test } from "@playwright/test";

/**
 * 15-a11y (deuda §5, item 15-a11y): el wizard /reservar debe ser operable al
 * 100% por teclado. Complementa a11y-axe.spec.ts — axe no prueba interacción,
 * así que acá se ejercita el flujo real: Tab/Enter avanzan los pasos, el foco
 * no se pierde al cambiar de paso (el título del paso lo recibe) y Escape
 * cierra el diálogo de éxito.
 *
 * El input de fecha se completa con fill(): es un control nativo del browser
 * (picker propio, teclado garantizado por la UA); lo que se prueba acá es la
 * operabilidad por teclado de los controles CUSTOM de la app.
 */
test.describe("reservar · wizard operable solo con teclado", () => {
  test("Tab + Enter completan los pasos y Escape cierra el diálogo de éxito", async ({ page }) => {
    await page.goto("/reservar");

    // Paso 1: foco explícito en el primer campo, escritura por teclado
    const nameInput = page.getByLabel("Nombre completo *");
    await nameInput.focus();
    await page.keyboard.type("María García");

    const phoneInput = page.getByLabel("WhatsApp *");
    await phoneInput.focus();
    await page.keyboard.type("+54 9 11 1234-5678");

    // Enter dentro del form del paso 1 avanza al paso 2
    await page.keyboard.press("Enter");

    const serviceHeading = page.getByRole("heading", { name: "Elegí tu servicio" });
    await expect(serviceHeading).toBeVisible();
    // El foco no se pierde al cambiar de paso (WCAG 2.4.3)
    await expect(serviceHeading).toBeFocused();

    // Paso 2: servicio, tipo y avance solo con teclado
    const serviceButton = page.getByRole("button", { name: /Manicura clásica/i });
    await serviceButton.focus();
    await page.keyboard.press("Enter");
    await expect(serviceButton).toHaveAttribute("aria-pressed", "true");

    const typeButton = page.getByRole("button", { name: /^Nuevo( |$)/ });
    await typeButton.focus();
    await page.keyboard.press("Enter");
    await expect(typeButton).toHaveAttribute("aria-pressed", "true");

    const continueButton = page.getByRole("button", { name: "Continuar" });
    await continueButton.focus();
    await page.keyboard.press("Enter");

    // Paso 3: foco en el título del paso activo
    const scheduleHeading = page.getByRole("heading", { name: "Elegí fecha y horario" });
    await expect(scheduleHeading).toBeFocused();

    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const dateInput = page.getByLabel("Fecha *");
    await dateInput.fill(tomorrow);

    const hourButton = page.getByRole("button", { name: "15:00" });
    await hourButton.focus();
    await page.keyboard.press("Enter");
    await expect(hourButton).toHaveAttribute("aria-pressed", "true");

    // Enter en el botón principal registra el turno
    const submitButton = page.getByRole("button", { name: /Reservar turno/i });
    await submitButton.focus();
    await page.keyboard.press("Enter");

    // Diálogo de éxito con foco atrapado; Escape lo cierra
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("¡Reserva registrada!");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });
});
