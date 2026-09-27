import { FALLBACK_WHATSAPP_NUMBER, getEnv } from "@/lib/env";

export { FALLBACK_WHATSAPP_NUMBER, getEnv };

export function getWhatsAppNumber(): string {
  return getEnv("NEXT_PUBLIC_WHATSAPP_NUMBER", FALLBACK_WHATSAPP_NUMBER);
}
