import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 px-4 py-12 relative z-0">
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl tracking-tight font-light">
          NailApp
        </h1>
        <p className="glass-text-secondary text-center text-base sm:text-lg max-w-md font-light leading-relaxed">
          Sistema de gestión para manicuristas
        </p>
      </div>

      <div className="w-full max-w-md space-y-4">
        {/* Client section */}
        <div className="glass-opaque rounded-2xl p-6">
          <h2 className="text-xl mb-2 font-medium tracking-wide">Soy Clienta</h2>
          <p className="text-sm glass-text-secondary mb-4">
            Reservá tu turno de forma fácil y rápida
          </p>
          <Link
            className="btn-primary w-full"
            href="/reservar"
          >
            Reservar turno
          </Link>
        </div>

        {/* Admin section */}
        <div className="glass-subtle rounded-2xl p-6">
          <h2 className="text-xl mb-2 font-medium tracking-wide">Soy Manicurista</h2>
          <p className="text-sm glass-text-secondary mb-4">
            Gestióná tu agenda, clientas y presupuestos
          </p>
          <Link
            className="btn-outline w-full"
            href="/admin"
          >
            Ir al panel
          </Link>
        </div>
      </div>

      <p className="text-xs glass-text-muted text-center pt-8">
        Mockup demo · Datos de ejemplo
      </p>
    </main>
  );
}
