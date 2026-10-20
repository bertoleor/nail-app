"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getWhatsAppNumber } from "@/lib/config/whatsapp";
import { COMMON_ACTIONS, HOURS, SERVICE_TYPE_LABELS } from "@/lib/content";
import { checkAvailability, type AvailabilityReason } from "@/lib/domain/booking";
import {
  calculatePrice,
  calculateDuration as domainCalculateDuration,
  formatPrice,
  type ServiceType,
} from "@/lib/domain/pricing";
import { MOCK_ADDONS, MOCK_SERVICES } from "@/lib/mock/data";
import { useAppStore } from "@/stores/app-store";

type Step = "client" | "confirm" | "schedule" | "service";

// NAIL-H3: display copy per availability reason — the domain gate returns WHY
// a slot is unavailable so the UI can explain it without leaking internals.
const UNAVAILABLE_MESSAGES: Readonly<Record<AvailabilityReason, string>> = Object.freeze({
  blocked: "Horario no disponible: hay un bloqueo de agenda en esa franja.",
  conflict: "Horario no disponible: ya existe una reserva en esa franja.",
  "out-of-hours": "Horario no disponible: el turno queda fuera del horario de atención.",
});

// 15-a11y: nombre legible de cada paso para el indicador de progreso (sr-only)
const STEP_LABELS: Readonly<Record<Step, string>> = Object.freeze({
  client: "Tus datos",
  confirm: "Confirmación",
  schedule: "Fecha y horario",
  service: "Servicio",
});

export function ClientBookingPage() {
  const [step, setStep] = useState<Step>("client");
  const [clientData, setClientData] = useState({
    email: "",
    name: "",
    phone: "",
  });
  const [serviceData, setServiceData] = useState({
    addonIds: [] as readonly string[],
    serviceId: "",
    type: "" as "" | ServiceType,
  });
  const [scheduleData, setScheduleData] = useState({
    date: "",
    startTime: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  // 15-a11y (WCAG 2.4.3): al cambiar de paso el botón clickeado se desmonta y el
  // foco caía en <body> — el título del paso activo recibe el foco para no
  // perder el contexto. El primer render no roba el foco de la página.
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    stepHeadingRef.current?.focus();
  }, [step]);

  const addBooking = useAppStore((state) => state.addBooking);
  const addClient = useAppStore((state) => state.addClient);

  const selectedService = MOCK_SERVICES.find((s) => s.id === serviceData.serviceId);
  const selectedAddons = MOCK_ADDONS.filter((a) => serviceData.addonIds.includes(a.id));

  const calculateTotal = () => {
    if (!selectedService || !serviceData.type) {
      return 0;
    }
    return calculatePrice(selectedService, selectedAddons, serviceData.type);
  };

  const calculateDuration = () => {
    if (!selectedService || !serviceData.type) {
      return 0;
    }
    return domainCalculateDuration(selectedService, selectedAddons, serviceData.type);
  };

  const handleSubmitClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientData.name && clientData.phone) {
      setStep("service");
    }
  };

  const handleSubmitService = (e: React.FormEvent) => {
    e.preventDefault();
    if (serviceData.serviceId && serviceData.type) {
      setStep("schedule");
    }
  };

  // NAIL-H3: validate availability BEFORE any confirmation, then persist the
  // client + booking to the store — the wizard's success dialog was previously
  // shown without saving anything.
  const handleSubmitBooking = () => {
    if (!selectedService || !serviceData.type || !scheduleData.date || !scheduleData.startTime) {
      return;
    }
    const duration = calculateDuration();
    const availability = checkAvailability({
      blockedSlots: useAppStore.getState().blockedSlots,
      bookings: useAppStore.getState().bookings,
      date: scheduleData.date,
      duration,
      startTime: scheduleData.startTime,
    });
    if (!availability.ok) {
      setAvailabilityError(UNAVAILABLE_MESSAGES[availability.reason]);
      return;
    }
    const client = addClient({
      email: clientData.email || undefined,
      name: clientData.name,
      phone: clientData.phone,
    });
    addBooking({
      addonIds: serviceData.addonIds,
      clientId: client.id,
      date: scheduleData.date,
      duration,
      serviceId: serviceData.serviceId,
      startTime: scheduleData.startTime,
      status: "pending",
      totalPrice: calculateTotal(),
      type: serviceData.type,
    });
    setAvailabilityError(null);
    setShowSuccess(true);
  };

  const handleSendWhatsApp = () => {
    const message = encodeURIComponent(
      `¡Hola! Quiero reservar un turno:\n\n` +
        `👤 ${clientData.name}\n` +
        `📱 ${clientData.phone}\n` +
        `💅 ${selectedService?.name} (${serviceData.type ? SERVICE_TYPE_LABELS[serviceData.type] : ""})\n` +
        (selectedAddons.length > 0
          ? `✨ Add-ons: ${selectedAddons.map((a) => a.name).join(", ")}\n`
          : "") +
        `📅 ${scheduleData.date} a las ${scheduleData.startTime}\n` +
        `💰 Total: ${formatPrice(calculateTotal())}\n\n` +
        `¡Gracias!`,
    );
    window.open(`https://wa.me/${getWhatsAppNumber()}?text=${message}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 px-4 py-8">
      <div className="mx-auto max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-serif text-3xl sm:text-4xl">Reservá tu turno</h1>
          <p className="text-[rgba(15,15,20,0.6)]">Completá los datos para agendar tu sesión</p>
        </div>

        {/* Progress indicator */}
        <div
          aria-label="Progreso de la reserva"
          className="mb-8 flex justify-center"
          role="group"
        >
          <div className="flex items-center gap-2">
            {(["client", "service", "schedule", "confirm"] as readonly Step[]).map((s, i) => (
              <div
                className="flex items-center"
                key={s}
              >
                <div
                  aria-current={step === s ? "step" : undefined}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    step === s ||
                    (step === "confirm" && i < 3) ||
                    (step === "schedule" && i < 2) ||
                    (step === "service" && i < 1)
                      ? "bg-pink-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i + 1}
                  <span className="sr-only"> · {STEP_LABELS[s]}</span>
                </div>
                {i < 3 && (
                  <div
                    aria-hidden="true"
                    className={`mx-1 h-1 w-12 rounded ${
                      (step === "service" && i === 0) ||
                      (step === "schedule" && i < 2) ||
                      (step === "confirm" && i < 3)
                        ? "bg-pink-500"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Client Data */}
        {step === "client" && (
          <Card className="border-pink-100 bg-white/80 backdrop-blur-md">
            <CardHeader>
              <CardTitle
                className="text-xl"
                ref={stepHeadingRef}
                tabIndex={-1}
              >
                Tus datos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={handleSubmitClient}
              >
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium"
                    htmlFor="rb-name"
                  >
                    Nombre completo *
                  </label>
                  <Input
                    id="rb-name"
                    onChange={(e) => {
                      setClientData({ ...clientData, name: e.target.value });
                    }}
                    placeholder="Ej: María García"
                    required
                    value={clientData.name}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium"
                    htmlFor="rb-phone"
                  >
                    WhatsApp *
                  </label>
                  <Input
                    id="rb-phone"
                    onChange={(e) => {
                      setClientData({ ...clientData, phone: e.target.value });
                    }}
                    placeholder="Ej: +54 9 11 1234-5678"
                    required
                    type="tel"
                    value={clientData.phone}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium"
                    htmlFor="rb-email"
                  >
                    Email (opcional)
                  </label>
                  <Input
                    id="rb-email"
                    onChange={(e) => {
                      setClientData({ ...clientData, email: e.target.value });
                    }}
                    placeholder="Ej: maria@email.com"
                    type="email"
                    value={clientData.email}
                  />
                </div>
                <Button
                  className="w-full"
                  type="submit"
                >
                  Continuar
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Service Selection */}
        {step === "service" && (
          <Card className="border-pink-100 bg-white/80 backdrop-blur-md">
            <CardHeader>
              <CardTitle
                className="text-xl"
                ref={stepHeadingRef}
                tabIndex={-1}
              >
                Elegí tu servicio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-6"
                onSubmit={handleSubmitService}
              >
                <div
                  aria-labelledby="rb-service-group-label"
                  className="space-y-3"
                  role="group"
                >
                  <label
                    className="text-sm font-medium"
                    id="rb-service-group-label"
                  >
                    Servicio *
                  </label>
                  <div className="grid gap-3">
                    {MOCK_SERVICES.map((service) => (
                      <button
                        aria-pressed={serviceData.serviceId === service.id}
                        className={`rounded-xl border-2 p-4 text-left transition-all ${
                          serviceData.serviceId === service.id
                            ? "border-pink-500 bg-pink-50"
                            : "border-gray-200 hover:border-pink-200"
                        }`}
                        key={service.id}
                        onClick={() => {
                          setServiceData({
                            ...serviceData,
                            addonIds: [],
                            serviceId: service.id,
                            type: "",
                          });
                        }}
                        type="button"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-[rgba(15,15,20,0.5)]">
                              {service.description}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            desde {formatPrice(service.basePriceNew)}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {serviceData.serviceId && (
                  <div
                    aria-labelledby="rb-type-group-label"
                    className="space-y-3"
                    role="group"
                  >
                    <label
                      className="text-sm font-medium"
                      id="rb-type-group-label"
                    >
                      Tipo de sesión *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        aria-pressed={serviceData.type === "new"}
                        className={`rounded-xl border-2 p-4 text-center transition-all ${
                          serviceData.type === "new"
                            ? "border-pink-500 bg-pink-50"
                            : "border-gray-200 hover:border-pink-200"
                        }`}
                        onClick={() => {
                          setServiceData({ ...serviceData, type: "new" });
                        }}
                        type="button"
                      >
                        <p className="font-medium">{SERVICE_TYPE_LABELS.new}</p>
                        <p className="text-2xl font-light text-pink-600">
                          {formatPrice(selectedService?.basePriceNew ?? 0)}
                        </p>
                        <p className="text-xs text-[rgba(15,15,20,0.5)]">
                          {selectedService?.durationNew} min
                        </p>
                      </button>
                      <button
                        aria-pressed={serviceData.type === "maintenance"}
                        className={`rounded-xl border-2 p-4 text-center transition-all ${
                          serviceData.type === "maintenance"
                            ? "border-pink-500 bg-pink-50"
                            : "border-gray-200 hover:border-pink-200"
                        }`}
                        onClick={() => {
                          setServiceData({ ...serviceData, type: "maintenance" });
                        }}
                        type="button"
                      >
                        <p className="font-medium">{SERVICE_TYPE_LABELS.maintenance}</p>
                        <p className="text-2xl font-light text-pink-600">
                          {formatPrice(selectedService?.basePriceMaintenance ?? 0)}
                        </p>
                        <p className="text-xs text-[rgba(15,15,20,0.5)]">
                          {selectedService?.durationMaintenance} min
                        </p>
                      </button>
                    </div>
                  </div>
                )}

                {serviceData.type && (
                  <div
                    aria-labelledby="rb-addons-group-label"
                    className="space-y-3"
                    role="group"
                  >
                    <label
                      className="text-sm font-medium"
                      id="rb-addons-group-label"
                    >
                      Extras (opcional)
                    </label>
                    <div className="grid gap-2">
                      {MOCK_ADDONS.map((addon) => (
                        <button
                          aria-pressed={serviceData.addonIds.includes(addon.id)}
                          className={`flex items-center justify-between rounded-xl border-2 p-3 transition-all ${
                            serviceData.addonIds.includes(addon.id)
                              ? "border-pink-500 bg-pink-50"
                              : "border-gray-200 hover:border-pink-200"
                          }`}
                          key={addon.id}
                          onClick={() => {
                            const isSelected = serviceData.addonIds.includes(addon.id);
                            setServiceData({
                              ...serviceData,
                              addonIds: isSelected
                                ? serviceData.addonIds.filter((id) => id !== addon.id)
                                : [...serviceData.addonIds, addon.id],
                            });
                          }}
                          type="button"
                        >
                          <span>{addon.name}</span>
                          <span className="font-medium text-pink-600">
                            {formatPrice(addon.price)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-[rgba(15,15,20,0.6)]">Total estimado</span>
                    <span className="text-2xl font-light">{formatPrice(calculateTotal())}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setStep("client");
                    }}
                    type="button"
                    variant="outline"
                  >
                    Volver
                  </Button>
                  <Button
                    className="flex-1"
                    disabled={!serviceData.type}
                    type="submit"
                  >
                    Continuar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Schedule */}
        {step === "schedule" && (
          <Card className="border-pink-100 bg-white/80 backdrop-blur-md">
            <CardHeader>
              <CardTitle
                className="text-xl"
                ref={stepHeadingRef}
                tabIndex={-1}
              >
                Elegí fecha y horario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label
                    className="text-sm font-medium"
                    htmlFor="rb-date"
                  >
                    Fecha *
                  </label>
                  <Input
                    id="rb-date"
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      setScheduleData({ ...scheduleData, date: e.target.value });
                      setAvailabilityError(null);
                    }}
                    required
                    type="date"
                    value={scheduleData.date}
                  />
                </div>

                {scheduleData.date && (
                  <div
                    aria-labelledby="rb-hours-group-label"
                    className="space-y-3"
                    role="group"
                  >
                    <label
                      className="text-sm font-medium"
                      id="rb-hours-group-label"
                    >
                      Horario disponible *
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {HOURS.map((hour) => (
                        <button
                          aria-pressed={scheduleData.startTime === hour}
                          className={`rounded-lg p-2 text-sm font-medium transition-all ${
                            scheduleData.startTime === hour
                              ? "bg-pink-500 text-white"
                              : "bg-gray-100 hover:bg-pink-100"
                          }`}
                          key={hour}
                          onClick={() => {
                            setScheduleData({ ...scheduleData, startTime: hour });
                            setAvailabilityError(null);
                          }}
                          type="button"
                        >
                          {hour}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-[rgba(15,15,20,0.5)]">
                      Duración estimada: {calculateDuration()} minutos
                    </p>
                  </div>
                )}

                {/* Summary */}
                {scheduleData.startTime && (
                  <div className="space-y-2 rounded-xl bg-pink-50 p-4">
                    <p className="font-medium">Resumen de tu reserva:</p>
                    <p className="text-sm">
                      {selectedService?.name} (
                      {serviceData.type ? SERVICE_TYPE_LABELS[serviceData.type] : ""})
                    </p>
                    {selectedAddons.length > 0 && (
                      <p className="text-sm text-[rgba(15,15,20,0.6)]">
                        + {selectedAddons.map((a) => a.name).join(", ")}
                      </p>
                    )}
                    <p className="text-sm">
                      📅 {format(new Date(scheduleData.date), "EEEE d 'de' MMMM", { locale: es })}
                    </p>
                    <p className="text-sm">⏰ {scheduleData.startTime} hs</p>
                    <p className="pt-2 text-lg font-medium">
                      Total: {formatPrice(calculateTotal())}
                    </p>
                  </div>
                )}

                {availabilityError && (
                  <p
                    className="text-sm font-medium text-red-600"
                    role="alert"
                  >
                    {availabilityError}
                  </p>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setStep("service");
                    }}
                    type="button"
                    variant="outline"
                  >
                    Volver
                  </Button>
                  <Button
                    className="flex-1"
                    disabled={!scheduleData.date || !scheduleData.startTime}
                    onClick={handleSubmitBooking}
                  >
                    Reservar turno
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Dialog */}
        <Dialog
          onOpenChange={setShowSuccess}
          open={showSuccess}
        >
          <DialogContent className="mx-auto max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">¡Reserva registrada!</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <span
                  aria-hidden="true"
                  className="text-3xl"
                >
                  ✓
                </span>
              </div>
              <p className="text-[rgba(15,15,20,0.6)]">
                Tu turno quedó guardado como pendiente. Te contactaremos por WhatsApp para
                confirmar.
              </p>
              <div className="space-y-3 pt-4">
                <Button
                  className="w-full"
                  onClick={handleSendWhatsApp}
                >
                  {COMMON_ACTIONS.sendWhatsApp}
                </Button>
                <Button
                  className="w-full"
                  onClick={() => {
                    setShowSuccess(false);
                  }}
                  variant="outline"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}

export default ClientBookingPage;
