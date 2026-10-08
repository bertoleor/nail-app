import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SERVICE_TYPE_LABELS } from "@/lib/content";
import { formatPrice, SERVICES } from "@/lib/domain/pricing";

export default function AdminServicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 font-serif text-2xl">Servicios</h1>
          <p className="text-[rgba(15,15,20,0.6)]">Configurá precios y duración</p>
        </div>
        <Button>Nuevo servicio</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {SERVICES.map((service) => (
          <Card key={service.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">{service.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              {service.description && (
                <p className="text-sm text-[rgba(15,15,20,0.5)]">{service.description}</p>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-[rgba(15,15,20,0.5)]">{SERVICE_TYPE_LABELS.new}</p>
                  <Badge variant="default">{formatPrice(service.basePriceNew)}</Badge>
                  <p className="mt-1 text-xs text-[rgba(15,15,20,0.5)]">
                    {service.durationNew} minutos
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[rgba(15,15,20,0.5)]">
                    {SERVICE_TYPE_LABELS.maintenance}
                  </p>
                  <Badge variant="default">{formatPrice(service.basePriceMaintenance)}</Badge>
                  <p className="mt-1 text-xs text-[rgba(15,15,20,0.5)]">
                    {service.durationMaintenance} minutos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
