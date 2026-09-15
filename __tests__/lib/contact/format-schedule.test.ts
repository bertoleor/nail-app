import { beforeEach, describe, expect, it, vi } from "vitest";

import { formatSchedule, getScheduleWhatsAppUrl } from "@/lib/contact/format-schedule";

const FALLBACK_NUMBER = "5491112345678";
const ENV_KEY = "NEXT_PUBLIC_WHATSAPP_NUMBER";

describe("formatSchedule", () => {
  it("returns the exact es-AR schedule label", () => {
    expect(formatSchedule()).toBe("Lun a Sáb · 9 a 19 h");
  });
});

describe("getScheduleWhatsAppUrl", () => {
  const originalEnv = process.env[ENV_KEY];

  beforeEach(() => {
    vi.resetModules();
    if (originalEnv === undefined) {
      delete process.env[ENV_KEY];
    } else {
      process.env[ENV_KEY] = originalEnv;
    }
  });

  it("uses the configured env number when set", () => {
    process.env[ENV_KEY] = "5491100000000";

    expect(getScheduleWhatsAppUrl()).toBe("https://wa.me/5491100000000");
  });

  it("falls back when the env variable is unset", () => {
    delete process.env[ENV_KEY];

    expect(getScheduleWhatsAppUrl()).toBe(`https://wa.me/${FALLBACK_NUMBER}`);
  });

  it("falls back when the env variable is empty", () => {
    process.env[ENV_KEY] = "";

    expect(getScheduleWhatsAppUrl()).toBe(`https://wa.me/${FALLBACK_NUMBER}`);
  });

  it("appends an encoded message when provided", () => {
    process.env[ENV_KEY] = "5491100000000";

    expect(getScheduleWhatsAppUrl("Hola, quiero un turno")).toBe(
      "https://wa.me/5491100000000?text=Hola%2C%20quiero%20un%20turno",
    );
  });
});
