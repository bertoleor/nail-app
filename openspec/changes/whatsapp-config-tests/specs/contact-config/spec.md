# Contact Config Specification

## Purpose

Resolution contract for `getWhatsAppNumber()` in `src/lib/config/whatsapp.ts`.

## Requirements

### Requirement: Env Override

The system MUST return `NEXT_PUBLIC_WHATSAPP_NUMBER` when it is set to a
non-empty value.

#### Scenario: Number configured

- GIVEN `NEXT_PUBLIC_WHATSAPP_NUMBER="5491100000000"`
- WHEN `getWhatsAppNumber()` runs
- THEN it returns `"5491100000000"`

### Requirement: Fallback Default

The system MUST return the fallback `5491112345678` when the variable is
unset or empty.

#### Scenario: Variable unset

- GIVEN the variable is deleted from `process.env`
- WHEN `getWhatsAppNumber()` runs
- THEN it returns `"5491112345678"`

#### Scenario: Variable empty

- GIVEN the variable is `""`
- WHEN `getWhatsAppNumber()` runs
- THEN it returns the fallback (never `""`)
