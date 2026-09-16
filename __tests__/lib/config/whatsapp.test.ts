import { beforeEach, describe, expect, it, vi } from "vitest";

import { getWhatsAppNumber } from "@/lib/config/whatsapp";

const FALLBACK_NUMBER = "5491112345678";
const ENV_KEY = "NEXT_PUBLIC_WHATSAPP_NUMBER";

describe("getWhatsAppNumber", () => {
  const originalEnv = process.env[ENV_KEY];

  beforeEach(() => {
    vi.resetModules();
    if (originalEnv === undefined) {
      delete process.env[ENV_KEY];
    } else {
      process.env[ENV_KEY] = originalEnv;
    }
  });

  it("returns the configured env number when set", () => {
    process.env[ENV_KEY] = "5491100000000";

    expect(getWhatsAppNumber()).toBe("5491100000000");
  });

  it("falls back when the env variable is unset", () => {
    delete process.env[ENV_KEY];

    expect(getWhatsAppNumber()).toBe(FALLBACK_NUMBER);
  });

  it("falls back when the env variable is empty (never returns \"\")", () => {
    process.env[ENV_KEY] = "";

    expect(getWhatsAppNumber()).toBe(FALLBACK_NUMBER);
  });
});