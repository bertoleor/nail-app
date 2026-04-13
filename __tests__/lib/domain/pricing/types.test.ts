import { describe, expect, it } from "vitest";

import type { Addon, Service } from "@/lib/domain/pricing/types";

describe("Pricing Types", () => {
  it("exports Service interface", () => {
    const service: Service = {
      id: "test-service",
      name: "Test Service",
      basePrice: 1000,
      duration: 60,
    };

    expect(service.id).toBe("test-service");
    expect(service.name).toBe("Test Service");
    expect(service.basePrice).toBe(1000);
    expect(service.duration).toBe(60);
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
