# Changelog — nail-app

> **Busqueda:** keywords: `changelog, releases, nail-app` · clasificacion: `changelog` · estado: canonico · actualizado: 2026-10-20

## [Unreleased]

- 2026-10-16 **feat(reservar): persist booking + validate availability (NAIL-H3)** — the wizard's handleSubmitBooking only did setShowSuccess(true): the confirmation showed "¡Reserva enviada!" without saving anything and without checking availability. Now checkAvailability (conflict / blocked slot / business hours, same gate as the admin dialog) runs on submit; on failure renders a role=alert error per reason and persists nothing. Client (addClient) and booking (addBooking, status pending, totalPrice/duration from the domain calculator) land in the persisted useAppStore. Dialog copy is truthful now ("¡Reserva registrada!"); WhatsApp flow unchanged. Tests: 5 user-journey cases RED→GREEN, suite 269/269. (5383ba5)
- 2026-10-16 **test(a11y): axe-core e2e spec + baseline config (C-06)** — axe-core@4.13.0 as explicit devDep (was only transitive; require.resolve failed from root), a11y spec in e2e/ + accessibility.config.json baseline. (0f507e1)
- 2026-10-17 **feat(ci): design-qa gate (ORN-206)** — .github/workflows/design-qa.yml for the visual design QA gate; prettier ignore adjusted. Merged via PR #2. (34a22a5)
- 2026-10-18 **feat(arsenal): full quality arsenal — semgrep SAST, pr-agent AI review, knip, jscpd, cspell** — replicated from khal's validated pilot (blocking SAST); pr-agent model via NVIDIA OpenAI-compatible endpoint. Follow-up c4ce0b4 prettier-formats copied arsenal files to fix the CI format check. (0c67f61)
- 2026-10-19 **fix(deps): drop unresolvable pnpm overrides — restore frozen-lockfile install** — precommit-smoke commit added overrides brace-expansion ^5.0.12, braces ^3.0.4 and deepmerge-ts ^8.0.0 without regenerating pnpm-lock.yaml; braces@^3.0.4 was never published, so every CI job died at pnpm install --frozen-lockfile with ERR_PNPM_LOCKFILE_CONFIG_MISMATCH. Restored package.json to the 3-override state CI validated green on c4ce0b4. (189319a)
- 2026-09-25: changelog iniciado (P17 doctrina — flota Hermes). Historia previa: ver git log.
