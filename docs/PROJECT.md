# NailApp — Documentación del Proyecto

## Resumen

NailApp es una aplicación mockup para manicuristas argentinas con dos features principales:
1. **Calculadora de precios**: Calcula el costo del servicio según tipo, addons y duración.
2. **Agenda de turnos**: Gestión de turnos para la manicura y sus clientas.

Es un mockup sin backend real, pero preparado para futura integración con Supabase.

## Estética

La estética está basada en **Portadora de Eros** (`C:\Users\Pc Living\Desktop\sitios web\jacque\portadora de eros\portadora-eros\`):

### Paleta de Colores

| Variable | Color | Uso |
|----------|-------|-----|
| `--background` | `#ffffff` | Fondo base |
| `--foreground` | `#1d1d1f` | Texto principal |
| `--muted-foreground` | `#86868b` | Texto secundario |
| `--border` | `#e5e5ea` | Bordes |
| `--destructive` | `#ff3b30` | Errores |
| Body background | `#f8f9fb` | Fondo del body (sobre el mesh) |

### Glassmorphism System

| Clase | Background | Blur | Border |
|-------|-----------|------|--------|
| `.glass` | `rgba(255,255,255,0.25)` | `20px` | `1px solid rgba(255,255,255,0.4)` |
| `.glass-opaque` | `rgba(255,255,255,0.45)` | `24px` | `1px solid rgba(255,255,255,0.5)` |
| `.glass-subtle` | `rgba(255,255,255,0.15)` | `20px` | `1px solid rgba(255,255,255,0.25)` |
| `.glass-dark` | `rgba(10,10,20,0.45)` | `20px` | `1px solid rgba(255,255,255,0.12)` |
| `.glass-pill` | `rgba(255,255,255,0.35)` | `12px` | `1px solid rgba(255,255,255,0.55)` |
| `.skeleton-glass` | Gradiente animado | `8px` | `1px solid rgba(255,255,255,0.2)` |

### Botones Glass

| Clase | Estilo |
|-------|--------|
| `.btn-primary` | Glass con `blur(20px) saturate(1.4)`, `border: 1px solid rgba(255,255,255,0.6)`, `rounded-full`, `uppercase`, `tracking: 0.13em`, textura SVG con `mix-blend-mode: soft-light` |
| `.btn-outline` | Transparente con `border: 1px solid rgba(15,15,20,0.16)`, `rounded-full`, `uppercase`, `tracking: 0.12em` |

### Fondo Dinámico (BackgroundMesh)

Canvas con partículas que se mueven lentamente con crossfade entre pares de colores:

| Par | Color 1 | Color 2 |
|-----|---------|---------|
| 1 | Menta `#98fb98` | Amarillo `#ffeb99` |
| 2 | Celeste `#87cefa` | Violeta `#d8b4e2` |
| 3 | Rosa `#ffb6c1` | Naranja `#ffc8a2` |
| 4 | Azul periwinkle `#b0c4ff` | Menta `#98fb98` |

**Configuración:**
- Velocidad: `0.55`
- Duración por par: ~7s (420 frames)
- Crossfade: ~1.5s (90 frames)
- Respiración: `0.12` amount, `0.003` speed
- Opacidad base: `0.55`
- Velo final: `0.2`

### Tipografía

| Fuente | Uso |
|--------|-----|
| **Geist** (sans) | Body, UI, botones |
| **Playfair Display** (serif) | Títulos, headings |

### Espaciado

| Elemento | Valor |
|----------|-------|
| Padding horizontal | `px-[5%]` |
| Cards | `p-[30px]`, `rounded-[24px]` |
| Botones | `padding: 13px 28px` (primary), `12px 24px` (outline) |
| Scrollbar | Invisible globalmente |

## Stack Técnico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Next.js | 16.2.2 |
| UI | React | 19.2.4 |
| Lenguaje | TypeScript | 5.9 (strict) |
| Estilos | Tailwind CSS | 4 |
| Validación | Zod | 4 |
| Estado | Zustand | 5 |
| Forms | React Hook Form | 7 |
| Animaciones | Framer Motion | 12 |
| Iconos | Lucide React | 1.7 |
| Notificaciones | Sonner | 2 |
| Testing Unit | Vitest | 4 |
| Testing E2E | Playwright | 1.59 |
| Linting | ESLint 9.x | flat config, 18+ plugins |
| Formato | Prettier | 3.8 |
| Git hooks | Husky + lint-staged | 9 + 16 |
| Commits | Commitlint | conventional |

## Estructura del Proyecto

```
nail-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx          ← Root layout con fonts + BackgroundMesh
│   │   ├── page.tsx            ← Home page
│   │   ├── globals.css         ← Paleta Eros + glass + botones + animaciones
│   │   ├── calculator/page.tsx ← Feature: Calculadora de precios
│   │   └── agenda/page.tsx     ← Feature: Agenda de turnos
│   ├── components/
│   │   ├── client/
│   │   │   └── BackgroundMesh.tsx  ← Canvas con partículas dinámicas
│   │   ├── ui/                 ← Componentes atómicos base
│   │   ├── layout/             ← Layout components
│   │   ├── pricing/            ← Componentes de calculadora
│   │   └── booking/            ← Componentes de agenda
│   ├── lib/
│   │   ├── utils.ts            ← cn() helper (clsx + tailwind-merge)
│   │   ├── types.ts            ← ActionResult type
│   │   ├── result.ts           ← successResult/errorResult helpers
│   │   └── domain/
│   │       ├── pricing/        ← Lógica de calculadora (pendiente)
│   │       └── booking/        ← Lógica de agenda (pendiente)
│   └── hooks/                  ← Custom hooks
├── __tests__/
│   ├── unit/
│   ├── components/
│   └── hooks/
├── e2e/                        ← Playwright tests
├── .agents/
│   ├── rules/                  ← 18 reglas de agente
│   └── NAIL-APP.context.md     ← Contexto del proyecto
├── .opencode/                  ← Configuración OpenCode
├── .atl/
│   └── skill-registry.md       ← Registro de skills
├── docs/                       ← Documentación
├── opencode.json               ← MCP servers, agents, commands
├── AGENTS.md                   ← Entry point para agentes AI
├── eslint.config.mjs           ← ESLint 9.x flat config
├── next.config.ts              ← Next.js config (React Compiler, security headers)
├── vitest.config.ts            ← Vitest config
├── playwright.config.ts        ← Playwright config
├── commitlint.config.js        ← Conventional commits
└── package.json
```

## Comandos

```bash
# Desarrollo
npm run dev           # Dev server con turbopack
npm run build         # Production build
npm run start         # Production server

# Calidad
npm run lint          # ESLint check
npm run lint:fix      # ESLint auto-fix
npm run format        # Prettier format
npm run format:check  # Prettier check
npm run fix:all       # lint:fix + format
npm run typecheck     # TypeScript check

# Testing
npm run test          # Vitest watch mode
npm run test:unit     # Unit tests once
npm run test:coverage # Coverage report
npm run test:e2e      # Playwright tests
npm run test:all      # Unit + E2E
```

## Reglas de Agente

Ver `.agents/rules/` para las 18 reglas completas. Las más importantes:

| Regla | Archivo | Resumen |
|-------|---------|---------|
| Behavior | `00-behavior.md` | Orquestador + Workers, delegación universal, sequential thinking obligatorio |
| TypeScript | `01-typescript.md` | Strict mode, zero any, type over interface, const types |
| Design System | `02-design-system.md` | Estética Eros, glassmorphism, paleta, tipografía |
| No AI Traces | `09-no-ai-traces.md` | Sin comentarios, sin style inline, sin emojis, sin variables genéricas |
| Accessibility | `10-accessibility.md` | WCAG 2.1 AA, focus visible, ARIA, keyboard nav |
| RSC Patterns | `16-rsc-patterns.md` | Server Components default, React 19 APIs, Server Actions |
| Code Quality | `17-code-quality.md` | ESLint 18+ plugins, max 40 líneas/función, max 3 params |
| Architecture Scope | `23-architecture-scope.md` | 1 uso = local, 2+ = shared |
| SDD | `24-spec-driven-development.md` | Workflow: explore → propose → spec → design → tasks → apply → verify → archive |
| TDD | `29-tdd-protocol.md` | RED-GREEN-REFACTOR obligatorio |
| Modern Stack | `30-modern-stack-zod-zustand.md` | Zod en frontera, Zustand solo cuando necesario |

## MCP Servers

| Server | Comando | Uso |
|--------|---------|-----|
| supabase | `mcp-server-supabase` | DB Supabase (futuro) |
| sequential-thinking | `mcp-server-sequential-thinking` | Análisis antes de acciones |
| engram | `engram.exe mcp stdio` | Memoria persistente |
| context7 | `context7-mcp` | Documentación de APIs |
| github | `mcp-server-github` | Operaciones GitHub |
| playwright | `playwright-mcp` | Testing E2E |

## Estado Actual

- [x] Proyecto Next.js inicializado
- [x] Stack completo (TS, Tailwind, Zod, Zustand, testing)
- [x] Estética Eros implementada (glassmorphism + BackgroundMesh + Playfair + Geist)
- [x] Reglas de agente (18 reglas adaptadas)
- [x] Configuración OpenCode (MCP, agents, commands)
- [x] ESLint 9.x con 18+ plugins
- [x] Prettier + Husky + commitlint
- [x] Build pasa sin errores
- [ ] Calculadora de precios (pendiente)
- [ ] Agenda de turnos (pendiente)
- [ ] Componentes UI base (pendiente)
- [ ] Tests (pendiente)
