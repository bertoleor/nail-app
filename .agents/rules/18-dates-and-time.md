# 18 - Dates and Time (Gentleman-Grade)

## Principio Fundamental

Las fechas y horarios son la fuente más común de bugs en aplicaciones de agenda. Tratar con rigor los timezones, formatos y cálculos de tiempo.

---

## 1. Stack de Fechas (P0)

- **Library**: `date-fns` para manipulación y formateo de fechas.
- **Timezone**: Usar `Intl.DateTimeFormat` para timezone del usuario.
- **Storage**: Siempre UTC en la base de datos.

## 2. Patrones Mandatorios

### Formateo Consistente

```typescript
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

// ✅ CORRECTO: Formateo localizado
const displayDate = format(date, "EEEE d 'de' MMMM", { locale: es });
// "Lunes 15 de abril"

const displayTime = format(date, "HH:mm");
// "14:30"
```

### Cálculo de Duración

```typescript
import { addMinutes, isWithinInterval } from "date-fns";

// ✅ CORRECTO: Calcular fin de turno
const bookingEnd = addMinutes(bookingStart, serviceDurationMinutes);

// ✅ CORRECTO: Verificar solapamiento
const hasOverlap = isWithinInterval(
  {
    start: newBookingStart,
    end: newBookingEnd,
  },
  {
    start: existingBookingStart,
    end: existingBookingEnd,
  },
);
```

## 3. Checklist de Fechas

- [ ] ¿Todas las fechas se almacenan en UTC?
- [ ] ¿El formateo usa locale correcto (es-AR)?
- [ ] ¿Los cálculos de duración usan `date-fns`?

---

## Reglas Relacionadas

Al trabajar con fechas y horarios, estas reglas son MANDATORIAS:

- **Rule 01**: TypeScript - Zero `any`, strict mode
- **Rule 07**: Testing - Tests de cálculos de tiempo
- **Rule 16**: RSC Patterns - Server Components para fechas
