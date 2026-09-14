# NAIL-APP — Project Context

## Identity

Aplicación mockup para servicios cosméticos (uñas), diseñada para ofrecer a manicuristas argentinas.

**Stack**: Next.js 16 + React 19 + TypeScript 5.9 + Tailwind CSS 4 + Zod 4 + Zustand 5
**Testing**: Vitest (unit) + Playwright (E2E)
**Agent Framework**: OpenCode + Antigravity (.agents/) + Gentleman AI ecosystem

## Features Principales

1. **Calculadora de precios**: Calcula el costo del servicio según tipo (Nuevo/Mantenimiento), addons y duración. Implementada en `/calculator` (público) y `/admin/calculadora` (presupuestos).
2. **Agenda**: Gestión de turnos para la manicura y sus clientas. Reserva de clienta en `/reservar` (wizard 4 pasos) y gestión en `/admin/turnos`.

## Arquitectura

- **Mockup de alta fidelidad**: Sin backend real, datos en memoria (Zustand) y catálogo único en `lib/domain/pricing`. Preparada para integración futura con Supabase.
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
src/app/
  (client)/           # Rutas de clienta
    reservar/         # Feature: Reserva (wizard 4 pasos) → /reservar
    calculator/       # Feature: Calculadora de precios → /calculator
  (admin)/            # Panel manicurista
    page.tsx          # Dashboard → /admin
    turnos/           # Feature: Agenda de turnos → /admin/turnos
    calculadora/      # Feature: Presupuestos → /admin/calculadora
    clientas/         # Feature: Lista de clientas → /admin/clientas
    services/         # Feature: Catálogo de servicios → /admin/services

src/lib/
  domain/
    pricing/          # Fuente única del catálogo + calculadora
    booking/          # Lógica de agenda/turnos
  mock/data.ts        # Datos mock (re-exporta catálogo de domain/pricing)
  config/whatsapp.ts  # Número WhatsApp (NEXT_PUBLIC_WHATSAPP_NUMBER)
  shared/             # Utilidades compartidas

src/components/
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
- [x] Calculadora de precios implementada
- [x] Agenda de turnos implementada
- [ ] Backend real / Supabase (futuro, planificado)
