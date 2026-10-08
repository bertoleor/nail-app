import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="relative z-0 flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-12">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-light tracking-tight sm:text-5xl md:text-6xl">NailApp</h1>
        <p className="glass-text-secondary max-w-md text-center text-base leading-relaxed font-light sm:text-lg">
          Sistema de gestión para manicuristas
        </p>
      </div>

      <div className="w-full max-w-md space-y-4">
        {/* Client section */}
        <div className="glass-opaque rounded-2xl p-6">
          <h2 className="mb-2 text-xl font-medium tracking-wide">Soy Clienta</h2>
          <p className="glass-text-secondary mb-4 text-sm">
            Reservá tu turno de forma fácil y rápida
          </p>
          <Button
            asChild
            className="w-full"
            size="lg"
          >
            <Link href="/reservar">Reservar turno</Link>
          </Button>
        </div>

        {/* Admin section */}
        <div className="glass-subtle rounded-2xl p-6">
          <h2 className="mb-2 text-xl font-medium tracking-wide">Soy Manicurista</h2>
          <p className="glass-text-secondary mb-4 text-sm">
            Gestióná tu agenda, clientas y presupuestos
          </p>
          <Button
            asChild
            className="w-full"
            size="lg"
            variant="outline"
          >
            <Link href="/admin">Ir al panel</Link>
          </Button>
        </div>
      </div>

      <p className="glass-text-muted pt-8 text-center text-xs">Mockup demo · Datos de ejemplo</p>
    </main>
  );
}
