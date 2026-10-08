import type { Metadata, Viewport } from "next";

import { Geist } from "next/font/google";

import BackgroundMesh from "@/components/client/BackgroundMesh";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const viewport: Viewport = {
  initialScale: 1,
  themeColor: "#ffffff",
  userScalable: true,
  width: "device-width",
};

export const metadata: Metadata = {
  description:
    "Aplicación para manicuristas: calculá el precio de tus servicios y gestioná tu agenda de turnos.",
  title: {
    default: "NailApp — Calculadora y Agenda para Manicuristas",
    template: "%s | NailApp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  readonly children: React.ReactNode;
}>) {
  return (
    <html
      className={cn("font-sans", geist.variable)}
      lang="es"
    >
      <body className="flex min-h-screen flex-col font-sans text-[#1d1d1f] antialiased selection:bg-[#1d1d1f] selection:text-white">
        <Providers>
          <BackgroundMesh />
          {children}
        </Providers>
      </body>
    </html>
  );
}
