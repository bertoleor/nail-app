import { describe, expect, it } from "vitest";

import { calculateEndTime, formatTime } from "@/lib/domain/booking/time-utils";

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

    it("handles crossing midnight", () => {
      const result = calculateEndTime("23:00", 120);
      expect(result).toBe("01:00");
    });
  });

  describe("formatTime", () => {
    it("returns time as-is for valid format", () => {
      const result = formatTime("14:00");
      expect(result).toBe("14:00");
    });

    it("handles single digit hour", () => {
      const result = formatTime("09:30");
      expect(result).toBe("09:30");
    });
  });
});
