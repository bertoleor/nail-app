# Accessibility (a11y) - WCAG 2.1 AA

## Principio Fundamental

NAIL-APP debe ser usable por todas las personas, independientemente de sus capacidades. Accesibilidad no es opcional.

---

## Stack de Accesibilidad

| Componente          | Implementación            |
| ------------------- | ------------------------- |
| Focus Management    | Focus visible, tab order  |
| Screen Reader       | ARIA labels, live regions |
| Keyboard Navigation | Full keyboard support     |
| Color Contrast      | WCAG AA (4.5:1 mínimo)    |
| Motion              | prefers-reduced-motion    |

---

## Focus Visible

```css
/* app/globals.css */
:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
```

### Skip Links

```tsx
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-pink-700 focus:px-4 focus:py-2 focus:text-white"
    >
      Saltar al contenido principal
    </a>
  );
}
```

---

## ARIA Labels

### Botones de Icono

```tsx
// ✅ CORRECTO
<button aria-label="Cerrar menú" onClick={handleClose}>
  <XIcon aria-hidden="true" />
</button>

// ❌ INCORRECTO
<button onClick={handleClose}>
  <XIcon />
</button>
```

### Estados Dinámicos

```tsx
// ✅ CORRECTO
<button
  aria-expanded={isOpen ? "true" : "false"}
  aria-controls="mobile-menu"
  onClick={toggleMenu}
>
  <MenuIcon aria-hidden="true" />
  <span className="sr-only">{isOpen ? "Cerrar menú" : "Abrir menú"}</span>
</button>
```

---

## Keyboard Navigation

### Keyboard Handlers

```tsx
function Modal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
    >
      {/* Modal content */}
    </div>
  );
}
```

---

## Screen Reader

### Live Regions

```tsx
function FormStatus({ isSubmitting, isSuccess, isError }: FormStatusProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="sr-only"
    >
      {isSubmitting && "Enviando formulario..."}
      {isSuccess && "Formulario enviado exitosamente"}
      {isError && "Error al enviar. Intenta nuevamente."}
    </div>
  );
}
```

---

## Color Contrast

### Ratios Mínimos (WCAG AA)

| Tipo                 | Ratio Mínimo |
| -------------------- | ------------ |
| Texto normal         | 4.5:1        |
| Texto grande (18px+) | 3:1          |
| UI components        | 3:1          |
| Focus indicators     | 3:1          |

---

## Reduced Motion

```css
/* app/globals.css */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Forms Accessibility

### Labels

```tsx
// ✅ CORRECTO
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// ✅ CORRECTO: Con error
<div>
  <label htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    aria-invalid={hasError ? 'true' : 'false'}
    aria-describedby={hasError ? 'email-error' : undefined}
  />
  {hasError && (
    <span id="email-error" role="alert">
      Ingresa un email válido
    </span>
  )}
</div>
```

---

## Checklist a11y Pre-Commit

- [ ] Focus visible en todos los interactivos
- [ ] Skip link implementado
- [ ] ARIA labels en botones de icono
- [ ] Estados dinámicos anunciados
- [ ] Keyboard navigation completa
- [ ] Color contrast ≥ 4.5:1
- [ ] Reduced motion respetado
- [ ] Form labels asociados
- [ ] Errores anunciados
- [ ] Landmarks correctos

---

## Referencias

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

---

## Reglas Relacionadas

Al crear/modificar componentes UI, estas reglas son MANDATORIAS:

- **Rule 02**: Design System - Estética y paleta
- **Rule 09**: No AI Traces - Sin comentarios, sin style={}
- **Rule 17**: Code Quality - ESLint rules
- **Rule 14**: Performance - memo(), lazy loading
- **Rule 16**: RSC Patterns - Server vs Client Components
