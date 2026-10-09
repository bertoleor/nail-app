import { describe, expect, it } from "vitest";

import { getBookingsForDate, hasConflict } from "@/lib/domain/booking/conflict";
import type { Booking } from "@/lib/domain/booking/types";

describe("Conflict Detection", () => {
  const createBooking = (
    id: string,
    startTime: string,
    duration: number,
    date = "2025-01-15",
  ): Booking => ({
    id,
    clientId: `client-${id}`,
    serviceId: "manicura",
    type: "new",
    date,
    startTime,
    duration,
    totalPrice: 5000,
    status: "confirmed",
    createdAt: "2025-01-10T10:00:00.000Z",
    addonIds: [],
  });

  describe("hasConflict", () => {
    it("returns false when no existing bookings", () => {
      const newBooking = createBooking("new", "14:00", 60);
      const result = hasConflict(newBooking, []);

      expect(result).toBe(false);
    });

    it("returns false for non-overlapping times", () => {
      const existing = createBooking("1", "10:00", 60);
      const newBooking = createBooking("2", "11:30", 60);

      const result = hasConflict(newBooking, [existing]);

      expect(result).toBe(false);
    });

    it("returns false when back-to-back (no gap)", () => {
      const existing = createBooking("1", "10:00", 60);
      const newBooking = createBooking("2", "11:00", 60);

      const result = hasConflict(newBooking, [existing]);

      expect(result).toBe(false);
    });

    it("returns true for overlapping times", () => {
      const existing = createBooking("1", "14:00", 60);
      const newBooking = createBooking("2", "14:30", 60);

      const result = hasConflict(newBooking, [existing]);

      expect(result).toBe(true);
    });

    it("returns true when new booking starts during existing", () => {
      const existing = createBooking("1", "14:00", 90);
      const newBooking = createBooking("2", "14:30", 30);

      const result = hasConflict(newBooking, [existing]);

      expect(result).toBe(true);
    });

    it("returns true when new booking contains existing", () => {
      const existing = createBooking("1", "14:30", 30);
      const newBooking = createBooking("2", "14:00", 90);

      const result = hasConflict(newBooking, [existing]);

      expect(result).toBe(true);
    });

    it("returns true for same start time", () => {
      const existing = createBooking("1", "14:00", 60);
      const newBooking = createBooking("2", "14:00", 30);

      const result = hasConflict(newBooking, [existing]);

      expect(result).toBe(true);
    });

    it("ignores bookings on different dates", () => {
      const existing = createBooking("1", "14:00", 60, "2025-01-14");
      const newBooking = createBooking("2", "14:00", 60, "2025-01-15");

      const result = hasConflict(newBooking, [existing]);

      expect(result).toBe(false);
    });

    it("checks against multiple existing bookings", () => {
      const existing1 = createBooking("1", "10:00", 60);
      const existing2 = createBooking("2", "14:00", 60);
      const newBooking = createBooking("3", "11:30", 60);

      const result = hasConflict(newBooking, [existing1, existing2]);

      expect(result).toBe(false);
    });

    it("detects conflict with a previous-day booking spilling past midnight (NAIL-L1)", () => {
      // 23:00–01:00 booked on Jan 14; a Jan 15 slot at 00:30 overlaps its tail.
      const existing = createBooking("1", "23:00", 120, "2025-01-14");
      const newBooking = createBooking("2", "00:30", 60, "2025-01-15");

      const result = hasConflict(newBooking, [existing]);

      expect(result).toBe(true);
    });

    it("detects conflict when the new booking crosses midnight over a same-day booking (NAIL-L1)", () => {
      // New 23:00–01:00; existing 23:30–00:30 sits inside it.
      const existing = createBooking("1", "23:30", 60);
      const newBooking = createBooking("2", "23:00", 120);

      const result = hasConflict(newBooking, [existing]);

      expect(result).toBe(true);
    });

    it("allows back-to-back bookings across the midnight boundary (NAIL-L1)", () => {
      // 22:00–24:00 on Jan 14 ends exactly when 00:00 starts on Jan 15.
      const existing = createBooking("1", "22:00", 120, "2025-01-14");
      const newBooking = createBooking("2", "00:00", 60, "2025-01-15");

      const result = hasConflict(newBooking, [existing]);

      expect(result).toBe(false);
    });

    it("ignores a midnight-crossing booking that ends before the new slot starts (NAIL-L1)", () => {
      // 23:00–01:00 on Jan 15 spills into Jan 16, but a 09:00 Jan 16 slot is clear.
      const existing = createBooking("1", "23:00", 120, "2025-01-15");
      const newBooking = createBooking("2", "09:00", 60, "2025-01-16");

      const result = hasConflict(newBooking, [existing]);

      expect(result).toBe(false);
    });

    it("detects conflict with second booking", () => {
      const existing1 = createBooking("1", "10:00", 60);
      const existing2 = createBooking("2", "14:00", 60);
      const newBooking = createBooking("3", "14:30", 60);

      const result = hasConflict(newBooking, [existing1, existing2]);

      expect(result).toBe(true);
    });
  });

  describe("getBookingsForDate", () => {
    it("returns empty array when no bookings", () => {
      const result = getBookingsForDate([], "2025-01-15");

      expect(result).toEqual([]);
    });

    it("returns bookings for specific date", () => {
      const booking1 = createBooking("1", "10:00", 60, "2025-01-15");
      const booking2 = createBooking("2", "14:00", 60, "2025-01-15");
      const booking3 = createBooking("3", "10:00", 60, "2025-01-16");

      const result = getBookingsForDate([booking1, booking2, booking3], "2025-01-15");

      expect(result).toHaveLength(2);
      expect(result.map((b) => b.id)).toContain("1");
      expect(result.map((b) => b.id)).toContain("2");
    });

    it("returns empty when no bookings for date", () => {
      const booking = createBooking("1", "10:00", 60, "2025-01-15");
      const result = getBookingsForDate([booking], "2025-01-16");

      expect(result).toEqual([]);
    });
  });
});
