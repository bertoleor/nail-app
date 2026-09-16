# Proposal: WhatsApp Config Tests

## Intent

QA hygiene (deuda-tecnica-plan §1/P2): `src/lib/config/whatsapp.ts`
(`getWhatsAppNumber`, env-overridable fallback) has zero unit coverage.
Lock its contract with tests before Supabase/env work (T-2) touches config.

## Scope

### In Scope

- `__tests__/lib/config/whatsapp.test.ts`: env-set vs fallback vs empty-env cases
- Fix prod code only if a case exposes a real gap

### Out of Scope

- Zod env validation (T-2, separate task)
- Changing the fallback number (business decision, not QA)

## Capabilities

### New Capabilities

- `contact-config`: `getWhatsAppNumber` resolution contract

### Modified Capabilities

- None (additive coverage unless a gap is found)

## Approach

Write the test file first (RED run), implement only on failure.
`npm run test:unit -- __tests__/lib/config/whatsapp.test.ts`, then typecheck.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `__tests__/lib/config/whatsapp.test.ts` | New | Env/fallback resolution cases |
| `src/lib/config/whatsapp.ts` | Modified only if gap | Minimal fix, if RED exposes one |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Env leakage between tests | Low | Save/restore `process.env` in hooks; `vi.resetModules` |

## Rollback Plan

Revert single commit; config behavior unchanged.

## Dependencies

- None

## Success Criteria

- [ ] 3+ assertions green; full unit suite stays 222+ green
- [ ] Linear ORN-19 updated with suite evidence
