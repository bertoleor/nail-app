"use client";

export default function Error({
  error,
  reset,
}: {
  readonly error: { readonly digest?: string } & Error;
  readonly reset: () => void;
}) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-medium text-foreground mb-2">
          Algo salió mal
        </h2>
        <p className="text-muted mb-4">{error.message || "Error inesperado"}</p>
        <button
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          onClick={() => { reset(); }}
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
