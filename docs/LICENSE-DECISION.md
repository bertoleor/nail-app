# Decisión de licencia — Nail-App
> Parte de: [[README]] · Relacionados: [[PROJECT]]

- Estado: **decidido (2026-09-14)** — MIT
- Commit: `5534e49` (`LICENSE` + `package.json` `"license": "MIT"`)
- Titular: `bertooleor`, "Copyright (c) 2026"

## Justificación (3-5 frases)

MIT es la licencia correcta para Nail-App: el repo está público en GitHub
(`bertooleor/nail-app`), no contiene componentes ni lógica propietaria en esta
etapa de mockup, y su ecosistema de dependencias (Next.js, React, Radix UI,
Zustand, Zod, Tailwind, Supabase — todo MIT/Apache-2.0) es 100% compatible con
una licencia permisiva sin cláusulas copyleft. MIT es también la licencia más
adoptada y reconocible, lo que elimina fricción para que terceros lo usen,
contribuyan o lo forkeen sin consultar. A diferencia de Apache-2.0, no exige
notificaciones de derivados ni cláusula de patentes, un costo administrativo
innecesario para un proyecto sin ambición de portfolio monopólico. AGPL-3.0
choca con el objetivo de adopción abierta (su componente de red obligaría a
publicar el código de cualquier instancia desplegada, tanto la del titular
como la de cada cliente). Una licencia propietaria bloquearía la colaboración
y la adopción, contradiciendo el uso público del repo y el precedente MIT en el
repo hermano KHAL. MIT es reversible: si el usuario luego prefiere Apache-2.0
o una modalidad propietaria, el cambio es una modificación de un solo archivo
sin migración de dependencias.

## Repercusiones de negocio

- Permisiva: cualquiera puede usar, modificar, rediseñar y vender el software
  sin pagar regalías ni revelar su código, respetando la nota de copyright.
- Sin copyleft: no atrae cláusulas de retroadaptación sobre derivados.
- Requiere retener el aviso de copyright/permiso en copias o porciones
  sustanciales.
- El autor mantiene el copyright; nada en MIT cede marca ni patentes.
- Con y sin localidad de jurisdicción, MIT se aplica "AS IS" sin garantías
  (exención de responsabilidad estándar incluida en el texto canónico).

## Pendiente (fuera de esta decisión)

- Redactar **términos de servicio y política de privacidad** antes de cualquier
  deploy público con datos reales; requieren titular legal y jurisdicción
  (es-AR) del usuario.