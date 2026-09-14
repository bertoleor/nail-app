import { create } from "zustand";

import { ADDONS, SERVICES, type ServiceType } from "@/lib/domain/pricing";

interface PricingState {
  readonly reset: () => void;
  readonly selectedAddonIds: readonly string[];

  readonly selectedServiceId: null | string;
  readonly selectedServiceType: ServiceType;
  readonly selectService: (id: string) => void;
  readonly selectServiceType: (type: ServiceType) => void;
  readonly toggleAddon: (id: string) => void;
}

export const usePricingStore = create<PricingState>((set) => ({
  reset: () =>
    { set({
      selectedAddonIds: [],
      selectedServiceId: null,
      selectedServiceType: "new",
    }); },
  selectedAddonIds: [],

  selectedServiceId: null,
  selectedServiceType: "new",

  selectService: (id: string) =>
    { set({
      selectedAddonIds: [],
      selectedServiceId: id,
    }); },

  selectServiceType: (type: ServiceType) =>
    { set({ selectedServiceType: type }); },

  toggleAddon: (id: string) =>
    { set((state) => {
      const isSelected = state.selectedAddonIds.includes(id);
      return {
        selectedAddonIds: isSelected
          ? state.selectedAddonIds.filter((a) => a !== id)
          : [...state.selectedAddonIds, id],
      };
    }); },
}));

export function getSelectedAddons(state: PricingState) {
  return ADDONS.filter((a) => state.selectedAddonIds.includes(a.id));
}

export function getSelectedService(state: PricingState) {
  return SERVICES.find((s) => s.id === state.selectedServiceId) ?? null;
}