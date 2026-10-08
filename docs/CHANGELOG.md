# Changelog — NailApp

> Parte de: [[README]] · Relacionados: [[PROJECT]]

Formato: Keep a Changelog. Todo UNVERIFIED hasta baseline verde.

## [Unreleased]

### Añadido

- `docs/plans/deuda-tecnica-plan.md`: primer plan de deuda técnica global (técnico + no-técnico).
- `docs/ADR-001-mockup-sin-backend.md`, `docs/ADR-002-es-ar-only.md`.
- README reescrito (era template de create-next-app).

### Pendiente (ver plan de deuda técnica)

- Baseline verde: `tsc --noEmit`, `eslint`, `vitest run`, `playwright test`.
- Commitear WIP (51 archivos).
- Validación Zod de env, infra i18n o decisión documentada, ROADMAP, legales.

## [0.1.0] — 2026-04-07

- Setup inicial: Next 16 + React 19 + Tailwind 4 + shadcn-like ui + zustand + RHF + zod 4.
- Features mockup: calculadora de precios, agenda de turnos (admin + cliente).
- Sistema glass + BackgroundMesh canvas + Geist/Playfair.
- Tests unitarios (vitest) + e2e (playwright) + husky/commitlint.
