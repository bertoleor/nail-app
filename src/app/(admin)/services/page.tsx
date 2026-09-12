import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SERVICES } from "@/lib/domain/pricing";

export default function AdminServicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl mb-2">Servicios</h1>
          <p className="text-[rgba(15,15,20,0.6)]">
            Configurá precios y duración
          </p>
        </div>
        <Button>Nuevo servicio</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SERVICES.map((service) => (
          <Card key={service.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{service.name}</h3>
                <Badge variant="default">
                  ARS {service.basePrice.toLocaleString()}
                </Badge>
              </div>
              <p className="text-sm text-[rgba(15,15,20,0.5)]">
                {service.duration} minutos
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
