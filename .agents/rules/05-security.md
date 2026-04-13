# 05 - Security (Gentleman-Grade)

## Ley Fundamental: Zero-Trust

Asumimos que toda entrada de usuario es maliciosa. Validar, sanitizar y desconfiar por defecto.

---

## 1. Autenticación & Autorización (P0)

- **AUTH-GUARD**: Proteger rutas sensibles en middleware. No confiar solo en la UI.
- **SESSION-OWNERSHIP**: Las sesiones deben verificar identidad antes de operaciones sensibles.

## 2. Seguridad de Datos (P1)

- **SECRET-SAFETY**: Prohibido hardcodear llaves o secretos. Usar `.env.local` validadas con Zod.
- **CSP**: Content Security Policy estricta. Bloquear scripts externos no autorizados.
- **RATE-LIMITING**: Implementar en APIs críticas para prevenir abuso.

## 3. Checklist de Seguridad

- [ ] ¿Middleware protege la ruta? (Obligatorio)
- [ ] ¿No hay secretos en el código?
- [ ] ¿Los datos de usuario están validados con Zod?

---

## Reglas Relacionadas

Al trabajar con seguridad, estas reglas son MANDATORIAS:

- **Rule 06**: Error Handling - Manejo de errores
- **Rule 30**: Modern Stack - Zod validation
