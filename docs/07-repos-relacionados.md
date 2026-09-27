# 07 — Repos relacionados
> Parte de: [[README]] · Relacionados: [[PRODUCTO]]

> Relevamiento web (2026-09-15) para NailApp: booking de nail salon / beauty salon y calculadora de precios para manicurista. Solo referencia — no se copia código sin revisar licencia.

## 1. Booking / gestión de salón (open source)

| Repo | Stack | Qué aporta a NailApp | Licencia / nota |
|------|-------|----------------------|-----------------|
| `teusdrz/hairbooking-saas` | Next.js + React + TS + Tailwind | Referencia más cercana: SaaS de reservas para peluquería/salón. Ver modelo de servicios + slots. | Verificar licencia en repo |
| `aledash3/judith-hairstudio` | Next.js 15 (App Router) + TS + React 19 + Mongoose + Sharp | Gestión full-stack de salón de belleza. Útil para comparar admin dashboard. | Verificar licencia en repo |
| `apLanka/blooso` | Next.js + NestJS + Prisma + PostgreSQL + Stripe | Flujo booking + pagos con Stripe. Interesante para futura seña/depósito. | Verificar licencia en repo |
| `caballerorandy6/rcbeautysalon` | Next.js 16 + React 19 + TS + Prisma + Stripe | Plataforma salón con booking online (+$50 seña), e-commerce, admin dashboard, emails con Resend. El más alineado funcionalmente con NailApp. | Verificar licencia en repo |
| `kenigbolo/openSalon` | Ruby (Rails) | Sistema open source de booking y gestión para salones. Idea de modelo provider/cliente. | MIT-ish, verificar |
| `MKlimecka/Appointment-manager` | Django REST Framework + PostgreSQL | API de turnos con detección de conflictos y slots dinámicos, roles cliente/proveedor/admin. Inspiración para reglas de disponibilidad. | MIT |
| `AseelKeleeb/GLOW-beauty-salon` | Java (OOP, académico) | Solo conceptual: clases Servicio/Reserva/Recibo/Review + cálculo de precio. | MIT |
| `smetaxas/beauty-salon-api` | Laravel (REST) | API de turnos: crear/listar/cancelar + slots disponibles por especialista. | Verificar licencia |
| `Easy!Appointments` (easyappointments.org) | PHP 8.2 + MySQL, Docker oficial | Scheduler open source maduro (desde 2014). Modelo negocio: servicios + proveedores + planes de trabajo. Bueno como referencia de UX de booking simple. | GPL-3.0 |
| `Cal.diy` (ex-Cal.com community, github.com/calcom/cal.diy) | Node + PostgreSQL + Redis | Motor de scheduling self-hosted (el Cal.com comercial se cerró en 2026). Availability rules, timezone detection, sync calendario. Recomendado solo uso personal/no-producción según su README. | MIT |

Búsqueda base: GitHub topics `salon-management`, `nail-stylist`; comparativas self-hosted 2026 (pinggy.io, miget.com, mith.tech).

## 2. Calculadora manicurista / pricing

No se encontró un repo open source dominante específico "calculadora manicurista". Lo que existe:

| Recurso | Tipo | Qué aporta |
|---------|------|------------|
| Booksy Biz — Price Lab (biz.booksy.com/tools/price-calculator) | SaaS (calculadora dinámica) | Si cambian insumos/alquiler, todo el menú se recalcula. Idea: costos → tarifa base/hora. |
| Cordoza Nail Supply — Pricing Calculator | Web tool | Tech independiente: servicio + tiempo + meta de ingreso → precio sugerido (+ reserva impuestos). |
| Unicorn Lab — Nail Service Pricing Calculator | Web tool | Arma servicio desde productos + deco + tiempo; muestra costo real y ganancia bruta. Redondeo a $5. |
| Tune Hustle — Nail Services Price Profit Calculator | Web tool | Estima costo insumos + overhead + tiempo + ganancia sin Excel. |
| Etsy — SalonProfitLab Pricing Calculator | Planilla Excel/Sheets paga | Fija precios por costo + ganancia; posible inspiración de fórmula, no de código. |
| GitHub topic `price-calculator` (JS) | Varios repos genéricos | Calculadoras de precio por costo/gasto/descuento/ganancia — adaptar fórmula a servicios de uñas. |

Implicancia para NailApp: la "calculadora" conviene como **feature propia** (fórmula: insumos + tiempo × tarifa/hora + overhead + margen → redondeo ARS), no como dependencia externa. Ningún repo encontrado justifica fork directo.

## 3. Recomendación

1. **No forkar nada por ahora.** Baseline NailApp (Next.js 16 + React 19) ya está por encima de la mayoría de los repos de referencia.
2. **Tomar ideas prestadas (no código):** flujo de seña Stripe de `rcbeautysalon`, slots/conflictos de `Appointment-manager`, modelo servicio-proveedor de Easy!Appointments, fórmula de pricing de Unicorn Lab/Cordoza.
3. **Si se integra scheduling externo:** evaluar Cal.diy solo para agenda personal; para producción multi-rol, mejor motor propio (ya previsto en `docs/`) por control de datos y es-AR.

## Fuentes

- github.com/topics/salon-management
- github.com/topics/nail-stylist
- github.com/topics/price-calculator
- easyappointments.org
- pinggy.io/blog/self_hosted_calendly_alternatives (2026)
- miget.com/blog/calendly-alternatives-self-hosted (2026)
- mith.tech/blog/open-source-calendly-alternative (2026)
- hivebook.wiki/wiki/cal-com-open-source-scheduling-calendly-alternative
- biz.booksy.com/tools/price-calculator · cordozanailsupply.com/pages/pricing-calculator · unicornlab.com.au/pages/nail-service-pricing-calculator · tunehustle.com/tools/nail-services-price-profit-calculator
