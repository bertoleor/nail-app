// @vitest-environment node
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const SRC_DIR = path.resolve(__dirname, "../../../src");
const APP_DIR = path.join(SRC_DIR, "app");

function readSource(relPath: string): string {
  return readFileSync(path.join(SRC_DIR, relPath), "utf8");
}

function existingAdminRoutes(): Set<string> {
  const routes = new Set<string>(["/admin"]);

  const adminDir = path.join(APP_DIR, "admin");
  for (const entry of readdirSync(adminDir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const hasPage = readdirSync(path.join(adminDir, entry.name)).includes(
        "page.tsx",
      );
      if (hasPage) routes.add(`/admin/${entry.name}`);
    }
  }

  for (const entry of readdirSync(APP_DIR, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name.startsWith("(")) {
      const groupAdmin = path.join(APP_DIR, entry.name, "admin");
      try {
        for (const nested of readdirSync(groupAdmin, {
          withFileTypes: true,
        })) {
          if (
            nested.isDirectory() &&
            readdirSync(path.join(groupAdmin, nested.name)).includes("page.tsx")
          ) {
            routes.add(`/admin/${nested.name}`);
          }
        }
      } catch {
        // route group without nested admin segment
      }
    }
  }

  return routes;
}

function extractAdminHrefs(source: string): string[] {
  const hrefs: string[] = [];

  const objectLiteral = /href:\s*"\/admin[^"]*"/g;
  for (const match of source.matchAll(objectLiteral)) {
    hrefs.push(match[0].slice('href: "'.length, -1));
  }

  const jsxAttribute = /href="\/admin[^"]*"/g;
  for (const match of source.matchAll(jsxAttribute)) {
    hrefs.push(match[0].slice('href="'.length, -1));
  }

  return hrefs.map((href) => href.split("?")[0]);
}

describe("Admin navigation routes contract (NAIL-H1)", () => {
  const NAV_SOURCES = [
    "components/admin/admin-sidebar.tsx",
    "app/admin/page.tsx",
  ];

  it("every admin nav href resolves to an existing App Router page", () => {
    const routes = existingAdminRoutes();
    expect(routes.size).toBeGreaterThan(1);

    for (const source of NAV_SOURCES) {
      const hrefs = extractAdminHrefs(readSource(source));
      expect(hrefs.length).toBeGreaterThan(0);

      const missing = hrefs.filter((href) => !routes.has(href));
      expect(
        missing,
        `${source} links to non-existent routes: ${missing.join(", ")}`,
      ).toEqual([]);
    }
  });

  it("Servicios is reachable: sidebar href has a real page (NAIL-H1 acceptance)", () => {
    const sidebar = readSource("components/admin/admin-sidebar.tsx");
    const match = sidebar.match(/href:\s*"\/admin\/(servicios|services)"/);

    expect(match, "sidebar must link a Servicios catalog").not.toBeNull();

    const routes = existingAdminRoutes();
    const href = match![0].slice('href: "'.length, -1);
    expect(
      routes.has(href),
      `sidebar Servicios href ${href} must match an existing route (found: ${[...routes].join(", ")})`,
    ).toBe(true);
  });
});
