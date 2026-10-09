import type { Booking } from "./types";

import { dateToAbsoluteMinutes, endAbsoluteMinutes, timeToMinutes } from "./time-utils";

/**
 * NAIL-M1: hasConflict only needs the scheduling fields of a booking.
 * Accepting a Pick keeps availability checks decoupled from the full
 * Booking record (a proposed slot has no client/price yet).
 */
export type BookingOverlapInput = Pick<Booking, "date" | "startTime" | "duration">;

/** Booking interval in absolute minutes since the UTC epoch. */
interface AbsoluteInterval {
  readonly end: number;
  readonly start: number;
}

function toInterval(booking: BookingOverlapInput): AbsoluteInterval {
  const dayStart = dateToAbsoluteMinutes(booking.date);
  return {
    start: dayStart + timeToMinutes(booking.startTime),
    end: dayStart + endAbsoluteMinutes(booking.startTime, booking.duration),
  };
}

export function getBookingsForDate(bookings: readonly Booking[], date: string): readonly Booking[] {
  return bookings.filter((b) => b.date === date);
}

/**
 * NAIL-L1: overlap detection runs in absolute minutes since the epoch,
 * so a booking crossing midnight is a real interval reaching into the
 * next day — no same-date filter, no %24 wrap. A previous-day booking
 * spilling past midnight therefore conflicts with early next-day slots.
 */
export function hasConflict(
  newBooking: BookingOverlapInput,
  existingBookings: readonly Booking[],
): boolean {
  const newInterval = toInterval(newBooking);

  for (const existing of existingBookings) {
    const existingInterval = toInterval(existing);

    if (newInterval.start < existingInterval.end && newInterval.end > existingInterval.start) {
      return true;
    }
  }

  return false;
}
