"use client";

import type { Booking } from "@/lib/domain/booking";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { calculateEndTime } from "@/lib/domain/booking";

interface BookingCardProps {
  readonly booking: Booking;
  readonly serviceName: string;
}

export function BookingCard({ booking, serviceName }: BookingCardProps) {
  const endTime = calculateEndTime(booking.startTime, booking.duration);

  return (
    <Card className="glass-subtle">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="font-medium text-[rgba(15,15,20,0.9)]">
              {booking.clientName}
            </p>
            <p className="text-sm text-[rgba(15,15,20,0.6)]">{serviceName}</p>
          </div>
          <Badge variant="default">
            {booking.startTime} - {endTime}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
