import { getWhatsAppNumber } from "@/lib/config/whatsapp";

export const SCHEDULE_LABEL = "Lun a Sáb · 9 a 19 h";

export function formatSchedule(): string {
  return SCHEDULE_LABEL;
}

export function getScheduleWhatsAppUrl(message?: string): string {
  // NAIL-M3: single source of truth — the fallback number lives ONLY in
  // @/lib/env (re-exported via @/lib/config/whatsapp). This module must not
  // keep its own copy; the source guard in format-schedule.test.ts enforces it.
  const baseUrl = `https://wa.me/${getWhatsAppNumber()}`;

  if (message === undefined || message === "") {
    return baseUrl;
  }

  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}
