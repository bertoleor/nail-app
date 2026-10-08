# Git Commit - Conventional Commits

## Principio Fundamental

Commits estructurados facilitan el historial, changelog y debugging. Cada commit debe ser una unidad lógica de cambio.

---

## Formato

```
<tipo>(<scope>): <descripción>

[cuerpo opcional]

[footer opcional]
```

---

## Tipos

| Tipo       | Descripción                | Ejemplo                                                 |
| ---------- | -------------------------- | ------------------------------------------------------- |
| `feat`     | Nueva feature              | `feat(calculator): agregar validación de servicios`     |
| `fix`      | Bug fix                    | `fix(agenda): corregir conflicto de horarios`           |
| `docs`     | Documentación              | `docs(readme): actualizar instrucciones de instalación` |
| `style`    | Formato (no afecta lógica) | `style(ui): formatear ServiceCard`                      |
| `refactor` | Refactoring                | `refactor(pricing): extraer cálculo de descuentos`      |
| `perf`     | Performance                | `perf(agenda): memoizar renderizado de turnos`          |
| `test`     | Tests                      | `test(calculator): agregar tests de validación`         |
| `chore`    | Mantenimiento              | `chore(deps): actualizar dependencias`                  |
| `ci`       | CI/CD                      | `ci(github): agregar workflow de tests`                 |

---

## Scopes NAIL-APP

| Scope        | Área                   |
| ------------ | ---------------------- |
| `calculator` | Calculadora de precios |
| `agenda`     | Agenda de turnos       |
| `auth`       | Autenticación          |
| `ui`         | Componentes UI         |
| `api`        | API routes             |
| `deps`       | Dependencias           |
| `config`     | Configuración          |

---

## Ejemplos

### Feat

```
feat(calculator): agregar selector de servicios y addons

- Integrar catálogo de servicios con precios base
- Agregar addons opcionales (diseño, strass, etc.)
- Mostrar total en tiempo real

Closes #1
```

### Fix

```
fix(agenda): corregir conflicto de horarios superpuestos

El cálculo de disponibilidad no consideraba la duración
variable de cada servicio.

Fixes #2
```

---

## PROHIBIDO

### Mensajes Vagos

```bash
# ❌ PROHIBIDO
git commit -m "fix"
git commit -m "update"
git commit -m "changes"
git commit -m "wip"
git commit -m "fix bug"
git commit -m "add feature"

# ✅ CORRECTO
git commit -m "fix(auth): corregir validación de sesión expirada"
git commit -m "feat(calculator): agregar selector de zona horaria"
```

### Commits Gigantes

```bash
# ❌ PROHIBIDO
git add .
git commit -m "feat: agregar todo"

# ✅ CORRECTO
git add lib/pricing/calculator.ts
git commit -m "feat(calculator): agregar cálculo de precios base"
git add components/services/ServiceCard.tsx
git commit -m "feat(ui): agregar componente ServiceCard"
```

---

## Validaciones Pre-Commit

### Hooks

```bash
# .husky/pre-commit
npm run lint
npm run typecheck

# .husky/commit-msg
npx commitlint --edit $1
```

### commitlint.config.js

```javascript
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "style", "refactor", "perf", "test", "chore", "ci"],
    ],
    "scope-enum": [2, "always", ["calculator", "agenda", "auth", "ui", "api", "deps", "config"]],
    "subject-max-length": [2, "always", 72],
    "body-max-line-length": [2, "always", 100],
  },
};
```

---

## Archivos a Ignorar

```bash
# Nunca commitear
.env
.env.local
.env.*.local
*.log
.DS_Store
Thumbs.db
node_modules/
.next/
dist/
coverage/
*.tsbuildinfo
```

---

## Checklist Pre-Commit

- [ ] Tipo correcto
- [ ] Scope específico
- [ ] Descripción clara (< 72 chars)
- [ ] Sin archivos temporales
- [ ] Lint pasa
- [ ] Typecheck pasa
- [ ] Tests pasan
- [ ] No secrets en código

---

## Referencias

- [Conventional Commits](https://www.conventionalcommits.org/)
- [commitlint](https://commitlint.js.org/)
- [Husky](https://typicode.github.io/husky/)

---

## Reglas Relacionadas

Al crear commits, estas reglas son MANDATORIAS:

- **Rule 01**: TypeScript - Zero `any`, strict mode
- **Rule 09**: No AI Traces - Sin comentarios, sin style={}
- **Rule 17**: Code Quality - ESLint rules, complejidad
