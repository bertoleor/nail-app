# NailApp — Documento de producto

> Única fuente de verdad de producto. Detalle técnico en `docs/PROJECT.md`, funciones en `docs/FEATURES.md`, stack en `docs/STACK.md`, arquitectura en `docs/ARCHITECTURE.md`.
> Fecha: 2026-09-16 · Idioma: español rioplatense con voseo.

## Qué es

NailApp es una **app de gestión para manicuristas argentinas**, hoy en etapa **demo/venta**: un mockup de alta fidelidad, sin backend real, que se usa como herramienta de venta y demostración.

## Para quién

Dos roles:

| Rol | Quién es | Para qué usa la app |
|-----|----------|---------------------|
| **Clienta** | La persona que quiere reservar una uña | Reserva un turno y lo cierra por WhatsApp |
| **Manicurista** | La profesional que administra | Arma presupuestos, lleva la agenda, gestiona clientas y servicios |

## Propuesta en una frase

> "Sistema de gestión para manicuristas" (tagline del home `/`).

## Features core

1. **Calculadora de precios** — elige servicio (Nuevo/Mantenimiento) + addons → precio y duración. Dos superficies: `/calculator` (pública) y `/admin/calculadora` (presupuesto).
2. **Agenda de turnos** — reserva del lado clienta (wizard de 4 pasos) + gestión del lado manicurista (agenda por día, bloqueos de horario, presupuestos, clientas, catálogo).

## Cierre comercial

**WhatsApp** es el motor de conversión. Toda reserva y todo presupuesto terminan en un deep link `wa.me` con mensaje preformateado (servicio, addons, fecha, total). Es lo que convierte la demo en una herramienta de venta real.

## Contexto técnico (lo que define al producto)

- **Sin backend:** datos mock en memoria (`src/lib/mock/data.ts` re-exporta el catálogo de `src/lib/domain/pricing`, que es la fuente única), estado con Zustand. Sin auth, sin DB real (ver `docs/ADR-001-mockup-sin-backend.md`).
- **Preparada para Supabase:** vars en `.env.example`, MCP configurado, sin implementar.
- **Número de WhatsApp configurable:** `NEXT_PUBLIC_WHATSAPP_NUMBER` (fallback en `src/lib/config/whatsapp.ts`).
- **Idioma:** es-AR con voseo, único idioma; la decisión formal está pendiente (`docs/ADR-002-es-ar-only.md`).

## Estado legal / técnico

| Ítem | Estado |
|------|--------|
| Licencia | **MIT** decidida (`docs/LICENSE-DECISION.md`, commit `5534e49`) |
| Términos de servicio | v1.0 borrador con marcadores `[POR COMPLETAR]` (`docs/TERMS-OF-SERVICE.md`) |
| Política de privacidad | v1.0 borrador con marcadores `[POR COMPLETAR]` (`docs/PRIVACY-POLICY.md`) |
| Modelo entrega | demo-vs-SaaS **PENDIENTE** (`docs/ADR-003-demo-vs-saas.md`, dueños PM senior + Backend senior, venc. 2026-10-03) |

**Regla de deploy:** no hay deploy público con datos reales hasta completar backend + legales (ADR-001 y ADR-003).

## Mapa de rutas (superficie real)

| Ruta | Rol | Descripción |
|------|-----|-------------|
| `/` | Público | Home: "Soy Clienta" → `/reservar`, "Soy Manicurista" → `/admin` |
| `/reservar` | Clienta | Wizard de reserva en 4 pasos + WhatsApp |
| `/calculator` | Público | Calculadora de precios rápida |
| `/admin` | Manicurista | Dashboard con stats del día/semana |
| `/admin/turnos` | Manicurista | Agenda por día + bloqueos + detalle de turno |
| `/admin/calculadora` | Manicurista | Presupuestos + envío por WhatsApp |
| `/admin/clientas` | Manicurista | Lista de clientas |
| `/admin/services` | Manicurista | Catálogo con precio/duración |

> Deuda conocida: el sidebar de admin aún linkea `/admin/servicios` (en español, 404) mientras la ruta real es `/admin/services` (ver `docs/plans/deuda-tecnica-plan.md` y `docs/FEATURES.md`).

## Índice de producto

- Resumen ejecutivo: `docs/OVERVIEW.md`
- Detalle técnico (diseño, stack, estructura): `docs/PROJECT.md`
- Funciones en profundidad: `docs/FEATURES.md`
- Catálogo + calculadora de pricing: `src/lib/domain/pricing/` (fuente única)
- Deuda técnica y roadmap deuda: `docs/plans/deuda-tecnica-plan.md`