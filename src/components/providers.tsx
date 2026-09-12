"use client";

import { domAnimation, LazyMotion } from "framer-motion";
import { type ReactNode } from "react";

interface ProvidersProps {
  readonly children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
