# 27 - Systematic Debugging (Gentleman-Grade)

## Principio Fundamental

No adivinar. Seguir un proceso estructurado para encontrar la raíz del problema.

---

## 1. Protocolo de Debugging

1. **Reproducir**: Confirmar que el bug es reproducible consistentemente
2. **Aislar**: Reducir al mínimo caso que reproduce el error
3. **Hipótesis**: Formular una hipótesis basada en evidencia, no en intuición
4. **Verificar**: Testear la hipótesis con datos concretos
5. **Corregir**: Aplicar el fix mínimo
6. **Prevenir**: Agregar test que cubra este caso

## 2. Herramientas

- **Console**: Solo para debugging temporal, eliminar antes de commit
- **React DevTools**: Inspeccionar árbol de componentes y estado
- **Network Tab**: Verificar requests y responses
- **Vitest**: Tests unitarios para aislar lógica

## 3. Anti-Patterns

- ❌ "Probemos cambiando esto a ver si funciona"
- ❌ Agregar console.log y commitear
- ❌ Fixear síntomas en lugar de la causa raíz
- ✅ "El error dice X, el código hace Y, la diferencia es Z"

---

## Reglas Relacionadas

Al debuggear, estas reglas son MANDATORIAS:

- **Rule 01**: TypeScript - Zero `any`, strict mode
- **Rule 07**: Testing - Tests para prevenir regresiones
- **Rule 09**: No AI Traces - Limpiar console.log antes de commit
