# NAIL-APP - Universal Agent Configuration

> Aplicación mockup para servicios cosméticos (uñas). Calculadora de precios + Agenda de turnos. Preparada para backend futuro.

## Project Identity

Aplicación para manicuristas argentinas. Dos features principales:

1. **Calculadora de precios**: Calcula el costo del servicio según tipo de servicio, addons y duración.
2. **Agenda**: Gestión de turnos para la manicura y sus clientas.

**Stack**: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + Zod 4 + Zustand 5
**Testing**: Vitest + Playwright
**Agent Framework**: OpenCode + Antigravity (.agents/) + Gentleman AI ecosystem

---

## PROTOCOLS MANDATORY (Siempre Activos)

### Lista de Protocolos Obligatorios

| Cuándo                          | Protocolo                     | Referencia     |
| ------------------------------- | ----------------------------- | -------------- |
| **ANTES de cualquier acción**   | Sequential Thinking MCP       | Líneas 40-52   |
| **ANTES de cualquier acción**   | Pre-Action Gate               | Líneas 55-70   |
| **ANTES de escribir código**    | Pre-Generation Gate           | Líneas 73-112  |
| **ANTES de implementar**        | TDD Protocol                  | Líneas 115-128 |
| **DESPUÉS de escribir**         | Post-Write Protocol           | Líneas 131-157 |
| **DESPUÉS de cada tarea**       | Engram Persistence            | Líneas 175-202 |
| **SI 2+ iteraciones fallan**    | Judgment Day                  | Líneas 205-219 |
| **ANTES/DESPUES de compaction** | Context Recovery (AUTOMÁTICO) | Líneas 224-258 |
| **SIEMPRE en arquitectura**     | Scope Rule                    | Lineas 240-261 |
| **SIEMPRE (todas las tareas)**  | Universal Delegation          | Lineas 296-380 |
| **AL llegar a 80% contexto**    | Auto-Compactation             | Lineas 355-380 |

---

### 0. Sequential Thinking MCP

**OBLIGATORIO antes de CUALQUIER acción:**

- Code implementation
- Debugging
- Refactoring
- Answering questions
- Planning
- ANY task

**NO EXCEPTIONS.**

---

### 1. Pre-Action Gate

**Ejecutar ANTES de cualquier acción:**

0. **READ EXISTING CODE**:
   - Leer el archivo que vas a modificar
   - Si no lo leíste, NO puedes modificarlo
   - BLOQUEAR si no se leyó

1. Sequential Thinking MCP → Analizar tarea
2. Read .agents/rules/00-behavior.md (complete)
3. Context7 MCP → If frameworks: `context7_query_docs` for current APIs
4. Supabase MCP → If DB: Use MCP for live schema (NOT types.ts)
5. Web Search → If local info insufficient: Search context and best practices

---

### 2. Pre-Generation Gate

**Verificar ANTES de escribir código:**

**All Code**:

- [ ] NO code comments (code must be self-explanatory)
- [ ] Only LSP-permitted comments (issue references with ID)
- [ ] NO emojis in code and documentation
- [ ] Reference: Rule 09-no-ai-traces.md

**Components** (components/**/\*.tsx):

- [ ] Exists already? → `grep_search` in components/
- [ ] Server Component default, 'use client' only if needed
- [ ] No inline styles, no hex colors, no font-bold
- [ ] ARIA states, responsive from mobile
- [ ] Unit test generated

**Pages** (app/**/page.tsx):

- [ ] generateMetadata() present
- [ ] Data fetched in Server Component
- [ ] next/image with priority for LCP
- [ ] LazyMotion for animations

**API Routes** (app/api/**/\*.ts):

- [ ] Zod validation before DB
- [ ] Auth verified before operations
- [ ] Errors captured with AppError

**Lib** (lib/**/\*.ts):

- [ ] Single responsibility
- [ ] ≤ 3 parameters or typed object
- [ ] Unit test accompanies

---

### 3. TDD Protocol

**MANDATORY para implementación:**

1. **RED**: Write failing test first
2. **VERIFY RED**: See it fail with expected error
3. **GREEN**: Write minimum code to pass
4. **VERIFY GREEN**: Confirm test passes
5. **REFACTOR**: Clean code keeping tests green

**NO production code without failing test first.**

Ver Rule 29-tdd-protocol.md para detalles.

---

### 4. Post-Write Protocol

**Ejecutar DESPUÉS de CADA write/edit:**

1. **Run lint + typecheck**:

```bash
npm run lint && npm run typecheck
```

2. **Evaluate results**:
   - TypeScript errors → Fix manually
   - ESLint errors → Auto-fix or fix manually
   - Prettier warnings → Format

3. **ZERO ERRORS/WARNINGS**:
   - NO next file until current is clean
   - NO tests
   - NO commit
   - NO code comments (self-explanatory code only)

**Pre-existent errors**: If you touch the file, they are YOUR responsibility.

---

### 5. Engram Persistence Protocol

**Ejecutar DESPUÉS de cada tarea:**

1. **Save to Engram**:

```typescript
mem_save({
  title: "[Task description]",
  type: "decision|bugfix|architecture|discovery",
  content:
    "**What**: [what was done]\n**Why**: [motivation]\n**Where**: [files]\n**Learned**: [insights]",
  project: "nail-app",
  scope: "project",
});
```

2. **Structure for parallel agent work**:
   - Use consistent topic_key for related observations
   - Session ID for tracking
   - Project scope for team visibility

---

### 6. Judgment Day Protocol

**Loop Protection (Rule of 2)**:

- After 2 failed correction iterations → STOP
- Ask user: "Attempt #3, new strategy, or stop?"

**AI Judge Protocol**:

- For critical architecture/domain logic tasks
- Launch 2 judges in parallel via `delegate`
- If verdicts differ → Escalate to user immediately

---

### 7. Context Recovery Protocol

**AUTOMATIC RECOVERY (OpenCode Plugin)**:

The `engram.ts` plugin automatically handles compaction recovery:

1. **PRE-compaction** (`experimental.session.compacting` hook):
   - Injects context from previous sessions into the compaction prompt
   - Instructs the compressor to include recovery instructions

2. **POST-compaction** (`session.compacted` hook):
   - Automatically sends recovery message to the agent
   - Forces the agent to execute the recovery protocol
   - No manual intervention required

**What the agent receives after compaction**:

```
## ⚠️ COMPACTION DETECTED — AUTOMATIC RECOVERY PROTOCOL

**MANDATORY IMMEDIATE ACTIONS:**
1. Call mem_session_summary() with the compacted content
2. Call mem_context() to retrieve context from previous sessions
3. Continue working
```

**Manual fallback** (if plugin fails):

1. IMMEDIATELY call `mem_session_summary` with compacted content
2. Call `mem_context` to recover additional context
3. ONLY THEN continue working

---

### 8. Gentleman Architecture Protocols

**Scope Rule**:

- Code used by 1 feature → Local in that feature
- Code used by 2+ features → Shared/global
- NO exceptions

**DDD (Domain-Driven Design)**:

- Domain does NOT know infrastructure
- Interfaces define WHAT, adapters define HOW
- Business logic pure, no framework dependencies

**Container-Presentational Pattern**:

- page.tsx → Container (fetches data, coordinates)
- \_components/ → Presentational (receives props, renders)
- \_hooks/ → Reusable logic within feature

Ver Rule 23-architecture-scope.md para detalles.

---

### 9. Sub-Agent Protocol Passing

**When delegating to sub-agents**:

USAR **Rule 33a** (`33a-delegation-template.md`) para generar prompts.

El template obligatorio incluye:

1. Task ID unico
2. Objective claro
3. Mandatory Protocols
4. Project Standards
5. Expected Output Format
6. Persistence to Engram (MANDATORY)

---

### 10. Universal Delegation Protocol

**PRINCIPIO FUNDAMENTAL: ORQUESTADOR + WORKERS**

El chat principal (padre) es SOLO para:

- Comunicacion con el usuario
- Delegar tareas a sub-agentes
- LEER resultados de sub-agentes
- ANALIZAR resultados
- CONFIRMAR con usuario antes de derivar
- Gestionar auto-compactacion al 80%

**TODO SE DELEGA**, incluyendo:

- Analisis de codigo → Sub-agente `explore`
- Exploracion de codebase → Sub-agente `explore`
- Planificación → sub-agentes ODD (explorer / writer / verifier)
- Implementacion → Sub-agente `general`
- Auditorias → Sub-agentes especializados

**El orquestador NUNCA:**

- Lee archivos completos
- Escribe codigo directamente
- Ejecuta analisis o exploracion
- Planifica implementaciones

---

**PARALELIZACION OBLIGATORIA:**

Si las tareas son independientes → Lanzar TODAS en paralelo:

```typescript
// ✅ CORRECTO
const [r1, r2, r3] = await Promise.all([
  delegate({ prompt: "Analizar archivo A", agent: "explore" }),
  delegate({ prompt: "Analizar archivo B", agent: "explore" }),
  delegate({ prompt: "Crear componente X", agent: "general" }),
]);
```

---

**DELEGACION RECURSIVA:**

Los sub-agentes PUEDEN delegar subtareas:

- Maximo 2 niveles de profundidad
- DEBEN consolidar resultados antes de retornar
- DEBEN pasar PROTOCOLS MANDATORY

---

**AUTO-COMPACTACION AL 80%:**

| Contexto | Accion                         |
| -------- | ------------------------------ |
| 60%      | Evaluar tareas pendientes      |
| 70%      | Delegar todo lo paralelizable  |
| 75%      | Guardar progreso en Engram     |
| 80%      | **EJECUTAR AUTO-COMPACTACION** |

---

**FLUJO DEL ORQUESTADOR:**

```
Usuario → Orquestador DELEGA → Sub-agente ejecuta
         ← Orquestador LEE resultado ←
         ← Orquestador ANALIZA ←
         ← Orquestador CONFIRMA ←
         → Orquestador DERIVA →
```

Ver Rule 33-universal-delegation.md para detalles completos.

---

## Build/Lint/Test Commands

### Development

```bash
npm run dev   # Start development server
npm run build # Production build
npm run start # Start production server
```

### Linting & Formatting

```bash
npm run lint         # Check for ESLint errors
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Format with Prettier
npm run format:check # Check formatting without modifying
npm run fix:all      # Run lint:fix + format
npm run fix:staged   # Fix only staged files (pre-commit)
npm run typecheck    # TypeScript type checking
```

### Testing

```bash
npm run test          # Run all unit tests (watch mode)
npm run test:unit     # Run unit tests once
npm run test:coverage # Run with coverage report
npm run test:ui       # Vitest UI dashboard
npm run test:ci       # CI mode with coverage

# Run specific test file
npx vitest run __tests__/lib/pricing/calculator.test.ts

# Run specific test pattern
npx vitest run -t "calculatePrice"

# E2E Tests
npm run test:e2e       # Run Playwright tests
npm run test:e2e:ui    # Playwright UI mode
npm run test:e2e:debug # Debug mode
```

### Quality Checks

```bash
npm run test:all     # Unit + E2E tests
```

---

## Code Style Guidelines

### TypeScript Strict Mode

- **Zero `any`** - Use `unknown` with type guards
- **Strict null checks** - Handle `null`/`undefined` explicitly
- **No unused variables** - Prefix with `_` if intentional
- **Type imports required** - `import { type X } from "module"`

### Import Organization (Auto-sorted by Prettier)

```typescript
// CORRECT - Type imports
import { type ReactNode } from "react";
import { type ClassValue, clsx } from "clsx";

// CORRECT - Named imports
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
```

### File Naming

- **Components**: `kebab-case.tsx` (e.g., `service-card.tsx`)
- **Utilities**: `kebab-case.ts` (e.g., `format-price.ts`)
- **Tests**: `*.test.ts` or `*.spec.ts`
- **Types**: `types.ts` or `*.types.ts`

### Component Structure

```typescript
"use client"; // Only when client-side features needed

import { type ReactNode } from "react";

interface ServiceCardProps {
  readonly name: string;
  readonly price: number;
  readonly duration: number;
  readonly className?: string;
}

export function ServiceCard({ name, price, duration, className = "" }: ServiceCardProps) {
  return (
    <div className={className}>
      <h3>{name}</h3>
      <p>{price}</p>
      <p>{duration} min</p>
    </div>
  );
}
```

### Function Limits (ESLint Enforced)

- **Max 150 lines** per file
- **Max 40 lines** per function
- **Max 3 parameters** per function (use object for more)
- **Max 3 nesting levels** (use early returns)
- **Complexity ≤ 15** (cognitive complexity)

### Styling Rules

- **No inline styles** - Use Tailwind classes
- **No hardcoded hex colors** - Use CSS variables
- **No `font-bold`** - Use `font-medium` max
- **Card style**: `bg-white/80 backdrop-blur-md border border-pink-100 rounded-2xl shadow-sm`

---

## Error Handling

### ActionResult Pattern

```typescript
type ActionResult<T> = {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
  readonly validationErrors?: Record<string, string[]>;
};

// Server Actions must return ActionResult
export async function createAction(formData: FormData): Promise<ActionResult<Data>> {
  const validated = schema.safeParse(Object.fromEntries(formData));

  if (!validated.success) {
    return {
      success: false,
      error: "Validation failed",
      validationErrors: validated.error.flatten().fieldErrors,
    };
  }

  return { success: true, data: result };
}
```

### Error Classes

- Use `DomainError` for business logic errors
- Use `InfrastructureError` for external service failures
- Never throw strings - always use error classes

---

## Pre-Commit Workflow

Automatically runs on every commit:

1. **lint-staged** - Format and lint staged files
2. **typecheck** - TypeScript validation

If pre-commit fails, fix errors before committing.

---

## Project Structure

```
app/                    # Next.js App Router routes
  (public)/             # Public routes
  calculator/           # Price calculator feature
  agenda/               # Booking/schedule feature
  api/                  # API routes (future backend)
  actions/              # Server Actions

components/
  ui/                   # Base UI components (atomic)
  layout/               # Layout components
  shared/               # Shared components (2+ features)
  pricing/              # Calculator domain components
  booking/              # Agenda domain components

lib/
  domain/               # Business logic (DDD)
    pricing/            # Price calculator logic
    booking/            # Booking/schedule logic
  shared/               # Shared utilities
  supabase/             # Database types (future)

__tests__/
  unit/                 # Unit tests
  components/           # Component tests
  actions/              # Server Action tests
  e2e/                  # Playwright tests
```

---

## Absolute Restrictions

1. **Zero `any`** in TypeScript
2. **No hardcoded hex colors** (use CSS variables)
3. **LazyMotion** for all animations
4. **No `style={{}}`** inline styles (use Tailwind)
5. **No `index` as key** in lists (use stable IDs)
6. **No manual `useMemo`/`useCallback`** (React Compiler handles)
7. **NO code comments** (self-explanatory code only)
8. **NO emojis** in code or documentation

---

## Agent Skills

Skills se cargan automáticamente según el contexto. Lista de skills disponibles:

### Base de Datos & Backend

| Skill                              | Cuándo usar                                         |
| ---------------------------------- | --------------------------------------------------- |
| `supabase-postgres-best-practices` | Escribir queries SQL, diseñar schema, optimizar RLS |
| `supabase-mcp`                     | Consultar o modificar base de datos Supabase        |

### Testing & Calidad

| Skill                     | Cuándo usar                                    |
| ------------------------- | ---------------------------------------------- |
| `vitest`                  | Escribir tests unitarios o de integración      |
| `playwright`              | Escribir tests E2E                             |
| `test-driven-development` | Antes de implementar cualquier feature         |
| `systematic-debugging`    | Encontrar bugs, tests que fallan               |
| `judgment-day`            | Después de audit o tests, revisión adversarial |

### Frontend & UI

| Skill                         | Cuándo usar                                                |
| ----------------------------- | ---------------------------------------------------------- |
| `react-19`                    | Crear componentes React (sin useMemo/useCallback manuales) |
| `nextjs-15`                   | Routing, Server Actions, data fetching                     |
| `tailwind-4`                  | Estilar con Tailwind, usar cn(), theme variables           |
| `frontend-design`             | Crear interfaces de producción, componentes UI             |
| `vercel-react-best-practices` | Optimizar performance React/Next.js                        |
| `vercel-composition-patterns` | Arquitectura de componentes, compound components           |

### Estado & Validación

| Skill       | Cuándo usar                        |
| ----------- | ---------------------------------- |
| `zustand-5` | Manejar estado de React en cliente |
| `zod-4`     | Validar datos con Zod, schemas     |

### DevOps & Git

| Skill            | Cuándo usar                             |
| ---------------- | --------------------------------------- |
| `git-commit`     | Ejecutar /commit, crear commit validado |
| `github-pr`      | Crear Pull Requests                     |
| `gh-cli`         | Operaciones con GitHub CLI              |
| `branch-pr`      | Workflow de creación de PR              |
| `issue-creation` | Crear issues en GitHub                  |

### Utility Skills

| Skill                   | Cuándo usar                                       |
| ----------------------- | ------------------------------------------------- |
| `skill-creator`         | Crear nuevas skills para agentes                  |
| `find-skills`           | Descubrir e instalar skills                       |
| `refactor`              | Mejorar mantenibilidad sin cambiar comportamiento |
| `polish`                | Review pre-launch, ajustes finales                |
| `critique`              | Evaluar diseño UX, feedback                       |
| `web-design-guidelines` | Review de UI, compliance                          |

---

## Specialized Sub-agents

Invoke experts for specific domain tasks using `@mention`:

### Tier 1 - Governance

- **`@orchestrator`** - Executive Orchestrator. Global coordinator for the ODD workflow.

### Tier 2 - Systems

- **`@architect`** - Core Systems Architect. Expert in DDD topology and system design.

### Tier 3 - Domain Experts

- **`@quality-auditor`** - Testing, auditing, performance (Benchmark guardian).
- **`@security-ops`** - Security, auth, database.

---

## Workflows

Use slash commands for standard operations:

- `/commit` - Validated conventional commit
- `/db-migration` - Secure Supabase migrations (future)

---

## Quick Reference

### Run Single Test

```bash
npx vitest run path/to/test.test.ts
npx vitest run -t "test name pattern"
```

### Fix All Issues

```bash
npm run fix:all
```

### Check Before Commit

```bash
npm run lint && npm run typecheck
```

### Coverage Threshold

- **90%** for branches, functions, lines, statements

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
