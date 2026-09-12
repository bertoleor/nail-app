"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SERVICES } from "@/lib/domain/pricing";
import { usePricingStore } from "@/stores/pricing-store";

export function ServiceSelect() {
  const selectedServiceId = usePricingStore((state) => state.selectedServiceId);
  const selectService = usePricingStore((state) => state.selectService);

  return (
    <div className="space-y-2">
      <label
        className="text-xs font-medium uppercase tracking-wider text-[rgba(15,15,20,0.5)]"
        htmlFor="service-select"
      >
        Servicio
      </label>
      <Select onValueChange={selectService} value={selectedServiceId ?? ""}>
        <SelectTrigger id="service-select">
          <SelectValue placeholder="Seleccioná un servicio" />
        </SelectTrigger>
        <SelectContent>
          {SERVICES.map((service) => (
            <SelectItem key={service.id} value={service.id}>
              {service.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
