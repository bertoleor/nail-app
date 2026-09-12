import type { Metadata, Viewport } from "next";

import { Geist } from "next/font/google";

import "./globals.css";
import BackgroundMesh from "@/components/client/BackgroundMesh";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});



export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
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
      <body className="font-sans antialiased text-[#1d1d1f] flex flex-col min-h-screen selection:bg-[#1d1d1f] selection:text-white">
      <Providers>
        <BackgroundMesh />
        {children}
      </Providers>
    </body>
    </html>
  );
}
