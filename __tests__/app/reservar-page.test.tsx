import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ClientBookingPage } from "@/app/(client)/reservar/page";
import type { Booking } from "@/lib/mock/data";
import { useAppStore } from "@/stores/app-store";

// NAIL-H3: /reservar wizard must persist the booking to the store AND validate
// availability (conflict/blocked/hours) BEFORE showing any confirmation.

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => "/reservar",
  useSearchParams: () => ({ get: () => null }),
}));

const existingBooking = (overrides: Partial<Booking>): Booking => ({
  addonIds: [],
  clientId: "client-1",
  createdAt: "2026-10-01T00:00:00.000Z",
  date: "2026-10-15",
  duration: 60,
  id: "booking-existing",
  serviceId: "manicura",
  startTime: "14:00",
  status: "confirmed",
  totalPrice: 3500,
  type: "new",
  ...overrides,
});

async function completeWizard(user: ReturnType<typeof userEvent.setup>) {
  // Step 1: client data
  await user.type(screen.getByLabelText(/nombre completo/i), "María García");
  await user.type(screen.getByLabelText(/whatsapp/i), "+54 9 11 1234-5678");
  await user.click(screen.getByRole("button", { name: "Continuar" }));

  // Step 2: service + type
  await user.click(screen.getByRole("button", { name: /esmaltado semipermanente/i }));
  await user.click(screen.getByRole("button", { name: /^Nuevo$/ }));
  await user.click(screen.getByRole("button", { name: "Continuar" }));

  // Step 3: schedule
  await user.type(screen.getByLabelText(/fecha/i), "2026-10-15");
  await user.click(screen.getByRole("button", { name: "15:00" }));
}

describe("ClientBookingPage /reservar (NAIL-H3)", () => {
  beforeEach(() => {
    useAppStore.setState({
      bookings: [],
      blockedSlots: [],
      clients: [],
      quotes: [],
    });
  });

  it("persists the booking to useAppStore on submit", async () => {
    const user = userEvent.setup();
    render(<ClientBookingPage />);

    await completeWizard(user);
    await user.click(screen.getByRole("button", { name: /reservar turno/i }));

    await waitFor(() => {
      expect(useAppStore.getState().bookings).toHaveLength(1);
    });
    const saved = useAppStore.getState().bookings[0];
    expect(saved.serviceId).toBe("esmaltado");
    expect(saved.date).toBe("2026-10-15");
    expect(saved.startTime).toBe("15:00");
    expect(saved.status).toBe("pending");
  });

  it("blocks submission and shows error when the slot conflicts with an existing booking", async () => {
    useAppStore.setState({
      bookings: [existingBooking({ startTime: "14:30", duration: 60 })],
    });

    const user = userEvent.setup();
    render(<ClientBookingPage />);

    await completeWizard(user);
    await user.click(screen.getByRole("button", { name: /reservar turno/i }));

    await waitFor(() => {
      expect(screen.getByText(/horario no disponible/i)).toBeInTheDocument();
    });
    // no booking persisted, no success dialog
    expect(useAppStore.getState().bookings).toHaveLength(1);
    expect(screen.queryByText(/reserva enviada/i)).not.toBeInTheDocument();
  });

  it("blocks submission when the slot falls inside a blocked slot", async () => {
    useAppStore.setState({
      blockedSlots: [
        {
          date: "2026-10-15",
          endTime: "17:00",
          id: "blocked-1",
          reason: "Curso",
          startTime: "15:00",
        },
      ],
    });

    const user = userEvent.setup();
    render(<ClientBookingPage />);

    await completeWizard(user);
    await user.click(screen.getByRole("button", { name: /reservar turno/i }));

    await waitFor(() => {
      expect(screen.getByText(/horario no disponible/i)).toBeInTheDocument();
    });
    expect(useAppStore.getState().bookings).toHaveLength(0);
    expect(screen.queryByText(/reserva enviada/i)).not.toBeInTheDocument();
  });

  it("persists the client to useAppStore on submit", async () => {
    const user = userEvent.setup();
    render(<ClientBookingPage />);

    await completeWizard(user);
    await user.click(screen.getByRole("button", { name: /reservar turno/i }));

    await waitFor(() => {
      expect(useAppStore.getState().clients).toHaveLength(1);
    });
    const savedClient = useAppStore.getState().clients[0];
    expect(savedClient.name).toBe("María García");
    expect(savedClient.phone).toBe("+54 9 11 1234-5678");
  });

  it("keeps the WhatsApp flow intact after a successful booking", async () => {
    const user = userEvent.setup();
    render(<ClientBookingPage />);

    await completeWizard(user);
    await user.click(screen.getByRole("button", { name: /reservar turno/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /enviar por whatsapp/i })).toBeInTheDocument();
    });
  });
});
