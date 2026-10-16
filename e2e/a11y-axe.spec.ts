import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * C-06 · Formal axe-core run (baseline: accessibility.config.json).
 *
 * La config de accesibilidad declara overrides de contraste (glassmorphism /
 * high-contrast dark UI) que son decisión de diseño y se preservan como baseline
 * (ADR 0001). La spec inyecta axe-core v4, escanea las rutas públicas clave y
 * falla ante violaciones de severidad grave/crítica, aplicando las excepciones
 * declaradas en accessibility.config.json.
 */

interface ContrastException {
  readonly selector: string;
  readonly reason?: string;
}

interface A11yConfig {
  readonly rules?: {
    readonly "color-contrast"?: {
      readonly exceptions?: readonly ContrastException[];
    };
  };
}

const config = JSON.parse(
  readFileSync(path.resolve(__dirname, "../accessibility.config.json"), "utf8"),
) as A11yConfig;

const contrastExceptions: readonly string[] =
  config.rules?.["color-contrast"]?.exceptions?.map((e) => e.selector) ?? [];

/** Rutas públicas escaneables sin auth (evita /admin y /dashboard). */
const PUBLIC_ROUTES = [
  { path: "/", name: "home" },
  { path: "/calculator", name: "calculator" },
  { path: "/reservar", name: "reservar" },
] as const;

async function runAxe(page: Page) {
  await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
  return page.evaluate(
    async ({ exceptions }) => {
      const axeWin = window as unknown as Window & {
        readonly axe: {
          run: (context?: unknown, options?: object) => Promise<unknown>;
        };
      };
      const results = (await axeWin.axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
      })) as {
        violations: ReadonlyArray<{
          id: string;
          impact: "critical" | "serious" | "moderate" | "minor";
          help: string;
          nodes: ReadonlyArray<{ target: readonly string[]; failureSummary?: string }>;
        }>;
      };

      // Aplica excepciones de contraste declaradas en accessibility.config.json.
      // Cada exception puede ser una lista de selectores separados por coma
      // (se matchea por parte) y un atributo-selector [class*='x'] se matchea
      // por su literal — los targets de axe nunca contienen el selector crudo.
      const exceptionLiterals = exceptions.flatMap((sel) =>
        sel
          .split(",")
          .map((s) => s.trim())
          .map((s) => {
            const attr = /^\[class\*=['"](.+)['"]\]$/.exec(s);
            return attr ? attr[1] : s;
          }),
      );
      const isExcepted = (target: string) =>
        exceptionLiterals.some((sel) => sel.length > 0 && target.includes(sel));

      const filtered = results.violations.filter((v) => {
        if (v.id !== "color-contrast") return true;
        if (exceptions.length === 0) return true;
        return v.nodes.some((n) => !isExcepted(n.target.join(" ")));
      });

      return filtered.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        targets: v.nodes.map((n) => n.target.join(" ")),
      }));
    },
    { exceptions: contrastExceptions },
  );
}

test.describe("a11y · axe-core (formal run, baseline overrides aplicados)", () => {
  // networkidle + primer render en server frío puede superar el default de 30s
  // (observado: 2 timeouts en primer request contra next start recién levantado).
  test.setTimeout(60_000);

  for (const route of PUBLIC_ROUTES) {
    test(`${route.name} (${route.path}) sin violaciones crit/serious`, async ({ page }) => {
      const response = await page.goto(route.path, { waitUntil: "networkidle" });
      expect(response?.status()).toBeLessThan(500);

      const violations = await runAxe(page);

      const critical = violations.filter((v) => v.impact === "critical" || v.impact === "serious");
      expect(critical, JSON.stringify(violations, null, 2)).toEqual([]);
    });
  }
});
