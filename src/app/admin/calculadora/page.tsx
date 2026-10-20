"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COMMON_ACTIONS, SERVICE_TYPE_LABELS } from "@/lib/content";
import {
  calculateDuration,
  calculatePrice,
  formatPrice,
  getBaseDuration,
  getBasePrice,
} from "@/lib/domain/pricing";
import { MOCK_ADDONS, MOCK_CLIENTS, MOCK_SERVICES, type ServiceType } from "@/lib/mock/data";
import { useAppStore } from "@/stores/app-store";

export default function AdminCalculatorPage() {
  // useSearchParams requires a Suspense boundary for static prerender
  // (missing-suspense-with-csr-bailout on next build).
  return (
    <Suspense fallback={null}>
      <AdminCalculatorPageBody />
    </Suspense>
  );
}

function AdminCalculatorPageBody() {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [serviceType, setServiceType] = useState<ServiceType>("new");
  const [addonIds, setAddonIds] = useState<readonly string[]>([]);
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const { addQuote, saveQuoteToClient } = useAppStore();

  // NAIL-L3: the clientas "Nueva cotización" lands here with ?client=<id> —
  // the client is preloaded instead of arriving to an empty form.
  const searchParams = useSearchParams();
  const clientParam = searchParams.get("client");

  useEffect(() => {
    if (!clientParam) {
      return;
    }
    const client = MOCK_CLIENTS.find((c) => c.id === clientParam);
    if (client) {
      setSelectedClientId(client.id);
      setClientName(client.name);
      setClientPhone(client.phone);
    }
  }, [clientParam]);

  const selectedService = MOCK_SERVICES.find((s) => s.id === serviceId);
  const selectedAddons = MOCK_ADDONS.filter((a) => addonIds.includes(a.id));

  const basePrice = selectedService ? getBasePrice(selectedService, serviceType) : 0;

  const totalPrice = selectedService
    ? calculatePrice(selectedService, selectedAddons, serviceType)
    : 0;

  const duration = selectedService ? getBaseDuration(selectedService, serviceType) : 0;

  const totalDuration = selectedService
    ? calculateDuration(selectedService, selectedAddons, serviceType)
    : 0;

  const toggleAddon = (id: string) => {
    setAddonIds((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  };

  const handleSelectClient = (id: string) => {
    if (id === "new") {
      setSelectedClientId("");
      setClientName("");
      setClientPhone("");
    } else {
      const client = MOCK_CLIENTS.find((c) => c.id === id);
      if (client) {
        setSelectedClientId(id);
        setClientName(client.name);
        setClientPhone(client.phone);
      }
    }
  };

  const generateQuoteText = () => {
    return `💅 PRESUPUESTO - NAILAPP

👤 Cliente: ${clientName || "Sin nombre"}
📱 Tel: ${clientPhone || "-"}

━━━━━━━━━━━━━━━━━━

💅 Servicio: ${selectedService?.name}
   Tipo: ${SERVICE_TYPE_LABELS[serviceType]}
   Precio: ${formatPrice(basePrice)}

${selectedAddons.length > 0 ? `✨ Extras:\n${selectedAddons.map((a) => `   • ${a.name}: ${formatPrice(a.price)}`).join("\n")}\n` : ""}━━━━━━━━━━━━━━━━━━

⏱️ Duración estimada: ${totalDuration} min
💰 TOTAL: ${formatPrice(totalPrice)}

${notes ? `📝 Notas: ${notes}\n` : ""}━━━━━━━━━━━━━━━━━━

¡Gracias por elegirnos! 💖`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateQuoteText());
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = generateQuoteText();
      document.body.append(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(generateQuoteText());
    const phone = clientPhone.replaceAll(/\D/g, "");
    const waLink = phone
      ? `https://wa.me/${phone}?text=${message}`
      : `https://wa.me/?text=${message}`;
    window.open(waLink, "_blank");
  };

  const handleSaveDraft = () => {
    addQuote({
      addonIds,
      clientId: selectedClientId || undefined,
      clientName: clientName || "Sin nombre",
      clientPhone: clientPhone || "-",
      notes: notes || undefined,
      serviceId,
      status: "draft",
      totalPrice,
      type: serviceType,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  const handleSaveToClient = () => {
    if (selectedClientId) {
      const quote = addQuote({
        addonIds,
        clientId: selectedClientId,
        clientName: clientName,
        clientPhone: clientPhone,
        notes: notes || undefined,
        serviceId,
        status: "saved",
        totalPrice,
        type: serviceType,
      });
      saveQuoteToClient(quote.id, selectedClientId);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
      }, 2000);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-1 font-serif text-3xl">Calculadora de Precios</h1>
        <p className="text-[rgba(15,15,20,0.5)]">Armá presupuestos y envialos por WhatsApp</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Form */}
        <div className="space-y-6">
          {/* Client */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                onValueChange={handleSelectClient}
                value={selectedClientId}
              >
                <SelectTrigger aria-label="Seleccionar clienta existente">
                  <SelectValue placeholder="Seleccionar clienta existente..." />
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
                  <SelectItem value="new">+ Nueva clienta</SelectItem>
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium"
                    htmlFor="calc-client-name"
                  >
                    Nombre
                  </label>
                  <Input
                    id="calc-client-name"
                    onChange={(e) => {
                      setClientName(e.target.value);
                    }}
                    placeholder="Nombre"
                    value={clientName}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium"
                    htmlFor="calc-client-phone"
                  >
                    WhatsApp
                  </label>
                  <Input
                    id="calc-client-phone"
                    onChange={(e) => {
                      setClientPhone(e.target.value);
                    }}
                    placeholder="+54 9 11..."
                    value={clientPhone}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Servicio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                onValueChange={setServiceId}
                value={serviceId}
              >
                <SelectTrigger aria-label="Seleccionar servicio">
                  <SelectValue placeholder="Seleccionar servicio..." />
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

              {serviceId && (
                <div
                  aria-label="Tipo de sesión"
                  className="grid grid-cols-2 gap-4"
                  role="group"
                >
                  <button
                    aria-pressed={serviceType === "new"}
                    className={`rounded-xl border-2 p-4 text-center transition-all ${
                      serviceType === "new"
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-200 hover:border-pink-200"
                    }`}
                    onClick={() => {
                      setServiceType("new");
                    }}
                  >
                    <p className="font-medium">{SERVICE_TYPE_LABELS.new}</p>
                    <p className="text-xl font-light text-pink-600">
                      {formatPrice(selectedService?.basePriceNew ?? 0)}
                    </p>
                    <p className="text-xs text-[rgba(15,15,20,0.5)]">
                      {selectedService?.durationNew} min
                    </p>
                  </button>
                  <button
                    aria-pressed={serviceType === "maintenance"}
                    className={`rounded-xl border-2 p-4 text-center transition-all ${
                      serviceType === "maintenance"
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-200 hover:border-pink-200"
                    }`}
                    onClick={() => {
                      setServiceType("maintenance");
                    }}
                  >
                    <p className="font-medium">{SERVICE_TYPE_LABELS.maintenance}</p>
                    <p className="text-xl font-light text-pink-600">
                      {formatPrice(selectedService?.basePriceMaintenance ?? 0)}
                    </p>
                    <p className="text-xs text-[rgba(15,15,20,0.5)]">
                      {selectedService?.durationMaintenance} min
                    </p>
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Addons */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Extras</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                aria-label="Extras"
                className="grid grid-cols-2 gap-2"
                role="group"
              >
                {MOCK_ADDONS.map((addon) => (
                  <button
                    aria-pressed={addonIds.includes(addon.id)}
                    className={`flex items-center justify-between rounded-xl border-2 p-3 transition-all ${
                      addonIds.includes(addon.id)
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-200 hover:border-pink-200"
                    }`}
                    key={addon.id}
                    onClick={() => {
                      toggleAddon(addon.id);
                    }}
                  >
                    <span className="text-sm">{addon.name}</span>
                    <Badge variant="secondary">{formatPrice(addon.price)}</Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Notas</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                aria-label="Notas adicionales para el presupuesto"
                id="notes-input"
                onChange={(e) => {
                  setNotes(e.target.value);
                }}
                placeholder="Notas adicionales para el presupuesto..."
                value={notes}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right: Summary */}
        <div className="space-y-6">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="text-xl">Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Service */}
              {selectedService && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{selectedService.name}</span>
                    <span>{formatPrice(basePrice)}</span>
                  </div>
                  <p className="text-sm text-[rgba(15,15,20,0.5)]">
                    {SERVICE_TYPE_LABELS[serviceType]} · {duration} min
                  </p>
                </div>
              )}

              {/* Addons */}
              {selectedAddons.length > 0 && (
                <div className="space-y-1 border-t pt-2">
                  {selectedAddons.map((addon) => (
                    <div
                      className="flex justify-between text-sm"
                      key={addon.id}
                    >
                      <span className="text-[rgba(15,15,20,0.6)]">{addon.name}</span>
                      <span>{formatPrice(addon.price)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total</span>
                  <span className="text-3xl font-light">{formatPrice(totalPrice)}</span>
                </div>
                <p className="mt-1 text-sm text-[rgba(15,15,20,0.5)]">
                  Duración total: {totalDuration} minutos
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4">
                <Button
                  className="w-full"
                  disabled={!serviceId || !clientName}
                  onClick={handleWhatsApp}
                >
                  {COMMON_ACTIONS.sendWhatsApp}
                </Button>
                <Button
                  aria-live="polite"
                  className="w-full"
                  disabled={!serviceId}
                  onClick={handleCopy}
                  variant="outline"
                >
                  {copied ? "✓ Copiado!" : "📋 Copiar al portapapeles"}
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    aria-live="polite"
                    disabled={!serviceId}
                    onClick={handleSaveDraft}
                    variant="outline"
                  >
                    {saved ? "✓ Guardado!" : "Guardar borrador"}
                  </Button>
                  <Button
                    disabled={!serviceId || !selectedClientId}
                    onClick={handleSaveToClient}
                    variant="outline"
                  >
                    Guardar en clienta
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
