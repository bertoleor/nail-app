# 01 - TypeScript (Gentleman-Grade)

## Ley Fundamental: TS-STRICT-ONLY

NAIL-APP opera bajo TypeScript 5.9 strict mode. La seguridad de tipos es binaria: o es total, o es un error.

---

## 1. Prohibiciones Atómicas (P0)

- **NO ANY**: Prohibido `any`, `as any`, `: any`. Uso de `unknown` + estrechamiento de tipos obligatorio para datos externos.
- **NO IGNORE**: Prohibido `@ts-ignore`. Solo se permite `@ts-expect-error` con justificación técnica (issue ID).
- **NO INTERFACES**: Preferencia absoluta por `type` (Discriminated Unions). Solo usar `interface` para tipos extensibles de librerías externas.

## 2. Estándares de Tipado

- **Prop-Safety**: Todas las props deben ser `Readonly<T>`. Evitar mutación de props en componentes.
- **Async-Fidelity**: Todas las funciones async deben tipar explícitamente su `Promise<ActionResult<T>>`.
- **Zod-First**: La validación en la frontera (API/Actions) debe usar Zod para inferencia automática de tipos. No duplicar tipos manualmente.

## 3. Patrones Mandatorios

### 3.1. Const Types Over Unions

Siempre que se necesite una unión de strings/números para un dominio, usar un objeto `as const` y extraer el tipo.

```typescript
// ✅ CORRECTO
const SERVICE_TYPE = {
  MANICURE: "manicure",
  SEMIPERMANENT: "semipermanent",
  GEL: "gel",
  NAIL_ART: "nail_art",
} as const;

type ServiceType = (typeof SERVICE_TYPE)[keyof typeof SERVICE_TYPE];

// ❌ INCORRECTO
type ServiceType = "manicure" | "semipermanent" | "gel" | "nail_art";
```

### 3.2. Flat Interfaces

Mantener interfaces con una profundidad de nivel 1. Los objetos anidados deben referenciarse a otra interface/tipo.

```typescript
// ✅ CORRECTO
type ClientAddress = {
  readonly street: string;
  readonly city: string;
};

type Client = {
  readonly id: string;
  readonly name: string;
  readonly address: ClientAddress;
};

// ❌ INCORRECTO
type Client = {
  readonly id: string;
  readonly address: { street: string; city: string };
};
```

## 4. @ts-expect-error Enforcement

- **PROHIBIDO**: `@ts-ignore` — oculta errores reales
- **PERMITIDO**: `@ts-expect-error` SOLO con issue ID de tracking:

```typescript
// ✅ CORRECTO — con justificación
// @ts-expect-error — library types incomplete: issue #123
const result = someExternalCall(data);

// ❌ INCORRECTO — sin justificación
// @ts-expect-error
const result = someExternalCall(data);
```

## 5. Checklist de Ejecución

- [ ] ¿Hay algún `any`? (Error fatal)
- [ ] ¿Los Server Actions devuelven `ActionResult`?
- [ ] ¿Las props son `Readonly`?
