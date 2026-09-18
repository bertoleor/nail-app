"use client";

import { Badge } from "@/components/ui/badge";
import { ADDONS } from "@/lib/domain/pricing";
import { usePricingStore } from "@/stores/pricing-store";

export function AddonList() {
  const selectedServiceId = usePricingStore((state) => state.selectedServiceId);
  const selectedAddonIds = usePricingStore((state) => state.selectedAddonIds);
  const toggleAddon = usePricingStore((state) => state.toggleAddon);

  if (!selectedServiceId) {
    return (
      <div className="text-sm text-[rgba(15,15,20,0.45)] italic">
        Primero seleccioná un servicio
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="text-xs font-medium uppercase tracking-wider text-[rgba(15,15,20,0.5)]">
        Extras
      </label>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {ADDONS.map((addon) => {
          const isSelected = selectedAddonIds.includes(addon.id);
          return (
            <button
              aria-pressed={isSelected}
              className={`touch-manipulation ${isSelected ? "outline outline-2 outline-offset-2 outline-primary rounded-full" : ""}`}
              key={addon.id}
              onClick={() => { toggleAddon(addon.id); }}
              type="button"
            >
              <Badge className="text-xs sm:text-sm whitespace-nowrap" variant={isSelected ? "success" : "default"}>
                {addon.name} — ARS {addon.price}
              </Badge>
            </button>
          );
        })}
      </div>
    </div>
  );
}
