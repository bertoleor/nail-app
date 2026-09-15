# Spec: nail-legal-build-gate

## Requirements

### REQ-1 — Auditoría legal sin datos inventados

Los docs `docs/TERMS-OF-SERVICE.md` (100 líneas) y `docs/PRIVACY-POLICY.md`
(107 líneas) deben auditarse cláusula por cláusula.

- Escenario 1: cada `[POR COMPLETAR]` queda listado como bloqueante con
  dueño = titular, sin rellenar con ficticios.
- Escenario 2: cada hallazgo cita texto exacto, severidad
  (🔴/🟡/🟢), ley aplicable (24.240 / 25.326 / GDPR nota) y redline concreto.
- Escenario 3: el output cierra con next steps ejecutables + checklist de
  revisión por abogado.

### REQ-2 — Re-gate mecánico de build

- Escenario 1: `npm run typecheck` → 0 errores.
- Escenario 2: `npm run test:unit` (`vitest run`) → N/N pass, N registrado.
- Escenario 3: `next build` → OK + rutas estáticas contadas.
- Escenario 4: si algún escenario falla, el fallo se reporta con salida
  exacta; fix solo vía TDD y tarjeta propia, nunca directo en este cambio.

### REQ-3 — Trazabilidad kanban + Linear

- Escenario 1: tarjeta `t_99bc0d82` actualizada con Estado/Evidencia/Gate/
  Linear (formato kanban-cards).
- Escenario 2: issue Linear espejo comentado con salidas verificables
  (exit codes, conteos), sin mover estados que no correspondan.
- Escenario 3: commit + push con mensaje commitlint; nada borrado.
