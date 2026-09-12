"use client";

import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/stores/booking-store";

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function Calendar() {
  const currentDate = useBookingStore((state) => state.currentDate);
  const selectedDate = useBookingStore((state) => state.selectedDate);
  const bookings = useBookingStore((state) => state.bookings);
  const nextMonth = useBookingStore((state) => state.nextMonth);
  const prevMonth = useBookingStore((state) => state.prevMonth);
  const selectDate = useBookingStore((state) => state.selectDate);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const hasBookingsOnDate = (date: Date): boolean => {
    const dateStr = format(date, "yyyy-MM-dd");
    return bookings.some((b) => b.date === dateStr);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Button className="touch-manipulation" onClick={prevMonth} size="sm" variant="outline">
          <ChevronLeft className="size-4" />
        </Button>
        <h2 className="text-base sm:text-lg font-serif text-center">
          {format(currentDate, "MMMM yyyy", { locale: es })}
        </h2>
        <Button className="touch-manipulation" onClick={nextMonth} size="sm" variant="outline">
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((dayName) => (
          <div
            className="text-center text-xs font-medium text-[rgba(15,15,20,0.5)] py-1 sm:py-2"
            key={dayName}
          >
            {dayName}
          </div>
        ))}

        {weeks.flatMap((week) =>
          week.map((date) => {
            const dateStr = format(date, "yyyy-MM-dd");
            const isSelected = selectedDate === dateStr;
            const isCurrentMonth = isSameMonth(date, currentDate);
            const hasBookings = hasBookingsOnDate(date);

            return (
              <button
                className={`
                  relative p-2 sm:p-3 rounded-xl text-xs sm:text-sm transition-all touch-manipulation
                  ${isCurrentMonth ? "text-[rgba(15,15,20,0.9)]" : "text-[rgba(15,15,20,0.3)]"}
                  ${isSelected ? "bg-[rgba(15,15,20,0.1)] font-medium" : "hover:bg-[rgba(15,15,20,0.05)]"}
                `}
                key={dateStr}
                onClick={() => { selectDate(dateStr); }}
                type="button"
              >
                {format(date, "d")}
                {hasBookings && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 size-1.5 sm:size-2 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
