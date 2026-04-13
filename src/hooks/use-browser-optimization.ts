"use client";

import { useState, useEffect } from "react";
import {
  detectBrowser,
  getOptimalAnimationDuration,
  getOptimalGlassOpacity,
  shouldReduceMotion,
  type BrowserInfo,
} from "@/lib/browser/detect";

export function useBrowserOptimization() {
  const [browser, setBrowser] = useState<BrowserInfo>({
    isSafari: false,
    isFirefox: false,
    isChrome: false,
    isMobile: false,
    isIOS: false,
    isAndroid: false,
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
    browser,
    reducedMotion,
    animationDuration: getOptimalAnimationDuration(browser),
    glassOpacity: getOptimalGlassOpacity(browser),
    isLowEnd: browser.isMobile && !browser.isChrome,
  };
}
