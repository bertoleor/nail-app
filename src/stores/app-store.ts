import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

import type {
  BlockedSlot,
  Booking,
  BookingStatus,
  Client,
  Quote,
  QuoteStatus,
} from "@/lib/mock/data";
import { MOCK_BLOCKED_SLOTS, MOCK_BOOKINGS, MOCK_CLIENTS, MOCK_QUOTES } from "@/lib/mock/data";

interface AppState {
  readonly addBlockedSlot: (slot: Omit<BlockedSlot, "id">) => BlockedSlot;
  readonly addBooking: (booking: Omit<Booking, "createdAt" | "id">) => Booking;
  readonly addClient: (client: Omit<Client, "createdAt" | "id">) => Client;
  readonly addQuote: (quote: Omit<Quote, "createdAt" | "id">) => Quote;

  readonly blockedSlots: readonly BlockedSlot[];
  readonly bookings: readonly Booking[];

  readonly cancelBooking: (id: string, notes?: string) => void;
  readonly clients: readonly Client[];
  readonly quotes: readonly Quote[];

  readonly removeBlockedSlot: (id: string) => void;
  readonly saveQuoteToClient: (quoteId: string, clientId: string) => void;

  readonly updateBookingStatus: (id: string, status: BookingStatus) => void;
  readonly updateClient: (id: string, data: Partial<Client>) => void;
  readonly updateQuoteStatus: (id: string, status: QuoteStatus) => void;
}

let clientIdCounter = MOCK_CLIENTS.length + 1;
let bookingIdCounter = MOCK_BOOKINGS.length + 1;
let blockedSlotIdCounter = MOCK_BLOCKED_SLOTS.length + 1;
let quoteIdCounter = MOCK_QUOTES.length + 1;

const generateId = (prefix: string, counter: number) => `${prefix}-${counter}`;

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
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
      addBooking: (bookingData) => {
        const newBooking: Booking = {
          ...bookingData,
          createdAt: new Date().toISOString(),
          id: generateId("booking", bookingIdCounter++),
        };
        set((state) => ({ bookings: [...state.bookings, newBooking] }));
        return newBooking;
      },
      addClient: (clientData) => {
        const newClient: Client = {
          ...clientData,
          createdAt: new Date().toISOString().split("T")[0],
          id: generateId("client", clientIdCounter++),
        };
        set((state) => ({ clients: [...state.clients, newClient] }));
        return newClient;
      },
      addQuote: (quoteData) => {
        const newQuote: Quote = {
          ...quoteData,
          createdAt: new Date().toISOString(),
          id: generateId("quote", quoteIdCounter++),
        };
        set((state) => ({ quotes: [...state.quotes, newQuote] }));
        return newQuote;
      },

      blockedSlots: [...MOCK_BLOCKED_SLOTS],

      bookings: [...MOCK_BOOKINGS],

      cancelBooking: (id, notes) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id ? { ...b, notes, status: "cancelled" as BookingStatus } : b,
          ),
        }));
      },

      clients: [...MOCK_CLIENTS],

      quotes: [...MOCK_QUOTES],

      removeBlockedSlot: (id) => {
        set((state) => ({
          blockedSlots: state.blockedSlots.filter((s) => s.id !== id),
        }));
      },

      saveQuoteToClient: (quoteId, clientId) => {
        set((state) => ({
          quotes: state.quotes.map((q) =>
            q.id === quoteId ? { ...q, clientId, status: "saved" as QuoteStatus } : q,
          ),
        }));
      },

      updateBookingStatus: (id, status) => {
        set((state) => ({
          bookings: state.bookings.map((b) => (b.id === id ? { ...b, status } : b)),
        }));
      },

      updateClient: (id, data) => {
        set((state) => ({
          clients: state.clients.map((c) => (c.id === id ? { ...c, ...data } : c)),
        }));
      },

      updateQuoteStatus: (id, status) => {
        set((state) => ({
          quotes: state.quotes.map((q) => (q.id === id ? { ...q, status } : q)),
        }));
      },
    }),
    {
      name: "nail-app-storage",
      partialize: (state) => ({
        blockedSlots: state.blockedSlots,
        bookings: state.bookings,
        clients: state.clients,
        quotes: state.quotes,
      }),
    },
  ),
);

export function useBlockedSlotsByDate(date: string): readonly BlockedSlot[] {
  return useAppStore(useShallow((state) => state.blockedSlots.filter((s) => s.date === date)));
}

export function useBookingsByClient(clientId: string): readonly Booking[] {
  return useAppStore(useShallow((state) => state.bookings.filter((b) => b.clientId === clientId)));
}

export function useBookingsByDate(date: string): readonly Booking[] {
  return useAppStore(
    useShallow((state) =>
      state.bookings.filter((b) => b.date === date && b.status !== "cancelled"),
    ),
  );
}

export function useClient(id: string): Client | undefined {
  return useAppStore((state) => state.clients.find((c) => c.id === id));
}

export function useClientHistory(clientId: string) {
  const bookings = useAppStore(
    useShallow((state) =>
      state.bookings
        .filter((b) => b.clientId === clientId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    ),
  );

  const completed = bookings.filter((b) => b.status === "completed");
  const totalSpent = completed.reduce((sum, b) => sum + b.totalPrice, 0);
  const lastVisit = completed[0]?.date;

  return {
    bookings,
    lastVisit,
    totalSpent,
    totalVisits: completed.length,
  };
}

export function useQuotesByStatus(status: QuoteStatus): readonly Quote[] {
  return useAppStore(useShallow((state) => state.quotes.filter((q) => q.status === status)));
}

export function useRecentBookings(limit = 10): readonly Booking[] {
  return useAppStore(
    useShallow((state) =>
      [...state.bookings]
        .filter((b) => b.status !== "cancelled")
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit),
    ),
  );
}

export function useTodayStats() {
  const today = new Date().toISOString().split("T")[0];
  return useAppStore(
    useShallow((state) => {
      const todayBookings = state.bookings.filter(
        (b) => b.date === today && b.status !== "cancelled",
      );
      return {
        pendingCount: state.bookings.filter((b) => b.status === "pending").length,
        todayCount: todayBookings.length,
        todayRevenue: todayBookings.reduce((sum, b) => sum + b.totalPrice, 0),
        weekCount: state.bookings.filter((b) => {
          if (b.status === "cancelled") {
            return false;
          }
          const bookingDate = new Date(b.date);
          const weekStart = new Date(today);
          const weekEnd = new Date(today);
          weekEnd.setDate(weekEnd.getDate() + 7);
          return bookingDate >= weekStart && bookingDate <= weekEnd;
        }).length,
      };
    }),
  );
}

export { MOCK_BLOCKED_SLOTS, MOCK_BOOKINGS, MOCK_CLIENTS, MOCK_QUOTES } from "@/lib/mock/data";
