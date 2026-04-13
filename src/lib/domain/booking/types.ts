export interface Booking {
  readonly id: string;
  readonly clientName: string;
  readonly serviceId: string;
  readonly date: string;
  readonly startTime: string;
  readonly duration: number;
}
