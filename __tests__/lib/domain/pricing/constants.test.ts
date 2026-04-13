import { describe, expect, it } from "vitest";

import { ADDONS, SERVICES } from "@/lib/domain/pricing/constants";

describe("Pricing Constants", () => {
  it("exports SERVICES array", () => {
    expect(SERVICES).toBeDefined();
    expect(Array.isArray(SERVICES)).toBe(true);
    expect(SERVICES.length).toBeGreaterThan(0);
  });

  it("SERVICES have valid structure", () => {
    for (const service of SERVICES) {
      expect(service).toHaveProperty("id");
      expect(service).toHaveProperty("name");
      expect(service).toHaveProperty("basePrice");
      expect(service).toHaveProperty("duration");
      expect(typeof service.id).toBe("string");
      expect(typeof service.name).toBe("string");
      expect(typeof service.basePrice).toBe("number");
      expect(typeof service.duration).toBe("number");
    }
  });

  it("exports ADDONS array", () => {
    expect(ADDONS).toBeDefined();
    expect(Array.isArray(ADDONS)).toBe(true);
    expect(ADDONS.length).toBeGreaterThan(0);
  });

  it("ADDONS have valid structure", () => {
    for (const addon of ADDONS) {
      expect(addon).toHaveProperty("id");
      expect(addon).toHaveProperty("name");
      expect(addon).toHaveProperty("price");
      expect(addon).toHaveProperty("duration");
    }
  });

  it("has expected service types", () => {
    const serviceIds = SERVICES.map((s) => s.id);
    expect(serviceIds).toContain("manicura");
    expect(serviceIds).toContain("pedicura");
  });
});
