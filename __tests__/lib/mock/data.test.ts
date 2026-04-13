import { describe, expect, it } from "vitest";

import {
  MOCK_CLIENTS,
  MOCK_SERVICES,
  MOCK_ADDONS,
  MOCK_BOOKINGS,
  MOCK_BLOCKED_SLOTS,
  MOCK_QUOTES,
  getClientById,
  getServiceById,
  getAddonById,
  getBookingsByDate,
  getBookingsByClient,
  getBlockedSlotsByDate,
  formatPrice,
  formatPhone,
} from "@/lib/mock/data";

describe("Mock Data", () => {
  describe("MOCK_CLIENTS", () => {
    it("has 6 clients", () => {
      expect(MOCK_CLIENTS).toHaveLength(6);
    });

    it("each client has required fields", () => {
      MOCK_CLIENTS.forEach((client) => {
        expect(client.id).toBeDefined();
        expect(client.name).toBeDefined();
        expect(client.phone).toBeDefined();
        expect(client.createdAt).toBeDefined();
      });
    });

    it("client has email optionally", () => {
      const withEmail = MOCK_CLIENTS.find((c) => c.email);
      const withoutEmail = MOCK_CLIENTS.find((c) => !c.email);
      expect(withEmail).toBeDefined();
      expect(withoutEmail).toBeDefined();
    });

    it("client has notes optionally", () => {
      const withNotes = MOCK_CLIENTS.find((c) => c.notes);
      expect(withNotes).toBeDefined();
    });
  });

  describe("MOCK_SERVICES", () => {
    it("has 5 services", () => {
      expect(MOCK_SERVICES).toHaveLength(5);
    });

    it("each service has required fields", () => {
      MOCK_SERVICES.forEach((service) => {
        expect(service.id).toBeDefined();
        expect(service.name).toBeDefined();
        expect(service.basePriceNew).toBeGreaterThan(0);
        expect(service.basePriceMaintenance).toBeGreaterThan(0);
        expect(service.durationNew).toBeGreaterThan(0);
        expect(service.durationMaintenance).toBeGreaterThan(0);
      });
    });

    it("maintenance price is lower than new price", () => {
      MOCK_SERVICES.forEach((service) => {
        expect(service.basePriceMaintenance).toBeLessThan(service.basePriceNew);
      });
    });

    it("maintenance duration is shorter than new duration", () => {
      MOCK_SERVICES.forEach((service) => {
        expect(service.durationMaintenance).toBeLessThanOrEqual(service.durationNew);
      });
    });
  });

  describe("MOCK_ADDONS", () => {
    it("has 5 addons", () => {
      expect(MOCK_ADDONS).toHaveLength(5);
    });

    it("each addon has required fields", () => {
      MOCK_ADDONS.forEach((addon) => {
        expect(addon.id).toBeDefined();
        expect(addon.name).toBeDefined();
        expect(addon.price).toBeGreaterThanOrEqual(0);
        expect(addon.duration).toBeGreaterThan(0);
      });
    });
  });

  describe("MOCK_BOOKINGS", () => {
    it("has 10 bookings", () => {
      expect(MOCK_BOOKINGS).toHaveLength(10);
    });

    it("each booking has required fields", () => {
      MOCK_BOOKINGS.forEach((booking) => {
        expect(booking.id).toBeDefined();
        expect(booking.clientId).toBeDefined();
        expect(booking.serviceId).toBeDefined();
        expect(booking.date).toBeDefined();
        expect(booking.startTime).toBeDefined();
        expect(booking.duration).toBeGreaterThan(0);
        expect(booking.totalPrice).toBeGreaterThan(0);
        expect(booking.status).toBeDefined();
        expect(booking.type).toBeDefined();
        expect(booking.createdAt).toBeDefined();
      });
    });

    it("booking has valid status", () => {
      const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
      MOCK_BOOKINGS.forEach((booking) => {
        expect(validStatuses).toContain(booking.status);
      });
    });

    it("booking has valid type", () => {
      const validTypes = ["new", "maintenance"];
      MOCK_BOOKINGS.forEach((booking) => {
        expect(validTypes).toContain(booking.type);
      });
    });
  });

  describe("MOCK_BLOCKED_SLOTS", () => {
    it("has blocked slots", () => {
      expect(MOCK_BLOCKED_SLOTS.length).toBeGreaterThanOrEqual(1);
    });

    it("each blocked slot has required fields", () => {
      MOCK_BLOCKED_SLOTS.forEach((slot) => {
        expect(slot.id).toBeDefined();
        expect(slot.date).toBeDefined();
        expect(slot.startTime).toBeDefined();
        expect(slot.endTime).toBeDefined();
        expect(slot.reason).toBeDefined();
      });
    });
  });

  describe("MOCK_QUOTES", () => {
    it("has quotes", () => {
      expect(MOCK_QUOTES.length).toBeGreaterThanOrEqual(1);
    });

    it("each quote has required fields", () => {
      MOCK_QUOTES.forEach((quote) => {
        expect(quote.id).toBeDefined();
        expect(quote.clientName).toBeDefined();
        expect(quote.clientPhone).toBeDefined();
        expect(quote.serviceId).toBeDefined();
        expect(quote.type).toBeDefined();
        expect(quote.totalPrice).toBeGreaterThan(0);
        expect(quote.status).toBeDefined();
        expect(quote.createdAt).toBeDefined();
      });
    });
  });
});

describe("Getter functions", () => {
  describe("getClientById", () => {
    it("returns client when exists", () => {
      const client = getClientById("client-1");
      expect(client).toBeDefined();
      expect(client?.name).toBe("María García");
    });

    it("returns undefined when not exists", () => {
      const client = getClientById("non-existent");
      expect(client).toBeUndefined();
    });
  });

  describe("getServiceById", () => {
    it("returns service when exists", () => {
      const service = getServiceById("manicura");
      expect(service).toBeDefined();
      expect(service?.name).toBe("Manicura clásica");
    });

    it("returns undefined when not exists", () => {
      const service = getServiceById("non-existent");
      expect(service).toBeUndefined();
    });
  });

  describe("getAddonById", () => {
    it("returns addon when exists", () => {
      const addon = getAddonById("diseno");
      expect(addon).toBeDefined();
      expect(addon?.name).toBe("Diseño artístico");
    });

    it("returns undefined when not exists", () => {
      const addon = getAddonById("non-existent");
      expect(addon).toBeUndefined();
    });
  });

  describe("getBookingsByDate", () => {
    it("returns bookings for date", () => {
      const today = new Date().toISOString().split("T")[0];
      const bookings = getBookingsByDate(today);
      expect(Array.isArray(bookings)).toBe(true);
    });
  });

  describe("getBookingsByClient", () => {
    it("returns bookings for client", () => {
      const bookings = getBookingsByClient("client-1");
      expect(bookings.length).toBeGreaterThan(0);
    });

    it("returns empty array for unknown client", () => {
      const bookings = getBookingsByClient("non-existent");
      expect(bookings).toHaveLength(0);
    });
  });

  describe("getBlockedSlotsByDate", () => {
    it("returns blocked slots for date", () => {
      const blockedSlots = getBlockedSlotsByDate("2025-01-01");
      expect(Array.isArray(blockedSlots)).toBe(true);
    });
  });
});

describe("Format functions", () => {
  describe("formatPrice", () => {
    it("formats price with $ sign", () => {
      expect(formatPrice(2500)).toBe("$2.500");
    });

    it("formats large prices", () => {
      expect(formatPrice(10000)).toBe("$10.000");
    });

    it("formats price with decimals", () => {
      expect(formatPrice(2550)).toBe("$2.550");
    });
  });

  describe("formatPhone", () => {
    it("formats phone with country code", () => {
      const result = formatPhone("+54 9 11 1234-5678");
      expect(result).toContain("54");
    });

    it("returns original if format unknown", () => {
      const result = formatPhone("123456");
      expect(result).toBe("123456");
    });
  });
});
