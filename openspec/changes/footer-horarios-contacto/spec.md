# Spec: footer-horarios-contacto

## Requirements

### REQ-1 — Bloque de horarios en footer

El footer MUST mostrar horarios de atención en español rioplatense
(es-AR only, sin i18n).

- Escenario 1: GIVEN cualquier página con footer, WHEN renderiza, THEN
  muestra " Lun a Sáb · 9 a 19 h" (texto exacto fijado acá).
- Escenario 2: GIVEN render, WHEN se inspecciona semántica, THEN usa
  elemento `<footer>` con sección identificable (`data-testid="footer-contact"`).

### REQ-2 — CTA de WhatsApp con fallback

El bloque MUST enlazar a WhatsApp con el número de `getWhatsAppNumber()`
(nunca hardcodeado, nunca `""`).

- Escenario 1: GIVEN env configurado, WHEN click en CTA, THEN abre
  `https://wa.me/<numero-env>`.
- Escenario 2: GIVEN env ausente/vacío, WHEN renderiza, THEN usa fallback
  `5491112345678` (contrato `contact-config`).
- Escenario 3: GIVEN render, WHEN se audita accesibilidad, THEN el enlace
  tiene `aria-label` descriptivo en es-AR.

### REQ-3 — Cero regresión visual

- Escenario 1: `npm run typecheck` → 0 errores tras implementar.
- Escenario 2: suite unitaria completa sigue verde (N/N, N registrado).
- Escenario 3: sin cambios fuera del componente footer + su test.
