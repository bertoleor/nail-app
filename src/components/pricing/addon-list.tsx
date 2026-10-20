"use client";

import { Badge } from "@/components/ui/badge";
import { ADDONS, formatPrice } from "@/lib/domain/pricing";
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
    <div
      aria-labelledby="addons-group-label"
      className="space-y-3"
      role="group"
    >
      <label
        className="text-xs font-medium tracking-wider text-[rgba(15,15,20,0.5)] uppercase"
        id="addons-group-label"
      >
        Extras
      </label>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {ADDONS.map((addon) => {
          const isSelected = selectedAddonIds.includes(addon.id);
          return (
            <button
              aria-pressed={isSelected}
              className={`touch-manipulation ${isSelected ? "outline-primary rounded-full outline outline-2 outline-offset-2" : ""}`}
              key={addon.id}
              onClick={() => {
                toggleAddon(addon.id);
              }}
              type="button"
            >
              <Badge
                className="text-xs whitespace-nowrap sm:text-sm"
                variant={isSelected ? "success" : "default"}
              >
                {addon.name} — {formatPrice(addon.price)}
              </Badge>
            </button>
          );
        })}
      </div>
    </div>
  );
}
