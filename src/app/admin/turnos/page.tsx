"use client";

import { addDays, format, isToday, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { Suspense, useEffect, useState } from "react";

import { NewBookingDialog } from "@/components/admin/new-booking-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  BOOKING_FIELD_LABELS,
  BOOKING_STATUS_LABELS,
  COMMON_ACTIONS,
  HOURS,
  SERVICE_TYPE_LABELS,
  SERVICE_TYPE_LABELS_SHORT,
} from "@/lib/content";
import { formatPrice } from "@/lib/domain/pricing";
import { type BookingStatus, MOCK_SERVICES } from "@/lib/mock/data";
import {
  MOCK_CLIENTS,
  useAppStore,
  useBlockedSlotsByDate,
  useBookingsByDate,
} from "@/stores/app-store";
import { useSearchParams } from "next/navigation";

const STATUS_COLORS: Record<BookingStatus, string> = {
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
};

export default function AdminBookingsPage() {
  // useSearchParams requires a Suspense boundary for static prerender
  // (missing-suspense-with-csr-bailout on next build) — the page body is
  // wrapped and the fallback keeps the layout chrome.
  return (
    <Suspense fallback={null}>
      <AdminBookingsPageBody />
    </Suspense>
  );
}

function AdminBookingsPageBody() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<null | string>(null);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [showNewBookingDialog, setShowNewBookingDialog] = useState(false);

  const searchParams = useSearchParams();
  const actionParam = searchParams.get("action");
  const clientParam = searchParams.get("client");

  // NAIL-L3: the dashboard quick action links to /admin/turnos?action=new —
  // it must actually open the dialog instead of being silently ignored.
  useEffect(() => {
    if (actionParam === "new") {
      setShowNewBookingDialog(true);
    }
  }, [actionParam]);

  const dateStr = currentDate.toISOString().split("T")[0];
  const bookings = useBookingsByDate(dateStr);
  const blockedSlots = useBlockedSlotsByDate(dateStr);
  const { addBlockedSlot, cancelBooking, removeBlockedSlot, updateBookingStatus } = useAppStore();

  const prevDay = () => {
    setCurrentDate(subDays(currentDate, 1));
  };
  const nextDay = () => {
    setCurrentDate(addDays(currentDate, 1));
  };
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isSlotBlocked = (hour: string) => {
    return blockedSlots.some((slot) => {
      const slotStart = slot.startTime;
      const slotEnd = slot.endTime;
      return hour >= slotStart && hour < slotEnd;
    });
  };

  const getBookingForHour = (hour: string) => {
    return bookings.find((b) => {
      const startHour = Number.parseInt(b.startTime.split(":")[0]);
      const startMin = Number.parseInt(b.startTime.split(":")[1]);
      const duration = b.duration;
      const endMinutes = startHour * 60 + startMin + duration;
      const currentMinutes =
        Number.parseInt(hour.split(":")[0]) * 60 + Number.parseInt(hour.split(":")[1]);
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
        endTime: "19:00",
        reason: blockReason,
        startTime: "09:00",
      });
      setBlockReason("");
      setShowBlockDialog(false);
    }
  };

  const selectedBookingData = bookings.find((b) => b.id === selectedBooking);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-1 font-serif text-3xl">Gestión de Turnos</h1>
          <p className="text-[rgba(15,15,20,0.5)]">Administrá todos los turnos y bloqueos</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              setShowBlockDialog(true);
            }}
            variant="outline"
          >
            Bloquear horario
          </Button>
          <Button
            onClick={() => {
              setShowNewBookingDialog(true);
            }}
          >
            Nuevo turno
          </Button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={prevDay}
              size="sm"
              variant="outline"
            >
              ← Anterior
            </Button>
            <div className="text-center">
              <p
                aria-live="polite"
                className="font-medium"
              >
                {format(currentDate, "EEEE d 'de' MMMM", { locale: es })}
              </p>
              {!isToday(currentDate) && (
                <button
                  className="text-xs text-pink-500 hover:underline"
                  onClick={goToToday}
                >
                  Ir a hoy
                </button>
              )}
            </div>
            <Button
              onClick={nextDay}
              size="sm"
              variant="outline"
            >
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
              const service = booking
                ? MOCK_SERVICES.find((s) => s.id === booking.serviceId)
                : null;

              return (
                <div
                  aria-label={
                    booking
                      ? `${client?.name}, ${service?.name}, ${hour}, ${BOOKING_STATUS_LABELS[booking.status]}`
                      : `${hour}, disponible`
                  }
                  className={`flex items-center gap-4 rounded-lg p-2 focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:outline-none ${
                    blocked
                      ? "bg-gray-100"
                      : booking
                        ? "cursor-pointer bg-pink-50 hover:bg-pink-100"
                        : "hover:bg-gray-50"
                  }`}
                  key={hour}
                  onClick={() => booking && setSelectedBooking(booking.id)}
                  onKeyDown={(e) => {
                    if (booking && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      setSelectedBooking(booking.id);
                    }
                  }}
                  role={booking ? "button" : undefined}
                  tabIndex={booking ? 0 : undefined}
                >
                  <span className="w-16 text-sm font-medium text-[rgba(15,15,20,0.5)]">{hour}</span>
                  {blocked && (
                    <div className="flex flex-1 items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {blockedSlots.find((s) => hour >= s.startTime && hour < s.endTime)?.reason}
                      </span>
                      <button
                        className="text-xs text-red-500 hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          const slot = blockedSlots.find(
                            (s) => hour >= s.startTime && hour < s.endTime,
                          );
                          if (slot) {
                            removeBlockedSlot(slot.id);
                          }
                        }}
                      >
                        Desbloquear
                      </button>
                    </div>
                  )}
                  {!blocked && !booking && (
                    <span className="flex-1 text-sm text-[rgba(15,15,20,0.3)]">Disponible</span>
                  )}
                  {booking && (
                    <div className="flex flex-1 items-center justify-between">
                      <div>
                        <p className="font-medium">{client?.name}</p>
                        <p className="text-sm text-[rgba(15,15,20,0.5)]">
                          {service?.name} · {SERVICE_TYPE_LABELS_SHORT[booking.type]}
                        </p>
                      </div>
                      <Badge className={STATUS_COLORS[booking.status]}>
                        {BOOKING_STATUS_LABELS[booking.status]}
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
      <Dialog
        onOpenChange={() => {
          setSelectedBooking(null);
        }}
        open={!!selectedBooking}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalle del turno</DialogTitle>
          </DialogHeader>
          {selectedBookingData && (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-[rgba(15,15,20,0.5)]">{BOOKING_FIELD_LABELS.client}</p>
                <p className="font-medium">
                  {MOCK_CLIENTS.find((c) => c.id === selectedBookingData.clientId)?.name}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-[rgba(15,15,20,0.5)]">{BOOKING_FIELD_LABELS.service}</p>
                <p className="font-medium">
                  {MOCK_SERVICES.find((s) => s.id === selectedBookingData.serviceId)?.name}
                  <span className="ml-2 text-sm text-[rgba(15,15,20,0.5)]">
                    ({SERVICE_TYPE_LABELS[selectedBookingData.type]})
                  </span>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[rgba(15,15,20,0.5)]">{BOOKING_FIELD_LABELS.date}</p>
                  <p className="font-medium">{selectedBookingData.date}</p>
                </div>
                <div>
                  <p className="text-sm text-[rgba(15,15,20,0.5)]">{BOOKING_FIELD_LABELS.hour}</p>
                  <p className="font-medium">{selectedBookingData.startTime}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-[rgba(15,15,20,0.5)]">{BOOKING_FIELD_LABELS.total}</p>
                <p className="text-xl font-medium">{formatPrice(selectedBookingData.totalPrice)}</p>
              </div>
              <Badge className={STATUS_COLORS[selectedBookingData.status]}>
                {BOOKING_STATUS_LABELS[selectedBookingData.status]}
              </Badge>
              <div className="flex gap-2 pt-4">
                {selectedBookingData.status === "pending" && (
                  <Button
                    onClick={() => {
                      handleConfirm(selectedBookingData.id);
                    }}
                  >
                    Confirmar
                  </Button>
                )}
                {selectedBookingData.status === "confirmed" && (
                  <Button
                    onClick={() => {
                      handleComplete(selectedBookingData.id);
                    }}
                  >
                    Marcar completado
                  </Button>
                )}
                {(selectedBookingData.status === "pending" ||
                  selectedBookingData.status === "confirmed") && (
                  <Button
                    className="text-red-500"
                    onClick={() => {
                      handleCancel(selectedBookingData.id);
                    }}
                    variant="outline"
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
      <Dialog
        onOpenChange={setShowBlockDialog}
        open={showBlockDialog}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Bloquear horario</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleBlockSlot();
            }}
          >
            <p className="text-sm text-[rgba(15,15,20,0.6)]">
              Bloquear todo el día del {format(currentDate, "d 'de' MMMM", { locale: es })}
            </p>
            <div className="space-y-2">
              <label
                className="text-sm font-medium"
                htmlFor="motivo-bloqueo"
              >
                Motivo
              </label>
              <input
                className="w-full rounded-lg border px-3 py-2"
                id="motivo-bloqueo"
                onChange={(e) => {
                  setBlockReason(e.target.value);
                }}
                placeholder="Ej: Día libre, curso, feriado..."
                type="text"
                value={blockReason}
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowBlockDialog(false);
                }}
                type="button"
                variant="outline"
              >
                {COMMON_ACTIONS.cancel}
              </Button>
              <Button
                disabled={!blockReason}
                type="submit"
              >
                Bloquear
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* New Booking Dialog (NAIL-L3) */}
      <NewBookingDialog
        defaultClientId={clientParam ?? undefined}
        defaultDate={dateStr}
        onOpenChange={setShowNewBookingDialog}
        open={showNewBookingDialog}
      />
    </div>
  );
}
