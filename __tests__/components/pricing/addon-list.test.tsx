import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { AddonList } from "@/components/pricing/addon-list";
import { usePricingStore } from "@/stores/pricing-store";

describe("AddonList", () => {
  beforeEach(() => {
    usePricingStore.setState({
      selectedServiceId: null,
      selectedAddonIds: [],
    });
  });

  it("shows message when no service selected", () => {
    render(<AddonList />);

    expect(screen.getByText("Primero seleccioná un servicio")).toBeInTheDocument();
  });

  it("renders addon badges when service is selected", () => {
    usePricingStore.setState({ selectedServiceId: "manicura" });
    render(<AddonList />);

    expect(screen.getByText(/Diseño artístico/)).toBeInTheDocument();
    expect(screen.getByText(/Decoración con piedras/)).toBeInTheDocument();
  });

  it("toggles addon on click", async () => {
    const user = userEvent.setup();
    usePricingStore.setState({ selectedServiceId: "manicura" });
    render(<AddonList />);

    await user.click(screen.getByText(/Diseño artístico/));

    const state = usePricingStore.getState();
    expect(state.selectedAddonIds).toContain("diseno");
  });

  it("removes addon when clicked again", async () => {
    const user = userEvent.setup();
    usePricingStore.setState({
      selectedServiceId: "manicura",
      selectedAddonIds: ["diseno"],
    });
    render(<AddonList />);

    await user.click(screen.getByText(/Diseño artístico/));

    const state = usePricingStore.getState();
    expect(state.selectedAddonIds).not.toContain("diseno");
  });

  it("allows multiple addons to be selected", async () => {
    const user = userEvent.setup();
    usePricingStore.setState({ selectedServiceId: "manicura" });
    render(<AddonList />);

    await user.click(screen.getByText(/Diseño artístico/));
    await user.click(screen.getByText(/Decoración con piedras/));

    const state = usePricingStore.getState();
    expect(state.selectedAddonIds).toHaveLength(2);
  });
});
