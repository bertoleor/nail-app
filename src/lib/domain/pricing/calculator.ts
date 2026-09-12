import type { Addon, Service } from "./types";

export function calculateDuration(
  service: Service,
  addons: readonly Addon[]
): number {
  const addonsDuration = addons.reduce(
    (sum, addon) => sum + addon.duration,
    0
  );
  return service.duration + addonsDuration;
}

export function calculatePrice(
  service: Service,
  addons: readonly Addon[]
): number {
  const addonsTotal = addons.reduce((sum, addon) => sum + addon.price, 0);
  return service.basePrice + addonsTotal;
}

export function formatDuration(minutes: number): string {
  return minutes === 1 ? "1 minuto" : `${minutes} minutos`;
}

export function formatPrice(price: number): string {
  const formatted = new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(price);
  return `ARS ${formatted}`;
}
