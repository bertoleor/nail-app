import type { Addon, Service, ServiceType } from "./types";

export function getBasePrice(service: Service, type: ServiceType): number {
  return type === "new" ? service.basePriceNew : service.basePriceMaintenance;
}

export function getBaseDuration(service: Service, type: ServiceType): number {
  return type === "new" ? service.durationNew : service.durationMaintenance;
}

export function calculateDuration(
  service: Service,
  addons: readonly Addon[],
  type: ServiceType
): number {
  const addonsDuration = addons.reduce(
    (sum, addon) => sum + addon.duration,
    0
  );
  return getBaseDuration(service, type) + addonsDuration;
}

export function calculatePrice(
  service: Service,
  addons: readonly Addon[],
  type: ServiceType
): number {
  const addonsTotal = addons.reduce((sum, addon) => sum + addon.price, 0);
  return getBasePrice(service, type) + addonsTotal;
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