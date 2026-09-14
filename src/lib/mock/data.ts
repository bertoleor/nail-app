import type { Addon, Service, ServiceType } from "@/lib/domain/pricing";
import { ADDONS, SERVICES } from "@/lib/domain/pricing";

export type { Addon, Service, ServiceType } from "@/lib/domain/pricing";

export interface BlockedSlot {
  readonly date: string;
  readonly endTime: string;
  readonly id: string;
  readonly reason: string;
  readonly startTime: string;
}

export interface Booking {
  readonly addonIds: readonly string[];
  readonly clientId: string;
  readonly createdAt: string;
  readonly date: string;
  readonly duration: number;
  readonly id: string;
  readonly notes?: string;
  readonly serviceId: string;
  readonly startTime: string;
  readonly status: BookingStatus;
  readonly totalPrice: number;
  readonly type: ServiceType;
}

export type BookingStatus = "cancelled" | "completed" | "confirmed" | "pending";

export interface Client {
  readonly createdAt: string;
  readonly email?: string;
  readonly id: string;
  readonly name: string;
  readonly notes?: string;
  readonly phone: string;
}

export interface Quote {
  readonly addonIds: readonly string[];
  readonly clientId?: string;
  readonly clientName: string;
  readonly clientPhone: string;
  readonly createdAt: string;
  readonly id: string;
  readonly notes?: string;
  readonly serviceId: string;
  readonly status: QuoteStatus;
  readonly totalPrice: number;
  readonly type: ServiceType;
}

export type QuoteStatus = "draft" | "saved" | "sent";

export const MOCK_SERVICES: readonly Service[] = SERVICES;

export const MOCK_CLIENTS: readonly Client[] = [
  {
    createdAt: "2025-01-05",
    email: "maria@email.com",
    id: "client-1",
    name: "María García",
    notes: "Prefiere uñas cortas, alérgica a algunos esmaltes acrílicos",
    phone: "+54 9 11 1234-5678",
  },
  {
    createdAt: "2025-01-10",
    id: "client-2",
    name: "Carolina López",
    phone: "+54 9 11 2345-6789",
  },
  {
    createdAt: "2025-01-15",
    email: "vale.martinez@gmail.com",
    id: "client-3",
    name: "Valentina Martínez",
    notes: "Siempre trae fotos de referencia de Instagram",
    phone: "+54 9 11 3456-7890",
  },
  {
    createdAt: "2025-02-01",
    id: "client-4",
    name: "Florencia Rodríguez",
    phone: "+54 9 11 4567-8901",
  },
  {
    createdAt: "2025-02-10",
    email: "cami.fernandez@hotmail.com",
    id: "client-5",
    name: "Camila Fernández",
    notes: "Viene cada 3 semanas para mantenimiento",
    phone: "+54 9 11 5678-9012",
  },
  {
    createdAt: "2025-02-20",
    id: "client-6",
    name: "Agustina Pérez",
    phone: "+54 9 11 6789-0123",
  },
] as const;

export const MOCK_ADDONS: readonly Addon[] = ADDONS;

const today = new Date();
const formatDay = (daysOffset: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split("T")[0];
};

export const MOCK_BOOKINGS: readonly Booking[] = [
  {
    addonIds: ["diseno"],
    clientId: "client-1",
    createdAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    date: formatDay(0),
    duration: 140,
    id: "booking-1",
    serviceId: "acrilicas",
    startTime: "10:00",
    status: "confirmed",
    totalPrice: 5300,
    type: "maintenance",
  },
  {
    addonIds: ["decoracion"],
    clientId: "client-3",
    createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    date: formatDay(0),
    duration: 115,
    id: "booking-2",
    serviceId: "gel",
    startTime: "14:00",
    status: "confirmed",
    totalPrice: 8200,
    type: "new",
  },
  {
    addonIds: [],
    clientId: "client-5",
    createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    date: formatDay(1),
    duration: 45,
    id: "booking-3",
    serviceId: "manicura",
    startTime: "09:00",
    status: "confirmed",
    totalPrice: 2500,
    type: "maintenance",
  },
  {
    addonIds: ["reforzado"],
    clientId: "client-2",
    createdAt: new Date(today.getTime() - 12 * 60 * 60 * 1000).toISOString(),
    date: formatDay(1),
    duration: 100,
    id: "booking-4",
    serviceId: "pedicura",
    startTime: "11:00",
    status: "pending",
    totalPrice: 5000,
    type: "new",
  },
  {
    addonIds: ["diseno"],
    clientId: "client-4",
    createdAt: new Date().toISOString(),
    date: formatDay(2),
    duration: 65,
    id: "booking-5",
    serviceId: "esmaltado",
    startTime: "16:00",
    status: "confirmed",
    totalPrice: 3800,
    type: "new",
  },
  {
    addonIds: ["decoracion", "reforzado"],
    clientId: "client-6",
    createdAt: new Date().toISOString(),
    date: formatDay(3),
    duration: 165,
    id: "booking-6",
    serviceId: "acrilicas",
    startTime: "10:00",
    status: "pending",
    totalPrice: 9700,
    type: "new",
  },
  {
    addonIds: [],
    clientId: "client-1",
    createdAt: new Date().toISOString(),
    date: formatDay(5),
    duration: 45,
    id: "booking-7",
    serviceId: "manicura",
    startTime: "15:00",
    status: "confirmed",
    totalPrice: 2500,
    type: "maintenance",
  },
  {
    addonIds: [],
    clientId: "client-3",
    createdAt: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    date: formatDay(-7),
    duration: 60,
    id: "booking-8",
    serviceId: "gel",
    startTime: "11:00",
    status: "completed",
    totalPrice: 4000,
    type: "maintenance",
  },
  {
    addonIds: ["diseno"],
    clientId: "client-5",
    createdAt: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    date: formatDay(-14),
    duration: 140,
    id: "booking-9",
    serviceId: "acrilicas",
    startTime: "10:00",
    status: "completed",
    totalPrice: 5300,
    type: "maintenance",
  },
  {
    addonIds: [],
    clientId: "client-2",
    createdAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    date: formatDay(-3),
    duration: 30,
    id: "booking-10",
    notes: "Canceló por enfermedad",
    serviceId: "esmaltado",
    startTime: "17:00",
    status: "cancelled",
    totalPrice: 2200,
    type: "maintenance",
  },
] as const;

export const MOCK_BLOCKED_SLOTS: readonly BlockedSlot[] = [
  {
    date: formatDay(4),
    endTime: "12:00",
    id: "blocked-1",
    reason: "Curso de capacitación",
    startTime: "09:00",
  },
  {
    date: formatDay(7),
    endTime: "19:00",
    id: "blocked-2",
    reason: "Personal",
    startTime: "14:00",
  },
  {
    date: formatDay(10),
    endTime: "19:00",
    id: "blocked-3",
    reason: "Feriado",
    startTime: "09:00",
  },
] as const;

export const MOCK_QUOTES: readonly Quote[] = [
  {
    addonIds: ["diseno", "decoracion"],
    clientId: "client-1",
    clientName: "María García",
    clientPhone: "+54 9 11 1234-5678",
    createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    id: "quote-1",
    serviceId: "acrilicas",
    status: "sent",
    totalPrice: 10_000,
    type: "new",
  },
  {
    addonIds: ["reforzado"],
    clientName: "Cliente nuevo",
    clientPhone: "+54 9 11 9999-8888",
    createdAt: new Date().toISOString(),
    id: "quote-2",
    notes: "Consulta por Instagram",
    serviceId: "gel",
    status: "draft",
    totalPrice: 7500,
    type: "new",
  },
  {
    addonIds: [],
    clientId: "client-3",
    clientName: "Valentina Martínez",
    clientPhone: "+54 9 11 3456-7890",
    createdAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    id: "quote-3",
    serviceId: "pedicura",
    status: "saved",
    totalPrice: 3200,
    type: "maintenance",
  },
] as const;

export function formatPhone(phone: string): string {
  const cleaned = phone.replaceAll(/\D/g, "");
  if (cleaned.startsWith("54") && cleaned.length >= 12) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 8)}-${cleaned.slice(8)}`;
  }
  return phone;
}

export function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-AR")}`;
}

export function getAddonById(id: string): Addon | undefined {
  return MOCK_ADDONS.find((a) => a.id === id);
}

export function getBlockedSlotsByDate(date: string): readonly BlockedSlot[] {
  return MOCK_BLOCKED_SLOTS.filter((s) => s.date === date);
}

export function getBookingsByClient(clientId: string): readonly Booking[] {
  return MOCK_BOOKINGS.filter((b) => b.clientId === clientId);
}

export function getBookingsByDate(date: string): readonly Booking[] {
  return MOCK_BOOKINGS.filter((b) => b.date === date && b.status !== "cancelled");
}

export function getClientById(id: string): Client | undefined {
  return MOCK_CLIENTS.find((c) => c.id === id);
}

export function getServiceById(id: string): Service | undefined {
  return MOCK_SERVICES.find((s) => s.id === id);
}
