# Design: footer-horarios-contacto

## Decisión

Reusar `getWhatsAppNumber()` de `src/lib/config/whatsapp.ts` como única
fuente del número; el helper `src/lib/contact/format-schedule.ts` solo
formatea el label es-AR (`SCHEDULE_LABEL`) y el `href wa.me`.
Copy fijo es-AR definido en `spec.md` (REQ-1), sin sistema de i18n.
Normaliza env vacío a fallback en la capa footer sin tocar el config
compartido (owned por `whatsapp-config-tests`).

## Alternativas descartadas

- Hardcodear número en el componente: rompe contrato `contact-config`.
- Nuevo endpoint/props de config: sobrediseño para un link estático.

## Límites

- Sin estilos finales (Fase 2 los define); este cambio solo fija contrato.
- Sin telemetría en el CTA (fuera de scope).
