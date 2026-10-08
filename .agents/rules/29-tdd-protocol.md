# 29 - TDD Protocol (Gentleman-Grade)

## Principio Fundamental

Test primero, código después. Sin excepciones para lógica de negocio.

---

## 1. Ciclo RED-GREEN-REFACTOR

1. **RED**: Escribir un test que falle
2. **VERIFY RED**: Confirmar que falla con el error esperado
3. **GREEN**: Escribir el mínimo código para que pase
4. **VERIFY GREEN**: Confirmar que el test pasa
5. **REFACTOR**: Limpiar el código manteniendo los tests verdes

## 2. Reglas

- **NO production code sin failing test primero**
- **Un test a la vez**: No escribir múltiples tests antes de implementar
- **Tests como documentación**: Los tests deben ser legibles y expresar intención

## 3. Patrones

### Fake It 'Til You Make It

```typescript
// 1. RED: Test que falla
test("calculatePrice returns base price for manicure", () => {
  expect(calculatePrice("manicure")).toBe(3000);
});

// 2. GREEN: Hardcode para pasar
function calculatePrice(service: string): number {
  return 3000;
}

// 3. RED: Segundo test que fuerza implementación real
test("calculatePrice returns different prices per service", () => {
  expect(calculatePrice("manicure")).toBe(3000);
  expect(calculatePrice("semipermanent")).toBe(5000);
  expect(calculatePrice("gel")).toBe(4500);
});

// 4. GREEN: Implementación real
function calculatePrice(service: string): number {
  const prices: Record<string, number> = {
    manicure: 3000,
    semipermanent: 5000,
    gel: 4500,
  };
  return prices[service] ?? 0;
}
```

### Triangulation

Múltiples tests con inputs diferentes fuerzan implementación genérica.

---

## Reglas Relacionadas

Al implementar con TDD, estas reglas son MANDATORIAS:

- **Rule 07**: Testing - Estrategia de testing
- **Rule 01**: TypeScript - Tipado estricto en tests
- **Rule 17**: Code Quality - AAA pattern, legibilidad
