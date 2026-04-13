import { create } from "zustand";

import { ADDONS, SERVICES } from "@/lib/domain/pricing";

interface PricingState {
  readonly selectedServiceId: string | null;
  readonly selectedAddonIds: readonly string[];

  selectService: (id: string) => void;
  toggleAddon: (id: string) => void;
  reset: () => void;
}

export const usePricingStore = create<PricingState>((set) => ({
  selectedServiceId: null,
  selectedAddonIds: [],

  selectService: (id: string) =>
    set({
      selectedServiceId: id,
      selectedAddonIds: [],
    }),

  toggleAddon: (id: string) =>
    set((state) => {
      const isSelected = state.selectedAddonIds.includes(id);
      return {
        selectedAddonIds: isSelected
          ? state.selectedAddonIds.filter((a) => a !== id)
          : [...state.selectedAddonIds, id],
      };
    }),

  reset: () =>
    set({
      selectedServiceId: null,
      selectedAddonIds: [],
    }),
}));

export function getSelectedService(state: PricingState) {
  return SERVICES.find((s) => s.id === state.selectedServiceId) ?? null;
}

export function getSelectedAddons(state: PricingState) {
  return ADDONS.filter((a) => state.selectedAddonIds.includes(a.id));
}
