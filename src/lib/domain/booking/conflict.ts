import { calculateEndTime } from "./time-utils";
import type { Booking } from "./types";

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function hasConflict(
  newBooking: Booking,
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

export function getBookingsForDate(
  bookings: readonly Booking[],
  date: string
): readonly Booking[] {
  return bookings.filter((b) => b.date === date);
}
