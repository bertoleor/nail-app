import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { NewBookingDialog } from "@/components/admin/new-booking-dialog";
import type { Booking } from "@/lib/mock/data";
import { useAppStore } from "@/stores/app-store";

// NAIL-L3: the admin "Nuevo turno" CTA must open a real booking dialog that
// persists to the store (addBooking) and validates availability through the
// domain gate (checkAvailability) before confirming.

const DIALOG_DATE = "2026-10-15";

const existingBooking = (overrides: Partial<Booking>): Booking => ({
  addonIds: [],
  clientId: "client-1",
  createdAt: "2026-10-01T00:00:00.000Z",
  date: DIALOG_DATE,
  duration: 60,
  id: "booking-existing",
  serviceId: "manicura",
  startTime: "10:00",
  status: "confirmed",
  totalPrice: 3500,
  type: "new",
  ...overrides,
});

function renderDialog(defaultClientId?: string) {
  const onOpenChange = vi.fn();
  render(
    <NewBookingDialog
      defaultClientId={defaultClientId}
      defaultDate={DIALOG_DATE}
      onOpenChange={onOpenChange}
      open
    />,
  );
  return onOpenChange;
}

async function selectClient(user: ReturnType<typeof userEvent.setup>, label: string) {
  await user.click(screen.getByRole("combobox", { name: "Cliente" }));
  await user.click(screen.getByRole("option", { name: label }));
}

async function selectService(user: ReturnType<typeof userEvent.setup>, label: string) {
  await user.click(screen.getByRole("combobox", { name: "Servicio" }));
  await user.click(screen.getByRole("option", { name: label }));
}

describe("NewBookingDialog (NAIL-L3)", () => {
  beforeEach(() => {
    useAppStore.setState({
      clients: [],
      bookings: [],
      blockedSlots: [],
      quotes: [],
    });
  });

  it("renders the dialog with the form fields", () => {
    renderDialog();

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Nuevo turno")).toBeInTheDocument();
    expect(within(dialog).getByRole("combobox", { name: "Cliente" })).toBeInTheDocument();
    expect(within(dialog).getByRole("combobox", { name: "Servicio" })).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Guardar turno" })).toBeInTheDocument();
  });

  it("shows the preselected client in the client combobox", () => {
    renderDialog("client-2");

    expect(screen.getByText("Carolina López")).toBeInTheDocument();
  });

  it("adds a confirmed booking to the store on save", async () => {
    const user = userEvent.setup();
    const onOpenChange = renderDialog();

    await selectClient(user, "María García");
    await selectService(user, "Manicura clásica");
    // 15-a11y: el nombre accesible del toggle incluye precio+duración (sin aria-label truncante)
    await user.click(screen.getByRole("button", { name: /^Nuevo( |$)/ }));
    await user.click(screen.getByRole("button", { name: "09:00" }));
    await user.click(screen.getByRole("button", { name: "Guardar turno" }));

    const bookings = useAppStore.getState().bookings;
    expect(bookings).toHaveLength(1);
    expect(bookings[0].status).toBe("confirmed");
    expect(bookings[0].clientId).toBe("client-1");
    expect(bookings[0].serviceId).toBe("manicura");
    expect(bookings[0].type).toBe("new");
    expect(bookings[0].date).toBe(DIALOG_DATE);
    expect(bookings[0].startTime).toBe("09:00");
    expect(bookings[0].totalPrice).toBe(3500);
    expect(bookings[0].duration).toBe(60);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("shows price and duration summary for the selected service", async () => {
    const user = userEvent.setup();
    renderDialog();

    await selectService(user, "Manicura clásica");

    // The price appears in both the type-selector cards and the summary
    // badge — same duplicate-match pattern the calculator e2e scoped with
    // .last(); here the summary is the last match in DOM order.
    const priceNodes = screen.getAllByText(/\$3\.500/);
    const summaryPrice = priceNodes[priceNodes.length - 1];
    expect(summaryPrice).toBeInTheDocument();
    // The summary line is the only one with the "·" separator pattern.
    expect(screen.getByText(/· 60 min/)).toBeInTheDocument();
  });

  it("rejects a slot that conflicts with an existing booking", async () => {
    const user = userEvent.setup();
    useAppStore.setState({
      bookings: [existingBooking({ startTime: "10:00", duration: 60 })],
    });
    renderDialog();

    await selectService(user, "Manicura clásica");
    await user.click(screen.getByRole("button", { name: "10:00" }));
    await user.click(screen.getByRole("button", { name: "Guardar turno" }));

    expect(screen.getByText(/ya hay un turno/i)).toBeInTheDocument();
    expect(useAppStore.getState().bookings).toHaveLength(1);
  });

  it("rejects a slot that overlaps a blocked range", async () => {
    const user = userEvent.setup();
    useAppStore.setState({
      blockedSlots: [
        {
          date: DIALOG_DATE,
          endTime: "12:00",
          id: "blocked-test",
          reason: "Curso",
          startTime: "09:00",
        },
      ],
    });
    renderDialog();

    await selectService(user, "Manicura clásica");
    await user.click(screen.getByRole("button", { name: "09:00" }));
    await user.click(screen.getByRole("button", { name: "Guardar turno" }));

    expect(screen.getByText(/bloqueado/i)).toBeInTheDocument();
    expect(useAppStore.getState().bookings).toHaveLength(0);
  });

  it("rejects a session that ends after closing time", async () => {
    const user = userEvent.setup();
    renderDialog();

    // Uñas acrílicas (new) = 120 min. Starting 18:30 ends 20:30 > 19:00 closing.
    await selectService(user, "Uñas acrílicas");
    await user.click(screen.getByRole("button", { name: "18:30" }));
    await user.click(screen.getByRole("button", { name: "Guardar turno" }));

    expect(screen.getByText(/horario de atenci/i)).toBeInTheDocument();
    expect(useAppStore.getState().bookings).toHaveLength(0);
  });

  it("disables save until client, service and hour are chosen", async () => {
    const user = userEvent.setup();
    renderDialog();

    const save = screen.getByRole("button", { name: "Guardar turno" });
    expect(save).toBeDisabled();

    await selectClient(user, "María García");
    await selectService(user, "Manicura clásica");
    expect(save).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "09:00" }));
    expect(save).toBeEnabled();
  });
});
