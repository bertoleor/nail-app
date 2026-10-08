import { beforeEach, describe, expect, it } from "vitest";

import { ADDONS, SERVICES } from "@/lib/domain/pricing";
import { usePricingStore } from "@/stores/pricing-store";

describe("Pricing Store", () => {
  beforeEach(() => {
    usePricingStore.setState({
      selectedServiceId: null,
      selectedAddonIds: [],
    });
  });

  describe("initial state", () => {
    it("has null selectedServiceId", () => {
      const state = usePricingStore.getState();
      expect(state.selectedServiceId).toBeNull();
    });

    it("has empty selectedAddonIds", () => {
      const state = usePricingStore.getState();
      expect(state.selectedAddonIds).toEqual([]);
    });
  });

  describe("selectService", () => {
    it("sets selectedServiceId", () => {
      const { selectService } = usePricingStore.getState();
      selectService("manicura");

      const state = usePricingStore.getState();
      expect(state.selectedServiceId).toBe("manicura");
    });

    it("clears addons when changing service", () => {
      const { selectService, toggleAddon } = usePricingStore.getState();
      selectService("manicura");
      toggleAddon("diseno");
      selectService("pedicura");

      const state = usePricingStore.getState();
      expect(state.selectedAddonIds).toEqual([]);
    });
  });

  describe("toggleAddon", () => {
    it("adds addon when not selected", () => {
      const { selectService, toggleAddon } = usePricingStore.getState();
      selectService("manicura");
      toggleAddon("diseno");

      const state = usePricingStore.getState();
      expect(state.selectedAddonIds).toContain("diseno");
    });

    it("removes addon when already selected", () => {
      const { selectService, toggleAddon } = usePricingStore.getState();
      selectService("manicura");
      toggleAddon("diseno");
      toggleAddon("diseno");

      const state = usePricingStore.getState();
      expect(state.selectedAddonIds).not.toContain("diseno");
    });

    it("allows multiple addons", () => {
      const { selectService, toggleAddon } = usePricingStore.getState();
      selectService("manicura");
      toggleAddon("diseno");
      toggleAddon("decoracion");

      const state = usePricingStore.getState();
      expect(state.selectedAddonIds).toHaveLength(2);
    });
  });

  describe("reset", () => {
    it("clears all selections", () => {
      const { selectService, toggleAddon, reset } = usePricingStore.getState();
      selectService("manicura");
      toggleAddon("diseno");
      reset();

      const state = usePricingStore.getState();
      expect(state.selectedServiceId).toBeNull();
      expect(state.selectedAddonIds).toEqual([]);
    });
  });

  describe("computed values", () => {
    it("returns selected service", () => {
      const { selectService } = usePricingStore.getState();
      selectService("manicura");

      const state = usePricingStore.getState();
      const service = SERVICES.find((s) => s.id === state.selectedServiceId);

      expect(service?.name).toBe("Manicura clásica");
    });

    it("returns selected addons", () => {
      const { selectService, toggleAddon } = usePricingStore.getState();
      selectService("manicura");
      toggleAddon("diseno");
      toggleAddon("decoracion");

      const state = usePricingStore.getState();
      const addons = ADDONS.filter((a) => state.selectedAddonIds.includes(a.id));

      expect(addons).toHaveLength(2);
    });
  });
});
