import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AdminServicesPage from "@/app/admin/servicios/page";

// NAIL-L3: "Nuevo servicio" has no backing mutation path — SERVICES is a
// read-only domain constant (no addService action exists in any store).
// The acceptance explicitly allows marking it as a future feature instead of
// shipping a dead CTA, so the button must be disabled with an honest hint.

describe("AdminServicesPage — Nuevo servicio CTA (NAIL-L3)", () => {
  it("renders the button disabled with a Próximamente badge", () => {
    render(<AdminServicesPage />);

    const button = screen.getByRole("button", { name: /Nuevo servicio/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
    expect(screen.getByText(/próximamente/i)).toBeInTheDocument();
  });

  it("keeps the catalog rendering read-only", () => {
    render(<AdminServicesPage />);

    expect(screen.getByText("Manicura clásica")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });
});
