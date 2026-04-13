import { describe, expect, it } from "vitest";

import type { Booking } from "@/lib/domain/booking/types";

describe("Booking Types", () => {
  it("exports Booking interface", () => {
    const booking: Booking = {
      id: "test-1",
      clientName: "María García",
      serviceId: "manicura",
      date: "2025-01-15",
      startTime: "14:00",
      duration: 60,
    };

    expect(booking.id).toBe("test-1");
    expect(booking.clientName).toBe("María García");
    expect(booking.serviceId).toBe("manicura");
    expect(booking.date).toBe("2025-01-15");
    expect(booking.startTime).toBe("14:00");
    expect(booking.duration).toBe(60);
  });

  it("Booking has all required fields", () => {
    const booking: Booking = {
      id: "test",
      clientName: "Test Client",
      serviceId: "pedicura",
      date: "2025-01-20",
      startTime: "10:00",
      duration: 90,
    };

    expect(booking).toHaveProperty("id");
    expect(booking).toHaveProperty("clientName");
    expect(booking).toHaveProperty("serviceId");
    expect(booking).toHaveProperty("date");
    expect(booking).toHaveProperty("startTime");
    expect(booking).toHaveProperty("duration");
  });
});
