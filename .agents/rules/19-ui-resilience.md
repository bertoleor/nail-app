# 19 - UI Resilience (Gentleman-Grade)

## Principio Fundamental

Cada componente debe manejar gracefully todos los estados posibles: loading, empty, error, y success. La UI nunca debe romperse silenciosamente.

---

## 1. Estados Mandatorios (P0)

Todo componente que fetch data debe manejar:

- **Loading**: Skeleton o spinner accesible
- **Empty**: Mensaje claro con call-to-action
- **Error**: Mensaje humanizado con opción de retry
- **Success**: Contenido renderizado

## 2. Patrones de Resiliencia

### Error Boundary

```tsx
"use client";
import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
}

interface ErrorBoundaryState {
  readonly hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            role="alert"
            className="p-4 text-center"
          >
            <p>Algo salió mal. Intentá de nuevo.</p>
            <button onClick={() => this.setState({ hasError: false })}>Reintentar</button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

### Empty State

```tsx
function EmptyBookings() {
  return (
    <div className="py-12 text-center">
      <p className="text-muted">No tenés turnos agendados</p>
      <button>Agendar primer turno</button>
    </div>
  );
}
```

### Loading Skeleton

```tsx
function ServiceCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-white/80 p-4">
      <div className="bg-muted h-4 w-3/4 rounded" />
      <div className="bg-muted mt-2 h-3 w-1/2 rounded" />
    </div>
  );
}
```

## 3. Checklist UI Resilience

- [ ] ¿Maneja estado loading?
- [ ] ¿Maneja estado empty?
- [ ] ¿Maneja estado error con retry?
- [ ] ¿Los skeletons son accesibles (aria-busy)?

---

## Reglas Relacionadas

Al crear componentes UI, estas reglas son MANDATORIAS:

- **Rule 02**: Design System - Estética y paleta
- **Rule 09**: No AI Traces - Sin comentarios, sin style={}
- **Rule 10**: Accessibility - ARIA labels, keyboard navigation
- **Rule 16**: RSC Patterns - Server vs Client Components
