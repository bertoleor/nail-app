# 07 - Testing (Gentleman-Grade)

## Ley Fundamental: Test-Driven

Código sin tests es código roto. La lógica de negocio y los tests son inseparables.

---

## 1. Estrategia de Testing (P0)

- **VITEST-UNIT**: 90% de cobertura en lógica de dominio (calculadora de precios, validaciones).
- **PLAYWRIGHT-E2E**: Flujos críticos (reserva, calculadora) testeados en Chrome/Firefox.
- **MOCK-INFRA**: Mockear APIs y DB en tests unitarios. No tocar la red ni el disco.

## 2. Calidad de Tests (P1)

- **AAA-PATTERN**: Arrange, Act, Assert. Mantener tests legibles y atómicos.

## 3. Patrones de TDD (P0)

### Fake It 'Til You Make It

1. Escribir el test con el resultado esperado
2. Hardcodear el return para que pase (GREEN)
3. Agregar más tests que fuercen la implementación real
4. Reemplazar el hardcode con lógica real

### Triangulation

Usar múltiples tests con inputs diferentes para forzar la implementación genérica:

```typescript
expect(calculatePrice("manicure", false)).toBe(3000);
expect(calculatePrice("semipermanent", true)).toBe(5500);
expect(calculatePrice("gel", false)).toBe(4500);
// Tres tests fuerzan una implementación real, no un hardcode
```

### Query Priority (Testing Library)

Orden de preferencia para selectores:

1. `getByRole` — verifica accesibilidad
2. `getByLabelText` — verifica labels
3. `getByText` — contenido visible
4. `getByTestId` — último recurso

### Page Object Model (E2E)

```typescript
// e2e/pages/calculator.page.ts
class CalculatorPage {
  constructor(private page: Page) {}
  async selectService(service: string) { ... }
  async toggleAddons(addons: string[]) { ... }
  async getTotal() { ... }
}
```

## 4. Cobertura Diferenciada

| Tipo                  | Target     | Crítico              |
| --------------------- | ---------- | -------------------- |
| Utilities/Hooks       | 90%+       | < 80%                |
| Components            | 85%+       | < 70%                |
| E2E (flujos críticos) | 5-10 tests | Calculadora, Reserva |

## 5. Checklist de Testing

- [ ] ¿El test cubre el Edge Case?
- [ ] ¿Es determinista?
- [ ] ¿Pasa en CI antes del commit?

---

## Reglas Relacionadas

Al escribir tests, estas reglas son MANDATORIAS:

- **Rule 27**: Systematic Debugging - Si hay bugs en tests
- **Rule 29**: TDD Protocol - RED-GREEN-REFACTOR obligatorio
- **Rule 01**: TypeScript - Tipado estricto en tests
- **Rule 17**: Code Quality - AAA pattern, legibilidad
