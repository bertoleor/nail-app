# Reporte: destino de directorios vacíos actions/agenda

Task: `t_1fa98962` (Decide disposition of empty actions/agenda directories)
Fecha: 2026-09-14 · Perfil: 22-operations · Repo: `E:/sitios web E/nail-app`

No se borró nada. Este reporte solo investiga y recomienda.

## Directorios investigados

| Ruta | Contenido | Tracked en git |
|------|-----------|----------------|
| `src/app/actions/` | `.gitkeep` (0 B) | Sí |
| `src/app/agenda/` | `.gitkeep` (0 B) | Sí |
| `src/app/(client)/agenda/` | `.gitkeep` (0 B) | Sí |

Los tres estaban vacíos; el orquestador (24-orquestador) les agregó `.gitkeep`
para que sobrevivan al clone, respetando la regla "no borrar" del plan.

## Evidencia de propósito (no son restos legacy)

1. **AGENTS.md — Project Structure (líneas 510-535)**: documenta la arquitectura
   deseada del App Router e incluye `agenda/` con la nota "Booking/schedule
   feature" y `actions/` con "Server Actions" como segmentos de primera clase.
2. **src/app/(client)/layout.tsx:30**: el nav del cliente tiene un link activo
   `href="/agenda"` (label "Agenda"). Hoy esa ruta no tiene handler (404) — el
   directorio indica una ruta esperada e inminente.
3. **README.md:3,25**: describe la **agenda de turnos** como feature core
   (vista admin + cliente), con "(client) — agenda, calculadora, reservar".
4. **docs/plans/deuda-tecnica-plan.md §2 (Dead dirs, P2, línea 28)**: lista los
   tres explícitamente y ordena "NO borrar (requiere autorización)".
5. **CHANGELOG.md:19**: "agenda de turnos (admin + cliente)" como feature del
   mockup.

## Recomendación por directorio

| Ruta | Disposición | Razón |
|------|-------------|-------|
| `src/app/(client)/agenda/` | **KEEP** (placeholder) | Ruta destino del link `/agenda` del nav cliente (layout.tsx:30). Es donde debe implementarse la agenda del cliente. |
| `src/app/agenda/` | **KEEP** (placeholder, peroconflicto a resolver) | Documentado en AGENTS.md como "Booking feature". Compite con `(client)/agenda` por la URL `/agenda`. |
| `src/app/actions/` | **KEEP** (placeholder) | Documentado en AGENTS.md como home de Server Actions (mutaciones hoy van por mock/zustand, sin backend). |

Todos: **intencionales** (placeholders de rutas futuras documentados), **no** son
restos legacy. Mantener con `.gitkeep`; no requiere borrado.

## Pendiente a resolver al implementar

- Conflicto de ruta: `src/app/agenda/` y `src/app/(client)/agenda/` resolverían
  ambas la URL `/agenda` si ambas llevaran `page.tsx` (Next/App Router colisiona).
  Conservar solo una al momento de implementar — se recomienda `(client)/agenda`
  (coherente con el rol "Soy Clienta" y el link del nav). La otra puede renombrarse
  o usarse para el admin si se quisiera separar por grupo; decisión puntual, no bloquea nada hoy.
- `actions/` solo necesita materializarse cuando existan Server Actions reales
  (integración Supabase futura).

## Deuda técnica conectada

- Este hallazgo queda registrado en `docs/plans/deuda-tecnica-plan.md` §2 (P2)
  y lo consumirá el task `t_b4bd52dd` (deuda-tecnica-plan.md).