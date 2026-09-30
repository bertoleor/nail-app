# Reporte de Producto, Marketing y Estilo — NailApp
> Parte de: [[README]] · Relacionados: [[dead-dirs-report]]

> Fecha: 2026-09-12 · Autor: subagente (reporte delegado) · Alcance: producto + marketing + estilo
> Fuente: lectura directa de `docs/`, `src/`, `.agents/rules/`, `src/lib/mock/data.ts`.
> Estado: **UNVERIFIED** (no se corrió tsc/lint/build; todo lo aquí descrito es lectura estática del código fuente).
> Nada fue borrado ni modificado salvo la creación de este reporte.

---

## 1. Resumen ejecutivo

NailApp es un **mockup de alta fidelidad** (sin backend real, con datos mock) para **manicuristas argentinas**. El objetivo declarado es **venta/demo**, no producción. Combina dos features core — **calculadora de precios** y **agenda de turnos** — con una estética visual tipo "premium beauty" basada en glassmorphism + fondo animado con partículas (BackgroundMesh).

**Posicionamiento en una frase:** "Sistema de gestión para manicuristas" (tagline literal del home), con dos puertas de entrada por rol: **Soy Clienta** y **Soy Manicurista**.

---

## 2. Producto

### 2.1. Propuesta de valor

| Dimensión | Qué ofrece |
|-----------|-----------|
| Rol clienta | Reservar turno en 4 pasos (datos → servicio → fecha/horario → confirmación), con resumen y envío por WhatsApp. |
| Rol manicurista (admin) | Dashboard con stats del día; agenda con bloqueo de horarios; calculadora para armar presupuestos y enviarlos por WhatsApp; gestión de clientas y servicios. |
| Sin fricción | Sin registro/backend: todo funciona con datos mock (`src/lib/mock/data.ts`) y estado en memoria (Zustand). |

### 2.2. Features actuales (superficie real)

**Páginas/rutas encontradas en `src/app/`:**

| Ruta | Rol | Contenido real |
|------|-----|----------------|
| `/` (home) | público | Elegir "Soy Clienta" → `/reservar` / "Soy Manicurista" → `/admin`. |
| `/reservar` | clienta | Wizard en 4 pasos con selección de servicio (Nuevo/Mantenimiento), extras, fecha/horario, resumen, envío por WhatsApp. |
| `/admin` | manicurista | Dashboard con stats (turnos hoy/semana, pendientes, facturación) + acciones rápidas. |
| `/admin/turnos` | manicurista | Agenda por día: grilla horaria 09:00–18:30, bloqueo de horarios, detalle de turno (confirmar/completar/cancelar). |
| `/admin/calculadora` | manicurista | Presupuesto: clienta + servicio + extras + notas → copiar al portapapeles / WhatsApp / guardar borrador. |
| `/admin/clientas` | manicurista | Lista de clientas (página simple). |
| `/admin/servicios` | manicurista | Lista de servicios con precio/duración. |
| `/admin/bookings` | manicurista | **Placeholder casi vacío** (stats en 0, "No hay turnos registrados") — funcionalidad real duplicada en `/admin/turnos`. |

**Dominio (lógica de negocio pura) en `src/lib/domain/`:**

- `pricing/` → `SERVICES` + `ADDONS` (`constants.ts`), `calculatePrice` / `calculateDuration` / `formatPrice` / `formatDuration` (`calculator.ts`). Precios en **pesos con `$`** vía `formatPrice` del dominio (NAIL-M2: única fuente, antes divergía ARS/`$`).
- `booking/` → `types.ts` (`Booking` básico), `conflict.ts`, `time-utils.ts`.

**Catálogo de servicios (precio base, ARS):**

| Servicio | Nuevo | Mantenimiento | Duración |
|----------|-------|---------------|----------|
| Manicura clásica | $3.500 | $2.500 | 60/45 min |
| Pedicura completa | $4.500 | $3.200 | 90/60 min |
| Uñas acrílicas | $8.000 | $4.500 | 120/60 min |
| Uñas en gel | $7.000 | $4.000 | 90/60 min |
| Esmaltado semipermanente | $3.000 | $2.200 | 45/30 min |

**Add-ons:** diseño artístico ($800), decoración con piedras ($1.200), reforzado extra ($500), reparación de uña ($300), retiro esmaltado anterior ($400).

> Nota de coherencia: existen **dos** catálogos — `src/lib/domain/pricing/constants.ts` (5 servicios, precios antiguos más bajos, usados en `/admin/servicios`) y `src/lib/mock/data.ts` (5 servicios con modelo Nuevo/Mantenimiento + 5 add-ons, usados en casi todo el resto). Ambos conviven sin unificar. Ver §4 (deuda).

### 2.3. Datos mock (verosímiles, rioplatenses)

`src/lib/mock/data.ts` aporta: 6 clientas con nombres y notas realistas (ej. "Prefiere uñas cortas, alérgica a algunos esmaltes acrílicos", "Viene cada 3 semanas para mantenimiento"), 10 turnos con estados (`confirmed`/`pending`/`completed`/`cancelled`), 3 bloqueos de horario ("Curso de capacitación", "Feriado"), 3 presupuestos. Teléfonos en formato `+54 9 11 ...`. Formateo de precio y teléfono con helpers propios (`formatPrice`, `formatPhone`).

### 2.4. Modelo conceptual de negocio

- **Servicio** con precio diferencial por **tipo**: `new` (nuevo) vs `maintenance` (mantenimiento).
- **Add-ons** que suman precio y duración.
- **Turno** con estado y total calculado; **presupuesto/quota** como entidad separada (borrador / guardada / enviada).
- **Bloqueo de horario** como primera clase (para francos, feriados, capacitaciones).
- Canal de cierre: **WhatsApp** (deep link `wa.me` con mensaje formateado) tanto en reserva como en presupuesto.

---

## 3. Marketing

### 3.1. Segmento objetivo

Manicuristas independientes argentinas (profesionales unipersonales, no salones grandes). Lenguaje 100% rioplatense con voseo ("Reservá tu turno", "Armá presupuestos", "Gestióná", "Administrá", "Configurá", "Elegí").

### 3.2. Canales y tacticas ya implementadas en el producto

- **WhatsApp como motor de conversión**: la reserva del cliente termina en un deep link `wa.me/5491112345678` con mensaje preformateado (nombre, tel, servicio, addons, fecha, total). El presupuesto del admin genera texto formateado (con emojis de nail/calendar/money) para copiar o enviar por WhatsApp. Esto es la pieza de marketing más fuerte del mockup: **convierte la demo en una herramienta de venta real**.
- **Tono de marca**: cercano, femenino, con emojis decorativos (💅💰📅👥⚠️📱💖) en la capa visual (aunque la regla 09 prohíbe emojis en *código/documentación*, sí abundan en strings de UI y en el texto de presupuesto).
- **Sin presencia externa**: no hay landing pública, SEO, ni materiales de marca fuera del app en sí. El "marketing" está embebido en el producto.

### 3.3. Gaps de marketing (recomendaciones)

| Gap | Detalle |
|-----|---------|
| POSICIONAMIENTO | No hay diferenciación explícita vs. apps ya existentes de gestión de turnos. El valor "para manicuristas" está implícito, no argumentado. |
| PROOF | Falta una landing o página "acerca de" que explique el valor a la manicurista potencial (ahorra tiempo, evita doble agenda, profesionaliza el presupuesto por WhatsApp). |
| ONBOARDING | El home es funcional (elegir rol) pero no "vende" el producto. |
| DATOS | Sin métricas ni integración para medir conversión de reservas (comprensible: es mockup sin backend). |

---

## 4. Estilo (sistema visual)

### 4.1. Dirección artística

"**Premium-Beauty**": minimalismo cálido y femenino. Base: estética **Portadora de Eros** (proyecto de referencia en el Desktop del usuario), adaptada a manicuría.

### 4.2. Paleta de colores (de `globals.css`)

| Token | Valor | Uso |
|-------|-------|-----|
| `--background` | `#ffffff` | Fondo base |
| `--foreground` | `#1d1d1f` | Texto principal |
| `--muted-foreground` | `#86868b` | Texto secundario |
| `--border` / `--input` | `#e5e5ea` | Bordes |
| `--destructive` | `#ff3b30` | Errores por defecto |
| `--primary` | `#1d1d1f` | Botones shadcn (negro) |

**Acentos usados en la UI** (via Tailwind): `pink` (rosa, constante en botones/badges/selección), `rose`, `purple`, `blue`, `amber`, `green`, `red` — en dosis suaves (`bg-pink-50`, `border-pink-500`, `text-pink-500/600`). El **rosa** es el color de marca de facto.

### 4.3. Glassmorphism system

Implementado como tokens CSS + clases utilitarias:

| Clase | Fondo | Blur | Borde |
|-------|-------|------|-------|
| `.glass` | `rgba(255,255,255,.25)` | 20px | `1px rgba(255,255,255,.4)` |
| `.glass-opaque` | `rgba(255,255,255,.45)` | 24px | `1px rgba(255,255,255,.5)` |
| `.glass-subtle` | `rgba(255,255,255,.15)` | 20px | `1px rgba(255,255,255,.25)` |
| `.glass-dark` | `rgba(10,10,20,.45)` | 20px | `1px rgba(255,255,255,.12)` |
| `.glass-pill` | `rgba(255,255,255,.35)` | 12px | `1px rgba(255,255,255,.55)` |
| `.skeleton-glass` | gradiente animado | 8px | `1px rgba(255,255,255,.2)` |

Con fallback `@supports not (backdrop-filter: blur(1px))` a fondos opacos, y texto con clases `glass-text-primary/secondary/muted` (nunca blanco puro sobre glass claro).

### 4.4. Botones glass

- **`.btn-primary`**: blur(20px) saturate(1.4), borde `rgba(255,255,255,.6)`, `rounded-full`, uppercase, tracking 0.13em, con **textura de ruido SVG** (`feTurbulence`, `mix-blend-mode: soft-light`). Hover eleva 1px.
- **`.btn-outline`**: transparente, borde `rgba(15,15,20,.16)`, uppercase, tracking 0.12em.

> Nota: junto al sistema glass conviven componentes **shadcn** (`button.tsx` con CVA, `card`, `badge`, `select`, `dialog`, `input`) que usan la paleta `--primary` negra y no el estilo glass. Hay **dos lenguajes de botón coexistendo** (glass `.btn-primary` del home vs shadcn `<Button>` del admin). Ver §4.8.

### 4.5. Fondo dinámico — BackgroundMesh

Canvas (`src/components/client/BackgroundMesh.tsx`) con partículas que se mueven lentamente, crossfade entre 4 pares de color: menta/amarillo, celeste/violeta, rosa/naranja, periwinkle/menta. Config: velocidad 0.55, ~7s por par, crossfade ~1.5s, respiración 0.12/0.003, opacidad 0.55. Correctamente accesible: `aria-hidden`, `tabIndex=-1`, respeta `prefers-reduced-motion`.

### 4.6. Tipografía

- **Geist** (sans) → body, UI, botones.
- **Playfair Display** (serif) → títulos (`font-serif`).
- Pesos ligeros por defecto: body `font-weight: 300`, headings `weight 400`/h1 `300`. Regla: prohibido `font-bold` (usar `font-medium` máximo).

### 4.7. Espaciado y forma

- Padding horizontal `px-[5%]`; cards `p-[30px]`, `rounded-[24px]` (en diseño de referencia).
- Botones `13px 28px` (primary) / `12px 24px` (outline), `min-height: 46px`.
- Scrollbar invisible globalmente.
- Radius base `--radius: 1rem` (shadcn), escalas `radius-sm`…`radius-4xl`.

### 4.8. Hallazgos de coherencia de estilo (deuda visual)

1. **Doble catálogo de precios** (domain/constants vs mock/data) con valores distintos → riesgo de mostrar precios inconsistentes.
2. **Doble sistema de botones** (glass vs shadcn) sin regla clara de cuándo usar cada uno.
3. **Emojis en UI** (💅💰📅👥⚠️📱 en dashboard y strings) contradicen la estética "premium minimalista" y la regla 09 (que solo prohíbe emojis en código/doc, pero deja ambigua la UI). Los presupuestos generados por WhatsApp usan emojis deliberadamente (marketing).
4. **`/admin/bookings` redundante**: implementa una segunda agenda casi vacía mientras `/admin/turnos` tiene la funcionalidad real. Confunde al evaluar el producto.
5. **Colores hardcodeados** `rgba(15,15,20,x)` repetidos en JSX podrían estar en tokens (la regla 02 pide CSS variables; `globals.css` ya los define, pero las páginas usan literales).

---

## 5. Estado vs. documentación

El `docs/PROJECT.md` describe la app como proyecto en fase inicial (calculadora y agenda "pendientes"), pero el código actual (`src/`) ya tiene **ambas features implementadas con UI completa**. El `AGENTS.md` y `NAIL-APP.context.md` marcan features como `[ ] pendiente`, desactualizados respecto al código real. Esto es deuda de documentación: los docs no reflejan el estado real del mockup.

---

## 6. Deuda técnica consolidada (referencia)

La deuda técnica global **ya está consolidada** en `docs/plans/deuda-tecnica-plan.md` (creado en la auditoría nocturna 2026-09-12) y reflejada en `E:/Hermes/docs/reports/general-nailapp.md`. Este reporte de producto/marketing/estilo **agrega** deuda específica de capa de negocio no cubierta por el plan técnico:

| # | Deuda (capa negocio/estilo) | Prioridad sugerida |
|---|------------------------------|--------------------|
| N-1 | Doble catálogo de precios sin unificar (domain/constants vs mock/data) | P1 |
| N-2 | Doble sistema de botones (glass vs shadcn) sin regla de uso | P2 |
| N-3 | `/admin/bookings` redundante vs `/admin/turnos` | P2 |
| N-4 | Docs desactualizados (features marcadas "pendientes" ya implementadas) | P2 |
| N-5 | Colores `rgba()` hardcodeados en JSX vs tokens CSS | P2 |
| N-6 | WhatsApp de reserva apunta a número hardcodeado (`5491112345678`) | P1 (rompe demo si cambia) |
| N-7 | Emojis en UI ambigüos respecto a estética premium | P2 (decisión de marca) |

> Los 6 reportes "hermanos" mencionados en el contexto de la tarea no fueron localizados como archivos en `E:/Hermes/docs/reports/` (solo existe `general-nailapp.md`). La consolidación de deuda técnica global quedó ya realizada en `docs/plans/deuda-tecnica-plan.md`; este reporte se integra como complemento de capa producto/marketing/estilo sin duplicarla.

---

## 7. Veredicto

**Producto**: mockup de alta fidelidad funcional y coherente para demo/venta; el valor real de venta es el **cierre por WhatsApp**. **Marketing**: embedded (voseo + WhatsApp), sin presencia externa ni argumentación de valor. **Estilo**: sistema visual "premium-beauty" bien definido y documentado, con inconsistencias de implementación (doble botón, doble catálogo, emojis).

Todo lo anterior es **UNVERIFIED** (lectura estática; sin tsc/lint/build corridos).