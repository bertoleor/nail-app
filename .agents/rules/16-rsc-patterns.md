# React Server Components & React 19 — Next.js 16

## Principio Fundamental

RSC es la arquitectura central de Next.js App Router. La regla de oro: **todo componente es Server Component por defecto**. `'use client'` es la excepción, no la norma.

---

## Árbol de Decisión: RSC vs Client Component

```
¿Necesita este componente...
  - useState / useReducer?            → 'use client'
  - useEffect?                        → 'use client'
  - Event handlers (onClick, etc.)?  → 'use client'
  - Browser APIs (window, document)? → 'use client'
  - Context con estado mutable?      → 'use client'
  - Framer Motion / animaciones?     → 'use client'
  - Todo lo demás?                   → RSC (sin 'use client')
```

**Preguntas clave:**

1. "¿Necesito interactividad?" → No implica siempre Client Component. Un botón en un form Server Action es RSC.
2. "¿Podría mover el estado a un componente hijo más pequeño?" → Sí: hacer el componente hijo Client Component, mantener el padre RSC.

---

## 1. React 19 — Leyes Fundamentales (P0)

1. **No Manual Memoization**: Prohibido el uso de `useMemo` y `useCallback`. El **React Compiler** gestiona la optimización automáticamente. Escribir código limpio y dejar que el compilador trabaje.
2. **Ref as Prop**: Prohibido `forwardRef`. En React 19, `ref` es una prop estándar.
3. **Named Imports**: Prohibido `import React from 'react'`. Usar siempre imports nominales: `import { useState } from 'react'`.

---

## 2. Async APIs en Next.js 15+

En Next.js 15+, estas APIs son **async obligatoriamente**:

```typescript
// ✅ CORRECTO
import { cookies, headers } from "next/headers";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q: string }>;
}) {
  const { slug } = await params;
  const { q } = await searchParams;
  const cookieStore = await cookies();
  const headersList = await headers();
}

// ❌ INCORRECTO — Next.js 14 pattern, rompe en 15+
export default function Page({ params }: { params: { slug: string } }) {
  const cookieStore = cookies(); // SIN await — error en Next.js 15+
  const slug = params.slug; // SIN await — warning en Next.js 15+
}
```

---

## Fetch en RSC

```typescript
// ✅ CORRECTO: async/await directo en RSC
async function ServiceList() {
  const services = await fetchServices(); // Sin useEffect, sin useState

  return <ul>{services.map(s => <li key={s.id}>{s.name}</li>)}</ul>;
}

// ❌ INCORRECTO: useEffect en RSC (no funciona)
function ServiceList() {
  const [services, setServices] = useState([]);
  useEffect(() => { fetchServices().then(setServices); }, []); // Client anti-pattern
}
```

---

## React 19 — APIs Modernas

### useActionState (reemplaza useFormState)

```typescript
'use client';
import { useActionState } from 'react';

type FormState = { success: boolean; error?: string };

function BookingForm() {
  const [state, submitAction, isPending] = useActionState<FormState, FormData>(
    async (prevState, formData) => {
      const result = await createBookingAction(formData);
      return result;
    },
    { success: false }
  );

  return (
    <form action={submitAction}>
      <input name="date" type="date" />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Enviando...' : 'Reservar'}
      </button>
      {state.error && <p role="alert">{state.error}</p>}
    </form>
  );
}
```

### useFormStatus

```typescript
'use client';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Procesando...' : 'Confirmar'}
    </button>
  );
}

// Debe estar DENTRO del <form>, no fuera
function BookingForm() {
  return (
    <form action={submitAction}>
      <SubmitButton /> {/* ✅ Accede al form context */}
    </form>
  );
}
```

---

## Server Actions

```typescript
// lib/actions/bookings.ts
"use server"; // Marca el archivo completo como Server Actions

import { revalidatePath } from "next/cache";

export async function createBookingAction(formData: FormData): Promise<ActionResult<Booking>> {
  const correlationId = crypto.randomUUID();

  try {
    const validated = bookingSchema.safeParse(Object.fromEntries(formData));

    if (!validated.success) {
      return {
        success: false,
        error: "Datos inválidos",
        validationErrors: validated.error.flatten().fieldErrors,
      };
    }

    // TODO: DB integration when backend is ready
    revalidatePath("/agenda");

    return { success: true, data: validated.data };
  } catch {
    return { success: false, error: "Error inesperado" };
  }
}
```

---

## Streaming con Suspense

```tsx
// app/calculator/page.tsx
import { Suspense } from "react";

export default async function CalculatorPage() {
  return (
    <main>
      <CalculatorForm /> {/* RSC, sin datos async */}
      <Suspense fallback={<ServiceListSkeleton />}>
        <ServiceCatalog /> {/* RSC, datos async → streamed */}
      </Suspense>
    </main>
  );
}
```

---

## Gestión de Estado (State Management)

> **Regla estricta:** En App Router, usar estado global del cliente (Zustand, Redux, Contextos gigantes) suele ser un **anti-patrón extremo**. La mayoría del estado debe vivir en dos lugares únicos:

1. **Estado del Servidor (Server State):** La caché de fetch de React o Server Actions.
2. **Estado de la URL (URL State / Search Params):** Para filtros, modales abiertos, tabs o paginación.

```typescript
// ✅ CORRECTO: Usar Search Params
import { useQueryState } from 'nuqs';

export function TabSelector() {
  const [tab, setTab] = useQueryState('tab', { defaultValue: 'services' });
  return <button onClick={() => setTab('addons')}>Ver Addons</button>;
}

// ❌ INCORRECTO: Zustand store solo para guardar el tab activo
import { create } from 'zustand';
const useTabStore = create((set) => ({ tab: 'services', setTab: (t) => set({ tab: t }) }));
```

**Excepción real:** Solo instalar un estado global (Client-side) para UI de flujo complejo que NO debe refrescarse al recargar. En ese caso, usar **Zustand**, nunca Redux.

---

## 5. 'use client' — Frontera Correcta

```tsx
// ✅ CORRECTO: boundary mínima
// page.tsx — RSC
async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getService(slug);

  return (
    <div>
      <ServiceHeader service={service} />          {/* RSC */}
      <ServiceBookingButton serviceId={service.id} /> {/* 'use client' — solo este */}
    </div>
  );
}

// ServiceBookingButton.tsx
'use client'; // Solo el botón de interacción necesita client

function ServiceBookingButton({ serviceId }: { serviceId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return <button onClick={() => setIsOpen(true)}>Reservar</button>;
}

// ❌ INCORRECTO: 'use client' en página completa por un botón
'use client'; // Mata todo el beneficio de RSC para esta ruta
async function ServicePage() { ... }
```

---

## Compound Components Pattern

Evitar props booleanas proliferantes. Usar composición:

```tsx
// ❌ INCORRECTO: Boolean prop hell
<Card hasHeader hasFooter hasBorder isCollapsible isLoading />

// ✅ CORRECTO: Compound components
<Card>
  <Card.Header>Título</Card.Header>
  <Card.Body>Contenido</Card.Body>
  <Card.Footer>Acciones</Card.Footer>
</Card>
```

## Children over Render Props

```tsx
// ❌ INCORRECTO: Render prop innecesario
<Modal renderContent={() => <Form />} />

// ✅ CORRECTO: Children
<Modal>
  <Form />
</Modal>
```

## Server Parallel Fetching

```tsx
// ✅ CORRECTO: Parallel fetching
async function DashboardPage() {
  const [services, bookings, clients] = await Promise.all([
    getServices(),
    getBookings(),
    getClients(),
  ]);
  // ...
}
```

---

## NO Hacer

- ❌ `'use client'` en archivos `page.tsx` (casi nunca es correcto)
- ❌ `'use client'` en `layout.tsx` salvo casos extremos (context providers)
- ❌ `cookies()` / `headers()` sin `await` en Next.js 15+
- ❌ `params.slug` sin `await params` en Next.js 15+
- ❌ `useFormState` de `react-dom` (deprecado) → usar `useActionState` de `react`
- ❌ fetch en `useEffect` cuando puede ser RSC con async/await

---

## Checklist RSC Pre-Commit

- [ ] `'use client'` solo donde hay interactividad real
- [ ] `params` y `searchParams` awaited
- [ ] `cookies()` y `headers()` awaited
- [ ] Server Actions en archivos con `'use server'`
- [ ] Suspense boundaries en rutas con datos async
- [ ] `useActionState` en lugar de `useFormState`
- [ ] `useFormStatus` dentro del `<form>`, no fuera

---

## Referencias

- [Next.js App Router](https://nextjs.org/docs/app)
- [React 19 Blog](https://react.dev/blog/2024/12/05/react-19)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

---

## Reglas Relacionadas

Al crear/modificar componentes React, estas reglas son MANDATORIAS:

- **Rule 02**: Design System - Estética y paleta
- **Rule 09**: No AI Traces - Sin comentarios, sin style={}
- **Rule 10**: Accessibility - ARIA labels, keyboard navigation
- **Rule 14**: Performance - memo(), lazy loading
- **Rule 17**: Code Quality - ESLint rules
- **Rule 19**: UI Resilience - Error boundaries, loading states
