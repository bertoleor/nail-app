export interface BrowserInfo {
  readonly isAndroid: boolean;
  readonly isChrome: boolean;
  readonly isFirefox: boolean;
  readonly isIOS: boolean;
  readonly isMobile: boolean;
  readonly isSafari: boolean;
  readonly supportsBackdropFilter: boolean;
  readonly supportsCssGrid: boolean;
}

export function detectBrowser(): BrowserInfo {
  if (globalThis.window === undefined) {
    return {
      isAndroid: false,
      isChrome: false,
      isFirefox: false,
      isIOS: false,
      isMobile: false,
      isSafari: false,
      supportsBackdropFilter: true,
      supportsCssGrid: true,
    };
  }

  const ua = navigator.userAgent;
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  const isFirefox = ua.includes("Firefox");
  const isChrome = ua.includes("Chrome") && !ua.includes("Edg");
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isAndroid = ua.includes("Android");

  const supportsBackdropFilter = CSS.supports("backdrop-filter", "blur(1px)");
  const supportsCssGrid = CSS.supports("display", "grid");

  return {
    isAndroid,
    isChrome,
    isFirefox,
    isIOS,
    isMobile,
    isSafari,
    supportsBackdropFilter,
    supportsCssGrid,
  };
}

export function getOptimalAnimationDuration(browser: BrowserInfo): number {
  if (browser.isMobile) {return 150;}
  return 300;
}

export function getOptimalGlassOpacity(browser: BrowserInfo): number {
  if (!browser.supportsBackdropFilter) {return 0.85;}
  if (browser.isSafari) {return 0.4;}
  return 0.38;
}

export function shouldReduceMotion(): boolean {
  if (globalThis.window === undefined) {return false;}
  return globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
