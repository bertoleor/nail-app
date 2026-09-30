import type { BlockedSlot } from "@/lib/mock/data";

import { hasConflict } from "./conflict";
import { calculateEndTime } from "./time-utils";
import type { Booking } from "./types";

/**
 * NAIL-H3: single availability gate for client bookings.
 *
 * A proposed slot is unavailable when it:
 *  1. overlaps a non-cancelled booking on the same date (conflict), or
 *  2. overlaps a blocked slot on the same date, or
 *  3. starts before opening time or ends after closing time.
 *
 * `reason` is returned so the UI can explain WHY the slot is unavailable
 * (and tests can pin behaviour) without leaking internal data.
 */

export type AvailabilityReason = "blocked" | "conflict" | "out-of-hours";
export type Availability = { ok: true } | { ok: false; reason: AvailabilityReason };

export interface AvailabilityInput {
  readonly date: string;
  readonly startTime: string;
  readonly duration: number;
  readonly bookings: readonly Booking[];
  readonly blockedSlots: readonly BlockedSlot[];
}

const OPENING_TIME = "09:00";
const CLOSING_TIME = "19:00";

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function checkAvailability(input: AvailabilityInput): Availability {
  const { blockedSlots, bookings, date, duration, startTime } = input;

  // 1. Business hours: must start at/after opening and end at/before closing.
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(calculateEndTime(startTime, duration));
  if (startMinutes < timeToMinutes(OPENING_TIME) || endMinutes > timeToMinutes(CLOSING_TIME)) {
    return { ok: false, reason: "out-of-hours" };
  }

  // 2. Overlap with existing bookings (cancelled ones are ignored).
  const activeBookings = bookings.filter(
    (b) => b.date === date && b.status !== "cancelled"
  );
  const proposed = {
    id: "proposed",
    date,
    startTime,
    duration,
  };
  if (hasConflict(proposed, activeBookings)) {
    return { ok: false, reason: "conflict" };
  }

  // 3. Overlap with blocked slots on the same date.
  const proposedStart = startMinutes;
  const proposedEnd = endMinutes;
  for (const slot of blockedSlots) {
    if (slot.date !== date) {continue;}
    const slotStart = timeToMinutes(slot.startTime);
    const slotEnd = timeToMinutes(slot.endTime);
    if (proposedStart < slotEnd && proposedEnd > slotStart) {
      return { ok: false, reason: "blocked" };
    }
  }

  return { ok: true };
}
