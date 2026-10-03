/**
 * Fuente única de copies de UI compartidos entre superficies (admin / clienta / públicas).
 * ADR-002: es-AR único idioma, SIN framework i18n — este módulo ES la infraestructura.
 *
 * Scope (deuda 21-content): SOLO strings duplicados ENTRE superficies.
 * Strings que aparecen una sola vez viven donde se usan (evitar refactor mayor).
 * Esta tarea no reescribe el tono: mueve copies existentes, voseo intacto.
 */
import type { BookingStatus } from "@/lib/domain/booking/types";
import type { ServiceType } from "@/lib/domain/pricing/types";

/** Labels de estado de un turno — antes duplicados en admin/turnos, admin/page y admin/clientas. */
export const BOOKING_STATUS_LABELS: Readonly<Record<BookingStatus, string>> = Object.freeze({
  cancelled: "Cancelado",
  completed: "Completado",
  confirmed: "Confirmado",
  pending: "Pendiente",
});

/** Labels del tipo de sesión — antes "Nuevo"/"Mantenimiento" duplicados en 5 superficies. */
export const SERVICE_TYPE_LABELS: Readonly<Record<ServiceType, string>> = Object.freeze({
  maintenance: "Mantenimiento",
  new: "Nuevo",
});

/**
 * Labels cortos de tipo de sesión (agenda admin).
 * "Mant." es un abreviado propio de la grilla de agenda donde el espacio es crítico —
 * NO es el mismo copy que el label largo de mantenimiento (semántica de densidad distinta),
 * se mantiene separado a propósito.
 */
export const SERVICE_TYPE_LABELS_SHORT: Readonly<Record<ServiceType, string>> = Object.freeze({
  maintenance: "Mant.",
  new: "Nuevo",
});

/** Labels de campos del detalle de turno — antes duplicados entre agenda admin y wizard /reservar. */
export const BOOKING_FIELD_LABELS = Object.freeze({
  client: "Cliente",
  date: "Fecha",
  hour: "Horario",
  service: "Servicio",
  total: "Total",
});

/**
 * Grilla de horarios de atención (09:00–18:30, paso 30 min).
 * Antes duplicada literal en admin/turnos y wizard /reservar.
 * NO mover a lib/domain/booking: aunque suena a "dominio", es contenido display
 * compartido — availability.ts ya tiene sus constantes de apertura/cierre propias.
 */
export const HOURS: readonly string[] = Object.freeze([
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30",
]);

/** Actions compartidas entre superficies — "Volver"/"Continuar" quedan in situ (duplicación interna de /reservar, no cross-surface). */
export const COMMON_ACTIONS = Object.freeze({
  cancel: "Cancelar",
  sendWhatsApp: "📱 Enviar por WhatsApp",
});
