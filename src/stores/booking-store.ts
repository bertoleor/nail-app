import { addMonths, subMonths } from "date-fns";
import { create } from "zustand";

import type { Booking } from "@/lib/domain/booking";

interface BookingState {
  readonly addBooking: (booking: Booking) => void;
  readonly bookings: readonly Booking[];
  readonly currentDate: Date;

  readonly nextMonth: () => void;
  readonly prevMonth: () => void;
  readonly selectDate: (date: string) => void;
  readonly selectedDate: null | string;
}

export const useBookingStore = create<BookingState>((set) => ({
  addBooking: (booking: Booking) =>
    { set((state) => ({
      bookings: [...state.bookings, booking],
    })); },
  bookings: [],
  currentDate: new Date(),

  nextMonth: () =>
    { set((state) => ({
      currentDate: addMonths(state.currentDate, 1),
    })); },

  prevMonth: () =>
    { set((state) => ({
      currentDate: subMonths(state.currentDate, 1),
    })); },

  selectDate: (date: string) =>
    { set({
      selectedDate: date,
    }); },

  selectedDate: null,
}));
