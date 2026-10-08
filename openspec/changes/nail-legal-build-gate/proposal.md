# Proposal: NAIL-APP legal + build gate (turno noche)

## Intent

Certificar lo certificable sin datos del titular: (a) auditoría legal de
`docs/TERMS-OF-SERVICE.md` y `docs/PRIVACY-POLICY.md` — ambos con marcadores
`[POR COMPLETAR]` que bloquean deploy público con datos reales; (b) re-gate de
build (tsc + vitest + next build) porque el baseline verde es del 2026-09-12 y
Fase 1 tocó disco después.

## Scope

### In Scope

- Revisión legal (tablas severidad + redlines) de ToS y Privacy, Ley 25.326 /
  Ley 24.240, sin inventar datos del titular.
- Re-correr `typecheck` + `test:unit` + `next build`, registrar evidencia.
- Actualizar tarjeta kanban `t_99bc0d82` e issue Linear espejo con evidencia.

### Out of Scope

- Completar `[POR COMPLETAR]` con datos ficticios (requiere input titular).
- Tocar código productivo o reglas eslint (decisión humana pendiente).
- Fase 2 (visual/docs, blocked) y Fase 3 (decisión demo-vs-SaaS).

## Capabilities

### New Capabilities

- None (auditoría + verificación, sin comportamiento nuevo).

### Modified Capabilities

- None.

## Approach

1. Legal-reviewer sobre ambos docs → hallazgos con severidad y redlines.
2. Gate mecánico: `npm run typecheck`, `npm run test:unit`, `npx next build`.
3. Si gate verde → evidencia en kanban + Linear; si rojo → TDD rojo-primero
   solo para regresiones de Fase 1, resto se reporta sin tocar.

## Affected Areas

| Area                                      | Impact    | Description                                                       |
| ----------------------------------------- | --------- | ----------------------------------------------------------------- |
| `docs/TERMS-OF-SERVICE.md`                | Modified? | Solo si hay redlines aplicables sin datos titular; si no, intacto |
| `docs/PRIVACY-POLICY.md`                  | Modified? | Idem                                                              |
| `openspec/changes/nail-legal-build-gate/` | New       | Artefactos SDD del cambio                                         |

## Risks

| Risk                                       | Likelihood | Mitigation                                  |
| ------------------------------------------ | ---------- | ------------------------------------------- |
| Inventar datos titular para "cerrar" legal | Low        | Prohibido explícito; placeholders quedan    |
| Build rojo por deriva post-Fase-1          | Med        | Reportar, fix solo con TDD + tarjeta propia |

## Rollback Plan

Sin cambios productivos previstos; revertir con `git checkout` cualquier
edición doc si el humano la rechaza.

## Dependencies

- Runners locales (npm, next). Sin red, sin Supabase, sin datos titular.

## Success Criteria

- [ ] Hallazgos legales tabulados con severidad y redlines concretos.
- [ ] `tsc` + `vitest` + `next build` con salidas registradas.
- [ ] Kanban `t_99bc0d82` + Linear espejo actualizados con evidencia.
