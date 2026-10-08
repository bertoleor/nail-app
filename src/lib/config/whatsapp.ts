export { FALLBACK_WHATSAPP_NUMBER, getEnv } from "@/lib/env";

import { FALLBACK_WHATSAPP_NUMBER, getEnv } from "@/lib/env";

const ENV_KEY = "NEXT_PUBLIC_WHATSAPP_NUMBER";

/**
 * NAIL-M3: fail-visible guard. When the WhatsApp number is not configured,
 * every reservation/quote link silently pointed to an unverified hardcoded
 * number. The fallback still exists (fail-visible, not fail-closed — this is
 * a demo, see ADR-003), but in production its use MUST be observable so a
 * misconfigured deploy is caught instead of shipping silently.
 */
export function getWhatsAppNumber(): string {
  const configured = getEnv(ENV_KEY);
  warnIfUnconfigured(configured);
  return configured ?? FALLBACK_WHATSAPP_NUMBER;
}

function warnIfUnconfigured(value: string | undefined): void {
  if (value !== undefined || process.env.NODE_ENV !== "production") {
    return;
  }
  // eslint-disable-next-line no-console -- visible misconfiguration signal (NAIL-M3)
  console.error(
    `[config] ${ENV_KEY} is not set; falling back to the built-in demo number. ` +
      "Set it in the deploy environment before going public.",
  );
}
