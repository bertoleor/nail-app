# NailApp — Marketing

Consolidación canónica de `docs/reports/producto-marketing-estilo.md` §3 (reporte UNVERIFIED por lectura estática).

## Segmento

Manicuristas independientes argentinas (profesionales unipersonales, no salones grandes). Todo el producto habla en voseo rioplatense.

## Propuesta de valor

- **Clienta:** reservar en 4 pasos con resumen y envío por WhatsApp.
- **Manicurista:** dashboard con stats del día, agenda con bloqueos, presupuestos por WhatsApp, gestión de clientas y servicios.
- **Sin fricción:** sin registro ni backend — todo funciona con datos mock (ideal para demo/venta).

## Motor de conversión: WhatsApp

La pieza de marketing más fuerte es embebida en el producto:

- Reserva → deep link `wa.me/<NEXT_PUBLIC_WHATSAPP_NUMBER>` con mensaje (nombre, teléfono, servicio, addons, fecha, total).
- Presupuesto → texto formateado con emojis (💅📅💰) para copiar o enviar por WhatsApp.
- Esto convierte la demo en herramienta de venta real.

## Tono

Cercano, femenino, con emojis decorativos en UI y mensajes. Regla 09 prohíbe emojis en código/docs pero los permite en strings de UI — ambigüedad pendiente de decisión de marca.

## Gaps (sin presencia externa)

| Gap | Acción sugerida |
|-----|-----------------|
| Posicionamiento | Argumentar diferenciación vs. apps de turnos existentes |
| Proof | Landing/"acerca de" que explique el valor (ahorra tiempo, evita doble agenda, profesionaliza presupuesto) |
| Onboarding | El home elige rol pero no "vende" el producto |
| Métricas | Sin medición de conversión (esperable: mockup sin backend) |

## Restricción

No hay deploy público con datos reales hasta backend Supabase + legales completos (ver `docs/ADR-001-mockup-sin-backend.md`, `docs/PRIVACY-POLICY.md`, `docs/TERMS-OF-SERVICE.md`).
