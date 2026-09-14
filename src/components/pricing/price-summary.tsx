"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  ADDONS,
  calculateDuration,
  calculatePrice,
  formatDuration,
  formatPrice,
  SERVICES,
} from "@/lib/domain/pricing";
import { usePricingStore } from "@/stores/pricing-store";

export function PriceSummary() {
  const selectedServiceId = usePricingStore((state) => state.selectedServiceId);
  const selectedAddonIds = usePricingStore((state) => state.selectedAddonIds);
  const selectedServiceType = usePricingStore((state) => state.selectedServiceType);

  if (!selectedServiceId) {
    return null;
  }

  const service = SERVICES.find((s) => s.id === selectedServiceId);
  if (!service) {return null;}

  const selectedAddons = ADDONS.filter((a) => selectedAddonIds.includes(a.id));
  const totalPrice = calculatePrice(service, selectedAddons, selectedServiceType);
  const totalDuration = calculateDuration(service, selectedAddons, selectedServiceType);

  return (
    <Card className="mt-6">
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-[rgba(15,15,20,0.6)]">Total</span>
          <span className="text-2xl font-light text-[rgba(15,15,20,0.9)]">
            {formatPrice(totalPrice)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-[rgba(15,15,20,0.6)]">Duración</span>
          <span className="text-sm text-[rgba(15,15,20,0.8)]">
            {formatDuration(totalDuration)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}