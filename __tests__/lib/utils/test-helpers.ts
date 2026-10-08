import type { BrowserInfo } from "@/lib/browser/detect";

const DEFAULT_BROWSER: BrowserInfo = {
  isSafari: false,
  isFirefox: false,
  isChrome: false,
  isMobile: false,
  isIOS: false,
  isAndroid: false,
  supportsBackdropFilter: true,
  supportsCssGrid: true,
};

export function createMockBrowser(overrides: Partial<BrowserInfo> = {}): BrowserInfo {
  return { ...DEFAULT_BROWSER, ...overrides };
}
