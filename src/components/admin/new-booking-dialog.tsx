"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HOURS, SERVICE_TYPE_LABELS } from "@/lib/content";
import { checkAvailability, type AvailabilityReason } from "@/lib/domain/booking";
import {
  calculateDuration,
  calculatePrice,
  formatPrice,
  getBaseDuration,
  getBasePrice,
  type ServiceType,
} from "@/lib/domain/pricing";
import { MOCK_SERVICES } from "@/lib/mock/data";
import { MOCK_CLIENTS, useAppStore } from "@/stores/app-store";

/**
 * NAIL-L3: real booking dialog for the admin "Nuevo turno" CTA.
 *
 * Replaces the dead placeholder button: selecting client, service, type and
 * hour persists a confirmed booking through `addBooking` — after validating
 * the slot through the domain gate `checkAvailability` (conflict / blocked /
 * business hours), so the agenda stays consistent with the wizard rules.
 * Add-ons are intentionally out of scope for the quick-booking flow; the
 * booking stores the base service price.
 */

const NEW_BOOKING_STATUS = "confirmed";

const UNAVAILABLE_MESSAGES: Readonly<Record<AvailabilityReason, string>> = Object.freeze({
  blocked: "Ese horario está bloqueado para esa fecha",
  conflict: "Ya hay un turno en ese horario",
  "out-of-hours": "La sesión termina fuera del horario de atención",
});

interface NewBookingDialogProps {
  readonly defaultClientId?: string;
  readonly defaultDate: string;
  readonly onOpenChange: (open: boolean) => void;
  readonly open: boolean;
}

export function NewBookingDialog({
  defaultClientId,
  defaultDate,
  onOpenChange,
  open,
}: NewBookingDialogProps) {
  const [clientId, setClientId] = useState(defaultClientId ?? "");
  const [serviceId, setServiceId] = useState("");
  const [serviceType, setServiceType] = useState<ServiceType>("new");
  const [startTime, setStartTime] = useState("");
  const [unavailableReason, setUnavailableReason] = useState<string | null>(null);

  const bookings = useAppStore((state) => state.bookings);
  const blockedSlots = useAppStore((state) => state.blockedSlots);
  const addBooking = useAppStore((state) => state.addBooking);

  useEffect(() => {
    if (open) {
      setClientId(defaultClientId ?? "");
      setServiceId("");
      setServiceType("new");
      setStartTime("");
      setUnavailableReason(null);
    }
  }, [defaultClientId, open]);

  const selectedService = MOCK_SERVICES.find((s) => s.id === serviceId);

  const duration = selectedService ? calculateDuration(selectedService, [], serviceType) : 0;
  const totalPrice = selectedService ? calculatePrice(selectedService, [], serviceType) : 0;

  // NAIL-L3: validate on hour selection (same contract as the /reservar wizard)
  // — the reason surfaces next to the picker immediately, and save stays
  // gated on a validated hour. availabilityReason is null only when the
  // selected slot is available.
  const selectHour = (hour: string) => {
    setStartTime(hour);
    if (!selectedService) {
      setUnavailableReason(null);
      return;
    }
    const availability = checkAvailability({
      blockedSlots,
      bookings,
      date: defaultDate,
      duration: calculateDuration(selectedService, [], serviceType),
      startTime: hour,
    });
    setUnavailableReason(availability.ok ? null : UNAVAILABLE_MESSAGES[availability.reason]);
  };

  const canSave = Boolean(clientId && serviceId && startTime && unavailableReason === null);

  const handleSave = () => {
    if (!selectedService || !canSave) {
      return;
    }

    // Re-check at save time: the store may have changed since selection.
    const availability = checkAvailability({
      blockedSlots,
      bookings,
      date: defaultDate,
      duration,
      startTime,
    });

    if (!availability.ok) {
      setUnavailableReason(UNAVAILABLE_MESSAGES[availability.reason]);
      return;
    }

    addBooking({
      addonIds: [],
      clientId,
      date: defaultDate,
      duration,
      serviceId,
      startTime,
      status: NEW_BOOKING_STATUS,
      totalPrice,
      type: serviceType,
    });
    onOpenChange(false);
  };

  return (
    <Dialog
      onOpenChange={onOpenChange}
      open={open}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo turno</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Client */}
          <div className="space-y-2">
            <label
              className="text-sm font-medium"
              htmlFor="nb-client"
            >
              Cliente
            </label>
            <Select
              onValueChange={setClientId}
              value={clientId}
            >
              <SelectTrigger id="nb-client">
                <SelectValue placeholder="Elegir clienta..." />
              </SelectTrigger>
              <SelectContent>
                {MOCK_CLIENTS.map((client) => (
                  <SelectItem
                    key={client.id}
                    value={client.id}
                  >
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Service */}
          <div className="space-y-2">
            <label
              className="text-sm font-medium"
              htmlFor="nb-service"
            >
              Servicio
            </label>
            <Select
              onValueChange={setServiceId}
              value={serviceId}
            >
              <SelectTrigger id="nb-service">
                <SelectValue placeholder="Elegir servicio..." />
              </SelectTrigger>
              <SelectContent>
                {MOCK_SERVICES.map((service) => (
                  <SelectItem
                    key={service.id}
                    value={service.id}
                  >
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Service type */}
          {serviceId && selectedService && (
            <div
              aria-label="Tipo de sesión"
              className="grid grid-cols-2 gap-3"
              role="group"
            >
              {(["new", "maintenance"] as const).map((type) => (
                <button
                  aria-pressed={serviceType === type}
                  className={`rounded-xl border-2 p-3 text-center transition-all ${
                    serviceType === type
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-pink-200"
                  }`}
                  key={type}
                  onClick={() => {
                    setServiceType(type);
                    setStartTime("");
                    setUnavailableReason(null);
                  }}
                  type="button"
                >
                  <p className="text-sm font-medium">{SERVICE_TYPE_LABELS[type]}</p>
                  <p className="text-sm text-pink-600">
                    {formatPrice(getBasePrice(selectedService, type))}
                  </p>
                  <p className="text-xs text-[rgba(15,15,20,0.5)]">
                    {getBaseDuration(selectedService, type)} min
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* Hour picker */}
          {serviceId && (
            <div
              aria-labelledby="nb-hours-group-label"
              className="space-y-2"
              role="group"
            >
              <label
                className="text-sm font-medium"
                id="nb-hours-group-label"
              >
                Horario
              </label>
              <div className="grid grid-cols-4 gap-2">
                {HOURS.map((hour) => (
                  <button
                    aria-pressed={startTime === hour}
                    className={`rounded-lg p-2 text-sm font-medium transition-all ${
                      startTime === hour
                        ? "bg-pink-500 text-white"
                        : "bg-gray-100 hover:bg-pink-100"
                    }`}
                    key={hour}
                    onClick={() => {
                      selectHour(hour);
                    }}
                    type="button"
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {selectedService && (
            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
              <div>
                <p className="text-sm font-medium">{selectedService.name}</p>
                <p className="text-xs text-[rgba(15,15,20,0.5)]">
                  {SERVICE_TYPE_LABELS[serviceType]} · {duration} min
                </p>
              </div>
              <Badge>{formatPrice(totalPrice)}</Badge>
            </div>
          )}

          {unavailableReason && (
            <p
              className="rounded-lg bg-red-50 p-2 text-sm text-red-600"
              role="alert"
            >
              {unavailableReason}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => {
                onOpenChange(false);
              }}
              variant="outline"
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              disabled={!canSave}
              onClick={handleSave}
            >
              Guardar turno
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
