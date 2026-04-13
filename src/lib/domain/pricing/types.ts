export interface Service {
  readonly id: string;
  readonly name: string;
  readonly basePrice: number;
  readonly duration: number;
}

export interface Addon {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly duration: number;
}
