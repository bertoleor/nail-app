# Tasks: footer-horarios-contacto

## Review Workload Forecast

| Field                   | Value     |
| ----------------------- | --------- |
| Estimated changed lines | 60–120    |
| 400-line budget risk    | Low       |
| Chained PRs recommended | No        |
| Suggested split         | single PR |
| Delivery strategy       | single-pr |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal                                                   | Likely PR | Focused test command                                                 | Runtime harness                  | Rollback boundary                                         |
| ---- | ------------------------------------------------------ | --------- | -------------------------------------------------------------------- | -------------------------------- | --------------------------------------------------------- |
| 1    | formatSchedule es-AR + CTA WhatsApp con tests y verify | PR 1      | `npm run test:unit -- __tests__/lib/contact/format-schedule.test.ts` | tsc-emit + node assertions (5/5) | revertir commit; solo agrega `src/lib/contact/` + su test |

## Phase 1: RED — Tests First

- [x] 1.1 Crear `__tests__/lib/contact/format-schedule.test.ts`: label exacto es-AR + href `wa.me` con env-set / unset / vacío + mensaje encodado; corrida enfocada en RED (tsc TS2307, exit 2).

## Phase 2: GREEN — Implementación mínima

- [x] 2.1 Crear `src/lib/contact/format-schedule.ts` con `formatSchedule()` y `getScheduleWhatsAppUrl()`; reusa `getWhatsAppNumber()`; sin hardcodear número en el caller; `aria-label` es-AR queda para el componente footer futuro.

## Phase 3: Verify

- [x] 3.1 Archivo enfocado verde (harness node 5/5) + `npm run typecheck` exit 0 + vitest documentado como bloqueado por infra pre-existente.
- [x] 3.2 Commit commitlint con scope permitido + evidencias (exit codes, conteos) en `verify.md`.
