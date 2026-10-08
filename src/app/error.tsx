"use client";

export default function Error({
  error,
  reset,
}: {
  readonly error: { readonly digest?: string } & Error;
  readonly reset: () => void;
}) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <h2 className="text-foreground mb-2 text-xl font-medium">Algo salió mal</h2>
        <p className="text-muted mb-4">{error.message || "Error inesperado"}</p>
        <button
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2"
          onClick={() => {
            reset();
          }}
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
