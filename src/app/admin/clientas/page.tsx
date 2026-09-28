"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

import type { Client } from "@/lib/mock/data";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MOCK_SERVICES } from "@/lib/mock/data";
import { MOCK_CLIENTS, useAppStore, useClientHistory } from "@/stores/app-store";

function ClientCard({
  client,
  onSelect,
}: {
  client: Client;
  onSelect: (client: Client) => void;
}) {
  const history = useClientHistory(client.id);

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => { onSelect(client); }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(client);
        }
      }}
      role="button"
      tabIndex={0}
      key={client.id}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="font-medium">{client.name}</p>
            <p className="text-sm text-[rgba(15,15,20,0.5)]">{client.phone}</p>
          </div>
          {client.email && (
            <Badge className="text-xs" variant="outline">
              <Mail aria-hidden className="size-3.5" />
            </Badge>
          )}
        </div>
        <div className="flex gap-4 text-sm text-[rgba(15,15,20,0.5)]">
          <span>{history.totalVisits} visitas</span>
          <span>${history.totalSpent.toLocaleString("es-AR")}</span>
        </div>
        {history.lastVisit && (
          <p className="text-xs text-[rgba(15,15,20,0.4)] mt-2">
            Última visita: {history.lastVisit}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminClientsPage() {
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [newClient, setNewClient] = useState({ email: "", name: "", notes: "", phone: "" });

  const { addClient } = useAppStore();

  const filteredClients = MOCK_CLIENTS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const handleAddClient = () => {
    if (newClient.name && newClient.phone) {
      addClient({
        email: newClient.email || undefined,
        name: newClient.name,
        notes: newClient.notes || undefined,
        phone: newClient.phone,
      });
      setNewClient({ email: "", name: "", notes: "", phone: "" });
      setShowNewClientDialog(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl mb-1">Clientas</h1>
          <p className="text-[rgba(15,15,20,0.5)]">
            {MOCK_CLIENTS.length} clientas registradas
          </p>
        </div>
        <Button onClick={() => { setShowNewClientDialog(true); }}>
          Nueva clienta
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <Input
            aria-label="Buscar clientas por nombre o teléfono"
            onChange={(e) => { setSearch(e.target.value); }}
            placeholder="Buscar por nombre o teléfono..."
            value={search}
          />
        </CardContent>
      </Card>

      {/* Clients List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <ClientCard
            client={client}
            key={client.id}
            onSelect={setSelectedClient}
          />
        ))}
      </div>

      {/* Client Detail Dialog */}
      <Dialog onOpenChange={() => { setSelectedClient(null); }} open={!!selectedClient}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedClient?.name}</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <ClientDetail client={selectedClient} />
          )}
        </DialogContent>
      </Dialog>

      {/* New Client Dialog */}
      <Dialog onOpenChange={setShowNewClientDialog} open={showNewClientDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Nueva clienta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="new-client-name">Nombre *</label>
              <Input
                id="new-client-name"
                onChange={(e) => { setNewClient({ ...newClient, name: e.target.value }); }}
                placeholder="Nombre completo"
                value={newClient.name}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="new-client-phone">Teléfono *</label>
              <Input
                id="new-client-phone"
                onChange={(e) => { setNewClient({ ...newClient, phone: e.target.value }); }}
                placeholder="+54 9 11 ..."
                value={newClient.phone}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="new-client-email">Email</label>
              <Input
                id="new-client-email"
                onChange={(e) => { setNewClient({ ...newClient, email: e.target.value }); }}
                placeholder="email@ejemplo.com"
                type="email"
                value={newClient.email}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="new-client-notes">Notas</label>
              <Input
                id="new-client-notes"
                onChange={(e) => { setNewClient({ ...newClient, notes: e.target.value }); }}
                placeholder="Preferencias, alergias..."
                value={newClient.notes}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={() => { setShowNewClientDialog(false); }} variant="outline">
                Cancelar
              </Button>
              <Button
                disabled={!newClient.name || !newClient.phone}
                onClick={handleAddClient}
              >
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ClientDetail({ client }: { readonly client: Client }) {
  const history = useClientHistory(client.id);

  return (
    <div className="space-y-6">
      {/* Contact Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-[rgba(15,15,20,0.5)]">Teléfono</p>
          <p className="font-medium">{client.phone}</p>
        </div>
        {client.email && (
          <div>
            <p className="text-sm text-[rgba(15,15,20,0.5)]">Email</p>
            <p className="font-medium">{client.email}</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
        <div className="text-center">
          <p className="text-2xl font-light">{history.totalVisits}</p>
          <p className="text-xs text-[rgba(15,15,20,0.5)]">Visitas</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-light">${history.totalSpent.toLocaleString("es-AR")}</p>
          <p className="text-xs text-[rgba(15,15,20,0.5)]">Total gastado</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-light">
            {history.lastVisit || "-"}
          </p>
          <p className="text-xs text-[rgba(15,15,20,0.5)]">Última visita</p>
        </div>
      </div>

      {/* Notes */}
      {client.notes && (
        <div>
          <p className="text-sm text-[rgba(15,15,20,0.5)] mb-1">Notas</p>
          <p className="p-3 bg-amber-50 rounded-lg text-sm">{client.notes}</p>
        </div>
      )}

      {/* History */}
      <div>
        <p className="text-sm text-[rgba(15,15,20,0.5)] mb-2">Historial de sesiones</p>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {history.bookings.length === 0 ? (
            <p className="text-sm text-[rgba(15,15,20,0.4)] text-center py-4">
              Sin historial todavía
            </p>
          ) : (
            history.bookings.map((booking) => {
              const service = MOCK_SERVICES.find((s) => s.id === booking.serviceId);
              return (
                <div
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  key={booking.id}
                >
                  <div>
                    <p className="font-medium">{service?.name}</p>
                    <p className="text-sm text-[rgba(15,15,20,0.5)]">
                      {booking.date} · {booking.startTime}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${booking.totalPrice.toLocaleString("es-AR")}
                    </p>
                    <Badge
                      variant={
                        booking.status === "completed"
                          ? "default"
                          : (booking.status === "cancelled"
                          ? "destructive"
                          : "secondary")
                      }
                    >
                      {booking.status === "completed"
                        ? "Completado"
                        : (booking.status === "cancelled"
                        ? "Cancelado"
                        : booking.status)}
                    </Badge>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="flex-1" variant="outline">
          Agendar turno
        </Button>
        <Button className="flex-1">
          Nueva cotización
        </Button>
      </div>
    </div>
  );
}
