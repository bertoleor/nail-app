# NailApp — Qué es (Overview)
> Parte de: [[README]] · Relacionados: [[PRODUCTO]]

> Resumen ejecutivo. Documento de producto canónico: `docs/PRODUCTO.md`. Índice completo: `docs/README.md`.

- **Qué:** mockup de alta fidelidad para manicuristas argentinas, etapa demo/venta, sin backend real.
- **Para quién:** dos roles — **clienta** (reserva) y **manicurista** (administra).
- **Propuesta en una frase:** "Sistema de gestión para manicuristas" (tagline del home `/`).
- **Dos features core:**
  1. **Calculadora de precios** — servicio (Nuevo/Mantenimiento) + addons → precio y duración.
  2. **Agenda de turnos** — reserva lado clienta (wizard) + gestión lado manicurista (agenda, presupuestos, clientas, catálogo).
- **Cierre comercial:** WhatsApp (`wa.me` con mensaje preformateado) tanto en reserva como en presupuesto. Es el motor de conversión del mockup.
- **Datos:** mock en memoria — catálogo fuente única en `src/lib/domain/pricing`, re-exportado por `src/lib/mock/data.ts`; estado con Zustand. Sin auth, sin DB real.
- **Idioma:** español rioplatense con voseo, único idioma (ver `docs/ADR-002-es-ar-only.md` — pendiente de decisión formal).
- **Estado legal/técnico:** licencia MIT (ver `docs/LICENSE-DECISION.md`); `docs/PRIVACY-POLICY.md` y `docs/TERMS-OF-SERVICE.md` v1.0 con marcadores `[POR COMPLETAR]` — no hay deploy público con datos reales hasta completarlos + backend (ver `docs/ADR-001-mockup-sin-backend.md`). **Decisión modelo demo-vs-SaaS: PENDIENTE** (dueños: PM senior + Backend senior, vencimiento 2026-10-03) → `docs/ADR-003-demo-vs-saas.md`.
- **Detalle técnico completo:** `docs/PROJECT.md`. Funciones: `docs/FEATURES.md`. Stack: `docs/STACK.md`. Arquitectura: `docs/ARCHITECTURE.md`. Marca: `docs/BRANDING.md`. Marketing: `docs/MARKETING.md`.
