# 25 - Judgment Day (Gentleman-Grade)

## Principio Fundamental

Después de 2 intentos fallidos de corrección, DETENERSE. No seguir iterando ciegamente.

---

## 1. Loop Protection (Regla de 2)

- Después de 2 iteraciones fallidas de corrección → PARAR
- Preguntar al usuario: "Intento #3 con nueva estrategia, o paramos?"

## 2. AI Judge Protocol

- Para lógica crítica de arquitectura o dominio
- Lanzar 2 jueces en paralelo vía `delegate`
- Si los veredictos difieren → Escalar al usuario inmediatamente

---

## Reglas Relacionadas

Al auditar código crítico, estas reglas son MANDATORIAS:

- **Rule 00**: Behavior - Delegación universal
- **Rule 27**: Systematic Debugging - Debugging estructurado
