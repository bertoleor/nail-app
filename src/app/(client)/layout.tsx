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
      <header className="fixed top-0 left-0 right-0 z-50 glass-subtle border-b">
        <nav className="flex items-center justify-between px-4 py-3 max-w-6xl mx-auto">
          <Link className="font-serif text-lg" href="/">
            NailApp
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              className="text-sm text-[rgba(15,15,20,0.7)] hover:text-[rgba(15,15,20,0.9)] transition-colors"
              href="/calculator"
            >
              Calculadora
            </Link>
            <Link 
              className="text-sm text-[rgba(15,15,20,0.7)] hover:text-[rgba(15,15,20,0.9)] transition-colors"
              href="/reservar"
            >
              Reservar turno
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1 pt-16">
        {children}
      </main>
    </>
  );
}
