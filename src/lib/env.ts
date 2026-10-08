import { z } from "zod";

/**
 * Centralized, Zod-validated access to NEXT_PUBLIC_* environment variables.
 *
 * Why: process.env access scattered across the codebase is untyped and fails
 * silently (returns undefined or an empty string). This module validates each
 * variable once, applies trim + empty-string-as-unset semantics, and exposes
 * both one-shot getters (`getEnv(KEY, fallback)`) and a typed snapshot
 * (`getEnv()`).
 *
 * Scope: only vars actually consumed by the app today. Supabase vars defined
 * in `.env.example` are intentionally NOT validated here — they belong to the
 * future backend integration and should be added the same day that
 * integration ships. See ADR-003 (demo vs SaaS).
 */

const FALLBACK_WHATSAPP_NUMBER = "5491112345678";
const FALLBACK_SITE_URL = "http://localhost:3000";

const whatsappNumberSchema = z
  .string()
  .regex(/^\d+$/, { error: "WhatsApp number must contain only digits" });

const siteUrlSchema = z.url({ error: "NEXT_PUBLIC_SITE_URL must be a valid URL" });

interface PublicEnv {
  whatsappNumber: string;
  siteUrl: string;
}

function readRaw(key: string): string | undefined {
  const raw = process.env[key];
  if (raw === undefined) return undefined;
  const trimmed = raw.trim();
  return trimmed === "" ? undefined : trimmed;
}

/**
 * Overloaded env getter:
 *   getEnv()                    -> typed snapshot { whatsappNumber, siteUrl }
 *   getEnv(KEY)                 -> trimmed string | undefined
 *   getEnv(KEY, fallback)       -> trimmed string, or fallback if unset/blank
 *
 * Zod validation runs only on the snapshot path and on the named public vars.
 * The two-arg form is kept for backwards compatibility with early call sites.
 */
export function getEnv(): PublicEnv;
export function getEnv(key: string): string | undefined;
export function getEnv(key: string, fallback: string): string;
export function getEnv(key?: string, fallback?: string): unknown {
  if (key === undefined) {
    const whatsapp = whatsappNumberSchema.parse(
      readRaw("NEXT_PUBLIC_WHATSAPP_NUMBER") ?? FALLBACK_WHATSAPP_NUMBER,
    );
    const siteUrl = siteUrlSchema.parse(readRaw("NEXT_PUBLIC_SITE_URL") ?? FALLBACK_SITE_URL);
    return { whatsappNumber: whatsapp, siteUrl } satisfies PublicEnv;
  }
  const value = readRaw(key);
  if (value === undefined) return fallback;
  return value;
}

export { FALLBACK_SITE_URL, FALLBACK_WHATSAPP_NUMBER };
