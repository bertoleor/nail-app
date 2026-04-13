# 02 - Design System (Gentleman-Grade)

## Ley Fundamental: Elegancia Minimalista

NAIL-APP es minimalismo cálido y femenino. La estética es "Premium-Beauty".

---

## 1. Stack Visual (P0)

- **Framework**: Tailwind CSS 4.2 (Native). No usar clases arbitrarias `[#hex]`.
- **Motion**: Framer Motion 12 (LazyMotion). Micro-interacciones suaves.
- **Iconografía**: SVGs limpios en `components/ui/icons/`. Prohibido Emojis.

## 2. Paleta de Colores & Estética

- **Background**: `bg-background` o tonos suaves cálidos.
- **Texto**: `text-foreground` para lectura, `text-muted` para auxiliares.
- **Tipografía**: Font-light, font-thin. Prohibido `font-bold` (usar `font-medium` solo para énfasis).
- **Acentos**: Tonos rosados, nude, dorado suave — siempre a través de CSS variables en `globals.css`.

## 3. Leyes del Componente (P1)

- **CARD-RULE**: `bg-white/80 backdrop-blur-md border border-pink-100 rounded-2xl shadow-sm`.
- **ACCESIBILITY**: Contraste AA obligatorio. Foco en semántica HTML.
- **RESPONSIVE**: Mobile-first. Container queries preferidas sobre media queries.

## 4. Checklist UX

- [ ] ¿Es consistente con la paleta cálida/femenina?
- [ ] ¿El fondo es interactivo? (Hover con brillo sutil)
- [ ] ¿Es responsive? (Mobile-first)

---

## Reglas Relacionadas

Al crear/modificar componentes UI, estas reglas son MANDATORIAS:

- **Rule 09**: No AI Traces - Sin comentarios, sin style={}, sin emojis
- **Rule 10**: Accessibility - WCAG 2.1 AA compliance, ARIA labels, contraste
- **Rule 14**: Performance - memo(), lazy loading, optimización de imágenes
- **Rule 16**: RSC Patterns - Server vs Client Components, React 19
- **Rule 17**: Code Quality - ESLint rules, complejidad cognitiva
- **Rule 19**: UI Resilience - Error boundaries, empty states, UX senior
