import { describe, expect, it } from "vitest";

import { getBookingsForDate, hasConflict } from "@/lib/domain/booking/conflict";
import type { Booking } from "@/lib/domain/booking/types";

describe("Conflict Detection", () => {
  const createBooking = (
    id: string,
    startTime: string,
    duration: number,
    date = "2025-01-15"
  ): Booking => ({
    id,
    clientName: `Client ${id}`,
    serviceId: "manicura",
    date,
    startTime,
    duration,
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
