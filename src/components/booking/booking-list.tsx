"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";

import { useBookingStore } from "@/stores/booking-store";
import { getBookingsForDate } from "@/lib/domain/booking";
import { BookingCard } from "./booking-card";
import { SERVICES } from "@/lib/domain/pricing";

export function BookingList() {
  const selectedDate = useBookingStore((state) => state.selectedDate);
  const bookings = useBookingStore((state) => state.bookings);

  if (!selectedDate) {
    return (
      <div className="text-center text-[rgba(15,15,20,0.45)] py-8">
        Seleccioná un día para ver los turnos
      </div>
    );
  }

  const dayBookings = getBookingsForDate(bookings, selectedDate);
  const formattedDate = format(selectedDate, "EEEE d 'de' MMMM", { locale: es });

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium uppercase tracking-wider text-[rgba(15,15,20,0.5)]">
        {formattedDate}
      </h3>

      {dayBookings.length === 0 ? (
        <div className="text-center text-[rgba(15,15,20,0.45)] py-8">
          Sin turnos
        </div>
      ) : (
        <div className="space-y-3">
          {dayBookings.map((booking) => {
            const service = SERVICES.find((s) => s.id === booking.serviceId);
            return (
              <BookingCard
                key={booking.id}
                booking={booking}
                serviceName={service?.name ?? "Servicio"}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
