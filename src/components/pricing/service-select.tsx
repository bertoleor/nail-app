"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SERVICE_TYPE_LABELS } from "@/lib/content";
import { SERVICES, type ServiceType, formatPrice } from "@/lib/domain/pricing";
import { usePricingStore } from "@/stores/pricing-store";

export function ServiceSelect() {
  const selectedServiceId = usePricingStore((state) => state.selectedServiceId);
  const selectedServiceType = usePricingStore((state) => state.selectedServiceType);
  const selectService = usePricingStore((state) => state.selectService);
  const selectServiceType = usePricingStore((state) => state.selectServiceType);

  const selectedService = SERVICES.find((s) => s.id === selectedServiceId);
  const basePrice = selectedService
    ? selectedServiceType === "new"
      ? selectedService.basePriceNew
      : selectedService.basePriceMaintenance
    : null;
  const duration = selectedService
    ? selectedServiceType === "new"
      ? selectedService.durationNew
      : selectedService.durationMaintenance
    : null;

  return (
    <div className="space-y-2">
      <label
        className="text-xs font-medium tracking-wider text-[rgba(15,15,20,0.5)] uppercase"
        htmlFor="service-select"
      >
        Servicio
      </label>
      <Select
        onValueChange={selectService}
        value={selectedServiceId ?? ""}
      >
        <SelectTrigger id="service-select">
          <SelectValue placeholder="Seleccioná un servicio" />
        </SelectTrigger>
        <SelectContent>
          {SERVICES.map((service) => (
            <SelectItem
              key={service.id}
              value={service.id}
            >
              {service.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedService && (
        <div
          aria-label="Tipo de sesión"
          className="grid grid-cols-2 gap-2 pt-2"
          role="group"
        >
          <button
            aria-pressed={selectedServiceType === "new"}
            className={`rounded-xl border-2 p-3 text-center transition-all ${
              selectedServiceType === "new"
                ? "border-primary bg-primary/10"
                : "hover:border-primary/30 border-gray-200"
            }`}
            onClick={() => {
              selectServiceType("new");
            }}
            type="button"
          >
            <p className="text-sm font-medium">{SERVICE_TYPE_LABELS.new}</p>
            {basePrice !== null && (
              <p className="text-xs text-[rgba(15,15,20,0.5)]">
                {formatPrice(basePrice)} · {duration} min
              </p>
            )}
          </button>
          <button
            aria-pressed={selectedServiceType === "maintenance"}
            className={`rounded-xl border-2 p-3 text-center transition-all ${
              selectedServiceType === "maintenance"
                ? "border-primary bg-primary/10"
                : "hover:border-primary/30 border-gray-200"
            }`}
            onClick={() => {
              selectServiceType("maintenance" as ServiceType);
            }}
            type="button"
          >
            <p className="text-sm font-medium">{SERVICE_TYPE_LABELS.maintenance}</p>
            {selectedService && (
              <p className="text-xs text-[rgba(15,15,20,0.5)]">
                {formatPrice(selectedService.basePriceMaintenance)} ·{" "}
                {selectedService.durationMaintenance} min
              </p>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
