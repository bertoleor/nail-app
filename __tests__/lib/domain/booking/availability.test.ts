import { describe, expect, it } from "vitest";

import { checkAvailability } from "@/lib/domain/booking/availability";
import type { Booking } from "@/lib/domain/booking/types";
import type { BlockedSlot } from "@/lib/mock/data";

describe("Availability check (NAIL-H3, unified Booking model NAIL-M1)", () => {
  const createBooking = (
    id: string,
    startTime: string,
    duration: number,
    date = "2026-10-15",
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
    createdAt: "2026-10-01T10:00:00.000Z",
    addonIds: [],
  });

  const createBlockedSlot = (
    id: string,
    startTime: string,
    endTime: string,
    date = "2026-10-15",
  ): BlockedSlot => ({
    id,
    date,
    startTime,
    endTime,
    reason: "Blocked",
  });

  describe("checkAvailability", () => {
    it("returns available when no bookings and no blocked slots", () => {
      const result = checkAvailability({
        date: "2026-10-15",
        startTime: "14:00",
        duration: 60,
        bookings: [],
        blockedSlots: [],
      });

      expect(result.ok).toBe(true);
    });

    it("returns conflict when overlapping an existing booking", () => {
      const existing = createBooking("1", "14:00", 60);
      const result = checkAvailability({
        date: "2026-10-15",
        startTime: "14:30",
        duration: 60,
        bookings: [existing],
        blockedSlots: [],
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reason).toBe("conflict");
      }
    });

    it("ignores bookings on a different date", () => {
      const existing = createBooking("1", "14:00", 60, "2026-10-14");
      const result = checkAvailability({
        date: "2026-10-15",
        startTime: "14:00",
        duration: 60,
        bookings: [existing],
        blockedSlots: [],
      });

      expect(result.ok).toBe(true);
    });

    it("ignores cancelled bookings", () => {
      const cancelled = { ...createBooking("1", "14:00", 60), status: "cancelled" as const };
      const result = checkAvailability({
        date: "2026-10-15",
        startTime: "14:00",
        duration: 60,
        bookings: [cancelled],
        blockedSlots: [],
      });

      expect(result.ok).toBe(true);
    });

    it("returns blocked when inside a blocked slot", () => {
      const blocked = createBlockedSlot("blocked-1", "14:00", "17:00");
      const result = checkAvailability({
        date: "2026-10-15",
        startTime: "15:00",
        duration: 60,
        bookings: [],
        blockedSlots: [blocked],
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reason).toBe("blocked");
      }
    });

    it("returns blocked when new booking overlaps a blocked slot start", () => {
      const blocked = createBlockedSlot("blocked-1", "15:00", "17:00");
      const result = checkAvailability({
        date: "2026-10-15",
        startTime: "14:00",
        duration: 90,
        bookings: [],
        blockedSlots: [blocked],
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reason).toBe("blocked");
      }
    });

    it("ignores blocked slots on a different date", () => {
      const blocked = createBlockedSlot("blocked-1", "09:00", "12:00", "2026-10-14");
      const result = checkAvailability({
        date: "2026-10-15",
        startTime: "10:00",
        duration: 60,
        bookings: [],
        blockedSlots: [blocked],
      });

      expect(result.ok).toBe(true);
    });

    it("allows booking ending exactly at blocked slot start", () => {
      const blocked = createBlockedSlot("blocked-1", "15:00", "17:00");
      const result = checkAvailability({
        date: "2026-10-15",
        startTime: "14:00",
        duration: 60,
        bookings: [],
        blockedSlots: [blocked],
      });

      expect(result.ok).toBe(true);
    });

    it("rejects start time outside business hours (before 09:00)", () => {
      const result = checkAvailability({
        date: "2026-10-15",
        startTime: "08:30",
        duration: 60,
        bookings: [],
        blockedSlots: [],
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reason).toBe("out-of-hours");
      }
    });

    it("rejects end time outside business hours (after 19:00)", () => {
      const result = checkAvailability({
        date: "2026-10-15",
        startTime: "18:30",
        duration: 60,
        bookings: [],
        blockedSlots: [],
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reason).toBe("out-of-hours");
      }
    });

    it("allows booking ending exactly at closing time", () => {
      const result = checkAvailability({
        date: "2026-10-15",
        startTime: "18:00",
        duration: 60,
        bookings: [],
        blockedSlots: [],
      });

      expect(result.ok).toBe(true);
    });

    it("reports conflict over blocked when both apply", () => {
      const existing = createBooking("1", "14:00", 60);
      const blocked = createBlockedSlot("blocked-1", "15:00", "17:00");
      const result = checkAvailability({
        date: "2026-10-15",
        startTime: "14:30",
        duration: 60,
        bookings: [existing],
        blockedSlots: [blocked],
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reason).toBe("conflict");
      }
    });
  });
});
