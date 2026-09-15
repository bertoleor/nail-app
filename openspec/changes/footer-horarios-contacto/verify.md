# Verify: footer-horarios-contacto

Fecha: 2026-09-15 · Modo: Strict TDD · Alcance: `formatSchedule` es-AR + CTA WhatsApp.

## Spec compliance

| Req   | Escenario                                | Evidencia                       | Estado |
| ----- | ---------------------------------------- | ------------------------------- | ------ |
| REQ-1 | label exacto "Lun a Sáb · 9 a 19 h"      | harness `label exacto es-AR` ok | PASS   |
| REQ-2 | env set → `wa.me/<numero-env>`           | harness `env set` ok            | PASS   |
| REQ-2 | env unset → fallback `5491112345678`     | harness `env unset` ok          | PASS   |
| REQ-2 | env vacío → fallback (nunca `""`)        | harness `env vacio` ok          | PASS   |
| REQ-2 | mensaje se anexa encodado                | harness `mensaje` ok            | PASS   |
| REQ-3 | typecheck 0 errores                      | `npm run typecheck` exit 0      | PASS   |
| REQ-3 | solo agrega archivos, no toca existentes | `git status` post-commit        | PASS   |

Nota: `data-testid="footer-contact"` y `aria-label` son del componente
visual futuro que consuma este helper; el contrato de datos queda cubierto.

## Evidencia de ejecución real

| Comando                                                    | Resultado                                                             |
| ---------------------------------------------------------- | --------------------------------------------------------------------- |
| `npm run typecheck` (RED, sin `src/lib/contact/`)          | exit 2 · `TS2307: Cannot find module '@/lib/contact/format-schedule'` |
| `npm run typecheck` (GREEN, con implementación)            | exit 0 · 0 errores                                                    |
| harness node (tsc-transpile del fuente real, 5 aserciones) | exit 0 · `5 passed, 0 failed`                                         |
| `npx eslint src/lib/contact/format-schedule.ts`            | exit 0 · 0 errores (test ignorado por config del repo)                |
| `npx prettier --check` (mis 6 archivos)                    | exit 0 tras `--write`                                                 |

## Bloqueo pre-existente (no causado por este cambio)

`vitest run` no puede iniciar workers en este entorno
(`Timeout waiting for worker to respond`, pools `forks` y `threads`);
falla igual con tests pre-existentes
(`__tests__/lib/domain/pricing/calculator.test.ts`, sin cambios).
Suite completa queda UNVERIFIED hasta correr en CI o entorno sano;
el gate local se cierra con typecheck + harness + lint.

## Veredicto

PASS con nota: 5/5 casos verdes sobre el código real; vitest pendiente
de entorno.
