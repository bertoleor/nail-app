"use client";

import { useEffect, useState } from "react";

import {
  type BrowserInfo,
  detectBrowser,
  getOptimalAnimationDuration,
  getOptimalGlassOpacity,
  shouldReduceMotion,
} from "@/lib/browser/detect";

export function useBrowserOptimization() {
  const [browser, setBrowser] = useState<BrowserInfo>({
    isAndroid: false,
    isChrome: false,
    isFirefox: false,
    isIOS: false,
    isMobile: false,
    isSafari: false,
    supportsBackdropFilter: true,
    supportsCssGrid: true,
  });

  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const detected = detectBrowser();
    setBrowser(detected);
    setReducedMotion(shouldReduceMotion());
  }, []);

  return {
    animationDuration: getOptimalAnimationDuration(browser),
    browser,
    glassOpacity: getOptimalGlassOpacity(browser),
    isLowEnd: browser.isMobile && !browser.isChrome,
    reducedMotion,
  };
}
