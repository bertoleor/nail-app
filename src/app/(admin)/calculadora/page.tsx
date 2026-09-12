"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_ADDONS, MOCK_CLIENTS, MOCK_SERVICES, type ServiceType } from "@/lib/mock/data";
import { useAppStore } from "@/stores/app-store";

export default function AdminCalculatorPage() {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [serviceType, setServiceType] = useState<ServiceType>("new");
  const [addonIds, setAddonIds] = useState<readonly string[]>([]);
  const [notes, setNotes] = useState("");
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const { addQuote, saveQuoteToClient } = useAppStore();

  const selectedService = MOCK_SERVICES.find((s) => s.id === serviceId);
  const selectedAddons = MOCK_ADDONS.filter((a) => addonIds.includes(a.id));
  const selectedClient = MOCK_CLIENTS.find((c) => c.id === selectedClientId);

  const basePrice = selectedService
    ? (serviceType === "new"
      ? selectedService.basePriceNew
      : selectedService.basePriceMaintenance)
    : 0;

  const addonsPrice = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = basePrice + addonsPrice;

  const duration = selectedService
    ? (serviceType === "new"
      ? selectedService.durationNew
      : selectedService.durationMaintenance)
    : 0;
  const totalDuration = duration + selectedAddons.reduce((sum, a) => sum + a.duration, 0);

  const toggleAddon = (id: string) => {
    setAddonIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
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
   Tipo: ${serviceType === "new" ? "Nuevo" : "Mantenimiento"}
   Precio: $${basePrice.toLocaleString("es-AR")}

${selectedAddons.length > 0 ? `✨ Extras:\n${selectedAddons.map((a) => `   • ${a.name}: $${a.price.toLocaleString("es-AR")}`).join("\n")}\n` : ""}━━━━━━━━━━━━━━━━━━

⏱️ Duración estimada: ${totalDuration} min
💰 TOTAL: $${totalPrice.toLocaleString("es-AR")}

${notes ? `📝 Notas: ${notes}\n` : ""}━━━━━━━━━━━━━━━━━━

¡Gracias por elegirnos! 💖`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateQuoteText());
      setCopied(true);
      setTimeout(() => { setCopied(false); }, 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = generateQuoteText();
      document.body.append(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
      setCopied(true);
      setTimeout(() => { setCopied(false); }, 2000);
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
    setTimeout(() => { setSaved(false); }, 2000);
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
      setTimeout(() => { setSaved(false); }, 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl mb-1">Calculadora de Precios</h1>
        <p className="text-[rgba(15,15,20,0.5)]">
          Armá presupuestos y envialos por WhatsApp
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Form */}
        <div className="space-y-6">
          {/* Client */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select onValueChange={handleSelectClient} value={selectedClientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar clienta existente..." />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_CLIENTS.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="new">+ Nueva clienta</SelectItem>
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nombre</label>
                  <Input
                    onChange={(e) => { setClientName(e.target.value); }}
                    placeholder="Nombre"
                    value={clientName}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">WhatsApp</label>
                  <Input
                    onChange={(e) => { setClientPhone(e.target.value); }}
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
              <Select onValueChange={setServiceId} value={serviceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar servicio..." />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_SERVICES.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {serviceId && (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    className={`p-4 rounded-xl text-center transition-all border-2 ${
                      serviceType === "new"
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-200 hover:border-pink-200"
                    }`}
                    onClick={() => { setServiceType("new"); }}
                  >
                    <p className="font-medium">Nuevo</p>
                    <p className="text-xl font-light text-pink-600">
                      ${selectedService?.basePriceNew.toLocaleString("es-AR")}
                    </p>
                    <p className="text-xs text-[rgba(15,15,20,0.5)]">
                      {selectedService?.durationNew} min
                    </p>
                  </button>
                  <button
                    className={`p-4 rounded-xl text-center transition-all border-2 ${
                      serviceType === "maintenance"
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-200 hover:border-pink-200"
                    }`}
                    onClick={() => { setServiceType("maintenance"); }}
                  >
                    <p className="font-medium">Mantenimiento</p>
                    <p className="text-xl font-light text-pink-600">
                      ${selectedService?.basePriceMaintenance.toLocaleString("es-AR")}
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
              <div className="grid grid-cols-2 gap-2">
                {MOCK_ADDONS.map((addon) => (
                  <button
                    className={`p-3 rounded-xl flex justify-between items-center transition-all border-2 ${
                      addonIds.includes(addon.id)
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-200 hover:border-pink-200"
                    }`}
                    key={addon.id}
                    onClick={() => { toggleAddon(addon.id); }}
                  >
                    <span className="text-sm">{addon.name}</span>
                    <Badge variant="secondary">
                      +${addon.price.toLocaleString("es-AR")}
                    </Badge>
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
                onChange={(e) => { setNotes(e.target.value); }}
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
                    <span>${basePrice.toLocaleString("es-AR")}</span>
                  </div>
                  <p className="text-sm text-[rgba(15,15,20,0.5)]">
                    {serviceType === "new" ? "Nuevo" : "Mantenimiento"} · {duration} min
                  </p>
                </div>
              )}

              {/* Addons */}
              {selectedAddons.length > 0 && (
                <div className="space-y-1 pt-2 border-t">
                  {selectedAddons.map((addon) => (
                    <div className="flex justify-between text-sm" key={addon.id}>
                      <span className="text-[rgba(15,15,20,0.6)]">{addon.name}</span>
                      <span>+${addon.price.toLocaleString("es-AR")}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Total */}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="text-3xl font-light">
                    ${totalPrice.toLocaleString("es-AR")}
                  </span>
                </div>
                <p className="text-sm text-[rgba(15,15,20,0.5)] mt-1">
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
                  📱 Enviar por WhatsApp
                </Button>
                <Button
                  className="w-full"
                  disabled={!serviceId}
                  onClick={handleCopy}
                  variant="outline"
                >
                  {copied ? "✓ Copiado!" : "📋 Copiar al portapapeles"}
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button
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
