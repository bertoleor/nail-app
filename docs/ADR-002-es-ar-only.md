# ADR-002 — Español rioplatense como único idioma (pendiente de decisión)
> Parte de: [[README]] · Relacionados: [[ADR-001-mockup-sin-backend]] · [[ADR-003-demo-vs-saas]]

- Estado: propuesto (2026-09-12, UNVERIFIED)
- Contexto: toda la UI está en español hardcodeado; no existe infra i18n (`src/i18n`, `locales/`).
- Opción A (recomendada para mockup): declarar es-AR único idioma, documentarlo aquí y cerrar el gap.
- Opción B: instalar `cuihua-i18n-helper`, extraer claves `t('...')` y preparar multi-idioma.
- Decisión: **pendiente del usuario.** Sin decisión, el gap i18n sigue P1 en `docs/plans/deuda-tecnica-plan.md`.
