import type { Metadata, Viewport } from "next";
import { Playfair_Display, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import BackgroundMesh from "@/components/client/BackgroundMesh";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: {
    default: "NailApp — Calculadora y Agenda para Manicuristas",
    template: "%s | NailApp",
  },
  description:
    "Aplicación para manicuristas: calculá el precio de tus servicios y gestioná tu agenda de turnos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn("font-sans", geist.variable, playfair.variable)}
    >
      <body className="font-sans antialiased text-[#1d1d1f] bg-[#f8f9fb] flex flex-col min-h-screen selection:bg-[#1d1d1f] selection:text-white">
        <BackgroundMesh />
        {children}
      </body>
    </html>
  );
}
