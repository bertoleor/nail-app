# ADR-002 — Español rioplatense como único idioma
> Parte de: [[README]] · Relacionados: [[ADR-001-mockup-sin-backend]] · [[ADR-003-demo-vs-saas]]

- Estado: **aceptado** (2026-09-27, resuelto por task `t_1dd00b74`)
- Contexto: toda la UI está en español hardcodeado; no existe infra i18n (`src/i18n`, `locales/`).
- Decisión: **Opción A — es-AR único idioma**. NailApp es un mockup/demo funcional para un público rioplatense; no hay requerimiento de multi-idioma ni plan de internacionalización (ver ADR-003 demo-vs-saas).
- Consecuencias:
  - Los strings permanecen hardcodeados en español rioplatense — no se instala `cuihua-i18n-helper` ni infra i18n.
  - Centralización de copies duplicados (21-content) se aborda como deuda independiente, sin framework i18n.
  - Si el producto migra a SaaS multi-país (ADR-003), este ADR se revisa y se reabre como deuda P1.
- I-1 en `docs/plans/deuda-tecnica-plan.md` queda **resuelto**.
