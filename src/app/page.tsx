import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex flex-col items-center justify-center gap-8 px-4 py-12">
      <div className="text-center space-y-4">
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight">
          NailApp
        </h1>
        <p className="text-[rgba(15,15,20,0.6)] text-center text-base sm:text-lg max-w-md font-light leading-relaxed">
          Sistema de gestión para manicuristas
        </p>
      </div>

      <div className="w-full max-w-md space-y-4">
        {/* Client section */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-pink-100">
          <h2 className="font-serif text-xl mb-2">Soy Clienta</h2>
          <p className="text-sm text-[rgba(15,15,20,0.5)] mb-4">
            Reservá tu turno de forma fácil y rápida
          </p>
          <Link
            href="/reservar"
            className="block w-full text-center py-3 px-6 rounded-full bg-pink-500 text-white font-medium hover:bg-pink-600 transition-colors"
          >
            Reservar turno
          </Link>
        </div>

        {/* Admin section */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-gray-200">
          <h2 className="font-serif text-xl mb-2">Soy Manicurista</h2>
          <p className="text-sm text-[rgba(15,15,20,0.5)] mb-4">
            Gestióná tu agenda, clientas y presupuestos
          </p>
          <Link
            href="/admin"
            className="block w-full text-center py-3 px-6 rounded-full border-2 border-pink-500 text-pink-500 font-medium hover:bg-pink-50 transition-colors"
          >
            Ir al panel
          </Link>
        </div>
      </div>

      <p className="text-xs text-[rgba(15,15,20,0.3)] text-center">
        Mockup demo · Datos de ejemplo
      </p>
    </main>
  );
}
