import type { Metadata } from "next";

import Link from "next/link";
import {
  Calculator,
  CalendarDays,
  ChevronLeft,
  LayoutDashboard,
  Sparkles,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Admin — NailApp",
};

const NAV_ITEMS = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/turnos", icon: CalendarDays, label: "Turnos" },
  { href: "/admin/clientas", icon: Users, label: "Clientas" },
  { href: "/admin/calculadora", icon: Calculator, label: "Calculadora" },
  { href: "/admin/servicios", icon: Sparkles, label: "Servicios" },
];

export default function AdminLayout({
  children,
}: Readonly<{
  readonly children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50/30 flex">
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white/80 backdrop-blur-md border-r border-gray-200 p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="font-serif text-2xl">NailApp</h1>
          <p className="text-xs text-[rgba(15,15,20,0.5)]">Panel de administración</p>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-pink-50 hover:text-pink-600 transition-colors"
              href={item.href}
              key={item.href}
            >
              <item.icon aria-hidden className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          className="flex items-center gap-1 text-xs text-[rgba(15,15,20,0.5)] hover:text-pink-500 transition-colors"
          href="/"
        >
          <ChevronLeft aria-hidden className="size-3.5" />
          Volver al inicio
        </Link>
      </aside>

      <main className="flex-1 ml-64 p-6 sm:p-8">
        {children}
      </main>
    </div>
  );
}