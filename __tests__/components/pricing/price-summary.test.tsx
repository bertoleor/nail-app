import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { PriceSummary } from "@/components/pricing/price-summary";
import { usePricingStore } from "@/stores/pricing-store";

describe("PriceSummary", () => {
  beforeEach(() => {
    usePricingStore.setState({
      selectedServiceId: null,
      selectedAddonIds: [],
      selectedServiceType: "new",
    });
  });

  it("returns null when no service selected", () => {
    const { container } = render(<PriceSummary />);

    expect(container.firstChild).toBeNull();
  });

  it("displays base price when service selected", () => {
    usePricingStore.setState({ selectedServiceId: "manicura" });
    render(<PriceSummary />);

    expect(screen.getByText(/\$/)).toBeInTheDocument();
    expect(screen.getByText(/3\.500/)).toBeInTheDocument();
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

    expect(screen.getByText(/4\.300/)).toBeInTheDocument();
  });

  it("shows updated duration with addons", () => {
    usePricingStore.setState({
      selectedServiceId: "manicura",
      selectedAddonIds: ["diseno", "decoracion"],
    });
    render(<PriceSummary />);

    expect(screen.getByText(/105 minutos/)).toBeInTheDocument();
  });

  it("renders in a Card component", () => {
    usePricingStore.setState({ selectedServiceId: "manicura" });
    render(<PriceSummary />);

    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("Duración")).toBeInTheDocument();
  });
});
