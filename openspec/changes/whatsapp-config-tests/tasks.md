# Tasks: WhatsApp Config Tests

## Review Workload Forecast

| Field                   | Value     |
| ----------------------- | --------- |
| Estimated changed lines | 30–60     |
| 400-line budget risk    | Low       |
| Chained PRs recommended | No        |
| Suggested split         | single PR |
| Delivery strategy       | single-pr |
| Chain strategy          | pending   |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

## Phase 1: RED — Tests First

- [x] 1.1 Create `__tests__/lib/config/whatsapp.test.ts` (env-set / unset / empty); run focused file and record RED vs GREEN

## Phase 2: GREEN — Fix Only If Gap

- [x] 2.1 If empty-env returns `""`, fix with `||` fallback in `src/lib/config/whatsapp.ts`; otherwise no prod change

## Phase 3: Verify

- [x] 3.1 Focused file green + `npm run test:unit` full green + `npm run typecheck`
- [x] 3.2 Linear ORN-19 to Done with suite evidence; commit + push (`master`)
