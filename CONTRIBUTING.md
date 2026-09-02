# Contributing to MakeSense

Thanks for your interest in MakeSense. It is a local-first financial calculator
and business model simulator, and the codebase is small, typed, and testable.
This guide keeps contributions consistent with the existing design system.

## Ground rules

- MakeSense is proprietary (all rights reserved). Discussing, reporting bugs,
  and reviewing code is welcome; submitting code is fine too, but any code you
  contribute is used under the repository's license. Contact the maintainer if
  you intend to use the code elsewhere.
- Match the existing visual language (iOS-system-inspired design tokens in
  `src/app/globals.css`). No new ad-hoc colors or hardcoded styles.
- No new dependencies without a clear reason. The stack is deliberately small:
  Next.js, React, TypeScript, Tailwind, Zustand, Dexie, decimal.js, Recharts.

## Development setup

Requirements: Node.js 20 or newer, npm or pnpm.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Verification

Every pull request must pass all four gates:

```bash
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm test             # vitest domain tests
npm run build        # production build
```

A word on lint: the repo intentionally keeps `react-hooks/set-state-in-effect`
warnings out of the diff. If you need to set state from an event handler or a
subscription callback, do it there, not synchronously in an effect body.

## Structure

| Path | Purpose |
|---|---|
| `src/lib/` | Domain engine, registries, pure calculation logic and fixtures |
| `src/components/calculators/widgets/` | Interactive calculator widgets |
| `src/app/calculators/` + `src/app/personal-finance/` | Calculator landing pages |
| `src/app/guides/` + `src/components/guides/` | Educational articles |
| `src/components/site/` | Header, footer, install button, document pages |
| `src/components/workspace/` | The app's workspace tabs |
| `docs/` | FDS, implementation plan, build tracker |

When you add a public page, mirror the existing pattern: unique metadata,
canonical URL, JSON-LD structured data (via `CalculatorShell` or index pages),
an interactive widget, and educational content (formula, example, mistakes,
FAQ). Keep public copy free of em dashes and emojis.

## Pull requests

1. Fork the repo (read-only permissions) and branch from `main`.
2. Make focused commits with conventional messages (`feat:`, `fix:`, `docs:`).
3. Run the four verification gates above.
4. Open a PR describing what changed and why.

## Reporting issues

Include the page or workspace, the exact inputs you used, the numbers you saw,
and what you expected instead. Screenshots help a lot for UI issues.