# NailApp — Funciones
> Parte de: [[README]] · Relacionados: [[PRODUCTO]]

Superficie real verificada por lectura de `src/` (rutas, dominio, mock). Detalle de diseño en `docs/PROJECT.md`.

## Rutas

| Ruta | Rol | Qué hace |
|------|-----|----------|
| `/` | Público | Home: "Soy Clienta" → `/reservar`, "Soy Manicurista" → `/admin` |
| `/reservar` | Clienta | Wizard 4 pasos: datos personales → servicio/extras → fecha/horario → confirmación + envío por WhatsApp |
| `/calculator` | Público | Calculadora rápida (reutiliza `CalculatorForm`) |
| `/admin` | Manicurista | Dashboard: stats hoy/semana, pendientes, facturación + accesos rápidos |
| `/admin/turnos` | Manicurista | Agenda por día (grilla 09:00–18:30), bloqueos de horario, detalle (confirmar/completar/cancelar) |
| `/admin/calculadora` | Manicurista | Presupuesto: clienta + servicio + extras + notas → copiar / WhatsApp / guardar borrador |
| `/admin/clientas` | Manicurista | Lista de clientas |
| `/admin/servicios` | Manicurista | Catálogo con precio/duración |

## Dominio pricing (`src/lib/domain/pricing`)

- `calculatePrice(service, addons, type)` = base + addons; `calculateDuration` igual en minutos.
- `formatPrice` en ARS con `es-AR`; `formatDuration` en minutos.
- Tipos: `ServiceType` = `new` | `maintenance`.

### Catálogo (ARS)

| Servicio | Nuevo | Mantenimiento | Duración N/M |
|----------|-------|---------------|--------------|
| Manicura clásica | $3.500 | $2.500 | 60/45 min |
| Pedicura completa | $4.500 | $3.200 | 90/60 min |
| Uñas acrílicas | $8.000 | $4.500 | 120/60 min |
| Uñas en gel | $7.000 | $4.000 | 90/60 min |
| Esmaltado semipermanente | $3.000 | $2.200 | 45/30 min |

Addons: diseño artístico ($800, 20min) · decoración con piedras ($1.200, 25min) · reforzado extra ($500, 10min) · reparación ($300, 5min) · retiro esmaltado ($400, 15min).

## Dominio booking (`src/lib/domain/booking` + `src/lib/mock/data.ts`)

- **Booking:** clienta + servicio + tipo + addons + fecha/hora + duración + total + estado (`pending`/`confirmed`/`completed`/`cancelled`).
- **Quote:** presupuesto separado (`draft`/`saved`/`sent`).
- **BlockedSlot:** bloqueos de horario (francos, feriados, cursos).
- **Client:** nombre, teléfono `+54 9 11`, email/notas opcionales.
- Detección de conflictos (`conflict.ts`) y utilidades de horario (`time-utils.ts`).

## Mock

6 clientas rioplatenses, ~10 turnos relativos a hoy, 3 bloqueos, 3 presupuestos. Sin persistencia: todo vive en stores Zustand.
