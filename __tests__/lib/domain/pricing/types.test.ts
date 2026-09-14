import { describe, expect, it } from "vitest";

import type { Addon, Service } from "@/lib/domain/pricing/types";

describe("Pricing Types", () => {
  it("exports Service interface", () => {
    const service: Service = {
      basePriceMaintenance: 800,
      basePriceNew: 1000,
      description: "Test service",
      durationMaintenance: 45,
      durationNew: 60,
      id: "test-service",
      name: "Test Service",
    };

    expect(service.id).toBe("test-service");
    expect(service.name).toBe("Test Service");
    expect(service.basePriceNew).toBe(1000);
    expect(service.basePriceMaintenance).toBe(800);
    expect(service.durationNew).toBe(60);
    expect(service.durationMaintenance).toBe(45);
  });

  it("exports Addon interface", () => {
    const addon: Addon = {
      id: "test-addon",
      name: "Test Addon",
      price: 500,
      duration: 15,
    };

    expect(addon.id).toBe("test-addon");
    expect(addon.name).toBe("Test Addon");
    expect(addon.price).toBe(500);
    expect(addon.duration).toBe(15);
  });
});