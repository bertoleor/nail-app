"use client";

import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Client } from "@/lib/mock/data";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { BOOKING_STATUS_LABELS, COMMON_ACTIONS } from "@/lib/content";
import { formatPrice } from "@/lib/domain/pricing";
import { MOCK_SERVICES } from "@/lib/mock/data";
import { MOCK_CLIENTS, useAppStore, useClientHistory } from "@/stores/app-store";

function ClientCard({ client, onSelect }: { client: Client; onSelect: (client: Client) => void }) {
  const history = useClientHistory(client.id);

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:outline-none"
      onClick={() => {
        onSelect(client);
      }}
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
        <div className="mb-2 flex items-start justify-between">
          <div>
            <p className="font-medium">{client.name}</p>
            <p className="text-sm text-[rgba(15,15,20,0.5)]">{client.phone}</p>
          </div>
          {client.email && (
            <Badge
              className="text-xs"
              variant="outline"
            >
              <Mail
                aria-hidden
                className="size-3.5"
              />
            </Badge>
          )}
        </div>
        <div className="flex gap-4 text-sm text-[rgba(15,15,20,0.5)]">
          <span>{history.totalVisits} visitas</span>
          <span>{formatPrice(history.totalSpent)}</span>
        </div>
        {history.lastVisit && (
          <p className="mt-2 text-xs text-[rgba(15,15,20,0.4)]">
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

  const filteredClients = MOCK_CLIENTS.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search),
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-1 font-serif text-3xl">Clientas</h1>
          <p className="text-[rgba(15,15,20,0.5)]">{MOCK_CLIENTS.length} clientas registradas</p>
        </div>
        <Button
          onClick={() => {
            setShowNewClientDialog(true);
          }}
        >
          Nueva clienta
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <Input
            aria-label="Buscar clientas por nombre o teléfono"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Buscar por nombre o teléfono..."
            value={search}
          />
        </CardContent>
      </Card>

      {/* Clients List */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <ClientCard
            client={client}
            key={client.id}
            onSelect={setSelectedClient}
          />
        ))}
      </div>

      {/* Client Detail Dialog */}
      <Dialog
        onOpenChange={() => {
          setSelectedClient(null);
        }}
        open={!!selectedClient}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedClient?.name}</DialogTitle>
          </DialogHeader>
          {selectedClient && <ClientDetail client={selectedClient} />}
        </DialogContent>
      </Dialog>

      {/* New Client Dialog */}
      <Dialog
        onOpenChange={setShowNewClientDialog}
        open={showNewClientDialog}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Nueva clienta</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddClient();
            }}
          >
            <div className="space-y-2">
              <label
                className="text-sm font-medium"
                htmlFor="new-client-name"
              >
                Nombre *
              </label>
              <Input
                id="new-client-name"
                onChange={(e) => {
                  setNewClient({ ...newClient, name: e.target.value });
                }}
                placeholder="Nombre completo"
                value={newClient.name}
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium"
                htmlFor="new-client-phone"
              >
                Teléfono *
              </label>
              <Input
                id="new-client-phone"
                onChange={(e) => {
                  setNewClient({ ...newClient, phone: e.target.value });
                }}
                placeholder="+54 9 11 ..."
                value={newClient.phone}
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium"
                htmlFor="new-client-email"
              >
                Email
              </label>
              <Input
                id="new-client-email"
                onChange={(e) => {
                  setNewClient({ ...newClient, email: e.target.value });
                }}
                placeholder="email@ejemplo.com"
                type="email"
                value={newClient.email}
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium"
                htmlFor="new-client-notes"
              >
                Notas
              </label>
              <Input
                id="new-client-notes"
                onChange={(e) => {
                  setNewClient({ ...newClient, notes: e.target.value });
                }}
                placeholder="Preferencias, alergias..."
                value={newClient.notes}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => {
                  setShowNewClientDialog(false);
                }}
                type="button"
                variant="outline"
              >
                {COMMON_ACTIONS.cancel}
              </Button>
              <Button
                disabled={!newClient.name || !newClient.phone}
                type="submit"
              >
                Guardar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ClientDetail({ client }: { readonly client: Client }) {
  const history = useClientHistory(client.id);
  const router = useRouter();

  // NAIL-L3: the detail CTAs must act — they route to a live surface with the
  // client preselected, instead of being dead placeholder buttons.
  const handleBook = () => {
    router.push(`/admin/turnos?action=new&client=${client.id}`);
  };

  const handleQuote = () => {
    router.push(`/admin/calculadora?client=${client.id}`);
  };

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
      <div className="grid grid-cols-3 gap-4 rounded-xl bg-gray-50 p-4">
        <div className="text-center">
          <p className="text-2xl font-light">{history.totalVisits}</p>
          <p className="text-xs text-[rgba(15,15,20,0.5)]">Visitas</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-light">{formatPrice(history.totalSpent)}</p>
          <p className="text-xs text-[rgba(15,15,20,0.5)]">Total gastado</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-light">{history.lastVisit || "-"}</p>
          <p className="text-xs text-[rgba(15,15,20,0.5)]">Última visita</p>
        </div>
      </div>

      {/* Notes */}
      {client.notes && (
        <div>
          <p className="mb-1 text-sm text-[rgba(15,15,20,0.5)]">Notas</p>
          <p className="rounded-lg bg-amber-50 p-3 text-sm">{client.notes}</p>
        </div>
      )}

      {/* History */}
      <div>
        <p className="mb-2 text-sm text-[rgba(15,15,20,0.5)]">Historial de sesiones</p>
        <div className="max-h-60 space-y-2 overflow-y-auto">
          {history.bookings.length === 0 ? (
            <p className="py-4 text-center text-sm text-[rgba(15,15,20,0.4)]">
              Sin historial todavía
            </p>
          ) : (
            history.bookings.map((booking) => {
              const service = MOCK_SERVICES.find((s) => s.id === booking.serviceId);
              return (
                <div
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                  key={booking.id}
                >
                  <div>
                    <p className="font-medium">{service?.name}</p>
                    <p className="text-sm text-[rgba(15,15,20,0.5)]">
                      {booking.date} · {booking.startTime}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(booking.totalPrice)}</p>
                    <Badge
                      variant={
                        booking.status === "completed"
                          ? "default"
                          : booking.status === "cancelled"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {BOOKING_STATUS_LABELS[booking.status]}
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
        <Button
          className="flex-1"
          onClick={handleBook}
          variant="outline"
        >
          Agendar turno
        </Button>
        <Button
          className="flex-1"
          onClick={handleQuote}
        >
          Nueva cotización
        </Button>
      </div>
    </div>
  );
}
