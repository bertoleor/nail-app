# NailApp — Roadmap (mockup → backend → deploy)

> Parte de: [[PRODUCTO]] · Relacionados: [[ADR-001-mockup-sin-backend]] · [[ADR-002-es-ar-only]] · [[ADR-003-demo-vs-saas]] · [[deuda-tecnica-plan]]
>
> **Búsqueda:** keywords: `roadmap, mvp, fases, demo, saas, backend, supabase, deploy, gate, adr-003` · clasificación: `producto/plan` · estado: draft · actualizado: 2026-10-02

> Roadmap mínimo. No es un plan de release con fechas: cada fase existe para responder una pregunta distinta del negocio. Hoy estamos en Fase 1.
> El paso de Fase 1 → Fase 2 está **gateado por ADR-003** (demo-vs-SaaS, PENDIENTE, venc. 2026-10-03): no se abre backend hasta esa decisión.

## Fase 1 — Demo/venta (HOY)

**Objetivo del negocio:** sostener la herramienta de demostración y venta. Todo el valor hoy está en el mockup navegable y el cierre por WhatsApp; la app es un vendedor silencioso.

**Estado:** en curso — baseline verde verificado 2026-09-28 (`tsc --noEmit` 0 errores, `vitest run` 239/239, `next build` OK 11 rutas, e2e Playwright 20/20; queda `eslint src` ~105 err como deuda de estilo, ver `deuda-tecnica-plan.md` §V-1-ESLINT).

**Entregables ya logrados:**
- App completa navegable: wizard de reserva, agenda admin, calculadora pública + presupuesto, clientas, catálogo (`docs/FEATURES.md`).
- Catálogo y pricing en fuente única de dominio (`src/lib/domain/pricing/`).
- WhatsApp configurable por env con validación Zod (`src/lib/env.ts`).
- Docs de producto canónicas: `PRODUCTO.md`, `OVERVIEW.md`, `FEATURES.md`, ADR-001/002.
- Legales borrador (términos + privacidad) con marcadores `[POR COMPLETAR]` y licencia MIT decidida.

**Pendientes dentro de la fase (higiene, no features):**
- [ ] Auditoría a11y WCAG 2.2 AA en agenda y calculadora (deuda 15-a11y, en curso).
- [ ] Centralizar copies duplicados entre superficies (deuda 21-content, en curso).
- [ ] Completar `eslint` — no bloquea demo (§V-1-ESLINT).

**Criterios de salida (verificables):**
- [ ] `npm run typecheck` → 0 errores.
- [ ] `npm run test:unit` → 239/239 (o el count vigente del repo).
- [ ] `npm run test:e2e` → 20/20 specs en chromium.
- [ ] Recorrido de demo completo sin 404 ni valores contradictorios: home → wizard reserva → WhatsApp; admin → calculadora presupuesto → WhatsApp.
- [ ] ADR-003 decidido y firmado (gate de fase; dueños PM senior + Backend senior).

**Qué NO entra en Fase 1:** auth, persistencia, DB, multi-tenant, pagos, notificaciones automáticas, deploy con datos reales.

## Fase 2 — Backend real (GATEADO: requiere ADR-003 = SaaS)

**Gate de entrada:** ADR-003 decidido **SaaS** por dueños. Sin esa decisión firmada, esta fase no se abre (podría también resolverse "demo" y esta fase no existir nunca). Pendiente desde 2026-09-15, vencimiento 2026-10-03.

**Objetivo del negocio:** convertir la demo validada en producto con datos reales — persistencia y auth — sin perder lo que ya convirtió en ventas.

**Entregables:**
- Supabase: proyecto + schemas + RLS por manicurista (multi-tenant) + migración de `src/lib/mock/data.ts` a DB real.
- Auth (clientas y manicuristas, con decisiones UX a definir en su momento).
- Legales completos y aprobados: términos + privacidad sin `[POR COMPLETAR]`, datos del titular (razón social, CUIT, domicilio, email) — bloqueante para cualquier dato real de clientas (ver `deuda-tecnica-plan.md` §5 legal).
- Vars `SUPABASE_*` en `src/lib/env.ts` (hoy fuera de scope por diseño).
- Testing de integración: turnos y presupuestos persistidos de punta a punta.

**Criterios de salida (verificables):**
- [ ] `npm run test:unit` verde + suite de integración nueva en verde.
- [ ] Reserva creada en la app persiste tras recargar (e2e con DB real).
- [ ] RLS verificado: la manicurista A no ve datos de la B (test automatizado).
- [ ] Legales sin `[POR COMPLETAR]` y aprobados por el titular.

**Qué NO entra en Fase 2:** pagos online, deploy público, marketing/landing, cambio de idioma (ADR-002 sigue vigente: es-AR only).

## Fase 3 — Deploy público con datos reales

**Gate de entrada:** Fase 2 completa con criterios de salida en verde. Regla de deploy de `PRODUCTO.md`: no hay deploy público con datos reales hasta backend + legales completos (ADR-001 + ADR-003).

**Objetivo del negocio:** una manicurista real puede usar la app con sus clientas reales, de punta a punta.

**Entregables:**
- Hosting/CI (Next.js standalone o equivalente) + dominio propio.
- Datos de producción y backups.
- Protección legal activada: privacidad registrada, términos vigentes, `PRIVACY-POLICY.md` sin placeholders.
- Monitoreo básico de errores + uptime.

**Criterios de salida (verificables):**
- [ ] URL pública accesible con el wizard completo → reserva persistida → confirmación por WhatsApp con el número real de la manicurista.
- [ ] `npm run build` verde en CI antes de cada deploy.
- [ ] Legales vivos en la URL pública y aprobados.
- [ ] Filtro de errores en verde durante el primer ciclo de uso real.

**Qué NO entra en Fase 3:** pagos online (fuera de alcance por ahora), marketplace/multi-idioma, apps nativas.

## Reglas transversales

- **Sin fechas inventadas:** los avances se miden por criterios de salida, no por calendario. Donde una decisión tiene dueño y vencimiento (ADR-003: 2026-10-03), se anota explícitamente.
- **MVP vs futuro:** lo que NO entra en cada fase es tan parte del roadmap como lo que entra. Se agrega una fase nueva si (y solo si) el negocio lo pide tras ADR-003.
- **Retiro de deuda:** cada ítem retirado se marca `[x]` en `deuda-tecnica-plan.md` solo con commit + gate pasado (§9 de ese plan).
- **ADR-003 como bisagra:** si la decisión es "demo", Fases 2 y 3 se congelan y el roadmap se reescribe en torno a la venta directa del mockup.
