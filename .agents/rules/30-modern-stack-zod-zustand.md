# 30 - Modern Stack: Zod + Zustand (Gentleman-Grade)

## Principio Fundamental

Validación en la frontera, estado mínimo. Zod para datos, Zustand solo cuando es estrictamente necesario.

---

## 1. Zod - Validación de Datos

### Schema Definition

```typescript
import { z } from "zod";

const SERVICE_TYPE = {
  MANICURE: "manicure",
  SEMIPERMANENT: "semipermanent",
  GEL: "gel",
  NAIL_ART: "nail_art",
} as const;

const bookingSchema = z.object({
  clientName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  clientPhone: z.string().regex(/^\+?[0-9\s-]{8,}$/, "Teléfono inválido"),
  service: z.enum([
    SERVICE_TYPE.MANICURE,
    SERVICE_TYPE.SEMIPERMANENT,
    SERVICE_TYPE.GEL,
    SERVICE_TYPE.NAIL_ART,
  ]),
  date: z.string().datetime(),
  notes: z.string().max(500).optional(),
});

type BookingInput = z.infer<typeof bookingSchema>;
```

### ActionResult Pattern

```typescript
type ActionResult<T> = {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
  readonly validationErrors?: Record<string, string[]>;
};

// Server Action con Zod
export async function createBooking(formData: FormData): Promise<ActionResult<BookingInput>> {
  const validated = bookingSchema.safeParse(Object.fromEntries(formData));

  if (!validated.success) {
    return {
      success: false,
      error: "Datos inválidos",
      validationErrors: validated.error.flatten().fieldErrors,
    };
  }

  // Process validated.data
  return { success: true, data: validated.data };
}
```

## 2. Zustand - Estado Global (Solo Cuando Necesario)

### Cuándo Usar Zustand

- ✅ Form wizard multi-step con estado temporal
- ✅ Carrito de servicios antes de confirmar
- ✅ Preferencias de UI del usuario (tema, idioma)

### Cuándo NO Usar Zustand

- ❌ Datos que vienen del servidor (usar React cache)
- ❌ Filtros de búsqueda (usar search params)
- ❌ Tabs activos (usar search params)
- ❌ Modal abierto/cerrado (usar search params)

### Pattern Correcto

```typescript
import { create } from "zustand";

type CalculatorStore = {
  readonly selectedService: string | null;
  readonly addons: string[];
  selectService: (service: string) => void;
  toggleAddon: (addon: string) => void;
  reset: () => void;
};

export const useCalculator = create<CalculatorStore>((set) => ({
  selectedService: null,
  addons: [],
  selectService: (service) => set({ selectedService: service }),
  toggleAddon: (addon) =>
    set((state) => ({
      addons: state.addons.includes(addon)
        ? state.addons.filter((a) => a !== addon)
        : [...state.addons, addon],
    })),
  reset: () => set({ selectedService: null, addons: [] }),
}));
```

---

## Reglas Relacionadas

Al validar datos o manejar estado, estas reglas son MANDATORIAS:

- **Rule 01**: TypeScript - Zero `any`, strict mode
- **Rule 06**: Error Handling - ActionResult pattern
- **Rule 16**: RSC Patterns - Server vs Client state
