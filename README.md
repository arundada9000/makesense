# MakeSense

Make better business decisions.

MakeSense is a business model simulator for entrepreneurs. Turn a business idea into a mathematical model and understand the economics before spending significant time or money building it. Model revenue, costs, customers, tax, currency, financing, and scenarios in one coherent system, entirely on your own device.

Live: https://makesensebusiness.vercel.app/

## Screenshots

![Dashboard](public/screenshots/dashboard.png)

**Dashboard**: every model's year-one revenue, margin, runway and generated insights in one glance.

![Cash flow workspace](public/screenshots/workspace-cashflow-dark.png)
**Cash flow workspace (dark theme)**: month-by-month inflows, outflows and running balance with loan schedules.

![Models gallery](public/screenshots/models.png)

**Model gallery**: templates and saved models with summary metrics.

![Report](public/screenshots/report.png)

**Printable report**: a share-ready document generated from the model.

![Break-even calculator](public/screenshots/calculator.png)

**Standalone calculators**: twelve free calculators with formulas explained.

## What it does

- Model any business: digital products, SaaS, consulting, e-commerce, marketplaces, enterprise deals, or hybrids.
- Calculate revenue, profit, margins, break-even, ROI, payback, unit economics, CAC, LTV, MRR, ARR, cash flow, and runway from one canonical model.
- Test pricing, simulate conservative to aggressive scenarios, stress-test assumptions with sensitivity tables.
- Plan tax with jurisdiction aware profiles including VAT/GST.
- Compare alternative business models side by side with factual observations.
- Export a printable report or versioned JSON of every model.

The calculation engine uses decimal arithmetic end to end. Every key metric exposes the assumptions and formula behind it. Results are transparent mathematics under your assumptions, never predictions.

## Tech stack

Next.js (App Router), React, TypeScript, Tailwind CSS 4, shadcn/ui patterns on Radix primitives, Motion, Zustand, React Hook Form, Zod, Recharts, decimal.js, Dexie (IndexedDB), Vitest, Playwright.

## Getting started

Requirements: Node.js 20 or newer, npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Other scripts:

```bash
npm run build        # production build
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm test             # vitest domain tests
npm run test:e2e     # playwright suite
```

## Documentation

| Document | Contents |
|---|---|
| docs/FDS.md | Functional design specification |
| docs/IMPLEMENTATION_PLAN.md | Build order and verification gates |
| docs/TRACKER.md | Live build status per feature |
| FEATURES.md | All features with short descriptions |
| docs/CALCULATIONS.md | Formula reference |
| docs/TAX.md | Tax profile architecture and presets |
| docs/CURRENCY.md | Currency and FX handling |

## Privacy

Local first by design. Business models are stored in your browser via IndexedDB and never leave your device. No account required.

## Disclaimer

MakeSense provides financial modeling and tax-planning estimates for informational purposes. Tax rules, exchange rates, and financial outcomes depend on jurisdiction, timing, assumptions, and individual circumstances. It is not legal, tax, accounting, or investment advice.

## License

All rights reserved. Copyright (c) 2026 Arun Neupane. Use of this software requires prior written permission from the author. See LICENSE.

## Author

Arun Neupane, Butwal, Nepal. https://arunneupane.vercel.app
