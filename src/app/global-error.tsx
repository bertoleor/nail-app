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
      <body className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <h2 className="text-2xl font-medium text-foreground mb-4">
            Algo salió mal
          </h2>
          <p className="text-muted mb-6">
            Ocurrió un error inesperado. Por favor, intentá de nuevo.
          </p>
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            onClick={() => { reset(); }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
