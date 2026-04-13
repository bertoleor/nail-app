import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BookingCard } from "@/components/booking/booking-card";

describe("BookingCard", () => {
  const mockBooking = {
    id: "1",
    clientName: "María García",
    serviceId: "manicura",
    date: "2025-01-15",
    startTime: "14:00",
    duration: 60,
  };

  it("displays client name", () => {
    render(<BookingCard booking={mockBooking} serviceName="Manicura clásica" />);

    expect(screen.getByText("María García")).toBeInTheDocument();
  });

  it("displays service name", () => {
    render(<BookingCard booking={mockBooking} serviceName="Manicura clásica" />);

    expect(screen.getByText("Manicura clásica")).toBeInTheDocument();
  });

  it("displays time range", () => {
    render(<BookingCard booking={mockBooking} serviceName="Manicura" />);

    expect(screen.getByText("14:00 - 15:00")).toBeInTheDocument();
  });

  it("calculates correct end time for 90 min", () => {
    const longBooking = { ...mockBooking, duration: 90 };
    render(<BookingCard booking={longBooking} serviceName="Pedicura" />);

    expect(screen.getByText("14:00 - 15:30")).toBeInTheDocument();
  });

  it("renders in a Card", () => {
    render(<BookingCard booking={mockBooking} serviceName="Test" />);

    expect(screen.getByText("María García")).toBeInTheDocument();
  });
});
