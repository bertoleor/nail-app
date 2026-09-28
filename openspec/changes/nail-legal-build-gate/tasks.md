# Tasks: nail-legal-build-gate

- [x] T1 proposal + spec + tasks (este cambio) — ANTES de tocar código.
- [x] T2 Auditoría legal ToS + Privacy (tablas, redlines, bloqueantes titular). → `docs/reports/legal-audit-2026-09-28.md` (23 secciones auditadas, 11 bloques `[POR COMPLETAR]` inventariados con dueño=titular, redlines A-10 fuero y B-6 retención).
- [x] T3 Gate mecánico: typecheck + vitest run + next build (corre en bg).
  - tsc --noEmit exit 0 · vitest 239/239 (156 forks + 83 threads retry) · next build exit 0 (11 rutas) · e2e Playwright 20/20 chromium (browsers instalados esta corrida; specs realineados a la UI actual).
- [x] T4 TDD solo si hay regresión atribuible a Fase 1 (rojo-primero, si no N/A).
  - Hallazgo: suite e2e estaba stale (15/20 rojos contra UI real). ROJO capturado con corrida completa (log nail-e2e-0928.log), luego fixes: rutas admin 404 → git mv `(admin)`→`admin` (RED e2e → GREEN), dead-code + crash de lint full-repo (vitest.config.mts en ignores).
- [x] T5 Mover/actualizar tarjeta kanban `t_99bc0d82` + comentar Linear espejo.
- [x] T6 Commit + push (commitlint), reporte envelope.
