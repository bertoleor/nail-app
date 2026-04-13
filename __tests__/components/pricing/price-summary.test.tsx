import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { PriceSummary } from "@/components/pricing/price-summary";
import { usePricingStore } from "@/stores/pricing-store";

describe("PriceSummary", () => {
  beforeEach(() => {
    usePricingStore.setState({
      selectedServiceId: null,
      selectedAddonIds: [],
    });
  });

  it("returns null when no service selected", () => {
    const { container } = render(<PriceSummary />);

    expect(container.firstChild).toBeNull();
  });

  it("displays base price when service selected", () => {
    usePricingStore.setState({ selectedServiceId: "manicura" });
    render(<PriceSummary />);

    expect(screen.getByText(/ARS/)).toBeInTheDocument();
    expect(screen.getByText(/2\.500/)).toBeInTheDocument();
  });

  it("displays duration", () => {
    usePricingStore.setState({ selectedServiceId: "manicura" });
    render(<PriceSummary />);

    expect(screen.getByText(/60 minutos/)).toBeInTheDocument();
  });

  it("shows total with addons", () => {
    usePricingStore.setState({
      selectedServiceId: "manicura",
      selectedAddonIds: ["diseno"],
    });
    render(<PriceSummary />);

    expect(screen.getByText(/3\.000/)).toBeInTheDocument();
  });

  it("shows updated duration with addons", () => {
    usePricingStore.setState({
      selectedServiceId: "manicura",
      selectedAddonIds: ["diseno", "decoracion"],
    });
    render(<PriceSummary />);

    expect(screen.getByText(/95 minutos/)).toBeInTheDocument();
  });

  it("renders in a Card component", () => {
    usePricingStore.setState({ selectedServiceId: "manicura" });
    render(<PriceSummary />);

    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("Duración")).toBeInTheDocument();
  });
});
