import { describe, expect, it } from "vitest";

import {
  calculateDuration,
  calculatePrice,
  formatDuration,
  formatPrice,
} from "@/lib/domain/pricing/calculator";
import { ADDONS, SERVICES } from "@/lib/domain/pricing/constants";

describe("Calculator Functions", () => {
  describe("calculatePrice", () => {
    it("returns base price when no addons", () => {
      const service = SERVICES[0];
      const result = calculatePrice(service, [], "new");

      expect(result).toBe(service.basePriceNew);
    });

    it("uses maintenance price for maintenance type", () => {
      const service = SERVICES[0];
      const result = calculatePrice(service, [], "maintenance");

      expect(result).toBe(service.basePriceMaintenance);
    });

    it("adds addon prices to base", () => {
      const service = SERVICES[0];
      const addons = [ADDONS[0], ADDONS[1]];

      const expected = service.basePriceNew + ADDONS[0].price + ADDONS[1].price;
      const result = calculatePrice(service, addons, "new");

      expect(result).toBe(expected);
    });

    it("handles single addon", () => {
      const service = SERVICES[1];
      const addons = [ADDONS[2]];

      const expected = service.basePriceNew + ADDONS[2].price;
      const result = calculatePrice(service, addons, "new");

      expect(result).toBe(expected);
    });

    it("returns 0 for empty addons array", () => {
      const service = SERVICES[0];
      const result = calculatePrice(service, [], "new");

      expect(result).toBe(service.basePriceNew);
    });
  });

  describe("calculateDuration", () => {
    it("returns service duration when no addons", () => {
      const service = SERVICES[0];
      const result = calculateDuration(service, [], "new");

      expect(result).toBe(service.durationNew);
    });

    it("uses maintenance duration for maintenance type", () => {
      const service = SERVICES[0];
      const result = calculateDuration(service, [], "maintenance");

      expect(result).toBe(service.durationMaintenance);
    });

    it("adds addon durations", () => {
      const service = SERVICES[0];
      const addons = [ADDONS[0], ADDONS[1]];

      const expected = service.durationNew + ADDONS[0].duration + ADDONS[1].duration;
      const result = calculateDuration(service, addons, "new");

      expect(result).toBe(expected);
    });
  });

  describe("formatPrice", () => {
    it("formats price as ARS currency", () => {
      const result = formatPrice(2500);

      expect(result).toMatch(/ARS/);
      expect(result).toMatch(/2\.?500/);
    });

    it("handles zero", () => {
      const result = formatPrice(0);

      expect(result).toMatch(/0/);
    });

    it("handles large numbers", () => {
      const result = formatPrice(10000);

      expect(result).toMatch(/10\.?000/);
    });
  });

  describe("formatDuration", () => {
    it("formats minutes with 'minutos' suffix", () => {
      const result = formatDuration(60);

      expect(result).toBe("60 minutos");
    });

    it("handles singular (1 minuto)", () => {
      const result = formatDuration(1);

      expect(result).toBe("1 minuto");
    });

    it("handles complex durations", () => {
      const result = formatDuration(75);

      expect(result).toBe("75 minutos");
    });
  });
});