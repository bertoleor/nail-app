# NAIL-APP — Project Context

## Identity

Aplicación mockup para servicios cosméticos (uñas), diseñada para ofrecer a manicuristas argentinas.

**Stack**: Next.js 16 + React 19 + TypeScript 5.9 + Tailwind CSS 4 + Zod 4 + Zustand 5
**Testing**: Vitest (unit) + Playwright (E2E)
**Agent Framework**: OpenCode + Antigravity (.agents/) + Gentleman AI ecosystem

## Features Principales

1. **Calculadora de precios**: Calcula el costo del servicio según tipo de servicio, addons y duración.
2. **Agenda**: Gestión de turnos para la manicura y sus clientas.

## Arquitectura

- **Mockup primero**: Sin backend real, pero preparada para integración futura con Supabase.
- **Server Actions**: Preparadas para cuando se conecte el backend.
- **Domain-Driven**: Lógica de negocio pura en `lib/domain/`, separada de infraestructura.

## Convenciones

- **Scope Rule**: Código local a la feature hasta que 2+ features lo necesiten.
- **Feature-First**: Organizar por funcionalidad, no por tipo de archivo.
- **Container-Presentational**: page.tsx coordina, _components/ renderizan.
- **No emojis** en código ni documentación.
- **No code comments** (código auto-explicativo).
- **Argentine Spanish** para textos de UI y documentación.

## Directorios Clave

```
app/
  calculator/     # Feature: Calculadora de precios
  agenda/         # Feature: Agenda de turnos
  api/            # API routes (futuro backend)
  actions/        # Server Actions

lib/
  domain/
    pricing/      # Lógica de calculadora de precios
    booking/      # Lógica de agenda/turnos
  shared/         # Utilidades compartidas

components/
  ui/             # Componentes atómicos base
  pricing/        # Componentes de calculadora
  booking/        # Componentes de agenda
```

## Estado Actual

- [x] Proyecto Next.js inicializado
- [x] Stack configurado (TS, Tailwind, Zod, Zustand, testing)
- [x] Reglas de agente copiadas y adaptadas
- [x] Configuración OpenCode (opencode.json)
- [x] Skills curados instalados
- [x] Skill registry creado
- [ ] Calculadora de precios (pendiente)
- [ ] Agenda de turnos (pendiente)
