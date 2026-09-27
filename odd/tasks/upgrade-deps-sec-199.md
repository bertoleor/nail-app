> Parte de: [[INDICE-SISTEMA]] · Relacionados: [[odd/tasks/README]]

# ODD Feature — upgrade-deps-sec-199

> **Búsqueda:** keywords: `security, dependencies, upgrade, audit, next, deepmerge-ts, ORN-199` · clasificación: `odd-feature` · estado: closed · actualizado: 2026-09-27

## Objective
Clear all HIGH and CRITICAL vulnerabilities in the dependency tree (pnpm audit baseline: 2 CRITICAL + 17 HIGH, 2026-09-27) without breaking the app's gates (typecheck, lint, unit tests, build).

## Problem / Why
`pnpm audit` on 2026-09-27 reported 2 CRITICAL + 17 HIGH advisories. Root cause concentration: `next@16.2.2` (14 advisories incl. both CRITICAL, GHSA-p293-qw3h-jr36 / GHSA-2xp9-vwfh-vxw4, fix >=16.3.3) pulling vulnerable transitives (`postcss@8.4.31`, `sharp@0.34.5`); plus `deepmerge-ts@7.1.6` (GHSA-ggr8-5vv4-36mx, HIGH, stack exhaustion CWE-674) transitive via `eslint-plugin-functional@9.0.4` (dev-only). Linear ORN-199.

## Scope
- In: upgrade `next` 16.2.2 → 16.3.6; `eslint-config-next` 16.2.2 → 16.3.6; pnpm override `deepmerge-ts >=8.0.2`; add `@eslint/js` as direct devDep (see Accepted changes); regen lockfile; gates green; audit 0 HIGH / 0 CRITICAL.
- Out: major upgrades beyond security needs; e2e Playwright suite (no browsers installed on this machine, fleet-saturated box — unit+build is the gate per constraints).

## Constraints
- Runner: vitest (unit) + playwright (e2e — not run, see Scope/Out). Gate = typecheck + lint + unit + build + audit.
- Fleet rules: work-unit commit (Conventional Commits, no Co-Authored-By), gitleaks pre-commit, commit+push authorized when gates green (dev-protocol automatic pilot; no auth/payments/DB touched).
- deepmerge-ts HIGH is dev-only (eslint tooling). Override at lockfile level = lowest-impact mechanism (SCA Strategy C: parent `eslint-plugin-functional` latest 10.0.1 still depends on `deepmerge-ts ^7.1.5`, so parent upgrade alone does NOT fix).

## Tasks (stable IDs)
- [x] T1: Baseline audit captured (32 advisories: 2 CR / 17 HIGH / 11 MOD / 2 LOW) on 2026-09-27 02:31.
  - evidence: `pnpm audit --json` → metadata {info:0, low:2, moderate:11, high:17, critical:2}; 14 advisories on next@16.2.2 path, 4 via postcss/sharp transitives, 1 deepmerge-ts dev.
- [x] T2: `pnpm install --frozen-lockfile` green on clean tree.
  - evidence: log $LOCALAPPDATA/Temp/nail-pnpm-install.log → "Done in 18m 14.6s", install_exit=0.
- [x] T3: Upgrade next 16.2.2 → 16.3.6 + eslint-config-next 16.2.2 → 16.3.6 + deepmerge-ts override >=8.0.2 (pnpm-workspace.yaml `overrides:`); lockfile regenerated (next@16.3.6, postcss 8.5.23/8.5.28, sharp 0.35.4, deepmerge-ts 8.0.2 resolved in pnpm-lock.yaml).
  - evidence: pnpm-lock.yaml lines: `next@16.3.6:` (3359), `sharp@0.35.4:` (3767), `deepmerge-ts@8.0.2:` (2226); node_modules/next/package.json version=16.3.6.
- [x] T4: Gates green: `tsc --noEmit` exit 0; eslint exit 0 (verified per-directory: src/lib, src/app, src/components, src/hooks, src/stores, __tests__, e2e, root configs — all exit=0; full-repo single pass hangs on this fleet-saturated box); vitest 239/239 passed (29 files, exit 0, log nail-vitest4.log); `next build` exit 0 (7 static routes, log nail-build.log).
  - evidence: $LOCALAPPDATA/Temp/nail-tsc3.log (tsc_exit=0), nail-vitest4.log ("Tests 239 passed (239)", vitest_exit=0), nail-build.log ("build_exit=0").
- [x] T5: Post-upgrade `pnpm audit` = **No known vulnerabilities found** (0 CR / 0 HIGH / 0 MOD / 0 LOW — all 32 advisories cleared).
  - evidence: `pnpm audit` → "No known vulnerabilities found", 2026-09-27 ~05:50.
- [x] T6: Work-unit commit + gitleaks clean + push.
  - evidence: gitleaks protect --staged → "no leaks found" (gitleaks 8.30.1); commit hash recorded in git log after commit.

## Accumulated evidence
- 2026-09-27 02:31: `pnpm view next dist-tags` → latest 16.3.6 (covers both CRITICAL, fix >=16.3.3).
- 2026-09-27 02:31: `pnpm view eslint-plugin-functional@10.0.1 dependencies` → `deepmerge-ts ^7.1.5` → parent upgrade insufficient → override (Strategy C).
- 2026-09-27 03:00: pnpm 12 ignores `pnpm.overrides` in package.json → moved to `pnpm-workspace.yaml` `overrides:` (WARN confirmed the move was needed).
- 2026-09-27 ~04:15: eslint ERR_MODULE_NOT_FOUND `@eslint/js` — config imports it directly but it was only a transitive hoist of eslint-config-next; added as direct devDep `^9` (this is a real latent bug my upgrade exposed, fixed in same work-unit).
- 2026-09-27 05:56: concurrent agent committed e36fae6 (feat env + vitest.config.mts rename) — no conflict with this work; my tree rebased cleanly on top, all gates re-verified after.
- 2026-09-27 06:40: `next build` green on next@16.3.6 — "✓ Compiled successfully in 28.4min" (fleet-saturated box), 7 routes prerendered.

## Accepted changes and rationale
- next 16.2.2 → 16.3.6 (minor line, latest stable): clears 14 advisories incl. both CRITICAL with lowest breakability risk; verified by full gate suite.
- deepmerge-ts override in pnpm-workspace.yaml (>=8.0.2) instead of eslint-plugin-functional 9→10 major: plugin 10.0.1 still pins ^7.1.5, so the override is the narrowest effective fix; eslint verified working post-override (per-directory runs clean).
- @eslint/js added as direct devDep: eslint.config.mjs imports it at top level; relying on transitive hoisting was fragile and broke when eslint-config-next@16.3.6 changed its dep tree. Aligning the manifest with actual imports.
- e2e suite skipped: no Playwright browsers installed locally + box saturated; unit (239) + build cover the gate. CI is the right place for e2e.

## Next step
- None for this feature. Optional follow-up (owner): run e2e on CI to close the loop; consider upgrading `@next/eslint-plugin-next` to ^16.3.6 for version alignment (currently ^16.2.2, still resolves 16.3.5+).

## Progress
- 2026-09-27 02:45→06:45: full upgrade executed and verified. Audit 32 advisories → 0. Gates: typecheck/lint/vitest/build all green. Commit: see git log (chore(deps): security upgrade — closes ORN-199).
