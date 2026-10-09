import { describe, expect, it } from "vitest";

import {
  calculateEndTime,
  crossesMidnight,
  dateToAbsoluteMinutes,
  endAbsoluteMinutes,
} from "@/lib/domain/booking/time-utils";

describe("Time Utilities", () => {
  describe("calculateEndTime", () => {
    it("calculates end time from start and duration", () => {
      const result = calculateEndTime("14:00", 60);
      expect(result).toBe("15:00");
    });

    it("handles 90 minute duration", () => {
      const result = calculateEndTime("10:00", 90);
      expect(result).toBe("11:30");
    });

    it("handles crossing noon", () => {
      const result = calculateEndTime("11:30", 60);
      expect(result).toBe("12:30");
    });

    it("handles short duration", () => {
      const result = calculateEndTime("14:00", 15);
      expect(result).toBe("14:15");
    });

    it("handles 120 minute duration", () => {
      const result = calculateEndTime("09:00", 120);
      expect(result).toBe("11:00");
    });

    it("returns the wall-clock time when crossing midnight (display contract)", () => {
      const result = calculateEndTime("23:00", 120);
      expect(result).toBe("01:00");
    });
  });

  describe("endAbsoluteMinutes (NAIL-L1 midnight rollover)", () => {
    it("counts past midnight instead of wrapping to 00:xx", () => {
      // 23:00 + 120min ends at 25:00 (next day 01:00) — 1500, NOT 60.
      expect(endAbsoluteMinutes("23:00", 120)).toBe(1500);
    });

    it("matches plain minutes for same-day bookings", () => {
      expect(endAbsoluteMinutes("09:00", 120)).toBe(660);
      expect(endAbsoluteMinutes("14:00", 60)).toBe(900);
    });

    it("ends exactly at midnight for a full-day offset", () => {
      expect(endAbsoluteMinutes("22:00", 120)).toBe(1440);
    });
  });

  describe("crossesMidnight (NAIL-L1)", () => {
    it("is true when the end spills into the next day", () => {
      expect(crossesMidnight("23:00", 120)).toBe(true);
    });

    it("is false for same-day bookings", () => {
      expect(crossesMidnight("09:00", 120)).toBe(false);
      expect(crossesMidnight("22:00", 120)).toBe(false);
    });
  });

  describe("dateToAbsoluteMinutes (NAIL-L1)", () => {
    it("anchors an ISO date at UTC midnight", () => {
      // 1970-01-02T00:00Z == 1440 minutes after the epoch.
      expect(dateToAbsoluteMinutes("1970-01-02")).toBe(1440);
      expect(dateToAbsoluteMinutes("1970-01-01")).toBe(0);
    });

    it("places consecutive days exactly one day apart", () => {
      const day1 = dateToAbsoluteMinutes("2025-01-15");
      const day2 = dateToAbsoluteMinutes("2025-01-16");
      expect(day2 - day1).toBe(1440);
    });

    it("throws RangeError on malformed dates (fail-loud, no silent overlap miss)", () => {
      expect(() => dateToAbsoluteMinutes("not-a-date")).toThrow(RangeError);
      expect(() => dateToAbsoluteMinutes("2025-13-45")).toThrow(RangeError);
    });
  });
});
