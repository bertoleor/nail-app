"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAppStore, useClientHistory, MOCK_CLIENTS } from "@/stores/app-store";
import { MOCK_SERVICES } from "@/lib/mock/data";
import type { Client } from "@/lib/mock/data";

export default function AdminClientsPage() {
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", phone: "", email: "", notes: "" });

  const { addClient } = useAppStore();

  const filteredClients = MOCK_CLIENTS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const handleAddClient = () => {
    if (newClient.name && newClient.phone) {
      addClient({
        name: newClient.name,
        phone: newClient.phone,
        email: newClient.email || undefined,
        notes: newClient.notes || undefined,
      });
      setNewClient({ name: "", phone: "", email: "", notes: "" });
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
        <Button onClick={() => setShowNewClientDialog(true)}>
          Nueva clienta
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="Buscar por nombre o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Clients List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => {
          const history = useClientHistory(client.id);
          return (
            <Card
              key={client.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedClient(client)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-[rgba(15,15,20,0.5)]">{client.phone}</p>
                  </div>
                  {client.email && (
                    <Badge variant="outline" className="text-xs">
                      ✉️
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
        })}
      </div>

      {/* Client Detail Dialog */}
      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
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
      <Dialog open={showNewClientDialog} onOpenChange={setShowNewClientDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Nueva clienta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre *</label>
              <Input
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                placeholder="Nombre completo"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Teléfono *</label>
              <Input
                value={newClient.phone}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                placeholder="+54 9 11 ..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                placeholder="email@ejemplo.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notas</label>
              <Input
                value={newClient.notes}
                onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                placeholder="Preferencias, alergias..."
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowNewClientDialog(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleAddClient}
                disabled={!newClient.name || !newClient.phone}
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

function ClientDetail({ client }: { client: Client }) {
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
                  key={booking.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
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
                          : booking.status === "cancelled"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {booking.status === "completed"
                        ? "Completado"
                        : booking.status === "cancelled"
                        ? "Cancelado"
                        : booking.status}
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
        <Button variant="outline" className="flex-1">
          Agendar turno
        </Button>
        <Button className="flex-1">
          Nueva cotización
        </Button>
      </div>
    </div>
  );
}
