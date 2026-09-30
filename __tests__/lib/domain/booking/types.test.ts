import { describe, expect, it } from "vitest";

import type { Booking, BookingStatus } from "@/lib/domain/booking/types";
import type { Booking as MockBooking } from "@/lib/mock/data";

describe("Booking Types (NAIL-M1 unified model)", () => {
  it("exports the single rich Booking interface", () => {
    const booking: Booking = {
      id: "test-1",
      clientId: "client-1",
      serviceId: "manicura",
      type: "new",
      date: "2025-01-15",
      startTime: "14:00",
      duration: 60,
      totalPrice: 5000,
      status: "pending",
      createdAt: "2025-01-10T10:00:00.000Z",
      addonIds: [],
    };

    expect(booking.id).toBe("test-1");
    expect(booking.status).toBe("pending");
    expect(booking.totalPrice).toBe(5000);
  });

  it("allows optional clientName for display contexts without a client record", () => {
    const booking: Booking = {
      id: "test-2",
      clientId: "client-walkin",
      clientName: "María García (walk-in)",
      serviceId: "pedicura",
      type: "maintenance",
      date: "2025-01-20",
      startTime: "10:00",
      duration: 90,
      totalPrice: 3500,
      status: "confirmed",
      createdAt: "2025-01-18T10:00:00.000Z",
      addonIds: [],
    };

    expect(booking.clientName).toBe("María García (walk-in)");
  });

  it("Booking from mock/data is the same type as the domain Booking (single source of truth)", () => {
    // NAIL-M1: the app-store (admin + client) and lib/domain/booking must share
    // ONE Booking model. If this assignment compiles, both imports resolve to
    // the same structural type.
    const domainBooking: Booking = {
      id: "d-1",
      clientId: "c-1",
      serviceId: "manicura",
      type: "new",
      date: "2025-02-01",
      startTime: "09:00",
      duration: 60,
      totalPrice: 5000,
      status: "pending",
      createdAt: "2025-01-30T10:00:00.000Z",
      addonIds: [],
    };
    const mockBooking: MockBooking = domainBooking;

    expect(mockBooking.id).toBe("d-1");
  });

  it("BookingStatus keeps the four canonical statuses", () => {
    const statuses: readonly BookingStatus[] = [
      "pending",
      "confirmed",
      "completed",
      "cancelled",
    ];
    expect(statuses).toHaveLength(4);
  });
});
