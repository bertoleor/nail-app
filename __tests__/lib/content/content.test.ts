import { describe, expect, it } from "vitest";

import {
  BOOKING_FIELD_LABELS,
  BOOKING_STATUS_LABELS,
  HOURS,
  SERVICE_TYPE_LABELS,
} from "@/lib/content";

describe("lib/content — fuente única de copies es-AR", () => {
  it("expone labels de estado de turno para los 4 BookingStatus", () => {
    expect(Object.keys(BOOKING_STATUS_LABELS).sort()).toEqual([
      "cancelled",
      "completed",
      "confirmed",
      "pending",
    ]);
    expect(BOOKING_STATUS_LABELS.confirmed).toBe("Confirmado");
    expect(BOOKING_STATUS_LABELS.pending).toBe("Pendiente");
    expect(BOOKING_STATUS_LABELS.completed).toBe("Completado");
    expect(BOOKING_STATUS_LABELS.cancelled).toBe("Cancelado");
  });

  it("expone labels de tipo de sesión (nuevo/mantenimiento)", () => {
    expect(SERVICE_TYPE_LABELS.new).toBe("Nuevo");
    expect(SERVICE_TYPE_LABELS.maintenance).toBe("Mantenimiento");
  });

  it("expone labels compartidos de campos del turno", () => {
    expect(BOOKING_FIELD_LABELS.client).toBe("Cliente");
    expect(BOOKING_FIELD_LABELS.service).toBe("Servicio");
    expect(BOOKING_FIELD_LABELS.date).toBe("Fecha");
    expect(BOOKING_FIELD_LABELS.hour).toBe("Horario");
    expect(BOOKING_FIELD_LABELS.total).toBe("Total");
  });

  it("expone la grilla de horarios compartida por agenda admin y wizard cliente", () => {
    expect(HOURS).toHaveLength(20);
    expect(HOURS[0]).toBe("09:00");
    expect(HOURS[HOURS.length - 1]).toBe("18:30");
    // paso a paso de 30 min sin huecos
    const toMin = (h: string) => Number.parseInt(h.split(":")[0]) * 60 + Number.parseInt(h.split(":")[1]);
    for (let i = 1; i < HOURS.length; i += 1) {
      expect(toMin(HOURS[i]) - toMin(HOURS[i - 1])).toBe(30);
    }
  });

  it("está congelado (no mutación accidental de copies)", () => {
    expect(Object.isFrozen(BOOKING_STATUS_LABELS)).toBe(true);
    expect(Object.isFrozen(HOURS)).toBe(true);
    expect(Object.isFrozen(SERVICE_TYPE_LABELS)).toBe(true);
    expect(Object.isFrozen(BOOKING_FIELD_LABELS)).toBe(true);
  });
});
