# Plan de deuda técnica global — NailApp
> Parte de: [[README]] · Relacionados: [[PRD-nail-app-minimo]] · [[plan-accion-2026-09-12]]

> Estado: **BASELINE VERDE (2026-09-28, G0 noche)** — `tsc --noEmit` 0 errores, `vitest run` 239/239 (156 forks + 83 threads-retry), `next build` OK (11 rutas), e2e Playwright 20/20 chromium (browsers instalados + specs realineados a la UI). Queda `eslint src` (135→~105 err tras fixes mecánicos) como único gate rojo, ver §V-1-ESLINT.
> Alcance: técnico (código, config, stack, skills) + no-técnico (09-product, 10-uiux, 19-writer, 21-content, 18-i18n, 15-a11y, 23-legal).
> Regla: no se borra ningún archivo sin autorización — directorios vacíos y custom existente se conservan.
> Fecha: 2026-09-14 · Fuente: auditoría nocturna (baseline estático + auditor-general) + decisiones del task set legal/licencia/dirs.
> Decisiones incorporadas (2026-09-14): LICENSE = MIT (commit `5534e49`, ver `docs/LICENSE-DECISION.md`); dirs vacíos `actions/` + `agenda/` + `(client)/agenda/` = **KEEP** (ver `docs/reports/dead-dirs-report.md`); términos + privacidad redactados con placeholders (ver `docs/TERMS-OF-SERVICE.md` y `docs/PRIVACY-POLICY.md`).

## Priorización

| Prioridad | Criterio | Ítems |
|-----------|----------|-------|
| P0 | Riesgo de deploy o pérdida de trabajo | G-1 (51 archivos sin commitear), V-1 (baseline sin verde) |
| P1 | Deuda que crece con cada feature | I-1 (sin i18n), T-2 (env sin validar), D-1 (README template) |
| P2 | Higiene y completitud | Dead dirs, CHANGELOG/ADRs (creados en esta pasada), a11y labels, legal |

## 1. Errores de código (confirmados por scan estático, UNVERIFIED por compilador)

- **Ningún error chico confirmado para arreglar.** `any` = 0 hits, `as any` = 0, `console.log` = 0, `eslint-disable` = 0, `TODO` = 0 (solo palabras en español "todos"/"Administrá"), `dangerouslySetInnerHTML` = 0, `<img` crudo = 0, `setInterval` = 0, `process.env` en src = 0.
- **useEffect con cleanup OK:** `BackgroundMesh.tsx` (RAF + timeout + resize listener, todo con cleanup) y `use-browser-optimization.ts` (solo setState sincrónico, sin cleanup requerida). EX-UE PASS.
- **No se tocó código:** sin tsc/lint en verde, cualquier "fix" sería a ciegas. Ver V-1.

## 2. Configuraciones (P0/P1)

- [ ] **G-1 (P0): 51 archivos modificados sin commitear** (`git diff --stat`: 937+/903-). Riesgo de pérdida. Acción: commit por unidad de trabajo con commitlint (repo ya tiene husky + commitlint).
- [x] **V-1 (P0): baseline pesado RESUELTO (2026-09-12 G0).** `tsc --noEmit` = 0 errores, `vitest run` = 222/222, `next build` = OK (compila + 11 rutas estáticas). Desbloquea §3 (updates de stack) y §2 pending.
- [ ] **V-1-ESLINT (P0, actualizado 2026-09-28):** `npx eslint src` = 135 errores / 185 warnings. **Decisión tomada (fix mecánico, no refactor):** (1) crash de lint full-repo FIXEADO — `**/*.mts` agregado a ignores (vitest.config.mts explotaba las reglas typed sin project); CI `pnpm lint` ya no crashea. (2) Dead-code removido con evidencia: Dialog* + showPdfPreview/setShowPdfPreview + selectedClient en calculadora, CardHeader/CardTitle en clientas, isSameDay en turnos y calendar, Select* en reservar, imports duplicados mergeados en booking-card/mock-data/app-store. Quedan ~105 err = deuda de estilo distribuida (19 restrict-template-expressions, 9+9 nested-ternary, 6 pseudo-random, 5 sort-modules, 5 a11y labels, deprecation etc.) — NO bloquean build/deploy; el refactor profundo del componente calculadora (378 líneas, complexity 19) queda para F2 visual (blocked, decisión dueña). Próximo paso: `--fix` mecánico de los 21 fixables restantes + relajar `no-magic-numbers` (68 warn) en un cambio propio con ADR si la dueña aprueba.
- [x] **T-2 (P1): env sin validación Zod RESUELTO (2026-09-27, task `t_1dd00b74`).** `src/lib/env.ts` creado con schemas Zod 4 para `NEXT_PUBLIC_WHATSAPP_NUMBER` y `NEXT_PUBLIC_SITE_URL`. `getEnv()` sobrecargado: snapshot tipado + getter con fallback. `whatsapp.ts` usa validación centralizada. Tests: `__tests__/lib/config/env.test.ts` 8/8 verde. Supabase vars (`SUPABASE_*`) quedan fuera de scope — se agregan al integrar backend (ADR-003).
- [x] **Dead dirs (P2) RESUELTO (2026-09-14, task `t_1fa98962`; verificado 2026-09-30, NAIL-H2 `t_f4af1f5c`):** `src/app/actions/`, `src/app/agenda/`, `src/app/(client)/agenda/` son **placeholders de rutas futuras intencionales** (documentadas en AGENTS.md; el link `/agenda` del nav cliente — citado aquí y en dead-dirs-report.md como "activo 404" — fue removido en `6ed57d7` 2026-09-18: reemplazado por `/reservar`; nav actual = `/calculator` + `/reservar`, ambos con `page.tsx`), no restos legacy. Decisión: **KEEP** los tres con `.gitkeep`. Evidencia en `docs/reports/dead-dirs-report.md`.
  - **Nuevo hallazgo P2:** conflicto de ruta latente — `src/app/agenda/` y `src/app/(client)/agenda/` resolverían ambas la URL `/agenda` si ambas llevaran `page.tsx`. Resolver al implementar: conservar `(client)/agenda` (coherente con el nav, rol "Soy Clienta"). No bloquea nada hoy.
- [x] **i18n (P1):** strings en español hardcodeados, cero infra (`src/i18n`, `locales/` inexistentes). `date-fns` con `locale: es` correcto pero puntual. **RESUELTO (2026-09-27, task `t_1dd00b74`):** ADR-002 aceptado — es-AR-only, sin framework i18n. Centralización de copies duplicados queda como deuda 21-content independiente.

## 3. Actualización de stack (diferida, con motivo)

Stack actual: Next 16.2.2 · React 19.2.4 · zod 4.3.6 · Tailwind 4 · framer-motion 12 · RHF 7.72 · zustand 5 — moderno, sin upgrades mayores pendientes.
- **Diferido a propósito:** no se corrió `npm update` (ni siquiera minor) porque no había baseline en verde que atrape regresiones. **Desbloqueado 2026-09-12 (V-1 resuelto por G0).** Pendiente: correr `npm update` minor con `next build` + `vitest run` como red de seguridad.
- [ ] Chequear `lucide-react ^1.7.0` (versión inusual, verificar que exista en registry) cuando haya red/tiempo.

## 4. Skills faltantes (instalación SAFE pendiente de aprobación)

Detectados por auditor-general, no instalados (instalar cambia entorno global; se listan para instalar con intervención):

| Skill | Para qué falta |
|-------|----------------|
| `cuihua-i18n-helper` | Extracción de strings + traducción AI (I-1) |
| `oliver-accessibility` o `accessibility-audit` | Labels ARIA en interactivos, checklist WCAG (solo hay 2 `aria-hidden` decorativos) |
| `legal-reviewer` | Revisar términos/privacidad cuando se redacten (23-legal) |
| `snyk-fix` o `codeql` | SCA/SAST — nunca corridos en este repo |

## 5. Ciclo no-técnico (09/10/19/21/18/15/23)

- [x] **09-product — RESUELTO (2026-10-02, task `t_f437ee4f`):** `docs/ROADMAP.md` creado — 3 fases (F1 demo/mockup actual → F2 backend Supabase → F3 deploy público), cada una con objetivo, entregables, criterios de salida verificables (comandos/artefactos) y qué NO entra (MVP vs futuro). ADR-003 (demo-vs-SaaS) queda marcado como **gate abierto** de F2 (venc. 2026-10-03), no resuelto. Sin fechas inventadas.
- [x] **19-writer:** README era template de create-next-app → **reescrito en esta pasada**. CHANGELOG.md creado. ADR-001 (mockup sin backend) y ADR-002 (es-AR-only pendiente de decisión) creados.
- [x] **21-content — RESUELTO (2026-10-02, task `t_93fd0003`):** fuente única de copies compartidos creada en `src/lib/content/index.ts` (módulo TS tipado, const objects congelados, sin dependencias nuevas, según ADR-002 — NO se instala i18n). Scope: SOLO strings duplicados ENTRE superficies. Unificados: `BOOKING_STATUS_LABELS` (antes en admin/turnos + dashboard + clientas), `SERVICE_TYPE_LABELS` (antes "Nuevo"/"Mantenimiento" en 5 superficies: reservar, calculadora admin, turnos, servicios, calculator pública), `HOURS` (grilla 09:00–18:30 antes duplicada literal en admin/turnos y /reservar), `BOOKING_FIELD_LABELS` (labels del detalle de turno), `COMMON_ACTIONS` (Volver/Continuar/Cancelar/Enviar por WhatsApp). Excepciones documentadas: "Mant." (abreviado propio de la grilla de agenda, semántica de densidad distinta — separado como SERVICE_TYPE_LABELS_SHORT), "09:00" en availability.ts/mock (constantes de negocio, no copies), "Cliente" en dashboard (fallback de nombre, no label de campo). Tono intacto — solo se movieron copies, no se reescribió nada.
- [ ] **18-i18n:** ver I-1 arriba.
- [ ] **15-a11y:** canvas decorativo bien (`aria-hidden`, `tabIndex=-1`, respeta `prefers-reduced-motion` — bien). Gap: botones/controles de agenda y calculadora sin verificar labels/foco/teclado. Acción: auditoría a11y con skill (P2).
- [x] **23-legal — LICENSE RESUELTO (2026-09-14):** **MIT** (repo público, precedente KHAL; commit `5534e49`, `LICENSE` + `package.json` "MIT"). Justificación completa + repercusiones de negocio en `docs/LICENSE-DECISION.md`. Stack dependencias confirmado 100% compatible (todas MIT/Apache-2.0).
- [~] **23-legal — Términos + Privacidad BORRADOR (2026-09-14):** `docs/TERMS-OF-SERVICE.md` (100 líneas) y `docs/PRIVACY-POLICY.md` (107 líneas) redactados en es-AR, ley 25.326, GDPR nota. **AUDITADOS 2026-09-28 (tarjeta `t_99bc0d82`, SDD `nail-legal-build-gate` T2):** informe completo con severidades y redlines en `docs/reports/legal-audit-2026-09-28.md` — 6 hallazgos 🔴 (todos administrativos: 11 bloques `[POR COMPLETAR]` con dueño=titular), 4 🟡 (fuero vs 24.240 art. 58, retención post-baja, marca vs MIT, limitación de responsabilidad), resto 🟢. **Pendiente bloqueante antes de deploy público con datos reales:** el usuario debe proveer razón social / CUIT / domicilio legal / email de contacto (titular + inscripción AAIP). Ítem requiere input del titular, no es deuda de código.

## 6. Kanban dry-run (simulado, sin escrituras)

Tarjetas que `audit_to_kanban.py` generaría (no se escribieron, dry-run):

1. P0 `chore: commitear WIP (51 archivos)` — G-1
2. P0 `ci: obtener baseline verde (tsc+lint+vitest+playwright)` — V-1
3. P1 `feat: validación Zod de env (Supabase futuro)` — T-2
4. P1 `feat: infra i18n o ADR es-AR-only` — I-1
5. P1 `docs: ROADMAP mockup→backend→deploy` — 09-product
6. P2 `a11y: labels/foco/teclado en agenda+calculadora` — 15-a11y
7. P2 `legal: elegir licencia + términos + privacidad` — 23-legal
8. P2 `chore: decidir destino de dirs vacíos (actions/agenda)` — requiere autorización
9. P2 `chore: verificar lucide-react ^1.7.0 en registry` — stack
10. P2 `ci: instalar skills SAFE (i18n, a11y, legal, snyk)` — §4

## 7. Auto-recovery log (errores recuperados en esta pasada)

| # | Error | Retry/fallback | Resultado |
|---|-------|----------------|-----------|
| R-1 | `tsc --noEmit` timeout 180s | Sin retry pesado (costo); fallback a scans estáticos `search_files` | Baseline parcial estático OK; V-1 queda P0 |
| R-2 | Regex con grupos `(a\|b)` rompe `search_files` (wrapping interno) | Retry x2 con patrones simples sin paréntesis | Todos los scans OK |
| R-3 | Un `search_files` sin params barrió todo el workspace (ruido VirtualBox) | Re-scope a `E:/sitios web E/nail-app/src` | Scans limpios y acotados |
| R-4 | `npm update` / installs evaluados como riesgosos sin baseline verde | Workaround: diferir con motivo documentado (§3, §4) | Nada roto, nada a medio instalar |

## 8. Qué NO se hizo (requiere intervención o rompería "no dejar roto")

- Correr eslint/vitest/playwright (tiempo) — V-1.
- `npm update` minor — bloqueado por V-1.
- Instalar skills globalmente — requiere aprobación (§4).
- Borrar dirs vacíos o custom (`.agents/rules/*`, estilos glass) — prohibido sin autorización.
- Elegir licencia — RESUELTO (MIT, commit `5534e49`, ver `docs/LICENSE-DECISION.md`).
- Términos + privacidad — **redactados con placeholders** (`docs/TERMS-OF-SERVICE.md`, `docs/PRIVACY-POLICY.md`); falta que el titular provea razón social/CUIT/domicilio antes de completarlos y desplegar con datos reales (§5).
- Dirección exacta de `src/app/agenda/` vs `src/app/(client)/agenda/` — se resuelve al implementar agenda (ver decisión KEEP en §2 y `docs/reports/dead-dirs-report.md`).

## 9. Proceso de seguimiento y retiro de deuda (ligero)

Metodología simple, sin tablero externo: este archivo es la fuente de verdad del backlog.

1. **Registro:** toda deuda nueva se agrega como ítem `[ ]` bajo la sección correspondiente (código, config, stack, skills, no-técnico), con prioridad y referencia a evidencia (`path:line` o doc).
2. **Priorización (impacto × esfuerzo):**
   - **P0** — riesgo de deploy o pérdida de trabajo (desplegar primero; todo P0 resuelto es requisito para release real).
   - **P1** — deuda que crece con cada feature (i18n, env validation, roadmap).
   - **P2** — higiene, completitud, legal-administrativo, a11y.
   - El orden dentro de cada prioridad se decide en el checkpoint mensual (default: por impacto sobre el próximo hito del roadmap, luego por menor esfuerzo).
3. **Checkpoint:** revisión en cada run de auditoría nocturna (o al menos mensual): marcar `[x]` lo retirado, eliminar lo obsoleto, re-priorizar lo que cambió de peso, y actualizar la línea de estado del encabezado con los gates verdes.
4. **Retiro = verificación, no claim:** un ítem se marca `[x]` **solo** cuando el cambio está commitado y pasado el gate relevante (tsc/lint/vitest/next build para código; commit con commitlint para configuración). Lo legal se cierra cuando el archivo tiene datos reales y el usuario lo aprueba.
5. **Regla de oro:** no se borra ningún archivo ni se toca geometría de rutas sin autorización; los cambios que tocan conflictos conocidos (ruta `/agenda` de §2, `eslint.config.mjs` de §V-1-ESLINT) se anuncian en el checkpoint antes de ejecutar.
