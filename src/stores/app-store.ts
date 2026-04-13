import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  Booking,
  BookingStatus,
  Client,
  BlockedSlot,
  Quote,
  QuoteStatus,
} from "@/lib/mock/data";
import {
  MOCK_CLIENTS,
  MOCK_BOOKINGS,
  MOCK_BLOCKED_SLOTS,
  MOCK_QUOTES,
} from "@/lib/mock/data";

export { MOCK_CLIENTS, MOCK_BOOKINGS, MOCK_BLOCKED_SLOTS, MOCK_QUOTES };

interface AppState {
  readonly clients: readonly Client[];
  readonly bookings: readonly Booking[];
  readonly blockedSlots: readonly BlockedSlot[];
  readonly quotes: readonly Quote[];

  readonly addClient: (client: Omit<Client, "id" | "createdAt">) => Client;
  readonly updateClient: (id: string, data: Partial<Client>) => void;

  readonly addBooking: (booking: Omit<Booking, "id" | "createdAt">) => Booking;
  readonly updateBookingStatus: (id: string, status: BookingStatus) => void;
  readonly cancelBooking: (id: string, notes?: string) => void;

  readonly addBlockedSlot: (slot: Omit<BlockedSlot, "id">) => BlockedSlot;
  readonly removeBlockedSlot: (id: string) => void;

  readonly addQuote: (quote: Omit<Quote, "id" | "createdAt">) => Quote;
  readonly updateQuoteStatus: (id: string, status: QuoteStatus) => void;
  readonly saveQuoteToClient: (quoteId: string, clientId: string) => void;
}

let clientIdCounter = MOCK_CLIENTS.length + 1;
let bookingIdCounter = MOCK_BOOKINGS.length + 1;
let blockedSlotIdCounter = MOCK_BLOCKED_SLOTS.length + 1;
let quoteIdCounter = MOCK_QUOTES.length + 1;

const generateId = (prefix: string, counter: number) => `${prefix}-${counter}`;

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      clients: [...MOCK_CLIENTS],
      bookings: [...MOCK_BOOKINGS],
      blockedSlots: [...MOCK_BLOCKED_SLOTS],
      quotes: [...MOCK_QUOTES],

      addClient: (clientData) => {
        const newClient: Client = {
          ...clientData,
          id: generateId("client", clientIdCounter++),
          createdAt: new Date().toISOString().split("T")[0],
        };
        set((state) => ({ clients: [...state.clients, newClient] }));
        return newClient;
      },

      updateClient: (id, data) => {
        set((state) => ({
          clients: state.clients.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        }));
      },

      addBooking: (bookingData) => {
        const newBooking: Booking = {
          ...bookingData,
          id: generateId("booking", bookingIdCounter++),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ bookings: [...state.bookings, newBooking] }));
        return newBooking;
      },

      updateBookingStatus: (id, status) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id ? { ...b, status } : b
          ),
        }));
      },

      cancelBooking: (id, notes) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id
              ? { ...b, status: "cancelled" as BookingStatus, notes }
              : b
          ),
        }));
      },

      addBlockedSlot: (slotData) => {
        const newSlot: BlockedSlot = {
          ...slotData,
          id: generateId("blocked", blockedSlotIdCounter++),
        };
        set((state) => ({
          blockedSlots: [...state.blockedSlots, newSlot],
        }));
        return newSlot;
      },

      removeBlockedSlot: (id) => {
        set((state) => ({
          blockedSlots: state.blockedSlots.filter((s) => s.id !== id),
        }));
      },

      addQuote: (quoteData) => {
        const newQuote: Quote = {
          ...quoteData,
          id: generateId("quote", quoteIdCounter++),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ quotes: [...state.quotes, newQuote] }));
        return newQuote;
      },

      updateQuoteStatus: (id, status) => {
        set((state) => ({
          quotes: state.quotes.map((q) =>
            q.id === id ? { ...q, status } : q
          ),
        }));
      },

      saveQuoteToClient: (quoteId, clientId) => {
        set((state) => ({
          quotes: state.quotes.map((q) =>
            q.id === quoteId ? { ...q, clientId, status: "saved" as QuoteStatus } : q
          ),
        }));
      },
    }),
    {
      name: "nail-app-storage",
      partialize: (state) => ({
        clients: state.clients,
        bookings: state.bookings,
        blockedSlots: state.blockedSlots,
        quotes: state.quotes,
      }),
    }
  )
);

export function useClient(id: string): Client | undefined {
  return useAppStore((state) => state.clients.find((c) => c.id === id));
}

export function useBookingsByDate(date: string): readonly Booking[] {
  return useAppStore((state) =>
    state.bookings.filter((b) => b.date === date && b.status !== "cancelled")
  );
}

export function useBookingsByClient(clientId: string): readonly Booking[] {
  return useAppStore((state) =>
    state.bookings.filter((b) => b.clientId === clientId)
  );
}

export function useBlockedSlotsByDate(date: string): readonly BlockedSlot[] {
  return useAppStore((state) =>
    state.blockedSlots.filter((s) => s.date === date)
  );
}

export function useQuotesByStatus(status: QuoteStatus): readonly Quote[] {
  return useAppStore((state) =>
    state.quotes.filter((q) => q.status === status)
  );
}

export function useRecentBookings(limit: number = 10): readonly Booking[] {
  return useAppStore((state) =>
    [...state.bookings]
      .filter((b) => b.status !== "cancelled")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
  );
}

export function useTodayStats() {
  const today = new Date().toISOString().split("T")[0];
  return useAppStore((state) => {
    const todayBookings = state.bookings.filter(
      (b) => b.date === today && b.status !== "cancelled"
    );
    return {
      todayCount: todayBookings.length,
      todayRevenue: todayBookings.reduce((sum, b) => sum + b.totalPrice, 0),
      pendingCount: state.bookings.filter((b) => b.status === "pending").length,
      weekCount: state.bookings.filter((b) => {
        if (b.status === "cancelled") return false;
        const bookingDate = new Date(b.date);
        const weekStart = new Date(today);
        const weekEnd = new Date(today);
        weekEnd.setDate(weekEnd.getDate() + 7);
        return bookingDate >= weekStart && bookingDate <= weekEnd;
      }).length,
    };
  });
}

export function useClientHistory(clientId: string) {
  return useAppStore((state) => {
    const clientBookings = state.bookings
      .filter((b) => b.clientId === clientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const completed = clientBookings.filter((b) => b.status === "completed");
    const totalSpent = completed.reduce((sum, b) => sum + b.totalPrice, 0);
    const lastVisit = completed[0]?.date;

    return {
      bookings: clientBookings,
      totalVisits: completed.length,
      totalSpent,
      lastVisit,
    };
  });
}
