"use client";

import {
  Calculator,
  CalendarDays,
  ChevronLeft,
  LayoutDashboard,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
      <nav className="flex flex-1 space-x-1 overflow-x-auto pb-1 lg:flex-col lg:space-y-1 lg:space-x-0 lg:pb-0">
        {NAV_ITEMS.map((item) => (
          <Link
            aria-current={isActive(item.href) ? "page" : undefined}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-pink-50 hover:text-pink-600"
            href={item.href}
            key={item.href}
          >
            <item.icon
              aria-hidden
              className="size-4 shrink-0"
            />
            <span className="whitespace-nowrap">{item.label}</span>
          </Link>
        ))}
      </nav>
      <Link
        className="mt-4 hidden items-center gap-1 text-xs text-[rgba(15,15,20,0.5)] transition-colors hover:text-pink-500 lg:flex"
        href="/"
      >
        <ChevronLeft
          aria-hidden
          className="size-3.5"
        />
        Volver al inicio
      </Link>
    </>
  );
}
