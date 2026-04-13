import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { CalculatorForm } from "@/components/pricing/calculator-form";
import { usePricingStore } from "@/stores/pricing-store";

describe("CalculatorForm", () => {
  beforeEach(() => {
    usePricingStore.setState({
      selectedServiceId: null,
      selectedAddonIds: [],
    });
  });

  it("renders form title", () => {
    render(<CalculatorForm />);

    expect(screen.getByText("Calculadora de Precios")).toBeInTheDocument();
  });

  it("renders service select", () => {
    render(<CalculatorForm />);

    expect(screen.getByText("Servicio")).toBeInTheDocument();
  });

  it("renders addon list when service selected", () => {
    usePricingStore.setState({ selectedServiceId: "manicura" });
    render(<CalculatorForm />);

    expect(screen.getByText("Extras")).toBeInTheDocument();
  });

  it("renders all form sections", () => {
    usePricingStore.setState({ selectedServiceId: "manicura" });
    render(<CalculatorForm />);

    expect(screen.getByText("Servicio")).toBeInTheDocument();
    expect(screen.getByText("Extras")).toBeInTheDocument();
  });

  it("does not show price summary when no service selected", () => {
    render(<CalculatorForm />);

    expect(screen.queryByText("Total")).not.toBeInTheDocument();
  });

  it("shows price summary when service is selected", () => {
    usePricingStore.setState({ selectedServiceId: "manicura" });
    render(<CalculatorForm />);

    expect(screen.getByText("Total")).toBeInTheDocument();
  });
});
