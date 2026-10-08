import type { Metadata } from "next";

import Link from "next/link";

export const metadata: Metadata = {
  title: "NailApp",
};

export default function ClientLayout({
  children,
}: Readonly<{
  readonly children: React.ReactNode;
}>) {
  return (
    <>
      <header className="glass-subtle fixed top-0 right-0 left-0 z-50 border-b">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link
            className="font-serif text-lg"
            href="/"
          >
            NailApp
          </Link>
          <div className="flex items-center gap-4">
            <Link
              className="text-sm text-[rgba(15,15,20,0.7)] transition-colors hover:text-[rgba(15,15,20,0.9)]"
              href="/calculator"
            >
              Calculadora
            </Link>
            <Link
              className="text-sm text-[rgba(15,15,20,0.7)] transition-colors hover:text-[rgba(15,15,20,0.9)]"
              href="/reservar"
            >
              Reservar turno
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1 pt-16">{children}</main>
    </>
  );
}
