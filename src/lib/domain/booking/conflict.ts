import type { Booking } from "./types";

import { calculateEndTime } from "./time-utils";

/**
 * NAIL-M1: hasConflict only needs the scheduling fields of a booking.
 * Accepting a Pick keeps availability checks decoupled from the full
 * Booking record (a proposed slot has no client/price yet).
 */
export type BookingOverlapInput = Pick<Booking, "date" | "startTime" | "duration">;

export function getBookingsForDate(
  bookings: readonly Booking[],
  date: string
): readonly Booking[] {
  return bookings.filter((b) => b.date === date);
}

export function hasConflict(
  newBooking: BookingOverlapInput,
  existingBookings: readonly Booking[]
): boolean {
  const sameDateBookings = existingBookings.filter(
    (b) => b.date === newBooking.date
  );

  const newStart = timeToMinutes(newBooking.startTime);
  const newEnd = timeToMinutes(calculateEndTime(newBooking.startTime, newBooking.duration));

  for (const existing of sameDateBookings) {
    const existingStart = timeToMinutes(existing.startTime);
    const existingEnd = timeToMinutes(
      calculateEndTime(existing.startTime, existing.duration)
    );

    if (newStart < existingEnd && newEnd > existingStart) {
      return true;
    }
  }

  return false;
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}
