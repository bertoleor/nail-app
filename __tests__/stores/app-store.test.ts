import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import {
  useAppStore,
  useClient,
  useBookingsByDate,
  useBookingsByClient,
  useBlockedSlotsByDate,
  useTodayStats,
  useClientHistory,
} from "@/stores/app-store";

describe("App Store", () => {
  beforeEach(() => {
    useAppStore.setState({
      clients: [],
      bookings: [],
      blockedSlots: [],
      quotes: [],
    });
  });

  describe("addClient", () => {
    it("adds a new client with generated id", () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.addClient({
          name: "Test Client",
          phone: "+54 9 11 1234-5678",
        });
      });

      expect(result.current.clients).toHaveLength(1);
      expect(result.current.clients[0].name).toBe("Test Client");
      expect(result.current.clients[0].id).toBeDefined();
      expect(result.current.clients[0].createdAt).toBeDefined();
    });

    it("adds client with optional fields", () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.addClient({
          name: "Test Client",
          phone: "+54 9 11 1234-5678",
          email: "test@email.com",
          notes: "Test notes",
        });
      });

      expect(result.current.clients[0].email).toBe("test@email.com");
      expect(result.current.clients[0].notes).toBe("Test notes");
    });
  });

  describe("updateClient", () => {
    it("updates existing client", () => {
      const { result } = renderHook(() => useAppStore());

      let clientId: string;
      act(() => {
        const client = result.current.addClient({
          name: "Original Name",
          phone: "+54 9 11 1234-5678",
        });
        clientId = client.id;
      });

      act(() => {
        result.current.updateClient(clientId!, { name: "Updated Name" });
      });

      expect(result.current.clients[0].name).toBe("Updated Name");
    });
  });

  describe("addBooking", () => {
    it("adds a new booking with generated id", () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.addBooking({
          clientId: "client-1",
          serviceId: "manicura",
          addonIds: [],
          date: "2025-01-15",
          startTime: "10:00",
          duration: 60,
          type: "new",
          status: "pending",
          totalPrice: 3500,
        });
      });

      expect(result.current.bookings).toHaveLength(1);
      expect(result.current.bookings[0].id).toBeDefined();
      expect(result.current.bookings[0].createdAt).toBeDefined();
    });
  });

  describe("updateBookingStatus", () => {
    it("updates booking status", () => {
      const { result } = renderHook(() => useAppStore());

      let bookingId: string;
      act(() => {
        const booking = result.current.addBooking({
          clientId: "client-1",
          serviceId: "manicura",
          addonIds: [],
          date: "2025-01-15",
          startTime: "10:00",
          duration: 60,
          type: "new",
          status: "pending",
          totalPrice: 3500,
        });
        bookingId = booking.id;
      });

      act(() => {
        result.current.updateBookingStatus(bookingId!, "confirmed");
      });

      expect(result.current.bookings[0].status).toBe("confirmed");
    });
  });

  describe("cancelBooking", () => {
    it("cancels booking with optional notes", () => {
      const { result } = renderHook(() => useAppStore());

      let bookingId: string;
      act(() => {
        const booking = result.current.addBooking({
          clientId: "client-1",
          serviceId: "manicura",
          addonIds: [],
          date: "2025-01-15",
          startTime: "10:00",
          duration: 60,
          type: "new",
          status: "confirmed",
          totalPrice: 3500,
        });
        bookingId = booking.id;
      });

      act(() => {
        result.current.cancelBooking(bookingId!, "Client cancelled");
      });

      expect(result.current.bookings[0].status).toBe("cancelled");
      expect(result.current.bookings[0].notes).toBe("Client cancelled");
    });
  });

  describe("addBlockedSlot", () => {
    it("adds a blocked slot", () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.addBlockedSlot({
          date: "2025-01-15",
          startTime: "09:00",
          endTime: "12:00",
          reason: "Holiday",
        });
      });

      expect(result.current.blockedSlots).toHaveLength(1);
      expect(result.current.blockedSlots[0].reason).toBe("Holiday");
    });
  });

  describe("removeBlockedSlot", () => {
    it("removes blocked slot by id", () => {
      const { result } = renderHook(() => useAppStore());

      let slotId: string;
      act(() => {
        const slot = result.current.addBlockedSlot({
          date: "2025-01-15",
          startTime: "09:00",
          endTime: "12:00",
          reason: "Holiday",
        });
        slotId = slot.id;
      });

      act(() => {
        result.current.removeBlockedSlot(slotId!);
      });

      expect(result.current.blockedSlots).toHaveLength(0);
    });
  });

  describe("addQuote", () => {
    it("adds a new quote", () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.addQuote({
          clientName: "Test Client",
          clientPhone: "+54 9 11 1234-5678",
          serviceId: "manicura",
          addonIds: [],
          type: "new",
          totalPrice: 3500,
          status: "draft",
        });
      });

      expect(result.current.quotes).toHaveLength(1);
    });
  });

  describe("saveQuoteToClient", () => {
    it("links quote to client and updates status", () => {
      const { result } = renderHook(() => useAppStore());

      let quoteId: string;
      act(() => {
        const quote = result.current.addQuote({
          clientName: "Test Client",
          clientPhone: "+54 9 11 1234-5678",
          serviceId: "manicura",
          addonIds: [],
          type: "new",
          totalPrice: 3500,
          status: "draft",
        });
        quoteId = quote.id;
      });

      act(() => {
        result.current.saveQuoteToClient(quoteId!, "client-1");
      });

      expect(result.current.quotes[0].clientId).toBe("client-1");
      expect(result.current.quotes[0].status).toBe("saved");
    });
  });
});

describe("Store Hooks", () => {
  beforeEach(() => {
    useAppStore.setState({
      clients: [],
      bookings: [],
      blockedSlots: [],
      quotes: [],
    });
  });

  describe("useClient", () => {
    it("returns client by id", () => {
      const { result } = renderHook(() => useAppStore());

      let clientId: string;
      act(() => {
        const client = result.current.addClient({
          name: "Test Client",
          phone: "+54 9 11 1234-5678",
        });
        clientId = client.id;
      });

      const { result: clientResult } = renderHook(() => useClient(clientId!));
      expect(clientResult.current?.name).toBe("Test Client");
    });

    it("returns undefined for non-existent client", () => {
      const { result } = renderHook(() => useClient("non-existent"));
      expect(result.current).toBeUndefined();
    });
  });

  describe("useBookingsByDate", () => {
    it("returns bookings for specific date", () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.addBooking({
          clientId: "client-1",
          serviceId: "manicura",
          addonIds: [],
          date: "2025-01-15",
          startTime: "10:00",
          duration: 60,
          type: "new",
          status: "confirmed",
          totalPrice: 3500,
        });
      });

      const { result: bookingsResult } = renderHook(() =>
        useBookingsByDate("2025-01-15")
      );
      expect(bookingsResult.current).toHaveLength(1);
    });

    it("filters out cancelled bookings", () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.addBooking({
          clientId: "client-1",
          serviceId: "manicura",
          addonIds: [],
          date: "2025-01-15",
          startTime: "10:00",
          duration: 60,
          type: "new",
          status: "cancelled",
          totalPrice: 3500,
        });
      });

      const { result: bookingsResult } = renderHook(() =>
        useBookingsByDate("2025-01-15")
      );
      expect(bookingsResult.current).toHaveLength(0);
    });
  });

  describe("useBookingsByClient", () => {
    it("returns all bookings for a client", () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.addBooking({
          clientId: "client-1",
          serviceId: "manicura",
          addonIds: [],
          date: "2025-01-15",
          startTime: "10:00",
          duration: 60,
          type: "new",
          status: "confirmed",
          totalPrice: 3500,
        });
        result.current.addBooking({
          clientId: "client-1",
          serviceId: "pedicura",
          addonIds: [],
          date: "2025-01-16",
          startTime: "11:00",
          duration: 90,
          type: "maintenance",
          status: "confirmed",
          totalPrice: 3200,
        });
      });

      const { result: bookingsResult } = renderHook(() =>
        useBookingsByClient("client-1")
      );
      expect(bookingsResult.current).toHaveLength(2);
    });
  });

  describe("useTodayStats", () => {
    it("calculates today stats correctly", () => {
      const today = new Date().toISOString().split("T")[0];
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.addBooking({
          clientId: "client-1",
          serviceId: "manicura",
          addonIds: [],
          date: today,
          startTime: "10:00",
          duration: 60,
          type: "new",
          status: "confirmed",
          totalPrice: 3500,
        });
        result.current.addBooking({
          clientId: "client-2",
          serviceId: "pedicura",
          addonIds: [],
          date: today,
          startTime: "14:00",
          duration: 90,
          type: "new",
          status: "pending",
          totalPrice: 4500,
        });
      });

      const { result: statsResult } = renderHook(() => useTodayStats());
      expect(statsResult.current.todayCount).toBe(2);
      expect(statsResult.current.todayRevenue).toBe(8000);
      expect(statsResult.current.pendingCount).toBe(1);
    });
  });

  describe("useClientHistory", () => {
    it("calculates client history correctly", () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.addBooking({
          clientId: "client-1",
          serviceId: "manicura",
          addonIds: [],
          date: "2025-01-10",
          startTime: "10:00",
          duration: 60,
          type: "new",
          status: "completed",
          totalPrice: 3500,
        });
        result.current.addBooking({
          clientId: "client-1",
          serviceId: "pedicura",
          addonIds: [],
          date: "2025-01-15",
          startTime: "11:00",
          duration: 90,
          type: "maintenance",
          status: "completed",
          totalPrice: 3200,
        });
        result.current.addBooking({
          clientId: "client-1",
          serviceId: "gel",
          addonIds: [],
          date: "2025-01-20",
          startTime: "14:00",
          duration: 90,
          type: "new",
          status: "cancelled",
          totalPrice: 7000,
        });
      });

      const { result: historyResult } = renderHook(() =>
        useClientHistory("client-1")
      );
      expect(historyResult.current.totalVisits).toBe(2);
      expect(historyResult.current.totalSpent).toBe(6700);
      expect(historyResult.current.bookings).toHaveLength(3);
    });
  });
});
