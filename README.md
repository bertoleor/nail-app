# NailApp

Mockup de app para manicuristas argentinas: **calculadora de precios** y **agenda de turnos** (vista admin + cliente). Sin backend real — datos mock preparados para futura integración con Supabase.

## Stack

Next 16 · React 19 · Tailwind 4 · zustand · react-hook-form + zod 4 · framer-motion · date-fns

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run test:unit  # vitest
npm run test:e2e   # playwright
```

Env: copiar `.env.example` a `.env.local` (vars Supabase a futuro, hoy vacías).

## Estructura

- `src/app/(admin)` —Bookings, turnos, clientas, servicios, calculadora.
- `src/app/(client)` — agenda, calculadora, reservar.
- `src/lib/domain` — lógica booking/pricing · `src/stores` — zustand · `src/lib/mock` — datos mock.
- `docs/PROJECT.md` — diseño (sistema glass, paleta, BackgroundMesh) · `docs/plans/deuda-tecnica-plan.md` — plan de deuda técnica.

## Estado

Fase 1 cerrada (2026-09-16): build + typecheck + 208 tests unitarios verdes, Fase 2 en curso (due 2026-09-26). Deuda técnica priorizada en `docs/plans/deuda-tecnica-plan.md`. Documentación canónica en `docs/` (producto: `docs/PRODUCTO.md`, índice: `docs/README.md`).
