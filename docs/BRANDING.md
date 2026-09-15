# NailApp — Branding e identidad visual

Dirección: **"Premium-Beauty"** — minimalismo cálido y femenino, basada en la estética **Portadora de Eros**. Fuente de verdad de tokens: `src/app/globals.css`. Detalle histórico: `docs/PROJECT.md` + `docs/reports/producto-marketing-estilo.md` §4.

## Paleta

| Token | Valor | Uso |
|-------|-------|-----|
| `--background` | `#ffffff` | fondo base |
| `--foreground` / `--primary` | `#1d1d1f` | texto / botones shadcn (negro) |
| `--muted-foreground` | `#86868b` | texto secundario |
| `--border` / `--input` | `#e5e5ea` | bordes |
| `--destructive` | `#ff3b30` | errores |
| `--secondary` / `--accent` | `#f2f2f7` | superficies suaves |
| `--radius` | `1rem` | radio base |
| Body sobre mesh | `#f8f9fb` | fondo del body |

**Acento de marca de facto: rosa** (`pink`/`rose` en dosis suaves: `bg-pink-50`, `border-pink-500`, `text-pink-500/600`).

## Glassmorphism

| Clase | Fondo | Blur | Borde |
|-------|-------|------|-------|
| `.glass` | `rgba(255,255,255,0.25)` | 20px | `rgba(255,255,255,0.4)` |
| `.glass-opaque` | `rgba(255,255,255,0.45)` | 24px | `rgba(255,255,255,0.5)` |
| `.glass-subtle` | `rgba(255,255,255,0.15)` | 20px | `rgba(255,255,255,0.25)` |
| `.glass-dark` | `rgba(10,10,20,0.45)` | 20px | `rgba(255,255,255,0.12)` |
| `.glass-pill` | `rgba(255,255,255,0.35)` | 12px | `rgba(255,255,255,0.55)` |

Fallback sin `backdrop-filter` a fondos opacos; texto sobre glass con `glass-text-*` (nunca blanco puro sobre glass claro).

## Botones

- **`.btn-primary`** (glass): `blur(20px) saturate(1.4)`, `rounded-full`, uppercase, tracking `0.13em`, textura de ruido SVG (`soft-light`), padding `13px 28px`.
- **`.btn-outline`**: transparente, borde `rgba(15,15,20,0.16)`, uppercase, tracking `0.12em`, padding `12px 24px`.
- Conviven con shadcn `<Button>` (negro) en el admin — sin regla de uso definida (deuda visual).

## Fondo dinámico (BackgroundMesh)

Canvas `src/components/client/BackgroundMesh.tsx`: partículas lentas con crossfade entre 4 pares (menta/amarillo, celeste/violeta, rosa/naranja, periwinkle/menta). Velocidad `0.55`, ~7s por par, crossfade ~1.5s, opacidad `0.55`. Accesible: `aria-hidden`, respeta `prefers-reduced-motion`.

## Tipografía

- **Geist** (sans): body, UI, botones. **Playfair Display** (serif): títulos.
- Pesos ligeros: body `300`, headings `400`/h1 `300`. Prohibido `font-bold` (máx `font-medium`).

## Forma y espaciado

Padding horizontal `px-[5%]`; cards `p-[30px]`, `rounded-[24px]`; botones `min-height: 46px`; scrollbar invisible global.

## Voz de marca

Español rioplatense con voseo ("Reservá", "Armá", "Elegí"), tono cercano y femenino. Emojis decorativos en UI/WhatsApp (💅📅💰) — decisión de marca pendiente de cierre (contraste con estética premium minimalista).
