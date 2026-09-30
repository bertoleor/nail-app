"use client";

import Link from "next/link";
import {
  CalendarPlus,
  Calculator,
  Sparkles,
  TriangleAlert,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/domain/pricing";
import { MOCK_SERVICES } from "@/lib/mock/data";
import { MOCK_CLIENTS, useRecentBookings, useTodayStats } from "@/stores/app-store";

export default function AdminDashboard() {
  const stats = useTodayStats();
  const recentBookings = useRecentBookings(5);

  const today = new Date().toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    weekday: "long",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl mb-1">Dashboard</h1>
          <p className="text-[rgba(15,15,20,0.5)] capitalize">{today}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/calculadora">
            <Button>Nueva cotización</Button>
          </Link>
          <Link href="/admin/turnos">
            <Button variant="outline">Ver agenda</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-[rgba(15,15,20,0.5)] mb-1">Hoy</p>
            <p className="text-3xl font-light">{stats.todayCount}</p>
            <p className="text-xs text-[rgba(15,15,20,0.4)]">turnos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-[rgba(15,15,20,0.5)] mb-1">Esta semana</p>
            <p className="text-3xl font-light">{stats.weekCount}</p>
            <p className="text-xs text-[rgba(15,15,20,0.4)]">turnos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-[rgba(15,15,20,0.5)] mb-1">Pendientes</p>
            <p className="text-3xl font-light">{stats.pendingCount}</p>
            <p className="text-xs text-[rgba(15,15,20,0.4)]">por confirmar</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-[rgba(15,15,20,0.5)] mb-1">Hoy</p>
            <p className="text-3xl font-light text-pink-500">
              {formatPrice(stats.todayRevenue)}
            </p>
            <p className="text-xs text-[rgba(15,15,20,0.4)]">facturación</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Turnos recientes</CardTitle>
              <Link className="text-sm text-pink-500 hover:underline" href="/admin/turnos">
                Ver todos
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentBookings.length === 0 ? (
              <p className="text-sm text-[rgba(15,15,20,0.4)] text-center py-4">
                No hay turnos recientes
              </p>
            ) : (
              recentBookings.map((booking) => {
                const client = MOCK_CLIENTS.find((c) => c.id === booking.clientId);
                const service = MOCK_SERVICES.find((s) => s.id === booking.serviceId);
                return (
                  <div
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                    key={booking.id}
                  >
                    <div>
                      <p className="font-medium">{client?.name || "Cliente"}</p>
                      <p className="text-sm text-[rgba(15,15,20,0.5)]">
                        {service?.name} · {booking.startTime}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          booking.status === "confirmed"
                            ? "default"
                            : (booking.status === "pending"
                            ? "secondary"
                            : "outline")
                        }
                      >
                        {booking.status === "confirmed"
                          ? "Confirmado"
                          : (booking.status === "pending"
                          ? "Pendiente"
                          : booking.status)}
                      </Badge>
                      <p className="text-sm font-medium mt-1">
                        {formatPrice(booking.totalPrice)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Acciones rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Link href="/admin/calculadora">
              <div className="p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors cursor-pointer">
                <Calculator aria-hidden className="size-8 mb-2" />
                <p className="font-medium">Calculadora</p>
                <p className="text-xs text-[rgba(15,15,20,0.5)]">Armar presupuesto</p>
              </div>
            </Link>
            <Link href="/admin/turnos?action=new">
              <div className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors cursor-pointer">
                <CalendarPlus aria-hidden className="size-8 mb-2" />
                <p className="font-medium">Nuevo turno</p>
                <p className="text-xs text-[rgba(15,15,20,0.5)]">Agendar manualmente</p>
              </div>
            </Link>
            <Link href="/admin/clientas">
              <div className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer">
                <Users aria-hidden className="size-8 mb-2" />
                <p className="font-medium">Clientas</p>
                <p className="text-xs text-[rgba(15,15,20,0.5)]">{MOCK_CLIENTS.length} registradas</p>
              </div>
            </Link>
            <Link href="/admin/servicios">
              <div className="p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors cursor-pointer">
                <Sparkles aria-hidden className="size-8 mb-2" />
                <p className="font-medium">Servicios</p>
                <p className="text-xs text-[rgba(15,15,20,0.5)]">Configurar precios</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Pending Confirmations Alert */}
      {stats.pendingCount > 0 && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TriangleAlert aria-hidden className="size-8 shrink-0" />
              <div>
                <p className="font-medium">Tenés {stats.pendingCount} turnos pendientes de confirmación</p>
                <p className="text-sm text-[rgba(15,15,20,0.6)]">
                  Revisalos para confirmar o rechazar
                </p>
              </div>
            </div>
            <Link href="/admin/turnos?filter=pending">
              <Button variant="outline">Ver pendientes</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
