"use client";

export default function GlobalError({
  error,
  reset,
}: {
  readonly error: { readonly digest?: string } & Error;
  readonly reset: () => void;
}) {
  return (
    <html lang="es">
      <body className="bg-background flex min-h-screen items-center justify-center">
        <div className="p-8 text-center">
          <h2 className="text-foreground mb-4 text-2xl font-medium">Algo salió mal</h2>
          <p className="text-muted mb-6">
            Ocurrió un error inesperado. Por favor, intentá de nuevo.
          </p>
          <button
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2"
            onClick={() => {
              reset();
            }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
