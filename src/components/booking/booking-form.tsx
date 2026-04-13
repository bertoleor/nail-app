"use client";

import { useState } from "react";
import { format } from "date-fns";
import { z } from "zod";

import { useBookingStore } from "@/stores/booking-store";
import { hasConflict } from "@/lib/domain/booking";
import { SERVICES } from "@/lib/domain/pricing";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const bookingSchema = z.object({
  clientName: z.string().min(1, "Ingresá el nombre"),
  serviceId: z.string().min(1, "Seleccioná un servicio"),
  startTime: z.string().min(1, "Seleccioná un horario"),
});

export function BookingForm() {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedDate = useBookingStore((state) => state.selectedDate);
  const bookings = useBookingStore((state) => state.bookings);
  const addBooking = useBookingStore((state) => state.addBooking);

  const handleSubmit = (formData: FormData) => {
    const data = {
      clientName: formData.get("clientName") as string,
      serviceId: formData.get("serviceId") as string,
      startTime: formData.get("startTime") as string,
    };

    const result = bookingSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    if (!selectedDate) {
      setErrors({ date: "Seleccioná una fecha" });
      return;
    }

    const service = SERVICES.find((s) => s.id === data.serviceId);
    if (!service) return;

    const newBooking = {
      id: crypto.randomUUID(),
      clientName: data.clientName,
      serviceId: data.serviceId,
      date: selectedDate,
      startTime: data.startTime,
      duration: service.duration,
    };

    if (hasConflict(newBooking, bookings)) {
      setErrors({ conflict: "Horario no disponible" });
      return;
    }

    addBooking(newBooking);
    setErrors({});
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto touch-manipulation">Nuevo turno</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo turno</DialogTitle>
        </DialogHeader>

      {selectedDate && (
        <p className="text-sm text-[rgba(15,15,20,0.6)]">
          Fecha: {format(selectedDate, "d 'de' MMMM")}
        </p>
      )}

      {errors.date && (
        <p className="text-xs text-red-500">{errors.date}</p>
      )}

      <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="clientName"
              className="text-xs font-medium uppercase tracking-wider text-[rgba(15,15,20,0.5)]"
            >
              Cliente
            </label>
            <Input
              id="clientName"
              name="clientName"
              placeholder="Nombre de la clienta"
              className="touch-manipulation"
            />
            {errors.clientName && (
              <p className="text-xs text-red-500">{errors.clientName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="serviceId"
              className="text-xs font-medium uppercase tracking-wider text-[rgba(15,15,20,0.5)]"
            >
              Servicio
            </label>
            <Select name="serviceId">
              <SelectTrigger className="touch-manipulation">
                <SelectValue placeholder="Seleccioná un servicio" />
              </SelectTrigger>
              <SelectContent>
                {SERVICES.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.serviceId && (
              <p className="text-xs text-red-500">{errors.serviceId}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="startTime"
              className="text-xs font-medium uppercase tracking-wider text-[rgba(15,15,20,0.5)]"
            >
              Horario
            </label>
            <Input
              id="startTime"
              name="startTime"
              type="time"
              min="09:00"
              max="20:00"
              className="touch-manipulation"
            />
            {errors.startTime && (
              <p className="text-xs text-red-500">{errors.startTime}</p>
            )}
          </div>

          {errors.conflict && (
            <p className="text-xs text-red-500">{errors.conflict}</p>
          )}

          <Button className="w-full touch-manipulation">
            Guardar turno
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
