import type { BlockedSlot } from "@/lib/mock/data";

import type { BookingOverlapInput } from "./conflict";
import { hasConflict } from "./conflict";
import { endAbsoluteMinutes, timeToMinutes } from "./time-utils";
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
 *
 * NAIL-L1: end times are computed WITHOUT the %24 wrap, so a slot whose
 * end crosses midnight is rejected as out-of-hours instead of sliding
 * through the gate as a wrapped "01:00".
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

export function checkAvailability(input: AvailabilityInput): Availability {
  const { blockedSlots, bookings, date, duration, startTime } = input;

  // 1. Business hours: must start at/after opening and end at/before closing.
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = endAbsoluteMinutes(startTime, duration);
  if (startMinutes < timeToMinutes(OPENING_TIME) || endMinutes > timeToMinutes(CLOSING_TIME)) {
    return { ok: false, reason: "out-of-hours" };
  }

  // 2. Overlap with existing bookings (cancelled ones are ignored).
  // NAIL-L1: no date pre-filter — hasConflict works in absolute minutes
  // since the epoch, so previous-day bookings spilling past midnight are
  // compared too. Cancelling status is still respected.
  const activeBookings = bookings.filter((b) => b.status !== "cancelled");
  const proposed: BookingOverlapInput = {
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
    if (slot.date !== date) {
      continue;
    }
    const slotStart = timeToMinutes(slot.startTime);
    const slotEnd = timeToMinutes(slot.endTime);
    if (proposedStart < slotEnd && proposedEnd > slotStart) {
      return { ok: false, reason: "blocked" };
    }
  }

  return { ok: true };
}
