> Parte de: [[README]] · Relacionados: [[PRODUCTO]] · [[ROADMAP]] · [[deuda-tecnica-plan]]

# PRD — NAIL-APP: mockup de app para manicuristas argentinas (calculadora de precios + agenda de turnos)

> **Búsqueda:** keywords: `prd, nail-app, manicuristas, calculadora de precios, agenda de turnos, whatsapp, mockup, adr-003` · clasificación: `producto/prd` · estado: draft · actualizado: 2026-10-18

> Proyecto: nail-app · Autor: 19-writer (Technical Writer, flota Hermes) · Fecha: 2026-10-18
> Estado: DRAFT
> Links: kanban `t_2ef6a7df` (rework P17-1; evidencia `E:/Hermes/docs/audits/2026-10-16-revision-p17-1-prds.md`) · `docs/ADR-001-mockup-sin-backend.md` · `docs/ADR-002-es-ar-only.md` · `docs/ADR-003-demo-vs-saas.md` · `docs/ROADMAP.md` · `docs/plans/deuda-tecnica-plan.md`

## 1. Problema

Las manicuristas argentinas que administran su negocio calculan precios de memoria o en un cuaderno y manejan los turnos por WhatsApp: presupuestos inconsistentes, turnos que se pisan, sin agenda central ni histórico. Sus clientas no tienen forma simple de ver precio y horario disponible antes de reservar — cada consulta es un ida y vuelta por chat.

## 2. Contexto

- NailApp existe hoy como **mockup de alta fidelidad sin backend, en etapa demo/venta** (ADR-001): datos mock en memoria (`src/lib/mock/` re-exporta el catálogo fuente única de `src/lib/domain/pricing/`), estado con Zustand, sin auth ni DB real.
- Dos roles con superficies separadas: **clienta** (reserva un turno y lo cierra por WhatsApp) y **manicurista** (admin: arma presupuestos, lleva la agenda, gestiona clientas y servicios). Tagline del home: "Sistema de gestión para manicuristas".
- **WhatsApp es el motor de conversión**: toda reserva y todo presupuesto terminan en un deep link `wa.me` con mensaje preformateado (servicio, addons, fecha, total); número configurable por `NEXT_PUBLIC_WHATSAPP_NUMBER`, validado con Zod (`src/lib/env.ts`).
- Baseline verde (2026-10-16, G0): `tsc --noEmit` 0 errores, `vitest run` 266/266, `next build` OK (11 rutas), e2e Playwright 20/20 en chromium; `pnpm audit` 0 vulns (ORN-199, 2026-09-27). Deuda abierta: `eslint src` ~105 err de estilo (`deuda-tecnica-plan.md` §V-1-ESLINT).
- **ADR-003 (demo vs SaaS) PENDIENTE** (dueños: PM senior + Backend senior, vencimiento 2026-10-03): es el gate de la Fase 2 del roadmap. Este PRD reemplaza el placeholder señalado por la auditoría P17-1 del 2026-10-16 (hallazgo F1).

## 3. Scope explícito

Lo que el producto ES hoy — mockup navegable, verificado contra `docs/FEATURES.md`:

- **Calculadora de precios**: servicio (Nuevo/Mantenimiento) + addons → precio y duración. Dos superficies: `/calculator` (pública, cálculo rápido) y `/admin/calculadora` (presupuesto con clienta, notas y envío: copiar / WhatsApp / guardar borrador).
- **Agenda de turnos**: lado clienta, wizard de 4 pasos en `/reservar` (datos → servicio/extras → fecha/horario → confirmación + WhatsApp); lado manicurista, `/admin/turnos` con grilla 09:00–18:30, bloqueos de horario (francos, feriados, cursos) y estados `pending/confirmed/completed/cancelled`.
- **Gestión admin**: dashboard con stats del día/semana (`/admin`), clientas (`/admin/clientas`), catálogo con precio y duración (`/admin/servicios`).
- **Cierre comercial por WhatsApp**: deep link `wa.me` preformateado al final de cada reserva y de cada presupuesto.
- **Idioma único**: español rioplatense con voseo, sin infra i18n (ADR-002 aceptado).

## 4. NO-scope

- Auth, persistencia, DB real y multi-tenant: no existen por diseño en la etapa demo (ADR-001).
- Backend Supabase: solo preparado (vars en `.env.example`, MCP configurado), sin implementar hasta que ADR-003 se decida por SaaS.
- Deploy público con datos reales: bloqueado hasta backend + legales completos (regla de deploy de `docs/PRODUCTO.md`).
- Pagos online, notificaciones automáticas, apps nativas y marketplace: fuera de las 3 fases del roadmap actual.
- Multi-idioma / framework i18n: rechazado (ADR-002); solo se reabre si ADR-003 = SaaS multi-país.

## 5. Restricciones

- **Fuente única de pricing**: `src/lib/domain/pricing/` es el catálogo canónico (`calculatePrice`, `calculateDuration`, `formatPrice` en pesos es-AR); no duplicar el catálogo en otra capa.
- **`src/app/actions/` se conserva vacío** como placeholder de rutas futuras — no borrar sin autorización (ADR-001).
- **Gate ADR-003**: la Fase 2 (backend real) no se abre sin decisión firmada; si la decisión es "demo", las Fases 2 y 3 se congelan y el roadmap se reescribe en torno a la venta directa del mockup.
- **Legales incompletos**: términos y privacidad v1.0 en borrador con marcadores `[POR COMPLETAR]` (falta razón social, CUIT, domicilio y email del titular); licencia MIT ya decidida (`docs/LICENSE-DECISION.md`).
- **Copies centralizados sin i18n**: strings es-AR hardcodeados; los compartidos entre superficies viven en `src/lib/content/` (deuda 21-content resuelta).

## 6. Criterios de éxito medibles

Fase 1 (demo/venta) — verificables, de `docs/ROADMAP.md`:

- [ ] `pnpm typecheck` → 0 errores.
- [ ] `pnpm test:unit` → 266/266 (count vigente al 2026-10-18).
- [ ] `pnpm test:e2e` → 20/20 specs en chromium.
- [ ] Recorrido de demo completo sin 404 ni valores contradictorios: home → wizard de reserva → WhatsApp; admin → calculadora de presupuesto → WhatsApp.
- [ ] ADR-003 decidido y firmado (gate de fase).
- [ ] `pnpm audit` → 0 vulnerabilidades (sostener el estado de ORN-199).

## 7. Fases SDD sugeridas

Las fases del producto las define `docs/ROADMAP.md` (sin fechas inventadas: se avanza por criterios de salida). Cada feature dentro de una fase entra por SDD (explore → spec → design → tasks → apply → verify), con ADR-003 como gate humano:

1. **Fase 1 — Demo/venta (HOY)**: sostener el mockup navegable y el cierre por WhatsApp. Pendientes de higiene: auditoría a11y WCAG 2.2 AA en agenda y calculadora (15-a11y) y completar `eslint` (~105 err de estilo, no bloquea la demo).
2. **Fase 2 — Backend real (GATEADO por ADR-003 = SaaS)**: Supabase con RLS por manicurista (multi-tenant), migración de `src/lib/mock/data.ts` a DB real, auth de clientas y manicuristas, suite de integración punta a punta y legales sin `[POR COMPLETAR]`.
3. **Fase 3 — Deploy público con datos reales**: hosting/CI + dominio propio + monitoreo básico; solo con Fase 2 completa y legales aprobados.

## 8. Presupuesto líneas/tokens

- Líneas nuevas: N/A — PRD documental, no compromete código; cada cambio derivado define presupuesto propio (heurística de flota: ~400 líneas por PR).
- Archivos tocados: N/A — idem.
- Tokens aprox: N/A.
