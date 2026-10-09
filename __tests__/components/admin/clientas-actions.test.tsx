import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AdminClientsPage from "@/app/admin/clientas/page";
import { useAppStore } from "@/stores/app-store";

// NAIL-L3: the ClientDetail "Agendar turno" and "Nueva cotización" buttons must
// do something real — navigate to the agenda with the client preselected and to
// the calculator with the client preloaded. No dead CTAs in a management view.

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => "/admin/clientas",
  useSearchParams: () => ({ get: () => null }),
}));

describe("AdminClientsPage — ClientDetail actions (NAIL-L3)", () => {
  beforeEach(() => {
    pushMock.mockClear();
    useAppStore.setState({
      clients: [],
      bookings: [],
      blockedSlots: [],
      quotes: [],
    });
  });

  it("navigates to the agenda with the client preselected on Agendar turno", async () => {
    const user = userEvent.setup();
    useAppStore.setState({
      clients: [
        {
          createdAt: "2026-01-05",
          id: "client-1",
          name: "María García",
          phone: "+54 9 11 1234-5678",
        },
      ],
    });
    render(<AdminClientsPage />);

    await user.click(await screen.findByText("María García"));
    await user.click(await screen.findByRole("button", { name: /Agendar turno/i }));

    expect(pushMock).toHaveBeenCalledWith("/admin/turnos?action=new&client=client-1");
  });

  it("navigates to the calculator with the client preselected on Nueva cotización", async () => {
    const user = userEvent.setup();
    useAppStore.setState({
      clients: [
        {
          createdAt: "2026-01-05",
          id: "client-1",
          name: "María García",
          phone: "+54 9 11 1234-5678",
        },
      ],
    });
    render(<AdminClientsPage />);

    await user.click(await screen.findByText("María García"));
    await user.click(await screen.findByRole("button", { name: /Nueva cotización/i }));

    expect(pushMock).toHaveBeenCalledWith("/admin/calculadora?client=client-1");
  });
});
