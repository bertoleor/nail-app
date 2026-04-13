"use client";

import { useState } from "react";
import { format, addDays, subDays, isToday, isSameDay } from "date-fns";
import { es } from "date-fns/locale";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAppStore,
  useBookingsByDate,
  useBlockedSlotsByDate,
  MOCK_CLIENTS,
} from "@/stores/app-store";
import { MOCK_SERVICES, type BookingStatus } from "@/lib/mock/data";

const HOURS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30",
];

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  completed: "Completado",
  cancelled: "Cancelado",
};

const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminBookingsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [blockReason, setBlockReason] = useState("");

  const dateStr = currentDate.toISOString().split("T")[0];
  const bookings = useBookingsByDate(dateStr);
  const blockedSlots = useBlockedSlotsByDate(dateStr);
  const { updateBookingStatus, cancelBooking, addBlockedSlot, removeBlockedSlot } = useAppStore();

  const prevDay = () => setCurrentDate(subDays(currentDate, 1));
  const nextDay = () => setCurrentDate(addDays(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const isSlotBlocked = (hour: string) => {
    return blockedSlots.some((slot) => {
      const slotStart = slot.startTime;
      const slotEnd = slot.endTime;
      return hour >= slotStart && hour < slotEnd;
    });
  };

  const getBookingForHour = (hour: string) => {
    return bookings.find((b) => {
      const startHour = parseInt(b.startTime.split(":")[0]);
      const startMin = parseInt(b.startTime.split(":")[1]);
      const duration = b.duration;
      const endMinutes = startHour * 60 + startMin + duration;
      const currentMinutes = parseInt(hour.split(":")[0]) * 60 + parseInt(hour.split(":")[1]);
      return currentMinutes >= startHour * 60 + startMin && currentMinutes < endMinutes;
    });
  };

  const handleConfirm = (bookingId: string) => {
    updateBookingStatus(bookingId, "confirmed");
    setSelectedBooking(null);
  };

  const handleComplete = (bookingId: string) => {
    updateBookingStatus(bookingId, "completed");
    setSelectedBooking(null);
  };

  const handleCancel = (bookingId: string) => {
    cancelBooking(bookingId);
    setSelectedBooking(null);
  };

  const handleBlockSlot = () => {
    if (blockReason) {
      addBlockedSlot({
        date: dateStr,
        startTime: "09:00",
        endTime: "19:00",
        reason: blockReason,
      });
      setBlockReason("");
      setShowBlockDialog(false);
    }
  };

  const selectedBookingData = bookings.find((b) => b.id === selectedBooking);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl mb-1">Gestión de Turnos</h1>
          <p className="text-[rgba(15,15,20,0.5)]">
            Administrá todos los turnos y bloqueos
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowBlockDialog(true)}>
            Bloquear horario
          </Button>
          <Button>Nuevo turno</Button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={prevDay}>
              ← Anterior
            </Button>
            <div className="text-center">
              <p className="font-medium">
                {format(currentDate, "EEEE d 'de' MMMM", { locale: es })}
              </p>
              {!isToday(currentDate) && (
                <button
                  onClick={goToToday}
                  className="text-xs text-pink-500 hover:underline"
                >
                  Ir a hoy
                </button>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={nextDay}>
              Siguiente →
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Time Grid */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Horarios del día</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-1">
            {HOURS.map((hour) => {
              const blocked = isSlotBlocked(hour);
              const booking = getBookingForHour(hour);
              const client = booking ? MOCK_CLIENTS.find((c) => c.id === booking.clientId) : null;
              const service = booking ? MOCK_SERVICES.find((s) => s.id === booking.serviceId) : null;

              return (
                <div
                  key={hour}
                  className={`flex items-center gap-4 p-2 rounded-lg ${
                    blocked
                      ? "bg-gray-100"
                      : booking
                      ? "bg-pink-50 cursor-pointer hover:bg-pink-100"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => booking && setSelectedBooking(booking.id)}
                >
                  <span className="w-16 text-sm font-medium text-[rgba(15,15,20,0.5)]">
                    {hour}
                  </span>
                  {blocked && (
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {blockedSlots.find((s) => hour >= s.startTime && hour < s.endTime)?.reason}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const slot = blockedSlots.find((s) => hour >= s.startTime && hour < s.endTime);
                          if (slot) removeBlockedSlot(slot.id);
                        }}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Desbloquear
                      </button>
                    </div>
                  )}
                  {!blocked && !booking && (
                    <span className="flex-1 text-sm text-[rgba(15,15,20,0.3)]">
                      Disponible
                    </span>
                  )}
                  {booking && (
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{client?.name}</p>
                        <p className="text-sm text-[rgba(15,15,20,0.5)]">
                          {service?.name} · {booking.type === "new" ? "Nuevo" : "Mant."}
                        </p>
                      </div>
                      <Badge className={STATUS_COLORS[booking.status]}>
                        {STATUS_LABELS[booking.status]}
                      </Badge>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Booking Detail Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalle del turno</DialogTitle>
          </DialogHeader>
          {selectedBookingData && (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-[rgba(15,15,20,0.5)]">Cliente</p>
                <p className="font-medium">
                  {MOCK_CLIENTS.find((c) => c.id === selectedBookingData.clientId)?.name}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-[rgba(15,15,20,0.5)]">Servicio</p>
                <p className="font-medium">
                  {MOCK_SERVICES.find((s) => s.id === selectedBookingData.serviceId)?.name}
                  <span className="text-sm text-[rgba(15,15,20,0.5)] ml-2">
                    ({selectedBookingData.type === "new" ? "Nuevo" : "Mantenimiento"})
                  </span>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[rgba(15,15,20,0.5)]">Fecha</p>
                  <p className="font-medium">{selectedBookingData.date}</p>
                </div>
                <div>
                  <p className="text-sm text-[rgba(15,15,20,0.5)]">Horario</p>
                  <p className="font-medium">{selectedBookingData.startTime}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-[rgba(15,15,20,0.5)]">Total</p>
                <p className="text-xl font-medium">
                  ${selectedBookingData.totalPrice.toLocaleString("es-AR")}
                </p>
              </div>
              <Badge className={STATUS_COLORS[selectedBookingData.status]}>
                {STATUS_LABELS[selectedBookingData.status]}
              </Badge>
              <div className="flex gap-2 pt-4">
                {selectedBookingData.status === "pending" && (
                  <Button onClick={() => handleConfirm(selectedBookingData.id)}>
                    Confirmar
                  </Button>
                )}
                {selectedBookingData.status === "confirmed" && (
                  <Button onClick={() => handleComplete(selectedBookingData.id)}>
                    Marcar completado
                  </Button>
                )}
                {(selectedBookingData.status === "pending" || selectedBookingData.status === "confirmed") && (
                  <Button
                    variant="outline"
                    className="text-red-500"
                    onClick={() => handleCancel(selectedBookingData.id)}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Block Slot Dialog */}
      <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Bloquear horario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-[rgba(15,15,20,0.6)]">
              Bloquear todo el día del {format(currentDate, "d 'de' MMMM", { locale: es })}
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium">Motivo</label>
              <input
                type="text"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Ej: Día libre, curso, feriado..."
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowBlockDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleBlockSlot} disabled={!blockReason}>
                Bloquear
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
