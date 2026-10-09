import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AdminBookingsPage from "@/app/admin/turnos/page";
import { useAppStore } from "@/stores/app-store";

// NAIL-L3: the header "Nuevo turno" button must open the booking dialog
// (not be a dead placeholder), and the dashboard link ?action=new must reach it.
// ?client=<id> preselects the client (used by the clientas detail actions).

const pushMock = vi.fn();
const searchParamsMock: Record<string, string> = {};

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => "/admin/turnos",
  useSearchParams: () => ({
    get: (key: string) => searchParamsMock[key] ?? null,
  }),
}));

describe("AdminBookingsPage — Nuevo turno CTA (NAIL-L3)", () => {
  beforeEach(() => {
    pushMock.mockClear();
    Object.keys(searchParamsMock).forEach((key) => {
      delete searchParamsMock[key];
    });
    useAppStore.setState({
      clients: [],
      bookings: [],
      blockedSlots: [],
      quotes: [],
    });
  });

  it("renders the Nuevo turno button enabled (contract with mobile e2e)", () => {
    render(<AdminBookingsPage />);

    const button = screen.getByRole("button", { name: /Nuevo turno/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  it("opens the booking dialog on click", async () => {
    const user = userEvent.setup();
    render(<AdminBookingsPage />);

    await user.click(screen.getByRole("button", { name: /Nuevo turno/i }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/Cliente/i)).toBeInTheDocument();
  });

  it("?action=new opens the booking dialog on load (dashboard quick action)", async () => {
    searchParamsMock.action = "new";
    render(<AdminBookingsPage />);

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("?action=new&client=<id> opens the dialog with the client preselected", async () => {
    searchParamsMock.action = "new";
    searchParamsMock.client = "client-2";
    render(<AdminBookingsPage />);

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Carolina López")).toBeInTheDocument();
  });
});
