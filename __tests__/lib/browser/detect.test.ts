import { describe, expect, it } from "vitest";
import {
  detectBrowser,
  getOptimalAnimationDuration,
  getOptimalGlassOpacity,
  shouldReduceMotion,
} from "@/lib/browser/detect";
import { createMockBrowser } from "../utils/test-helpers";

describe("Browser Detection", () => {
  describe("detectBrowser", () => {
    it("returns default values on server", () => {
      const result = detectBrowser();

      expect(result.isSafari).toBe(false);
      expect(result.isFirefox).toBe(false);
      expect(result.isChrome).toBe(false);
      expect(result.isMobile).toBe(false);
    });
  });

  describe("getOptimalAnimationDuration", () => {
    it("returns shorter duration for mobile", () => {
      const mobileBrowser = createMockBrowser({ isMobile: true });
      const result = getOptimalAnimationDuration(mobileBrowser);

      expect(result).toBe(150);
    });

    it("returns longer duration for desktop", () => {
      const desktopBrowser = createMockBrowser({ isMobile: false });
      const result = getOptimalAnimationDuration(desktopBrowser);

      expect(result).toBe(300);
    });
  });

  describe("getOptimalGlassOpacity", () => {
    it("returns higher opacity when backdrop-filter not supported", () => {
      const browser = createMockBrowser({ supportsBackdropFilter: false, isSafari: false });
      const result = getOptimalGlassOpacity(browser);

      expect(result).toBe(0.85);
    });

    it("returns lower opacity for Safari", () => {
      const browser = createMockBrowser({ supportsBackdropFilter: true, isSafari: true });
      const result = getOptimalGlassOpacity(browser);

      expect(result).toBe(0.4);
    });

    it("returns default opacity for Chrome", () => {
      const browser = createMockBrowser({ supportsBackdropFilter: true, isSafari: false });
      const result = getOptimalGlassOpacity(browser);

      expect(result).toBe(0.38);
    });
  });

  describe("shouldReduceMotion", () => {
    it("returns false on server", () => {
      const result = shouldReduceMotion();

      expect(result).toBe(false);
    });
  });
});
