# NailApp — Documentación (índice)

> Punto de entrada único a toda la documentación del repo. Regla: **`docs/` es la única fuente** de documentación; no se dejan `.md` sueltos en la raíz fuera de `AGENTS.md`, `README.md`, `CHANGELOG.md` y `CLAUDE.md` (puntos de entrada estándar de repo).
> Fecha: 2026-09-16 · Repo: `bertoleor/nail-app` · Rama: `master`.

## Empezá acá

| Doc                          | Para qué                                                                                                            |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [`PRODUCTO.md`](PRODUCTO.md) | **Documento de producto** (única fuente de verdad de qué es la app, para quién, features, cierre comercial, estado) |
| [`OVERVIEW.md`](OVERVIEW.md) | Resumen ejecutivo de una pantalla                                                                                   |
| [`README.md`](../README.md)  | Quickstart de desarrollo (instalar, correr, testear)                                                                |

## Producto y negocio

| Doc                                                    | Contenido                                                          |
| ------------------------------------------------------ | ------------------------------------------------------------------ |
| [`PRODUCTO.md`](PRODUCTO.md)                           | Documento de producto (canónico, en voseo)                         |
| [`OVERVIEW.md`](OVERVIEW.md)                           | Qué es NailApp, en resumen                                         |
| [`FEATURES.md`](FEATURES.md)                           | Funciones reales: rutas, dominio pricing/booking, catálogo, mock   |
| [`MARKETING.md`](MARKETING.md)                         | Segmento objetivo, canales, posicionamiento                        |
| [`BRANDING.md`](BRANDING.md)                           | Identidad visual "Premium-Beauty": paleta, glass, tipografía       |
| [`07-repos-relacionados.md`](07-repos-relacionados.md) | Referencias open source de booking salón + calculadora manicurista |

## Decisiones (ADR)

| Doc                                                              | Decisión                                                    | Estado                                              |
| ---------------------------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------- |
| [`ADR-001-mockup-sin-backend.md`](ADR-001-mockup-sin-backend.md) | Operar con datos mock, preparar Supabase sin implementar    | Aceptado (2026-09-12)                               |
| [`ADR-002-es-ar-only.md`](ADR-002-es-ar-only.md)                 | Español rioplatense como único idioma                       | Propuesto / pendiente                               |
| [`ADR-003-demo-vs-saas.md`](ADR-003-demo-vs-saas.md)             | ¿Demo/venta o producto SaaS con backend?                    | **PENDIENTE** (dueños PM+Backend, venc. 2026-10-03) |
| [`LICENSE-DECISION.md`](LICENSE-DECISION.md)                     | Licencia MIT                                                | Decidido (2026-09-14)                               |
| [`PRIVACY-POLICY.md`](PRIVACY-POLICY.md)                         | Política de privacidad (v1.0, marcadores `[POR COMPLETAR]`) | Borrador                                            |
| [`TERMS-OF-SERVICE.md`](TERMS-OF-SERVICE.md)                     | Términos de servicio (v1.0, marcadores `[POR COMPLETAR]`)   | Borrador                                            |

## Técnico

| Doc                                  | Contenido                                                                                       |
| ------------------------------------ | ----------------------------------------------------------------------------------------------- |
| [`PROJECT.md`](PROJECT.md)           | Proyecto en detalle: resumen, rutas, estética, stack, estructura, comandos, reglas, MCP, estado |
| [`STACK.md`](STACK.md)               | Stack y versiones                                                                               |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Cómo se arma: modelo, carpetas, decisiones                                                      |

## Planes y deuda

| Doc                                                                  | Contenido                                                                      |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [`plans/deuda-tecnica-plan.md`](plans/deuda-tecnica-plan.md)         | **Backlog de deuda técnica** completo, priorizado (P0/P1/P2), fuente de verdad |
| [`plans/plan-accion-2026-09-12.md`](plans/plan-accion-2026-09-12.md) | Plan de acción 2026-09-12 (3 fases, dueños y gates)                            |

## Reportes

| Doc                                                                            | Contenido                                                       |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| [`reports/producto-marketing-estilo.md`](reports/producto-marketing-estilo.md) | Producto + marketing + estilo (lectura estática, UNVERIFIED)    |
| [`reports/dead-dirs-report.md`](reports/dead-dirs-report.md)                   | Disposición de directorios vacíos `actions/` + `agenda/` (KEEP) |

---

## Estructura de `docs/`

```
docs/
├── README.md                      ← este índice (única fuente de navegación)
├── PRODUCTO.md                    ← documento de producto (canónico)
├── OVERVIEW.md / FEATURES.md / MARKETING.md / BRANDING.md
├── ADR-001..003 · LICENSE-DECISION · PRIVACY-POLICY · TERMS-OF-SERVICE
├── PROJECT.md / STACK.md / ARCHITECTURE.md
├── 07-repos-relacionados.md
├── plans/
│   ├── deuda-tecnica-plan.md      ← backlog de deuda (live)
│   └── plan-accion-2026-09-12.md
└── reports/
    ├── producto-marketing-estilo.md
    └── dead-dirs-report.md
```

## Convención

- Todo `.md` de documentación vive dentro de `docs/`.
- Los únicos `.md` que permanecen en la raíz son los puntos de entrada estándar de repo: `AGENTS.md` (reglas de agente), `CLAUDE.md` (`@AGENTS.md`), `README.md` (quickstart) y `CHANGELOG.md`.
- Nuevos reportes → `docs/reports/` · nuevos planes → `docs/plans/` · nuevas decisiones → `docs/ADR-XXX-*.md`.
