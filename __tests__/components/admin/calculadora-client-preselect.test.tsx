import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AdminCalculatorPage from "@/app/admin/calculadora/page";

// NAIL-L3: ?client=<id> preloads the client in the calculator so the
// clientas "Nueva cotización" action lands on a useful state.

const searchParamsMock: Record<string, string> = {};

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => "/admin/calculadora",
  useSearchParams: () => ({
    get: (key: string) => searchParamsMock[key] ?? null,
  }),
}));

describe("AdminCalculatorPage — ?client preselection (NAIL-L3)", () => {
  beforeEach(() => {
    Object.keys(searchParamsMock).forEach((key) => {
      delete searchParamsMock[key];
    });
  });

  it("preloads client name and phone from ?client=<id>", () => {
    searchParamsMock.client = "client-1";
    render(<AdminCalculatorPage />);

    expect(screen.getByDisplayValue("María García")).toBeInTheDocument();
    expect(screen.getByDisplayValue("+54 9 11 1234-5678")).toBeInTheDocument();
  });

  it("does not preload anything without ?client", () => {
    render(<AdminCalculatorPage />);

    expect(screen.queryByDisplayValue("María García")).not.toBeInTheDocument();
  });
});
