import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { ServiceSelect } from "@/components/pricing/service-select";
import { usePricingStore } from "@/stores/pricing-store";

describe("ServiceSelect", () => {
  beforeEach(() => {
    usePricingStore.setState({
      selectedServiceId: null,
      selectedAddonIds: [],
    });
  });

  it("renders label", () => {
    render(<ServiceSelect />);

    expect(screen.getByText("Servicio")).toBeInTheDocument();
  });

  it("renders select trigger with placeholder", () => {
    render(<ServiceSelect />);

    expect(screen.getByText("Seleccioná un servicio")).toBeInTheDocument();
  });

  it("displays all services in dropdown", async () => {
    const user = userEvent.setup();
    render(<ServiceSelect />);

    await user.click(screen.getByRole("combobox"));

    expect(screen.getByText("Manicura clásica")).toBeInTheDocument();
    expect(screen.getByText("Pedicura completa")).toBeInTheDocument();
    expect(screen.getByText("Uñas acrílicas")).toBeInTheDocument();
  });

  it("updates store when service is selected", async () => {
    const user = userEvent.setup();
    render(<ServiceSelect />);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Manicura clásica"));

    const state = usePricingStore.getState();
    expect(state.selectedServiceId).toBe("manicura");
  });

  it("shows selected service in trigger", async () => {
    const user = userEvent.setup();
    render(<ServiceSelect />);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Pedicura completa"));

    expect(screen.getByRole("combobox")).toHaveTextContent("Pedicura completa");
  });
});
