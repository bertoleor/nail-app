/**
 * NAIL-L1: time math for bookings must be date-aware. The original
 * calculateEndTime wrapped hours with %24, so a 23:00 + 120min booking
 * "ended" at 01:00 of the SAME day, producing an invalid [1380, 60]
 * interval in conflict detection (a midnight-crossing booking could
 * never collide with anything, and previous-day spillover was skipped).
 *
 * Resolution: interval math lives in ABSOLUTE MINUTES since the UTC
 * epoch (date anchored at UTC midnight). A booking on 2025-01-14 at
 * 23:00 with 120min spans [20160+1380, 20160+1500) — comparable against
 * any other day's slots without a same-date filter.
 *
 * calculateEndTime keeps its wall-clock display contract ("01:00" for
 * a midnight crossing) — it is a formatting helper, NOT an interval
 * source. Interval math must use endAbsoluteMinutes.
 */

const MINUTES_PER_DAY = 1440;

/** Parses a "HH:MM" wall-clock time into minutes since midnight. */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * End of a booking in minutes since midnight, WITHOUT the %24 wrap.
 * 23:00 + 120min -> 1500 (i.e. 25:00, next-day 01:00).
 */
export function endAbsoluteMinutes(startTime: string, duration: number): number {
  return timeToMinutes(startTime) + duration;
}

/** Whether a booking ends on the calendar day after it starts (ends strictly past midnight). */
export function crossesMidnight(startTime: string, duration: number): boolean {
  return endAbsoluteMinutes(startTime, duration) > MINUTES_PER_DAY;
}

/**
 * Anchors an ISO date ("YYYY-MM-DD") at UTC midnight, in absolute
 * minutes since the epoch. Throws RangeError on malformed input so a
 * bad date fails loud instead of silently missing overlaps.
 */
export function dateToAbsoluteMinutes(date: string): number {
  const ms = Date.parse(`${date}T00:00:00.000Z`);
  if (Number.isNaN(ms)) {
    throw new RangeError(`Invalid booking date: "${date}" (expected YYYY-MM-DD)`);
  }
  return ms / 60000;
}

/**
 * Display helper: wall-clock end time. Wraps past midnight ("01:00"
 * for 23:00 + 120min) — callers rendering an interval must pair it
 * with crossesMidnight, and overlap math must use endAbsoluteMinutes.
 */
export function calculateEndTime(startTime: string, duration: number): string {
  const totalMinutes = endAbsoluteMinutes(startTime, duration);
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;

  return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
}
