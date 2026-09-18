"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calculator,
  CalendarDays,
  ChevronLeft,
  LayoutDashboard,
  Sparkles,
  Users,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/turnos", icon: CalendarDays, label: "Turnos" },
  { href: "/admin/clientas", icon: Users, label: "Clientas" },
  { href: "/admin/calculadora", icon: Calculator, label: "Calculadora" },
  { href: "/admin/servicios", icon: Sparkles, label: "Servicios" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  return (
    <>
      <nav className="flex-1 flex lg:flex-col lg:space-y-1 lg:space-x-0 space-x-1 overflow-x-auto pb-1 lg:pb-0">
        {NAV_ITEMS.map((item) => (
          <Link
            aria-current={isActive(item.href) ? "page" : undefined}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-pink-50 hover:text-pink-600 transition-colors"
            href={item.href}
            key={item.href}
          >
            <item.icon aria-hidden className="size-4 shrink-0" />
            <span className="whitespace-nowrap">{item.label}</span>
          </Link>
        ))}
      </nav>
      <Link
        className="hidden lg:flex items-center gap-1 text-xs text-[rgba(15,15,20,0.5)] hover:text-pink-500 transition-colors mt-4"
        href="/"
      >
        <ChevronLeft aria-hidden className="size-3.5" />
        Volver al inicio
      </Link>
    </>
  );
}