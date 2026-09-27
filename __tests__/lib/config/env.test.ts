import { beforeEach, describe, expect, it, vi } from "vitest";

import { getEnv, getWhatsAppNumber } from "@/lib/config/whatsapp";

const FALLBACK_WHATSAPP_NUMBER = "5491112345678";
const WHATSAPP_KEY = "NEXT_PUBLIC_WHATSAPP_NUMBER";
const SITE_URL_KEY = "NEXT_PUBLIC_SITE_URL";
const FALLBACK_SITE_URL = "http://localhost:3000";

describe("getEnv", () => {
  const originalWhatsapp = process.env[WHATSAPP_KEY];
  const originalSiteUrl = process.env[SITE_URL_KEY];

  beforeEach(() => {
    vi.resetModules();
    if (originalWhatsapp === undefined) {
      delete process.env[WHATSAPP_KEY];
    } else {
      process.env[WHATSAPP_KEY] = originalWhatsapp;
    }
    if (originalSiteUrl === undefined) {
      delete process.env[SITE_URL_KEY];
    } else {
      process.env[SITE_URL_KEY] = originalSiteUrl;
    }
  });

  it("returns the configured value when set", () => {
    process.env[WHATSAPP_KEY] = "5491100000000";

    expect(getEnv(WHATSAPP_KEY)).toBe("5491100000000");
  });

  it("returns the fallback when the variable is unset", () => {
    delete process.env[WHATSAPP_KEY];

    expect(getEnv(WHATSAPP_KEY, FALLBACK_WHATSAPP_NUMBER)).toBe(
      FALLBACK_WHATSAPP_NUMBER,
    );
  });

  it("returns the fallback when the variable is an empty string", () => {
    process.env[WHATSAPP_KEY] = "";

    expect(getEnv(WHATSAPP_KEY, FALLBACK_WHATSAPP_NUMBER)).toBe(
      FALLBACK_WHATSAPP_NUMBER,
    );
  });

  it("returns the fallback when the variable is only whitespace", () => {
    process.env[WHATSAPP_KEY] = "   ";

    expect(getEnv(WHATSAPP_KEY, FALLBACK_WHATSAPP_NUMBER)).toBe(
      FALLBACK_WHATSAPP_NUMBER,
    );
  });

  it("trims surrounding whitespace from the configured value", () => {
    process.env[WHATSAPP_KEY] = " 5491100000000 ";

    expect(getEnv(WHATSAPP_KEY)).toBe("5491100000000");
  });

  it("keeps the fallback for the site URL when unset", () => {
    delete process.env[SITE_URL_KEY];

    expect(getEnv(SITE_URL_KEY, FALLBACK_SITE_URL)).toBe(FALLBACK_SITE_URL);
  });

  it("exposes a typed snapshot of the public app env", () => {
    process.env[WHATSAPP_KEY] = "5491100000000";
    delete process.env[SITE_URL_KEY];

    expect(getEnv().whatsappNumber).toBe("5491100000000");
    expect(getEnv().siteUrl).toBe(FALLBACK_SITE_URL);
  });
});

describe("getWhatsAppNumber (via getEnv)", () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env[WHATSAPP_KEY];
  });

  it("still falls back when the env variable is unset", () => {
    expect(getWhatsAppNumber()).toBe(FALLBACK_WHATSAPP_NUMBER);
  });
});
