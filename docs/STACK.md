# NailApp — Stack (Framework y tecnologías)

> Parte de: [[README]] · Relacionados: [[ARCHITECTURE]]

Fuente: `package.json` + `docs/PROJECT.md` (verificado por lectura directa).

| Capa           | Tecnología                                                                                 | Versión                |
| -------------- | ------------------------------------------------------------------------------------------ | ---------------------- |
| Framework      | Next.js                                                                                    | 16.2.2                 |
| UI             | React                                                                                      | 19.2.4                 |
| Lenguaje       | TypeScript                                                                                 | 5.9 (strict)           |
| Estilos        | Tailwind CSS                                                                               | 4 (+ `tw-animate-css`) |
| Validación     | Zod                                                                                        | 4                      |
| Estado         | Zustand                                                                                    | 5                      |
| Forms          | React Hook Form (+ `@hookform/resolvers`)                                                  | 7 / 5                  |
| Animaciones    | Framer Motion                                                                              | 12                     |
| Iconos         | Lucide React                                                                               | 1.7                    |
| UI base        | Radix UI (dialog, label, select, slot, tabs, toast, tooltip) + CVA + clsx + tailwind-merge | —                      |
| Notificaciones | Sonner                                                                                     | 2                      |
| Fechas         | date-fns                                                                                   | 4                      |
| Testing unit   | Vitest (+ Testing Library, jsdom)                                                          | 4                      |
| Testing E2E    | Playwright                                                                                 | 1.59                   |
| Lint           | ESLint 9.x flat config (18+ plugins)                                                       | 9                      |
| Formato        | Prettier                                                                                   | 3.8                    |
| Hooks/commits  | Husky + lint-staged + commitlint (conventional)                                            | 9 + 16 + 20            |

## Comandos

```bash
npm run dev           # dev server (http://localhost:3000)
npm run build         # production build
npm run start         # production server
npm run lint          # eslint
npm run typecheck     # tsc --noEmit
npm run test:unit     # vitest run
npm run test:e2e      # playwright
npm run test:all      # unit + e2e
```

## Env

Copiar `.env.example` → `.env.local`. Hoy solo gobierna `NEXT_PUBLIC_SITE_URL` y `NEXT_PUBLIC_WHATSAPP_NUMBER`; las vars Supabase/Context7/GitHub son placeholders a futuro.

## MCP servers (`opencode.json`)

supabase (futuro) · sequential-thinking · engram · context7 · github · playwright.
