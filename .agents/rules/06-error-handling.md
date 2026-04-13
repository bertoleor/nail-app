# 06 - Error Handling (Gentleman-Grade)

## Ley Fundamental: Defensive-Programming

El error no es un accidente, es un estado esperado. Manejarlo con elegancia y reportar con precisión.

---

## 1. Jerarquía de Errores (P0)

- **APP-ERROR**: Usar clases personalizadas (`DomainError`, `InfrastructureError`). Prohibido lanzar strings.
- **ACTION-RESULT**: Toda función de frontera (Actions/APIs) debe retornar `{ success: boolean, data?, error? }`.

## 2. User Feedback (P1)

- **USER-FEEDBACK**: Mostrar mensajes de error humanizados, no códigos técnicos crudos.
- **TOAST-NOTIFICATIONS**: Usar `sonner` para notificaciones de error/éxito.

## 3. Checklist de Errores

- [ ] ¿Usa Try/Catch con clase de error personalizada?
- [ ] ¿El usuario recibe feedback claro y accionable?

---

## Reglas Relacionadas

Al manejar errores, estas reglas son MANDATORIAS:

- **Rule 05**: Security - Auth, middleware
- **Rule 30**: Modern Stack - Zod validation, ActionResult
- **Rule 01**: TypeScript - Tipado estricto, zero `any`
