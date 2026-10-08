import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

  it('falls back when the env variable is empty (never returns "")', () => {
    process.env[ENV_KEY] = "";

    expect(getWhatsAppNumber()).toBe(FALLBACK_NUMBER);
  });
});

describe("getWhatsAppNumber — NAIL-M3 fail-visible guard (production)", () => {
  // `as Record` bypasses next-env's read-only NODE_ENV typing in tests.
  const env = process.env as Record<string, string | undefined>;
  const originalNodeEnv = env.NODE_ENV;
  const originalWaNumber = env[ENV_KEY];

  beforeEach(() => {
    vi.resetModules();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    env["NODE_ENV"] = originalNodeEnv;
    if (originalWaNumber === undefined) {
      delete process.env[ENV_KEY];
    } else {
      process.env[ENV_KEY] = originalWaNumber;
    }
    vi.restoreAllMocks();
  });

  it("logs a visible error in production when NEXT_PUBLIC_WHATSAPP_NUMBER is unset", () => {
    delete process.env[ENV_KEY];
    env["NODE_ENV"] = "production";

    getWhatsAppNumber();

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("NEXT_PUBLIC_WHATSAPP_NUMBER"),
    );
  });

  it("logs a visible error in production when the variable is blank", () => {
    process.env[ENV_KEY] = "   ";
    env["NODE_ENV"] = "production";

    getWhatsAppNumber();

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("NEXT_PUBLIC_WHATSAPP_NUMBER"),
    );
  });

  it("still returns the fallback number (fail-visible, not fail-closed)", () => {
    delete process.env[ENV_KEY];
    env["NODE_ENV"] = "production";

    expect(getWhatsAppNumber()).toBe(FALLBACK_NUMBER);
  });

  it("does not warn in development when the variable is unset", () => {
    delete process.env[ENV_KEY];
    env["NODE_ENV"] = "development";

    getWhatsAppNumber();

    expect(console.error).not.toHaveBeenCalled();
  });
});
