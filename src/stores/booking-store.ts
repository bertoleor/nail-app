import { addMonths, subMonths } from "date-fns";
import { create } from "zustand";

import type { Booking } from "@/lib/domain/booking";

interface BookingState {
  readonly currentDate: Date;
  readonly selectedDate: string | null;
  readonly bookings: readonly Booking[];

  readonly nextMonth: () => void;
  readonly prevMonth: () => void;
  readonly selectDate: (date: string) => void;
  readonly addBooking: (booking: Booking) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  currentDate: new Date(),
  selectedDate: null,
  bookings: [],

  nextMonth: () =>
    set((state) => ({
      currentDate: addMonths(state.currentDate, 1),
    })),

  prevMonth: () =>
    set((state) => ({
      currentDate: subMonths(state.currentDate, 1),
    })),

  selectDate: (date: string) =>
    set({
      selectedDate: date,
    }),

  addBooking: (booking: Booking) =>
    set((state) => ({
      bookings: [...state.bookings, booking],
    })),
}));
