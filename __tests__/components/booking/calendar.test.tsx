import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { format, addMonths, subMonths } from "date-fns";

import { Calendar } from "@/components/booking/calendar";
import { useBookingStore } from "@/stores/booking-store";

describe("Calendar", () => {
  beforeEach(() => {
    useBookingStore.setState({
      currentDate: new Date(2025, 0, 15),
      selectedDate: null,
      bookings: [],
    });
  });

  it("renders current month and year", () => {
    render(<Calendar />);

    expect(screen.getByText(/enero 2025/i)).toBeInTheDocument();
  });

  it("renders navigation buttons", () => {
    render(<Calendar />);

    // Check for chevron icons in buttons
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it("navigates to next month", async () => {
    const user = userEvent.setup();
    render(<Calendar />);

    const nextButtons = screen.getAllByRole("button");
    const nextButton = nextButtons.find((btn) => btn.querySelector('svg.lucide-chevron-right'));

    if (nextButton) {
      await user.click(nextButton);
    }

    expect(screen.getByText(/febrero 2025/i)).toBeInTheDocument();
  });

  it("navigates to previous month", async () => {
    const user = userEvent.setup();
    render(<Calendar />);

    const prevButtons = screen.getAllByRole("button");
    const prevButton = prevButtons.find((btn) => btn.querySelector('svg.lucide-chevron-left'));

    if (prevButton) {
      await user.click(prevButton);
    }

    expect(screen.getByText(/diciembre 2024/i)).toBeInTheDocument();
  });

  it("renders day headers", () => {
    render(<Calendar />);

    expect(screen.getByText("Dom")).toBeInTheDocument();
    expect(screen.getByText("Lun")).toBeInTheDocument();
    expect(screen.getByText("Sáb")).toBeInTheDocument();
  });

  it("selects date on click", async () => {
    const user = userEvent.setup();
    render(<Calendar />);

    const dayButtons = screen.getAllByRole("button").slice(2);
    await user.click(dayButtons[0]);

    const state = useBookingStore.getState();
    expect(state.selectedDate).not.toBeNull();
  });

  it("shows indicator for days with bookings", () => {
    useBookingStore.setState({
      bookings: [
        {
          id: "1",
          clientName: "Test",
          serviceId: "manicura",
          date: "2025-01-15",
          startTime: "14:00",
          duration: 60,
        },
      ],
    });

    render(<Calendar />);

    const dots = document.querySelectorAll(".bg-emerald-500");
    expect(dots.length).toBeGreaterThan(0);
  });
});
