# Baseline — nail-app

> Foto medible del proyecto contra la cual se dice "mejoró/empeoró".
> Contrato: FASES-CONTRATOS §8. Se actualiza al cierre de F2, F3 y cada slice.

| Métrica                    | Valor                                                                                                       | Cómo se mide                                         | Fecha      |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ---------- |
| Build (`next build`)       | PASS, 11 rutas                                                                                              | `pnpm build` local                                   | 2026-09-28 |
| Typecheck (`tsc --noEmit`) | PASS, 0 err                                                                                                 | local 2026-10-08 (`e2e/a11y-axe.spec.ts` WIP aparte) | 2026-10-08 |
| Tests unit (vitest run)    | 132 passed / 136**                                                                                          | local 2026-10-08, forks pool (ver nota)              | 2026-10-08 |
| E2E Playwright (chromium)  | 20/20 PASS                                                                                                  | local 2026-09-28 (`nail-e2e-final2-0928.log`)        | 2026-09-28 |
| gitleaks full-history      | 0 leaks (33 commits)                                                                                        | `gate-sec-nail-app-2026-09-28.log`                   | 2026-09-28 |
| trivy fs HIGH,CRITICAL     | pnpm-lock.yaml = 0; package-lock.json stale ignorado (`.trivyignore`, pendiente purge de historial owner)   | `gate-sec-nail-app-2026-09-28.log`                   | 2026-10-08 |
| Lint (eslint full repo)    | 195 err / 168 warn — estilo, V-1-ESLINT abierta; en CI pasa a job **advisory** no bloqueante mientras dure  | `pnpm lint`                                          | 2026-10-08 |
| Formato (prettier)         | drift en ~173 archivos pre-existing; NO bloqueante (ticket aparte)                                          | `pnpm format:check`                                  | 2026-10-09 |
| Cobertura                  | no medida aún (runner sin threshold)                                                                        | `pnpm test:coverage`                                 | —          |
| Deuda aceptada             | P2/P3 con dueño: t_22e0db87 (a11y), t_dcfbac6e (worktree huérfano), t_4002533c (receipt rastro), V-1-ESLINT | board kanban                                         | 2026-10-08 |
| Commit                     | `4cbc73f` (HEAD al cierre F2.ci-verde)                                                                      | `git log -1`                                         | 2026-10-08 |

**Nota vitest (2026-10-08):** el pool `forks` en el host saturado tira timeouts de
worker en algunos archivos UI (`badge/skeleton/input.test.tsx`), no son fallos de
tests. Los 4 tests reales en ROJO de esa corrida eran WIP no terminado del run
caído 00:30 (NAIL-L1 conflict midnight-crossing + NAIL-H3 reservar-page),
preservado en stash `NAIL-L1+NAIL-H3 ROJO` + `.wip-1008/`.

## Delta vs baseline anterior

Primera versión del baseline (no hay anterior). Creación = salida F2 §8.
