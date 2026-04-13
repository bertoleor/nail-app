# Code Quality — ESLint, Prettier & Code Health

## Principio Fundamental

El código de NAIL-APP no solo debe funcionar — debe ser mantenible, escalable y libre de code smells. Las herramientas de análisis estático son la primera línea de defensa contra la deuda técnica.

**Versión:** 4.0 (ESLint 9.x flat config + Prettier 3.8)

---

## ESLint 9.x - Flat Config Architecture

### Configuración

El proyecto usa ESLint 9.x con **flat config** (`eslint.config.mjs`). Este formato reemplaza el antiguo `.eslintrc.*` y permite composición más granular de reglas y plugins.

**Archivo de configuración:** `eslint.config.mjs` (raíz del proyecto)

### Plugins Configurados

| Plugin                         | Propósito                               |
| ------------------------------ | --------------------------------------- |
| `@eslint/js`                   | Reglas base ESLint                      |
| `typescript-eslint`            | Reglas TypeScript estrictas + stylistic |
| `eslint-plugin-unicorn`        | Mejores prácticas modernas JS/TS        |
| `eslint-plugin-sonarjs`        | Code smells (SonarQube rules)           |
| `eslint-plugin-perfectionist`  | Orden alfabético imports/props          |
| `eslint-plugin-security`       | Prevención de vulnerabilidades comunes  |
| `eslint-plugin-promise`        | Mejores prácticas de Promises           |
| `eslint-plugin-n`              | Reglas específicas Node.js              |
| `eslint-plugin-functional`     | Programación funcional, inmutabilidad   |
| `eslint-plugin-no-secrets`     | Detección de secrets/token leakage      |
| `eslint-plugin-no-only-tests`  | Prevenir .only() en tests               |
| `eslint-plugin-vitest`         | Reglas específicas para tests Vitest    |
| `eslint-plugin-playwright`     | Reglas para tests E2E Playwright        |
| `eslint-plugin-react`          | Reglas React                            |
| `eslint-plugin-react-hooks`    | Reglas de hooks de React                |
| `eslint-plugin-react-compiler` | Reglas para React Compiler              |
| `eslint-plugin-jsx-a11y`       | Accesibilidad en JSX                    |
| `@next/eslint-plugin-next`     | Reglas específicas Next.js              |

### Reglas Críticas

```javascript
// ESLint Reglas Activas — NO VIOLAR
"@typescript-eslint/no-explicit-any": "error", // Prohíbe any
"no-secrets/no-secrets": "error", // Detecta secrets
"react-compiler/react-compiler": "error", // Valida React Compiler
"max-lines": ["warn", { max: 150 }], // Límite por archivo
"max-depth": ["error", { max: 3 }], // Máximo 3 niveles anidamiento
"max-params": ["error", { max: 3 }], // Máximo 3 parámetros
"complexity": ["warn", 15], // Complejidad cognitiva
"max-lines-per-function": ["warn", { max: 40 }], // Límite por función
"react/forbid-dom-props": ["error", { forbid: ["style"] }], // Prohíbe style inline
"react/no-array-index-key": "error", // Prohíbe index como key
"no-nested-ternary": "error", // Prohíbe ternarios anidados
"no-duplicate-imports": "error", // Prohíbe imports duplicados
```

---

## Prettier 3.8 - Configuration

### Plugins Activos

| Plugin                             | Propósito                      |
| ---------------------------------- | ------------------------------ |
| `prettier-plugin-organize-imports` | Auto-ordena imports            |
| `prettier-plugin-tailwindcss`      | Ordena clases de Tailwind      |
| `prettier-plugin-curly`            | Fuerza llaves en condicionales |
| `prettier-plugin-packagejson`      | Formatea package.json          |

### Configuración

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "printWidth": 100,
  "trailingComma": "all",
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "singleAttributePerLine": true
}
```

---

## Husky + lint-staged

### Pre-commit Hook

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Verificaciones obligatorias antes de commit
npm run lint
npm run typecheck
```

### lint-staged Configuration

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,css,md}": ["prettier --write"]
  }
}
```

---

## Code Smells — Detección y Prevención

### Anidamiento Excesivo

```typescript
// ❌ PROHIBIDO: > 3 niveles de anidamiento
function calculate() {
  if (a) {
    if (b) {
      if (c) {
        for (const x of list) {
          if (x.valid) { ... } // Nivel 5
        }
      }
    }
  }
}

// ✅ CORRECTO: Early returns + extracción
function calculate() {
  if (!a || !b || !c) return;
  return list.filter(x => x.valid).map(processItem);
}
```

### Funciones Demasiado Largas

```
Límite: 40 líneas por función.
Si supera 40 líneas: extraer sub-funciones con nombres semánticos.
```

### Parámetros Excesivos

```typescript
// ❌ PROHIBIDO: > 3 parámetros
function createBooking(
  userId: string,
  serviceId: string,
  date: Date,
  notes: string,
  price: number,
) {}

// ✅ CORRECTO: Objeto tipado
type CreateBookingInput = {
  readonly userId: string;
  readonly serviceId: string;
  readonly date: Date;
  readonly notes?: string;
  readonly price: number;
};

function createBooking(input: CreateBookingInput) {}
```

### Index como Key en Listas

```tsx
// ❌ PROHIBIDO: index como key
{bookings.map((booking, index) => (
  <BookingCard key={index} booking={booking} />
))}

// ✅ CORRECTO: ID estable
{bookings.map((booking) => (
  <BookingCard key={booking.id} booking={booking} />
))}
```

### Inline Styles

```tsx
// ❌ PROHIBIDO: style={{}}
<div style={{ color: '#fff', padding: '16px' }} />

// ✅ CORRECTO: Tailwind classes
<div className="text-white p-4" />

// ✅ EXCEPCIÓN: CSS variables dinámicas
<div style={{ '--width': `${pct}%` } as React.CSSProperties} />
```

---

## Métricas de Salud del Código

| Métrica                          | Target  | Alerta    |
| -------------------------------- | ------- | --------- |
| Cognitive Complexity por función | ≤ 10    | > 15      |
| Líneas por función               | ≤ 40    | > 60      |
| Parámetros por función           | ≤ 3     | > 4       |
| Líneas por archivo               | ≤ 150   | > 400     |
| Duplicación de código            | < 3%    | > 5%      |
| Test coverage (lógica crítica)   | > 80%   | < 60%     |
| TypeScript strict errors         | 0       | > 0       |

---

## Checklist Code Quality Pre-Commit

- [ ] `npm run lint` pasa sin errores ni warnings
- [ ] `npm run typecheck` pasa sin errores
- [ ] Sin `style={}` inline en elementos DOM (excepto CSS variables)
- [ ] Sin números mágicos — todo en constantes nombradas
- [ ] Sin `index` como key en listas
- [ ] Sin imports no usados
- [ ] Sin funciones > 40 líneas
- [ ] Sin anidamiento > 3 niveles
- [ ] Sin código duplicado en más de 2 lugares

---

## Comandos de Verificación

```bash
# Verificación completa de calidad
npm run lint && npm run typecheck && npm run format:check

# Auto-fix de todos los issues
npm run fix:all
```

---

## Referencias

- [ESLint 9.x Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- [Prettier Plugins](https://prettier.io/docs/plugins.html)
- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged](https://github.com/lint-staged/lint-staged)

---

## Reglas Relacionadas

Al crear/modificar código, estas reglas son MANDATORIAS:

- **Rule 01**: TypeScript - Zero `any`, strict mode
- **Rule 09**: No AI Traces - Sin comentarios, sin style={}
- **Rule 11**: Git Commit - Conventional commits
