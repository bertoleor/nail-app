# NAIL-APP — Plan de acción 2026-09-12 (UNVERIFIED)

> Parte de: [[README]] · Relacionados: [[PRD-nail-app-minimo]] · [[deuda-tecnica-plan]]

> Fuente: consolidado 2026-09-12 + `docs/reports/producto-marketing-estilo.md`. Mockup de alta fidelidad para demo/venta, sin backend. Nada aplicado sin OK.

## Fase 1 — Coherencia demo · due 2026-09-19 · dueño: Frontend Developer senior

- Unificar doble catálogo (`domain/pricing/constants.ts` vs `mock/data.ts`, precios inconsistentes) en una sola fuente.
- WhatsApp configurable (hoy hardcodeado `5491112345678`); eliminar o completar `/admin/bookings` (placeholder en 0 duplicado con `/admin/turnos`).
- **Gate:** demo sin valores contradictorios; número por env/config.

## Fase 2 — Sistema visual + docs · due 2026-09-26 · dueño: UI/UX senior + Tech Writer senior

- **Decisiones humanas:** regla glass vs shadcn (hoy conviven, doble botón); emojis en UI sí/no (convierte en WhatsApp pero choca con estética premium).
- Actualizar `PROJECT.md` y `AGENTS.md` desactualizados.
- **Gate:** regla visual firmada + docs al día + demo recorrible sin rupturas.

## Fase 3 — Camino a producción (solo si se decide venderlo como SaaS) · due 2026-10-03 · dueño: Product Manager senior + Backend Developer senior

- **Decisión humana — PENDIENTE:** ¿sigue demo o se convierte en producto con backend real? Si sí: auth, persistencia, multi-tenant por manicurista, testing. Registro: `docs/ADR-003-demo-vs-saas.md` (PENDIENTE, dueños PM senior + Backend senior, vencimiento 2026-10-03).
- **Gate:** decisión sí/no firmada; si es sí, nuevo plan con backend.
