import { getWhatsAppNumber } from "@/lib/config/whatsapp";

export const SCHEDULE_LABEL = "Lun a Sáb · 9 a 19 h";

const WHATSAPP_FALLBACK_NUMBER = "5491112345678";

export function formatSchedule(): string {
  return SCHEDULE_LABEL;
}

export function getScheduleWhatsAppUrl(message?: string): string {
  const number = getWhatsAppNumber() || WHATSAPP_FALLBACK_NUMBER;
  const baseUrl = `https://wa.me/${number}`;

  if (message === undefined || message === "") {
    return baseUrl;
  }

  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}
