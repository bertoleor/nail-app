# SDD Specification — Fix Critical Issues

## Metadata
- **Topic Key**: `sdd/fix-critical-issues/spec`
- **Proposal Reference**: `sdd/fix-critical-issues/proposal`
- **Status**: Draft
- **Created**: 2026-04-13

---

## 1. ESLint Configuration Fix

### Problem Statement
`npm run lint` fails with error:
```
Error while loading rule '@typescript-eslint/await-thenable': 
You have used a rule which requires type information, but don't have 
parserOptions set to generate type information for this file.
```

### Root Cause
The ESLint config (`eslint.config.mjs`) uses `strictTypeChecked` and `stylisticTypeChecked` rulesets from typescript-eslint. These rules require type information, but:
1. The config file itself is being linted (line 22-141)
2. `__tests__/` is in ignores but may still be processed for type-checking
3. The `parserOptions.projectService: true` needs a valid tsconfig reference

### Acceptance Criteria
- [ ] `npm run lint` exits with code 0, 0 errors, 0 warnings
- [ ] ESLint processes all `.ts/.tsx` files without crashing
- [ ] Type-checked rules work correctly for source files

### Implementation Approach
**Option A (Recommended)**: Create `tsconfig.eslint.json`
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": true
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "eslint.config.mjs"
  ],
  "exclude": ["node_modules"]
}
```

Then update `eslint.config.mjs`:
```javascript
parserOptions: {
  project: "./tsconfig.eslint.json",
  tsconfigRootDir: import.meta.dirname,
}
```

### Files Affected
- `eslint.config.mjs` (modify)
- `tsconfig.eslint.json` (create)

---

## 2. TypeScript Errors in Tests

### Problem Statement
`npm run typecheck` shows 6 errors:
1. `detect.test.ts` (lines 24, 31, 40, 47, 54): Partial mocks not assignable to `BrowserInfo`
2. `setup.ts` (line 26): Incorrect `CSS.supports` mock typing

### Root Cause Analysis

**detect.test.ts**: Tests use partial objects as mocks:
```typescript
const mobileBrowser = { isMobile: true } as const;
const result = getOptimalAnimationDuration(mobileBrowser);
```

The function expects `BrowserInfo` type with 7+ required properties.

**setup.ts**: Mock signature mismatch - `CSS.supports` has two overloads.

### Acceptance Criteria
- [ ] `npm run typecheck` exits with code 0
- [ ] `npx tsc --noEmit` shows 0 errors
- [ ] All tests compile without TypeScript errors

### Implementation Approach

**Step 1**: Create mock helper in `__tests__/lib/browser/test-utils.ts`:
```typescript
import type { BrowserInfo } from "@/lib/browser/detect";

const DEFAULT_BROWSER: BrowserInfo = {
  isSafari: false,
  isFirefox: false,
  isChrome: true,
  isMobile: false,
  isIOS: false,
  supportsBackdropFilter: true,
  prefersReducedMotion: false,
};

export function createMockBrowser(overrides: Partial<BrowserInfo> = {}): BrowserInfo {
  return { ...DEFAULT_BROWSER, ...overrides };
}
```

**Step 2**: Update `detect.test.ts` to use `createMockBrowser()`.

**Step 3**: Fix `setup.ts` mock to handle both overloads.

### Files Affected
- `__tests__/lib/browser/test-utils.ts` (create)
- `__tests__/lib/browser/detect.test.ts` (modify)
- `__tests__/setup.ts` (modify)

---

## 3. Zustand Store Tests Fix

### Problem Statement
5 tests fail with "Maximum update depth exceeded":
- `useBookingsByDate > returns bookings for specific date`
- `useBookingsByDate > filters out cancelled bookings`
- `useBookingsByClient > returns all bookings for a client`
- `useTodayStats > calculates today stats correctly`
- `useClientHistory > calculates client history correctly`

### Root Cause Analysis
The derived hooks use selectors that return new object references on every render, causing infinite re-renders.

### Acceptance Criteria
- [ ] `npm test` shows 222/222 passing
- [ ] No "Maximum update depth exceeded" errors
- [ ] Derived hooks use shallow comparison for arrays

### Implementation Approach

**Step 1**: Import `useShallow` from zustand:
```typescript
import { useShallow } from "zustand/react/shallow";
```

**Step 2**: Update derived hooks in `app-store.ts`:
```typescript
export function useBookingsByDate(date: string) {
  return useAppStore(
    useShallow((state) => 
      state.bookings.filter(b => b.date === date && b.status !== "cancelled")
    )
  );
}
```

### Files Affected
- `src/stores/app-store.ts` (modify)
- `__tests__/stores/app-store.test.ts` (verify passes)

---

## 4. LazyMotion Configuration

### Problem Statement
Rule 02 states Framer Motion LazyMotion should be used, but it's not configured.

### Options Analysis

**Option A**: Configure LazyMotion wrapper (complies with current rule)
**Option B**: Update rule to use tw-animate-css (simpler, aligns with Tailwind 4)

### Acceptance Criteria
- [ ] LazyMotion wraps app in layout.tsx OR
- [ ] Rule 02 is updated to reflect tw-animate-css usage
- [ ] Animations work correctly after change

### Files Affected
- `src/app/providers.tsx` (create if Option A)
- `src/app/layout.tsx` (modify if Option A)
- `.agents/rules/02-design-system.md` (modify if Option B)

---

## 5. Error Boundaries Implementation

### Problem Statement
No error boundaries exist in the application.

### Acceptance Criteria
- [ ] `src/app/global-error.tsx` exists
- [ ] `src/app/error.tsx` exists
- [ ] `src/app/calculator/loading.tsx` exists
- [ ] `src/app/agenda/loading.tsx` exists
- [ ] Error boundaries show user-friendly messages
- [ ] Retry button available for recoverable errors

### Files Affected
- `src/app/global-error.tsx` (create)
- `src/app/error.tsx` (create)
- `src/app/calculator/loading.tsx` (create)
- `src/app/agenda/loading.tsx` (create)
- `src/app/calculator/_components/calculator-skeleton.tsx` (create)
- `src/app/agenda/_components/agenda-skeleton.tsx` (create)

---

## Summary Matrix

| Issue | Root Cause | Fix Location | Priority |
|-------|------------|--------------|----------|
| ESLint | Missing tsconfig for type-checked rules | `tsconfig.eslint.json` | P0 |
| TypeScript Tests | Partial mocks without full type | `__tests__/lib/browser/test-utils.ts` | P0 |
| Zustand Tests | Missing useShallow for derived hooks | `src/stores/app-store.ts` | P0 |
| LazyMotion | Missing config OR rule update | `providers.tsx` or rule 02 | P1 |
| Error Boundaries | No error handling | `global-error.tsx`, `error.tsx` | P1 |

---

## Verification Commands

```bash
npm run lint        # Must exit 0
npm run typecheck   # Must exit 0
npm test -- --run   # Must show 222/222 passing
```

---

## Dependencies Between Tasks

All tasks are independent and can be implemented in parallel.

---

## Rollback Plan

Each fix is independent. If any fix causes regression:
1. ESLint: Revert `tsconfig.eslint.json`
2. TypeScript Tests: Use `as unknown as BrowserInfo` as temporary fix
3. Zustand: Revert to original hooks without useShallow
4. Error Boundaries: Remove created files
5. LazyMotion: Remove provider or revert rule change
