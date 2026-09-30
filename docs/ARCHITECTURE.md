# NailApp — Cómo se arma (Arquitectura)
> Parte de: [[README]] · Relacionados: [[STACK]] · [[ADR-001-mockup-sin-backend]]

## Modelo

Mockup sin backend (ver `docs/ADR-001-mockup-sin-backend.md`): UI Next.js App Router + lógica de dominio pura + stores Zustand en memoria. Preparado para Supabase (vars en `.env.example`, MCP configurado) sin implementarlo. `src/app/actions/` es placeholder vacío — no borrar sin autorización.

## Capas

| Capa | Ubicación | Contenido |
|------|-----------|-----------|
| Rutas | `src/app/` | `(client)`: `reservar/`, `calculator/` · `(admin)`: `page` (dashboard), `turnos/`, `calculadora/`, `clientas/`, `services/` · raíz: `page` (home), `layout`, `globals.css`, `error`/`global-error` |
| Componentes | `src/components/` | `ui/` (shadcn+CVA: button, card, badge, select, dialog, input, skeleton) · `pricing/` (calculator-form, service-select, addon-list, price-summary) · `booking/` (booking-card, booking-form, booking-list, calendar) · `client/BackgroundMesh.tsx` (canvas partículas) · `providers.tsx`, `error-boundary.tsx` |
| Dominio | `src/lib/domain/` | `pricing/` (SERVICES, ADDONS, `calculatePrice`/`calculateDuration`/`formatPrice`/`formatDuration`, fuente única del catálogo) · `booking/` (`types`, `conflict`, `time-utils`) |
| Mock | `src/lib/mock/data.ts` | Re-exporta catálogo de `domain/pricing` + 6 clientas, ~10 turnos (`confirmed`/`pending`/`completed`/`cancelled`), bloqueos de horario, presupuestos |
| Estado | `src/stores/` | `app-store`, `booking-store`, `pricing-store` (Zustand) |
| Config | `src/lib/config/whatsapp.ts` | Número WhatsApp (`NEXT_PUBLIC_WHATSAPP_NUMBER`, fallback `5491112345678`) |
| Utilidades | `src/lib/` | `utils.ts` (`cn`), `types.ts` (`ActionResult`), `result.ts` (helpers), `browser/detect.ts` |
| Hooks | `src/hooks/` | `use-browser-optimization.ts` |

## Flujos

- **Reserva clienta** (`/reservar`, wizard 4 pasos: datos → servicio/extras → fecha/horario → confirmación) → resumen + deep link `wa.me` con mensaje preformateado.
- **Presupuesto admin** (`/admin/calculadora`: clienta + servicio + extras + notas) → copiar / WhatsApp / guardar borrador (`Quote`: `draft`/`saved`/`sent`).
- **Agenda admin** (`/admin/turnos`: grilla 09:00–18:30 por día, bloqueos, detalle con confirmar/completar/cancelar).

## Deudas conocidas

- ~~Link del sidebar apunta a `/admin/servicios` pero la ruta real es `/admin/services`~~ — RESUELTO (NAIL-H1, 2026-09-30): la ruta ahora es `/admin/servicios`, consistente con el nav.
- WhatsApp de reserva con fallback hardcodeado si falta la env var.
- Detalle de deuda técnica: `docs/plans/deuda-tecnica-plan.md`.
