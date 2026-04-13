# 23 - Architecture Scope Rule (GP-Standard)

## Principio Fundamental: The Law of Locality

El código debe nacer y vivir lo más cerca posible de su uso. La abstracción prematura es una deuda técnica.

---

## 1. La Regla de Oro (1 vs 2+)

- **Uso Único (1)**: El componente, hook o utilidad DEBE vivir en la carpeta local de la feature (ej: `app/features/calculator/_components/`).
- **Uso Múltiple (2+)**: Solo cuando una pieza de código es requerida por una segunda feature independiente, se permite su ascenso a `shared/`.
- **Exclusividad UI**: Los componentes de `/components/ui/` son estrictamente para elementos atómicos (botones, inputs, cards genéricas).

## 2. Estructura de Directorios

- **Feature-First**: Organizar por funcionalidad, no por tipo de archivo.
- **_components**: Carpeta privada para componentes locales de una ruta o feature.
- **_hooks / _services**: Lógica privada local.

## 3. Autoridad del Agente

- El Agente tiene PROHIBIDO crear archivos globales sin justificar que existen 2 o más consumidores actuales.
- Cada nueva feature debe auditar si puede usar algo de `shared/` o si debe crear su propia versión local para evitar el acoplamiento.

---

## Reglas Relacionadas

Al organizar la arquitectura, estas reglas son MANDATORIAS:

- **Rule 16**: RSC Patterns - Server Components, composición
- **Rule 24**: SDD - Architecture-Before-Code
- **Rule 02**: Design System - Componentes UI atómicos
