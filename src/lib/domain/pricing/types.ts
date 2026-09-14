export type ServiceType = "maintenance" | "new";

export interface Addon {
  readonly duration: number;
  readonly id: string;
  readonly name: string;
  readonly price: number;
}

export interface Service {
  readonly basePriceMaintenance: number;
  readonly basePriceNew: number;
  readonly description?: string;
  readonly durationMaintenance: number;
  readonly durationNew: number;
  readonly id: string;
  readonly name: string;
}