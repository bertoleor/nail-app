import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { BookingList } from "@/components/booking/booking-list";
import { useBookingStore } from "@/stores/booking-store";

describe("BookingList", () => {
  beforeEach(() => {
    useBookingStore.setState({
      currentDate: new Date(2025, 0, 15),
      selectedDate: null,
      bookings: [],
    });
  });

  it("shows message when no date selected", () => {
    render(<BookingList />);

    expect(screen.getByText("Seleccioná un día para ver los turnos")).toBeInTheDocument();
  });

  it("shows empty state when no bookings", () => {
    useBookingStore.setState({ selectedDate: "2025-01-15" });
    render(<BookingList />);

    expect(screen.getByText("Sin turnos")).toBeInTheDocument();
  });

  it("displays bookings for selected date", () => {
    useBookingStore.setState({
      selectedDate: "2025-01-15",
      bookings: [
        {
          id: "1",
          clientName: "María García",
          serviceId: "manicura",
          date: "2025-01-15",
          startTime: "14:00",
          duration: 60,
        },
      ],
    });

    render(<BookingList />);

    expect(screen.getByText("María García")).toBeInTheDocument();
  });

  it("filters bookings by date", () => {
    useBookingStore.setState({
      selectedDate: "2025-01-15",
      bookings: [
        {
          id: "1",
          clientName: "María García",
          serviceId: "manicura",
          date: "2025-01-15",
          startTime: "14:00",
          duration: 60,
        },
        {
          id: "2",
          clientName: "Ana López",
          serviceId: "pedicura",
          date: "2025-01-16",
          startTime: "10:00",
          duration: 90,
        },
      ],
    });

    render(<BookingList />);

    expect(screen.getByText("María García")).toBeInTheDocument();
    expect(screen.queryByText("Ana López")).not.toBeInTheDocument();
  });
});
