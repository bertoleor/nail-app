import type { ServiceType } from "@/lib/domain/pricing";

/**
 * NAIL-M1: single source of truth for the Booking model.
 *
 * Before this, THREE divergent models coexisted:
 *  - mock/data.ts `Booking` (rich: clientId/status/totalPrice/type) — used by app-store
 *  - this file (simple: clientName only) — used by booking-store + dead components
 *  - (client)/reservar — reimplemented against MOCK_* inline
 *
 * Now the domain owns the canonical rich model. mock/data.ts re-exports it.
 * `clientName` stays optional for display-only contexts (e.g. BookingCard) that
 * render a walk-in label without a client record.
 */
export interface Booking {
  readonly addonIds: readonly string[];
  readonly clientId: string;
  readonly createdAt: string;
  readonly date: string;
  readonly duration: number;
  readonly id: string;
  readonly notes?: string;
  readonly serviceId: string;
  readonly startTime: string;
  readonly status: BookingStatus;
  readonly totalPrice: number;
  readonly type: ServiceType;
  readonly clientName?: string;
}

export type BookingStatus = "cancelled" | "completed" | "confirmed" | "pending";
