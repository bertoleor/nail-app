export type ServiceType = "new" | "maintenance";

export interface Client {
  readonly id: string;
  readonly name: string;
  readonly phone: string;
  readonly email?: string;
  readonly createdAt: string;
  readonly notes?: string;
}

export interface Service {
  readonly id: string;
  readonly name: string;
  readonly basePriceNew: number;
  readonly basePriceMaintenance: number;
  readonly durationNew: number;
  readonly durationMaintenance: number;
  readonly description?: string;
}

export interface Addon {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly duration: number;
}

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Booking {
  readonly id: string;
  readonly clientId: string;
  readonly serviceId: string;
  readonly addonIds: readonly string[];
  readonly date: string;
  readonly startTime: string;
  readonly duration: number;
  readonly type: ServiceType;
  readonly status: BookingStatus;
  readonly totalPrice: number;
  readonly notes?: string;
  readonly createdAt: string;
}

export interface BlockedSlot {
  readonly id: string;
  readonly date: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly reason: string;
}

export type QuoteStatus = "draft" | "sent" | "saved";

export interface Quote {
  readonly id: string;
  readonly clientId?: string;
  readonly clientName: string;
  readonly clientPhone: string;
  readonly serviceId: string;
  readonly addonIds: readonly string[];
  readonly type: ServiceType;
  readonly totalPrice: number;
  readonly status: QuoteStatus;
  readonly createdAt: string;
  readonly notes?: string;
}

export const MOCK_CLIENTS: readonly Client[] = [
  {
    id: "client-1",
    name: "María García",
    phone: "+54 9 11 1234-5678",
    email: "maria@email.com",
    createdAt: "2025-01-05",
    notes: "Prefiere uñas cortas, alérgica a algunos esmaltes acrílicos",
  },
  {
    id: "client-2",
    name: "Carolina López",
    phone: "+54 9 11 2345-6789",
    createdAt: "2025-01-10",
  },
  {
    id: "client-3",
    name: "Valentina Martínez",
    phone: "+54 9 11 3456-7890",
    email: "vale.martinez@gmail.com",
    createdAt: "2025-01-15",
    notes: "Siempre trae fotos de referencia de Instagram",
  },
  {
    id: "client-4",
    name: "Florencia Rodríguez",
    phone: "+54 9 11 4567-8901",
    createdAt: "2025-02-01",
  },
  {
    id: "client-5",
    name: "Camila Fernández",
    phone: "+54 9 11 5678-9012",
    email: "cami.fernandez@hotmail.com",
    createdAt: "2025-02-10",
    notes: "Viene cada 3 semanas para mantenimiento",
  },
  {
    id: "client-6",
    name: "Agustina Pérez",
    phone: "+54 9 11 6789-0123",
    createdAt: "2025-02-20",
  },
] as const;

export const MOCK_SERVICES: readonly Service[] = [
  {
    id: "manicura",
    name: "Manicura clásica",
    basePriceNew: 3500,
    basePriceMaintenance: 2500,
    durationNew: 60,
    durationMaintenance: 45,
    description: "Limpieza, forma, cutículas y esmaltado",
  },
  {
    id: "pedicura",
    name: "Pedicura completa",
    basePriceNew: 4500,
    basePriceMaintenance: 3200,
    durationNew: 90,
    durationMaintenance: 60,
    description: "Exfoliación, hidratación, forma y esmaltado",
  },
  {
    id: "acrilicas",
    name: "Uñas acrílicas",
    basePriceNew: 8000,
    basePriceMaintenance: 4500,
    durationNew: 120,
    durationMaintenance: 60,
    description: "Extensión con acrílico, diseño incluido",
  },
  {
    id: "gel",
    name: "Uñas en gel",
    basePriceNew: 7000,
    basePriceMaintenance: 4000,
    durationNew: 90,
    durationMaintenance: 60,
    description: "Gel semipermanente con dureza extra",
  },
  {
    id: "esmaltado",
    name: "Esmaltado semipermanente",
    basePriceNew: 3000,
    basePriceMaintenance: 2200,
    durationNew: 45,
    durationMaintenance: 30,
    description: "Esmaltado que dura hasta 3 semanas",
  },
] as const;

export const MOCK_ADDONS: readonly Addon[] = [
  {
    id: "diseno",
    name: "Diseño artístico",
    price: 800,
    duration: 20,
  },
  {
    id: "decoracion",
    name: "Decoración con piedras",
    price: 1200,
    duration: 25,
  },
  {
    id: "reforzado",
    name: "Reforzado extra",
    price: 500,
    duration: 10,
  },
  {
    id: "reparacion",
    name: "Reparación de uña",
    price: 300,
    duration: 5,
  },
  {
    id: "retiro",
    name: "Retiro de esmaltado anterior",
    price: 400,
    duration: 15,
  },
] as const;

const today = new Date();
const formatDay = (daysOffset: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split("T")[0];
};

export const MOCK_BOOKINGS: readonly Booking[] = [
  {
    id: "booking-1",
    clientId: "client-1",
    serviceId: "acrilicas",
    addonIds: ["diseno"],
    date: formatDay(0),
    startTime: "10:00",
    duration: 140,
    type: "maintenance",
    status: "confirmed",
    totalPrice: 5300,
    createdAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "booking-2",
    clientId: "client-3",
    serviceId: "gel",
    addonIds: ["decoracion"],
    date: formatDay(0),
    startTime: "14:00",
    duration: 115,
    type: "new",
    status: "confirmed",
    totalPrice: 8200,
    createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "booking-3",
    clientId: "client-5",
    serviceId: "manicura",
    addonIds: [],
    date: formatDay(1),
    startTime: "09:00",
    duration: 45,
    type: "maintenance",
    status: "confirmed",
    totalPrice: 2500,
    createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "booking-4",
    clientId: "client-2",
    serviceId: "pedicura",
    addonIds: ["reforzado"],
    date: formatDay(1),
    startTime: "11:00",
    duration: 100,
    type: "new",
    status: "pending",
    totalPrice: 5000,
    createdAt: new Date(today.getTime() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "booking-5",
    clientId: "client-4",
    serviceId: "esmaltado",
    addonIds: ["diseno"],
    date: formatDay(2),
    startTime: "16:00",
    duration: 65,
    type: "new",
    status: "confirmed",
    totalPrice: 3800,
    createdAt: new Date().toISOString(),
  },
  {
    id: "booking-6",
    clientId: "client-6",
    serviceId: "acrilicas",
    addonIds: ["decoracion", "reforzado"],
    date: formatDay(3),
    startTime: "10:00",
    duration: 165,
    type: "new",
    status: "pending",
    totalPrice: 9700,
    createdAt: new Date().toISOString(),
  },
  {
    id: "booking-7",
    clientId: "client-1",
    serviceId: "manicura",
    addonIds: [],
    date: formatDay(5),
    startTime: "15:00",
    duration: 45,
    type: "maintenance",
    status: "confirmed",
    totalPrice: 2500,
    createdAt: new Date().toISOString(),
  },
  {
    id: "booking-8",
    clientId: "client-3",
    serviceId: "gel",
    addonIds: [],
    date: formatDay(-7),
    startTime: "11:00",
    duration: 60,
    type: "maintenance",
    status: "completed",
    totalPrice: 4000,
    createdAt: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "booking-9",
    clientId: "client-5",
    serviceId: "acrilicas",
    addonIds: ["diseno"],
    date: formatDay(-14),
    startTime: "10:00",
    duration: 140,
    type: "maintenance",
    status: "completed",
    totalPrice: 5300,
    createdAt: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "booking-10",
    clientId: "client-2",
    serviceId: "esmaltado",
    addonIds: [],
    date: formatDay(-3),
    startTime: "17:00",
    duration: 30,
    type: "maintenance",
    status: "cancelled",
    totalPrice: 2200,
    createdAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Canceló por enfermedad",
  },
] as const;

export const MOCK_BLOCKED_SLOTS: readonly BlockedSlot[] = [
  {
    id: "blocked-1",
    date: formatDay(4),
    startTime: "09:00",
    endTime: "12:00",
    reason: "Curso de capacitación",
  },
  {
    id: "blocked-2",
    date: formatDay(7),
    startTime: "14:00",
    endTime: "19:00",
    reason: "Personal",
  },
  {
    id: "blocked-3",
    date: formatDay(10),
    startTime: "09:00",
    endTime: "19:00",
    reason: "Feriado",
  },
] as const;

export const MOCK_QUOTES: readonly Quote[] = [
  {
    id: "quote-1",
    clientId: "client-1",
    clientName: "María García",
    clientPhone: "+54 9 11 1234-5678",
    serviceId: "acrilicas",
    addonIds: ["diseno", "decoracion"],
    type: "new",
    totalPrice: 10000,
    status: "sent",
    createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "quote-2",
    clientName: "Cliente nuevo",
    clientPhone: "+54 9 11 9999-8888",
    serviceId: "gel",
    addonIds: ["reforzado"],
    type: "new",
    totalPrice: 7500,
    status: "draft",
    createdAt: new Date().toISOString(),
    notes: "Consulta por Instagram",
  },
  {
    id: "quote-3",
    clientId: "client-3",
    clientName: "Valentina Martínez",
    clientPhone: "+54 9 11 3456-7890",
    serviceId: "pedicura",
    addonIds: [],
    type: "maintenance",
    totalPrice: 3200,
    status: "saved",
    createdAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
] as const;

export function getClientById(id: string): Client | undefined {
  return MOCK_CLIENTS.find((c) => c.id === id);
}

export function getServiceById(id: string): Service | undefined {
  return MOCK_SERVICES.find((s) => s.id === id);
}

export function getAddonById(id: string): Addon | undefined {
  return MOCK_ADDONS.find((a) => a.id === id);
}

export function getBookingsByDate(date: string): readonly Booking[] {
  return MOCK_BOOKINGS.filter((b) => b.date === date && b.status !== "cancelled");
}

export function getBookingsByClient(clientId: string): readonly Booking[] {
  return MOCK_BOOKINGS.filter((b) => b.clientId === clientId);
}

export function getBlockedSlotsByDate(date: string): readonly BlockedSlot[] {
  return MOCK_BLOCKED_SLOTS.filter((s) => s.date === date);
}

export function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-AR")}`;
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("54") && cleaned.length >= 12) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 8)}-${cleaned.slice(8)}`;
  }
  return phone;
}
