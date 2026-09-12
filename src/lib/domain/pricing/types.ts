export interface Addon {
  readonly duration: number;
  readonly id: string;
  readonly name: string;
  readonly price: number;
}

export interface Service {
  readonly basePrice: number;
  readonly duration: number;
  readonly id: string;
  readonly name: string;
}
