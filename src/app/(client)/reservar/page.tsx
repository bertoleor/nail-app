"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getWhatsAppNumber } from "@/lib/config/whatsapp";
import {
  COMMON_ACTIONS,
  HOURS,
  SERVICE_TYPE_LABELS,
} from "@/lib/content";
import {
  calculateDuration as domainCalculateDuration,
  calculatePrice,
  formatPrice,
  type ServiceType,
} from "@/lib/domain/pricing";
import {
  MOCK_ADDONS,
  MOCK_SERVICES,
} from "@/lib/mock/data";

type Step = "client" | "confirm" | "schedule" | "service";

export default function ClientBookingPage() {
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

  const selectedService = MOCK_SERVICES.find((s) => s.id === serviceData.serviceId);
  const selectedAddons = MOCK_ADDONS.filter((a) => serviceData.addonIds.includes(a.id));

  const calculateTotal = () => {
    if (!selectedService || !serviceData.type) {return 0;}
    return calculatePrice(selectedService, selectedAddons, serviceData.type);
  };

  const calculateDuration = () => {
    if (!selectedService || !serviceData.type) {return 0;}
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

  const handleSubmitBooking = () => {
    setShowSuccess(true);
  };

  const handleSendWhatsApp = () => {
    const message = encodeURIComponent(
      `¡Hola! Quiero reservar un turno:\n\n` +
      `👤 ${clientData.name}\n` +
      `📱 ${clientData.phone}\n` +
      `💅 ${selectedService?.name} (${serviceData.type ? SERVICE_TYPE_LABELS[serviceData.type] : ""})\n` +
      (selectedAddons.length > 0 ? `✨ Add-ons: ${selectedAddons.map(a => a.name).join(", ")}\n` : "") +
      `📅 ${scheduleData.date} a las ${scheduleData.startTime}\n` +
      `💰 Total: ${formatPrice(calculateTotal())}\n\n` +
      `¡Gracias!`
    );
    window.open(`https://wa.me/${getWhatsAppNumber()}?text=${message}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl mb-2">Reservá tu turno</h1>
          <p className="text-[rgba(15,15,20,0.6)]">Completá los datos para agendar tu sesión</p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            {(["client", "service", "schedule", "confirm"] as readonly Step[]).map((s, i) => (
              <div className="flex items-center" key={s}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === s || (step === "confirm" && i < 3) || 
                    (step === "schedule" && i < 2) ||
                    (step === "service" && i < 1)
                      ? "bg-pink-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i + 1}
                </div>
                {i < 3 && (
                  <div className={`w-12 h-1 mx-1 rounded ${
                    (step === "service" && i === 0) ||
                    (step === "schedule" && i < 2) ||
                    (step === "confirm" && i < 3)
                      ? "bg-pink-500"
                      : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Client Data */}
        {step === "client" && (
          <Card className="bg-white/80 backdrop-blur-md border-pink-100">
            <CardHeader>
              <CardTitle className="text-xl">Tus datos</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmitClient}>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="rb-name">Nombre completo *</label>
                  <Input
                    id="rb-name"
                    onChange={(e) => { setClientData({ ...clientData, name: e.target.value }); }}
                    placeholder="Ej: María García"
                    required
                    value={clientData.name}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="rb-phone">WhatsApp *</label>
                  <Input
                    id="rb-phone"
                    onChange={(e) => { setClientData({ ...clientData, phone: e.target.value }); }}
                    placeholder="Ej: +54 9 11 1234-5678"
                    required
                    type="tel"
                    value={clientData.phone}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="rb-email">Email (opcional)</label>
                  <Input
                    id="rb-email"
                    onChange={(e) => { setClientData({ ...clientData, email: e.target.value }); }}
                    placeholder="Ej: maria@email.com"
                    type="email"
                    value={clientData.email}
                  />
                </div>
                <Button className="w-full" type="submit">
                  Continuar
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Service Selection */}
        {step === "service" && (
          <Card className="bg-white/80 backdrop-blur-md border-pink-100">
            <CardHeader>
              <CardTitle className="text-xl">Elegí tu servicio</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmitService}>
                <div className="space-y-3">
                  <label className="text-sm font-medium">Servicio *</label>
                  <div className="grid gap-3">
                    {MOCK_SERVICES.map((service) => (
                      <button
                        aria-pressed={serviceData.serviceId === service.id}
                        className={`p-4 rounded-xl text-left transition-all border-2 ${
                          serviceData.serviceId === service.id
                            ? "border-pink-500 bg-pink-50"
                            : "border-gray-200 hover:border-pink-200"
                        }`}
                        key={service.id}
                        onClick={() => { setServiceData({ ...serviceData, addonIds: [], serviceId: service.id, type: "" }); }}
                        type="button"
                      >
                        <div className="flex justify-between items-start">
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
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Tipo de sesión *</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        aria-pressed={serviceData.type === "new"}
                        className={`p-4 rounded-xl text-center transition-all border-2 ${
                          serviceData.type === "new"
                            ? "border-pink-500 bg-pink-50"
                            : "border-gray-200 hover:border-pink-200"
                        }`}
                        onClick={() => { setServiceData({ ...serviceData, type: "new" }); }}
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
                        className={`p-4 rounded-xl text-center transition-all border-2 ${
                          serviceData.type === "maintenance"
                            ? "border-pink-500 bg-pink-50"
                            : "border-gray-200 hover:border-pink-200"
                        }`}
                        onClick={() => { setServiceData({ ...serviceData, type: "maintenance" }); }}
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
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Extras (opcional)</label>
                    <div className="grid gap-2">
                      {MOCK_ADDONS.map((addon) => (
                        <button
                          aria-pressed={serviceData.addonIds.includes(addon.id)}
                          className={`p-3 rounded-xl flex justify-between items-center transition-all border-2 ${
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
                          <span className="text-pink-600 font-medium">
                            {formatPrice(addon.price)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-[rgba(15,15,20,0.6)]">Total estimado</span>
                    <span className="text-2xl font-light">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={() => { setStep("client"); }} type="button" variant="outline">
                    Volver
                  </Button>
                  <Button className="flex-1" disabled={!serviceData.type} type="submit">
                    Continuar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Schedule */}
        {step === "schedule" && (
          <Card className="bg-white/80 backdrop-blur-md border-pink-100">
            <CardHeader>
              <CardTitle className="text-xl">Elegí fecha y horario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium" htmlFor="rb-date">Fecha *</label>
                  <Input
                    id="rb-date"
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => { setScheduleData({ ...scheduleData, date: e.target.value }); }}
                    required
                    type="date"
                    value={scheduleData.date}
                  />
                </div>

                {scheduleData.date && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Horario disponible *</label>
                    <div className="grid grid-cols-4 gap-2">
                      {HOURS.map((hour) => (
                        <button
                          aria-pressed={scheduleData.startTime === hour}
                          className={`p-2 rounded-lg text-sm font-medium transition-all ${
                            scheduleData.startTime === hour
                              ? "bg-pink-500 text-white"
                              : "bg-gray-100 hover:bg-pink-100"
                          }`}
                          key={hour}
                          onClick={() => { setScheduleData({ ...scheduleData, startTime: hour }); }}
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
                  <div className="p-4 bg-pink-50 rounded-xl space-y-2">
                    <p className="font-medium">Resumen de tu reserva:</p>
                    <p className="text-sm">{selectedService?.name} ({serviceData.type ? SERVICE_TYPE_LABELS[serviceData.type] : ""})</p>
                    {selectedAddons.length > 0 && (
                      <p className="text-sm text-[rgba(15,15,20,0.6)]">
                        + {selectedAddons.map((a) => a.name).join(", ")}
                      </p>
                    )}
                    <p className="text-sm">
                      📅 {format(new Date(scheduleData.date), "EEEE d 'de' MMMM", { locale: es })}
                    </p>
                    <p className="text-sm">⏰ {scheduleData.startTime} hs</p>
                    <p className="text-lg font-medium pt-2">
                      Total: {formatPrice(calculateTotal())}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button onClick={() => { setStep("service"); }} type="button" variant="outline">
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
        <Dialog onOpenChange={setShowSuccess} open={showSuccess}>
          <DialogContent className="max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">¡Reserva enviada!</DialogTitle>
            </DialogHeader>
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl">✓</span>
              </div>
              <p className="text-[rgba(15,15,20,0.6)]">
                Tu solicitud de reserva fue enviada. Te contactaremos por WhatsApp para confirmar.
              </p>
              <div className="pt-4 space-y-3">
                <Button className="w-full" onClick={handleSendWhatsApp}>
                  {COMMON_ACTIONS.sendWhatsApp}
                </Button>
                <Button className="w-full" onClick={() => { setShowSuccess(false); }} variant="outline">
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
