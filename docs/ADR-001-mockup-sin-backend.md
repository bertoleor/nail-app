# ADR-001 — Mockup sin backend real

- Estado: aceptado (2026-09-12)
- Contexto: NailApp gestiona turnos y precios para manicuristas argentinas. Aún no hay backend.
- Decisión: operar con datos mock en `src/lib/mock/` + stores zustand; preparar integración Supabase (vars en `.env.example`, MCP configurado) sin implementarla.
- Consecuencias: `src/app/actions/` queda vacío como placeholder (NO borrar sin autorización); sin auth, sin RLS, sin datos reales → no deploy público con datos de clientas hasta backend + legales.
