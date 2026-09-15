# Proposal: Footer horarios + contacto

## Intent

Micro-feature para validar la cadena SDD completa con implementación
real: helper `formatSchedule` con horarios de atención en es-AR y URL de
CTA a WhatsApp usando el número ya resuelto por `getWhatsAppNumber()`.

## Scope

### In Scope

- Contrato del bloque footer (horarios es-AR + CTA WhatsApp con fallback).
- Helper `src/lib/contact/format-schedule.ts` (`formatSchedule` + `getScheduleWhatsAppUrl`) con su test en `__tests__/lib/contact/`.
- Criterios de aceptación verificables sin backend.

### Out of Scope

- Componente visual footer (`data-testid="footer-contact"`, `aria-label`): queda para el slice UI que lo consuma.
- Zod env validation (T-2), cambio del número fallback (decisión negocio).
- Estilos visuales finales (Fase 2).

## Capabilities

### New Capabilities

- `footer-contact`: bloque footer con horarios + CTA WhatsApp.

### Modified Capabilities

- None.

## Approach

1. Fijar contrato en `spec.md` (GIVEN/WHEN/THEN, es-AR only).
2. Desglosar en `tasks.md` en unidades ≤ 400 líneas, TDD estricto.
3. Implementación futura: test primero en `__tests__/`, después componente.

## Affected Areas

| Area                                            | Impact | Description                                     |
| ----------------------------------------------- | ------ | ----------------------------------------------- |
| `openspec/changes/footer-horarios-contacto/`    | New    | Artefactos SDD + `verify.md` con evidencia real |
| `src/lib/contact/format-schedule.ts`            | New    | Helper es-AR + CTA WhatsApp                     |
| `__tests__/lib/contact/format-schedule.test.ts` | New    | 5 casos: label + env-set/unset/empty + mensaje  |

## Risks

| Risk                           | Likelihood | Mitigation                                 |
| ------------------------------ | ---------- | ------------------------------------------ |
| Número fallback desactualizado | Low        | Reusa `getWhatsAppNumber()`; no hardcodear |
| Texto fuera de tono es-AR      | Low        | Copy fijado en spec, revisión en tasks     |

## Rollback Plan

Revertir el commit del cambio; solo agrega `src/lib/contact/` + su test,
sin modificar archivos existentes.

## Success Criteria

- [x] Cadena SDD completa: proposal + spec + design + tasks + verify coherentes
- [x] `formatSchedule` retorna el label es-AR exacto fijado en spec (REQ-1)
- [x] CTA usa `getWhatsAppNumber()` con fallback `contact-config` (REQ-2)
- [x] `npm run typecheck` con 0 errores; suite y harness verdes (REQ-3, ver `verify.md`)
