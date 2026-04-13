import { beforeEach, describe, expect, it } from "vitest";
import { addDays, format, subDays } from "date-fns";

import { useBookingStore } from "@/stores/booking-store";

describe("Booking Store", () => {
  beforeEach(() => {
    useBookingStore.setState({
      currentDate: new Date(),
      selectedDate: null,
      bookings: [],
    });
  });

  describe("initial state", () => {
    it("has currentDate as Date", () => {
      const state = useBookingStore.getState();
      expect(state.currentDate).toBeInstanceOf(Date);
    });

    it("has null selectedDate", () => {
      const state = useBookingStore.getState();
      expect(state.selectedDate).toBeNull();
    });

    it("has empty bookings array", () => {
      const state = useBookingStore.getState();
      expect(state.bookings).toEqual([]);
    });
  });

  describe("nextMonth", () => {
    it("advances currentDate by one month", () => {
      const initialDate = new Date(2025, 0, 15);
      useBookingStore.setState({ currentDate: initialDate });

      const { nextMonth } = useBookingStore.getState();
      nextMonth();

      const state = useBookingStore.getState();
      expect(state.currentDate.getMonth()).toBe(1);
      expect(state.currentDate.getFullYear()).toBe(2025);
    });
  });

  describe("prevMonth", () => {
    it("goes back one month", () => {
      const initialDate = new Date(2025, 1, 15);
      useBookingStore.setState({ currentDate: initialDate });

      const { prevMonth } = useBookingStore.getState();
      prevMonth();

      const state = useBookingStore.getState();
      expect(state.currentDate.getMonth()).toBe(0);
      expect(state.currentDate.getFullYear()).toBe(2025);
    });

    it("handles year boundary", () => {
      const initialDate = new Date(2025, 0, 15);
      useBookingStore.setState({ currentDate: initialDate });

      const { prevMonth } = useBookingStore.getState();
      prevMonth();

      const state = useBookingStore.getState();
      expect(state.currentDate.getMonth()).toBe(11);
      expect(state.currentDate.getFullYear()).toBe(2024);
    });
  });

  describe("selectDate", () => {
    it("sets selectedDate", () => {
      const dateStr = format(new Date(), "yyyy-MM-dd");

      const { selectDate } = useBookingStore.getState();
      selectDate(dateStr);

      const state = useBookingStore.getState();
      expect(state.selectedDate).toBe(dateStr);
    });

    it("can change selectedDate", () => {
      const date1 = format(new Date(), "yyyy-MM-dd");
      const date2 = format(addDays(new Date(), 1), "yyyy-MM-dd");

      const { selectDate } = useBookingStore.getState();
      selectDate(date1);
      selectDate(date2);

      const state = useBookingStore.getState();
      expect(state.selectedDate).toBe(date2);
    });
  });

  describe("addBooking", () => {
    it("adds booking to bookings array", () => {
      const booking = {
        id: "test-1",
        clientName: "Test Client",
        serviceId: "manicura",
        date: format(new Date(), "yyyy-MM-dd"),
        startTime: "14:00",
        duration: 60,
      };

      const { addBooking } = useBookingStore.getState();
      addBooking(booking);

      const state = useBookingStore.getState();
      expect(state.bookings).toHaveLength(1);
      expect(state.bookings[0].id).toBe("test-1");
    });

    it("allows multiple bookings", () => {
      const date = format(new Date(), "yyyy-MM-dd");
      const booking1 = {
        id: "1",
        clientName: "Client 1",
        serviceId: "manicura",
        date,
        startTime: "10:00",
        duration: 60,
      };
      const booking2 = {
        id: "2",
        clientName: "Client 2",
        serviceId: "pedicura",
        date,
        startTime: "14:00",
        duration: 90,
      };

      const { addBooking } = useBookingStore.getState();
      addBooking(booking1);
      addBooking(booking2);

      const state = useBookingStore.getState();
      expect(state.bookings).toHaveLength(2);
    });
  });
});
