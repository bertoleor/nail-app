# ESTADO-FLOTA — Documento maestro consolidado

> Fecha: 2026-09-14 · Idioma: español rioplatense · Postura: solo lo verificado hoy cuenta; el resto va marcado **UNVERIFIED**.
> Fuentes leídas: `docs/audits/flujo-2026-09-14.md`, `docs/audits/general-2026-09-14.md`, `docs/reports/datos-consolidacion-2026-09-14.md`, `reports/analisis-producto-todos-2026-09-12.md`, `reports/resultados-analisis-2026-09-12.md`, `reports/auditor/2026-09-14_changelog-weekly.md`, `reports/auditor/2026-09-14_weekly-product-pulse.md`, `docs/plans/project-map.md`, `docs/plans/rol-35-astrology-engine.md`, `docs/plans/vicky-spec.md`, `docs/plans/sacre-spec.md`, `cron/jobs.json` (conteo directo), `config.yaml` (fallback), `skills/kanban-cards/SKILL.md`, skill `supabase-fleet`.
> Nota: `docs/reports/auditor/por-rol/*-2026-09-14.md` **no existe** (tampoco `docs/reports/auditor/por-rol/`). Lo más cercano son los prompts `prompts/auditor/auditor-por-rol/v1.md` y los dos reportes del auditor del 14 en `E:/Hermes/reports/auditor/`. Todo lo atribuido a "5 roles por-rol" queda **UNVERIFIED**.

---

## 1) Cómo funciona la flota

Loops nocturnos (G0) despiertan un worker por proyecto → el worker ejecuta su plan contra el repo local y Supabase → abre o mueve tickets en Kanban (tablero del proyecto; lo que necesita tu decisión va a `default` + `request-review`) → el espejo en Linear (team ORN) se actualiza → el Auditor (34) pone gate de cierre → los digests te avisan por Telegram a la mañana. Vos das LGTM o pedís cambios; sin tu LGTM nada pasa de review a Done.

```
  cron G0 (02:00–04:00, stagger 15')          Telegram (bot, dm 5175850062)
  orquestador-loop-<proyecto>  ──despierta──►  worker del proyecto
        │                                           │ ejecuta plan / toca repo + Supabase
        │ jobs.json                                 ▼
        │                                     Kanban (board proyecto)
        │                                       │ review → default + request-review
        ▼                                         ▼
  Orquestador 24 (standby, failover 60s)      Espejo Linear (team ORN)
        │ backup/fallback de ruteo                │
        ▼                                         ▼
  Auditor 34 (gate; Modos A/B/C) ◄── exige ── evidencia (tsc, vitest, grep, SQL vivo)
        │ PASS con fidelity ≥0.9
        ▼
  Digests Telegram 08:00–09:15 (blocker-scan, delivery-status, weekly-pulse)
        │
        ▼
  VOS (LGTM / cambios / patear) ──► Done
```

Piezas verificadas hoy: 9 loops G0 con schedule propio; `blocker-scan` 0 8 * * *; `delivery-status-digest` 15 9 * * *; `orchestrator-heartbeat` cada 30'; Kanban 40 tasks (todo 6, ready 7, blocked 6, done 21, review 0); notificaciones Telegram 33 suscripciones, 3 sin leer (`last_read=0`).

---

## 2) Roles — 37 perfiles en disco, 36 workflows en spec

Conteo verificado: `E:/Hermes/profiles/` tiene **37 directorios** (00–35 + `24-orquestador-b`). `HERMES-WORKFLOWS.md` define **36 workflows** (00–35). El "38" que circula es **UNVERIFIED** (posible doble conteo del orquestador-b o del gateway, que es perfil `00-telegram-gateway`, no rol extra). El rol 35 existe como spec + perfil en disco, pero su skill propia y sus reglas AE-01..06 están **PROPUESTAS, no creadas** (ver §7).

| Grupo | Miembros (perfil → workflow) | Estado por defecto | Estado hoy |
|---|---|---|---|
| G0 Núcleo | 00 Arquitectura, 24 Orquestador (+24-b standby), 25 PM/Delivery, 26 Feedback, 34 Auditor | Activo | Activo; loops 02:00–04:00 OK, salvo khal/nail-app con error de providers (§5 S1) y sacre sin corrida registrada (§5 S2) |
| G1 Construcción | 01 Frontend, 02 Mobile, 16 Backend, 17 TS/Zod, 10 UI/UX, 35 Astrology Engine | Dormido | Dormido; 35 solo spec |
| G2 Infra & Datos | 03 SRE, 06 DBA, 12 Cloud, 04 Data, 05 ML, 11 Automation | Mixto (health activo) | Activo health (`slo-burn` c/15', `pg-health` 06:00); DBA 06 compartido G2↔G4 por cable C1 |
| G3 Calidad | 07 QA, 08 SDET, 14 Perf, 15 A11y, 33 Verificación | Dormido (despierta por PR) | Dormido; reportes semanales programados |
| G4 Pagos & Identidad | 28 Pagos, 29 Auth | Dormido | Dormido; gate duro cable C2 (13+12 antes de prod) |
| G5 Negocio | 30 Booking, 31 E-commerce, 32 Email, 27 Launch | Dormido (Launch por trigger) | Dormido; `booking-conflict-check` c/15' activo |
| G6 Gestión & Growth | 09 PM, 18 i18n, 19 Writer, 20 DevRel, 21 Content/SEO, 22 Ops, 23 Legal | Mixto | Mixto; weeklies de lunes/miércoles/viernes programados |

Tabla completa rol→skill→gate: `docs/audits/AUDITOR-PLAN.md` §6/§7 (no se re-releva acá).

---

## 3) Crons — 87 jobs en `jobs.json` (no 41, no 93)

Conteo medido hoy por lectura directa de `E:/Hermes/cron/jobs.json`: **87 jobs**. Correcciones con evidencia:
- El doc de flujo decía 41: ese número sale de `cron list` (CLI global) y **no cuenta los jobs por grupo del orquestador**. 41 = vista parcial, no total real.
- El "93" y el "88" que circularon quedan **UNVERIFIED**: medido 87. Diferencia posible: `jobs.json.bak*` o conteo con perfiles. Hasta re-contar con el mismo método, vale 87.
- `cron-autofix-watch` **sí existe** (intervalo 30', sin grupo) — el doc de flujo decía que no aparecía con ese nombre. Correjido con evidencia.
- `gateway-alive-check` (c/10', sin grupo) también existe.
- Triggers G0–G6: el doc de flujo decía que solo G0 existe porque miró `profiles/24-orquestador/cron/.dormido`. Correjido: **los 7 grupos existen en `jobs.json`** (G0 19, G1 11, G2 18, G3 11, G4 4, G5 5, G6 17, + 2 sin grupo). El `.dormido` solo gobierna el orquestador, no la flota.

### G0 — Núcleo (19)

| Job | Schedule | Deliver |
|---|---|---|
| orchestrator-heartbeat | */30 * * * * | local |
| daily-objective-sync | 0 8 * * * | telegram |
| delivery-status-digest | 15 9 * * * | telegram |
| blocker-scan (= blocker digest) | 0 8 * * * | local |
| weekly-product-pulse | 0 9 * * 1 | telegram |
| feedback-digest | 0 10 * * 3 | telegram |
| simulacro-e2e | 0 0 1 */3 * | telegram |
| auditor-self-check | 0 9 1 * * | telegram |
| cable-audit | 0 9 1 */3 * | telegram |
| model-deprecation-check | 0 9 1 * * | telegram |
| orquestador-loop-paeonia | 0 2 * * * | local |
| orquestador-loop-eros | 15 2 * * * | local |
| orquestador-loop-khal | 30 2 * * * | local |
| orquestador-loop-omakase | 45 2 * * * | local |
| orquestador-loop-social-pip | 0 3 * * * | local |
| orquestador-loop-trino | 15 3 * * * | local |
| orquestador-loop-nail-app | 30 3 * * * | local |
| orquestador-loop-vicky | 45 3 * * * | local |
| orquestador-loop-sacre | 0 4 * * * | local |

### G1 — Construcción (11)

morning-fe-check (lun–vie 08:00), weekly-perf-snapshot (vie 10:00), rn-upgrade-check (lun 09:00), ota-adoption-report (mié 10:00), design-token-audit (mié 10:00), design-system-health (día 1, 09:00), api-health-report (lun 08:00), dead-letter-check (mié 10:00), ts-strict-check (lun 09:00), astro-golden-nightly (04:00 diario), astro-se1-integrity-weekly (lun 05:00).

### G2 — Infra & Datos (18)

slo-burn-check (c/15'), incident-digest + eval-regression-check (07:00 diario), pg-health-check (06:00), pg-weekly-stats / terraform-drift-check / dependency-audit (lun 08:00), pipeline-health (mié 10:00), toil-weekly (lun 10:00), n8n-workflow-health (vie 08:00), llm-cost-report + toil-reduction-report + prompt-budget-check (lun/día-1 09:00), infra-cost-report + secret-scan (día 1, 09:00), monthly-lineage-audit (día 1, 08:00), cron-doctor (lun 08:00), cron-cleanup-weekly (dom 03:00).

### G3 — Calidad (11)

supabase-realtime-health (c/30'), reconcile-prompts (c/6h), flaky-test-report (vie 08:00), coverage-trend + ci-cost-report (lun 09:00/08:00), test-health-check + a11y-weekly-scan (mié 10:00), monthly-cwv-report (día 1, 08:00), a11y-score-report (día 1, 09:00), spec-drift-check (mié 09:00), fidelity-audit (día 1, 10:00).

### G4 — Pagos & Identidad (4)

mp-webhook-health (08:00 diario), auth-health (lun 08:00), fiscal-calendar-check (lun 09:00), refund-reconciliation (día 1, 10:00).

### G5 — Negocio (5)

booking-conflict-check (c/15'), email-deliverability-check (08:00 diario), booking-reminder-dispatch (09:00 diario), ecommerce-health (lun 08:00), post-launch-check (lun 09:00).

### G6 — Gestión & Growth (17)

mcp-health-check (c/15'), hermes-backup-daily (03:00 diario), missing-keys-report (mar 08:00), weekly-review + ops-health + compliance-scan + weekly-roadmap-sync + competitor-weekly + changelog-weekly + seo-weekly (lun/vie, varios horarios 08:00–10:00), community-pulse (mié 10:00), locale-qa-report + contract-renewal-check (día 1, 09:00), docs-health + monthly-content-audit + monthly-discovery-audit (día 1, 10:00), secret-rotation-check (1 ene, 01:00).

---

## 4) Workflows — 36 definidos + Auditor en 3 modos

`HERMES-WORKFLOWS.md` (3733 líneas) define 36 workflows (00–35), cada uno con pasos, triggers (evento vs horario), conexiones (cables C1–C7) y auditoría inversa. El "35 workflows" que circula es conteo sin el 00-Arquitectura o sin el 35: el número verificado en el índice es **36 secciones**. Fases transversales: 0.2 Baseline Código Limpio (10 lentes, 22 reglas, gate pre-transfusión), 0.3 Silent-Error Shield (6 bloques CI 🔴), 2.6 anti-pisada (Cloud/Security siempre disponibles, DBA compartido, QA/SDET sin colisión), 2.7 anti-cuello (orquestador standby failover 60s, auditor con tope de sesiones, realtime health).

Auditor 34 — 3 modos (fuente: `prompts/auditor/` + `AUDITOR-PLAN.md`):
- **Modo A (general/semanal)**: barrido completo código + infra viva. El del 14 dio FAIL global con 5 🔴 (ver §5). Fidelity 0.44 (baja, falta segunda pasada `spec-verifier`).
- **Modo B (por rol, rotativo)**: 1/día, ~7 roles/semana, ciclo ~5 semanas; cada rol tiene checklist y step de gate propios. El rol 35 entra acá con su skill cuando se cree.
- **Modo C (por categoría transversal)**: cruza roles (ej. pagos, RLS, webhooks en todos los proyectos). **UNVERIFIED** si corrió el 14: no hay reporte Modo C con esa fecha.

Formato de tarjetas (skill `kanban-cards`, verificado): título `[PROY] verbo + objeto`; body de 4 líneas (Estado UNVERIFIED/VERIFIED + cómo, Evidencia archivo:línea, Gate que cierra, Linear ID o "sin espejo + por qué"). Solo workers despachados crean tarjetas; a `review` solo lo que espera decisión tuya; `complete` solo con evidencia mecánica.

Skills: **sin duplicación encontrada**. El doc de flujo decía que el skill real es `supabase-fleet` y no `supabase-access`: verificado — `supabase-fleet` existe (inventario multi-org vía Management API + SQL read-only por PAT, sin tocar credenciales de app); `supabase-access` vive bajo `skills/data/` como material de referencia, no como skill duplicada activa. Total: 203 directorios en `skills/`.

---

## 5) Hallazgos y gaps abiertos (con IDs Linear y severidad)

### Auditoría Modo A 2026-09-14 — veredicto FAIL (bloquea go-live en SACRE, OMAKASE, VICKY, TRINO)

| ID | Sev | Proyecto | Hallazgo |
|---|---|---|---|
| `f30f7ae1` | 🔴 | SACRE | Webhook MP sin verificación de firma + doble `request.text()` (siempre 500 además de inseguro) |
| `8dab0b2d` | 🔴 | VICKY (viva `dttxtzuwodoikidzifwk`) | `telegram_messages`/`telegram_sessions` legibles/escribibles por PUBLIC (`USING true`, `polroles={0}`) |
| `85767224` | 🔴 | OMAKASE (viva) | `bookings` SELECT/UPDATE abierto a todos; `agent_audit_logs` con RLS deshabilitado |
| `d9daa51f` | 🔴 | TRINO | `.env` apunta a proyecto muerto (404); viva real `asbyqyxrpfggxjujfqte` con 0 tablas |
| `79e19360` | 🔴 | VICKY | `.env.local` apunta a proyecto muerto; viva real es la nueva |
| `c3380805` | 🟠 | OMAKASE | "HMAC" que es comparación plana opcional (`if (webhookSecret && …)`) |
| `7463c53f` | 🟠 | EROS | `is_admin()` SECURITY DEFINER ejecutable por `anon` |
| `2de67b44` | 🟠 | VICKY | `validateRequest` retorna `true` si no hay secret configurado |
| `657b9891`/`6b691119`/`49d8e709` | 🟠 | KHAL/TRINO/SACRE | DBs vivas con 0 tablas, migraciones sin aplicar |
| PAEONIA linter | 🟠 | PAEONIA | 11 funciones SECURITY DEFINER ejecutables por `anon` (`set_user_role`, `is_admin`, …): escalación de rol anónima |
| `e2368ab4`/`63e437c3` | 🟠 | VICKY/PAEONIA | Tablas RLS-on con 0 policies (= deny-all, feature rota) |

### Infraestructura de datos (rol Data, verificado por SQL + linter)

PAEONIA: 30 tablas, RLS ON 30/30, 2 sin policies, 7 FK sin índice, 43 policies con `auth.fn()` por fila, 136 policies solapadas, 3 índices duplicados, 80 sin uso. **PITR deshabilitado en los 9 proyectos** (incumple SQL-08 para producción: KHAL/EROS). SOCIAL-PIP: sqlite de 0 bytes (sin inicializar o corrupto).

### Flujo/kanban (auditoría de flujo — severidades originales S1–S4)

S1: loops khal/nail-app con `RuntimeError: every provider in the fallback chain kept failing`; S2: loop sacre sin corrida registrada, 7 EPICs en ready sin dueño, 4 blocked `needs_input` con assignee difuso, boards sin mapeo task→board; S3: review vacío en DB (canal real = Telegram/LGTM), Supabase 5 PATs sin inventario t1–t5, espejo Linear no verificado en esa pasada; S4: `state.db` ~190 MB sin política de retención.

### Tickets Linear mencionados hoy

ORN-113 (fase 1 PAEONIA, Todo), ORN-118 (deploy migraciones KHAL/TRINO/NAIL/SACRE), ORN-117 (PITR KHAL/EROS), ORN-121 (archivar OMAKASE/VICKY-vieja INACTIVE), ORN-77 (EROS RLS allowlist, done), ORN-86 (OMAKASE PCI, done), ORN-85 + ORN-16 (OMAKASE en review — cuello humano). **Conteo total "~125 issues" y urgents: UNVERIFIED** (sin llamada API en las pasadas de hoy; el pulse reporta PAEONIA 20 issues / 9 urgentes / 0 done, EROS 23 done — viene del weekly-pulse, no de conteo directo).

---

## 6) Errores conocidos y fixes aplicados hoy

| # | Error | Estado hoy |
|---|---|---|
| 1 | Backup: tar cifrado falla (`--force-local is not supported`, log 11:07) | **NO fixeado al cierre del log** — el snapshot en claro sí sale. Corrección al doc de flujo: el backup Supabase por proyecto **sí corrió 13:42** (`supabase-backups/` con 6 dirs: PAEONIA, OMAKASE, EROS, TRINO, SACRE-`qirzicgqqmcqlvyqskkv`, VICKY-`dttxtzuwodoikidzifwk`). Eso verifica que **SACRE y VICKY existen como proyectos vivos** (el sacre-spec los marcaba UNVERIFIED). Pendiente: tar portable + restore de prueba + PITR. |
| 2 | Loops khal/nail-app: fallback chain agotado | Abierto — rotar provider/key y reintentar (§7.1). Hay 16 entradas de fallback en `config.yaml` (6 NVIDIA + resto opencode), no 7 keys como decía el flujo de memoria. |
| 3 | `cron list` 41 vs real 87 | Aclarado, no es bug: el CLI muestra vista parcial (§3). |
| 4 | Skill `supabase-access` vs `supabase-fleet` | Aclarado: canónica `supabase-fleet`, sin duplicado (§4). |
| 5 | OMAKASE mudanza `omakase/` → `suhi reservas` | Hecha el 14 (project-map). PCI sin card fields (ORN-86) mergeado. |
| 6 | TRINO rename DOCS→docs (91 refs) | Hecho el 12. |
| 7 | EROS prettier roto + husky `|| true` | Abierto (traga el error). |
| 8 | SOCIAL-PIP suma `ruff.toml`/`pytest.ini`/`tests`/pre-commit + 158 ruff + 5 tests verdes | Hecho el 12. |
| 9 | PAEONIA: análisis producto falló (`server_error`, re-lanzar) | **UNVERIFIED** si se re-lanzó. |
| 10 | NAIL-APP transcript con basura (`; echo SUHI`, task-6 sospechoso) | Abierto, revisar. |

---

## 7) Mejoras pendientes priorizadas

1. **Cerrar los 5 🔴 del Modo A** (SACRE HMAC copiando `verifyMercadoPagoSignature` de KHAL + fix doble read; OMAKASE `bookings` a owner/admin + RLS en audit log; VICKY policies telegram a `service_role` + `.env.local` al ref vivo; TRINO `.env` al ref vivo). Sin esto no hay go-live.
2. **Deployar migraciones** (ORN-118): KHAL 17 tablas, TRINO ~20, SACRE primer schema, NAIL decidir (demo sin backend vs proyecto huérfano en t4 que se paga).
3. **Revocar EXECUTE `anon` en SECURITY DEFINER admin** (PAEONIA `set_user_role`/`is_admin`/… + EROS `is_admin()`): escalación anónima hoy.
4. **PITR en KHAL + EROS** (ORN-117, SQL-08) + tar portable + restore de prueba del backup diario.
5. **Loops khal/nail-app**: rotar provider, reintento manual, alerta ante 2 fallos seguidos; revisar definición del loop sacre y confirmar run 2026-09-15 04:00.
6. **Kanban**: dueño a los 7 EPICs ready o devolver a todo; dueño humano + vencimiento a los blocked `needs_input`; definir store de boards y mapeo task→board; blanquear que aprobación = Telegram/LGTM.
7. **PAEONIA producto** (del consolidado 09-12, UNVERIFIED en vivo): `results/page.tsx` roto, precio desde navegador, premium sin paywall, `orders` zombie, sin anti-doble-reserva, signo JD.
8. **Rol 35**: crear skill local `astrology-engine`, perfil operativo, reglas AE-01..06 en `lint-baseline.sh`, batería determinismo + spot-checks; antes, decisión humana de licencia AGPL-3.0 Swiss (P0 legal, dueños: vos + 23-Legal) y auditoría de integridad de los `.se1`.
9. **Decisiones humanas acumuladas**: EROS estilo + doble camino de reserva; KHAL MP vs manual + Supabase link + LICENSE; OMAKASE MVP de pago + `cashier` + overbooking; SOCIAL-PIP LICENSE/CONTRIBUTING + sqlite 0 bytes; TRINO categorías/devoluciones/mayoristas; NAIL-APP catálogo único + WhatsApp configurable; VICKY repo (greenfield en `E:/Hermes/` hasta que definas); SACRE dónde vive la DB.
10. **Segunda pasada `spec-verifier`** para salir de fidelity 0.44 + creds read-only Vercel/Sentry (todo error-rate/build-logs hoy es UNVERIFIED) + política de retención de `state.db` + inventario t1–t5 fuera de secretos.
