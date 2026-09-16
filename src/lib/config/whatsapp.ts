const FALLBACK_WHATSAPP_NUMBER = "5491112345678";

export function getWhatsAppNumber(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || FALLBACK_WHATSAPP_NUMBER;
}