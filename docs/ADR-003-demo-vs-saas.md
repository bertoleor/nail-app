# ADR-003 — Modelo de entrega: demo vs SaaS (PENDIENTE de decisión)

- Estado: propuesto / **PENDIENTE** (2026-09-15, UNVERIFIED) — necesita decisión humana.
- Dueño de la decisión: **Product Manager senior + Backend Developer senior** (vencimiento: 2026-10-03).
- Contexto: NailApp es un mockup de alta fidelidad para demo/venta, sin backend real (`docs/ADR-001-mockup-sin-backend.md`). Todo el valor hoy es el cierre por WhatsApp. No hay auth, persistencia ni multi-tenant.
- Decisión en juego: **¿sigue como demo/venta o se convierte en producto SaaS con backend real?**
  - **Opción A (demo)** — mantener mockup sin backend; menor costo, evoluciona por venta directa. Compatible con estado legal/licencia actual (sin datos reales de clientas hasta backend + legales completos).
  - **Opción B (SaaS)** — backend real + auth + persistencia + multi-tenant por manicurista + testing. Requiere nuevo plan de producto, build gate legal (ver `openspec/changes/nail-legal-build-gate/`) y rehecho de arquitectura (hoy `src/app/actions/` es placeholder vacío).
- Recomendación de trabajo previo: no bloquear el desarrollo demo por esta decisión; despejarla antes de 2026-10-03 para no heredar deuda si se elige SaaS.
- Gate: decisión sí/no firmada por el/los dueño(s); si es sí, nuevo plan con backend.
- Sin decisión, el gap sigue señalado en `plan-accion-2026-09-12.md` (Fase 3) y este ADR queda PENDIENTE.