# Skill Registry — nail-app

> Auto-generated skill registry for the nail-app project.

## Compact Rules

### react-19
- React 19 patterns with React Compiler
- No manual useMemo/useCallback
- ref as standard prop (no forwardRef)
- Named imports from React only
- useActionState replaces useFormState

### nextjs-15
- Next.js App Router patterns
- Server Components by default
- 'use client' only for interactivity
- params/searchParams are Promises in Next.js 15+
- cookies()/headers() require await

### typescript
- Strict mode, zero any
- Prefer type over interface
- Readonly props
- Const types over unions
- Flat interfaces (max depth 1)

### tailwind-4
- Tailwind CSS 4 native patterns
- No arbitrary values [#hex]
- Use CSS variables for colors
- Mobile-first responsive

### zod-4
- Schema validation at boundaries
- Infer types from schemas
- safeParse for error handling
- No manual type duplication

### zustand-5
- State management only when strictly needed
- Prefer server state and URL state
- Immutable updates with set()
- No Zustand for filters/tabs/modals (use search params)

### playwright
- E2E testing patterns
- Page Object Model
- Test critical user flows
- Deterministic assertions

### vitest
- Unit and component testing
- AAA pattern (Arrange, Act, Assert)
- Mock infrastructure, not logic
- 90% coverage target for domain logic

### test-driven-development
- RED-GREEN-REFACTOR cycle
- Fake It 'Til You Make It
- Triangulation for generic implementations
- No production code without failing test

### systematic-debugging
- Reproduce, Isolate, Hypothesize, Verify, Fix, Prevent
- No guessing, evidence-based debugging
- Clean up console.log before commit

### frontend-design
- Production-ready UI components
- Atomic design principles
- Accessibility-first approach

## User Skills Triggers

| Skill | Trigger |
|-------|---------|
| react-19 | Writing React components |
| nextjs-15 | Working with Next.js routing, Server Actions |
| typescript | Writing TypeScript code |
| tailwind-4 | Styling with Tailwind |
| zod-4 | Using Zod for validation |
| zustand-5 | Managing React state |
| playwright | Writing E2E tests |
| vitest | Writing unit tests |
| test-driven-development | Before implementing any feature |
| systematic-debugging | Finding bugs, failing tests |
| frontend-design | Creating UI components |
| sdd-* | SDD workflow phases |
| skill-creator | Creating new skills |
| find-skills | Discovering skills |
