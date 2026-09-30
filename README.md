> Parte de: [[INDICE-SISTEMA]] · Relacionados: [[INDICE-DOCS]], [[docs/README]]

# NAIL-APP — Mockup de app para manicuristas argentinas (calculadora de precios + agenda de turnos)

> Path: `E:/Hermes/projects/nail-app` · Stack: Next 16.3.6 · React 19.2.4 · Tailwind 4 · zustand · zod 4 · vitest + playwright · Estado: ACTIVO
> Registry: `E:/Hermes/docs/plans/project-map.md` (fila NAIL-APP) · Espejo Hermes: `E:/Hermes/docs/proyectos/nail-app.md`
> Última verificación: 2026-09-27 (F0 — ver `docs/F0-2026-09-27.md`)

## 1. Qué es
- **Problema:** las manicuristas argentinas calculan precios a mano y manejan turnos por WhatsApp/cuaderno.
- **Usuario:** manicurista que administra su negocio (vista admin) y sus clientas (vista cliente).
- **Propuesta:** calculadora de precios + agenda de turnos con contacto directo vía `wa.me`. **Mockup funcional SIN backend** — datos mock preparados para Supabase futuro (ADR-001). Español rioplatense único idioma (ADR-002).

## 2. Cómo correr
- Requisitos: Node ≥22 (`.nvmrc`), pnpm 10, Playwright browsers (solo para e2e).
- Comandos:
  - `pnpm install`
  - `pnpm dev` — desarrollo, http://localhost:3000
  - `pnpm typecheck` — `tsc --noEmit`
  - `pnpm test:unit` — vitest (239 tests reportados al 2026-09-27)
  - `pnpm test:e2e` — playwright
  - `pnpm build` — build de producción
- Env: copiar `.env.example` a `.env.local` y completar. Solo 2 vars se consumen hoy (`NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_SITE_URL`); el resto es para el backend futuro. Ver `src/lib/env.ts` (validación Zod).

## 3. Estructura de carpetas (solo primer nivel)
- `src/app/admin` — admin: turnos, clientas, servicios, calculadora.
- `src/app/(client)` — cliente: agenda, calculator, reservar.
- `src/lib/domain` — lógica booking/pricing pura · `src/lib/mock` — datos mock · `src/lib/env.ts` — env validado con Zod.
- `src/stores` — zustand (app, booking, pricing).
- `src/components/ui` — componentes base propios (button, card, dialog, select, etc.).
- `__tests__/` — unit tests (vitest, jsdom) · `e2e/` — specs playwright.
- `docs/` — única fuente de documentación del repo (ver `docs/README.md`).
- `odd/tasks/` — features ODD con evidencia.

## 4. Documentación canónica
- Producto (PRD): `docs/PRD-nail-app-minimo.md` (plans) + `docs/PRODUCTO.md`.
- Plan activo: `docs/plans/deuda-tecnica-plan.md`.
- ADRs: `docs/ADR-001-mockup-sin-backend.md` (mockup), `docs/ADR-002-es-ar-only.md` (idioma), `docs/ADR-003-demo-vs-saas.md`.
- Inventario F0: `docs/F0-2026-09-27.md`.
- Espejo en Hermes: `E:/Hermes/docs/proyectos/nail-app.md`.

## 5. Estado actual
- Rama: `master` · HEAD `86e3873` (2026-09-27, security upgrade ORN-199) · CI: definida completa, sin corrida fresca local en F0.
- Seguridad: **pnpm audit 0 vulns** (ORN-199 cerrado 2026-09-27 — next 16.3.6 + override deepmerge-ts).
- Próximo hito: F4 (auditoría); pendiente verificar lint (`eslint src/lib` dio 18 errors en corrida local del F0, contradice el exit 0 del upgrade — ver `docs/F0-2026-09-27.md` §3).
- Tickets abiertos: ORN-199 **Done** (Linear). Deuda interna en `docs/plans/deuda-tecnica-plan.md`.
