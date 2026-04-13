import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminBookingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl mb-2">Gestión de Turnos</h1>
          <p className="text-[rgba(15,15,20,0.6)]">
            Administrá todos los turnos
          </p>
        </div>
        <Button>Agregar turno</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-[rgba(15,15,20,0.5)]">Hoy</p>
            <p className="text-2xl font-light">0 turnos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-[rgba(15,15,20,0.5)]">Esta semana</p>
            <p className="text-2xl font-light">0 turnos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-[rgba(15,15,20,0.5)]">Pendientes</p>
            <p className="text-2xl font-light">0</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Turnos recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[rgba(15,15,20,0.45)] text-center py-8">
            No hay turnos registrados
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
