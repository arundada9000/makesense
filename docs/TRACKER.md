# MakeSense Build Tracker

Updated after each verified feature. Mark status: Done, In Progress, Blocked, Not Started.

Last updated: 2026-08-22

---

## Phase 0: Repository and Planning

| Item | Status | Notes |
|---|---|---|
| FDS document | Done | docs/FDS.md |
| Implementation plan | Done | docs/IMPLEMENTATION_PLAN.md |
| Tracker | Done | this file |
| Feature list | Done | FEATURES.md |
| LICENSE (all rights reserved) | Done | LICENSE rewritten as all rights reserved |
| .gitignore + git init + first commit | Done | commit e5a8b9f then scaffold commit |
| README | Done | setup, stack, privacy, disclaimer |

## Phase 1: Domain Engine

| Item | Status | Notes |
|---|---|---|
| Money, currency registry, percentage primitives | Done | decimal.js based, largest-remainder allocate |
| Revenue engine | Done | streams, MRR/ARR/ARPU, usage and commission types |
| Cost engine | Done | frequency normalization, per-order conversion |
| Customer growth projections | Done | fixed, percent, custom, churn first, market cap |
| Profit waterfall and margins | Done | tax with loss carryforward |
| Unit economics | Done | contribution, CAC, LTV with manual override, payback |
| Break-even suite | Done | customers, revenue, investment recovery, progress |
| ROI and payback | Done | cumulative series |
| Cash flow | Done | debt service, founder drawings, runway guards |
| Debt amortization | Done | level payment schedule, zero interest split |
| Canonical model types and defaults | Done | templates for SaaS, micro-payment, enterprise |
| Scenario engine | Done | override application, comparison rows |
| Sensitivity tables | Done | two-variable grid re-running full engine |
| Tax/VAT calculators | Done | VAT breakdown, position, corporate estimate |
| Currency/FX | Done | rate table, conversion preserving originals, scenarios |
| Insights generator | Done | deterministic observations only |
| Vitest domain test suite | In Progress | primitives/customers/costs/revenue/profit/unit/breakeven/roi/debt written, tax+scenario next, run pending |

## Phase 2: Core Application

| Item | Status | Notes |
|---|---|---|
| Design tokens and theme system (7 themes) | Pending | |
| App shell: sidebar, mobile bottom nav | Pending | |
| Dexie persistence layer | Pending | |
| Model CRUD with templates and examples | Pending | |
| Model editor forms | Pending | RHF + Zod |
| Dashboard metrics and charts | Pending | |

## Phase 3: Advanced Finance

| Item | Status | Notes |
|---|---|---|
| Cash flow page | Pending | |
| Pricing simulator | Pending | |
| SaaS metrics page | Pending | |
| Scenario engine UI | Pending | |
| What-if simulator | Pending | |
| Sensitivity tables | Pending | |

## Phase 4: Tax and Currency

| Item | Status | Notes |
|---|---|---|
| Tax profiles and Nepal preset | Pending | |
| VAT/GST calculator | Pending | |
| Currency conversion with provenance | Pending | |
| FX scenarios | Pending | |

## Phase 5: Financing

| Item | Status | Notes |
|---|---|---|
| Founder capital | Pending | |
| Debt amortization | Pending | |
| Investor capital and dilution | Pending | |
| Financing comparison | Pending | |
| Founder economics | Pending | |
| Capital allocation | Pending | |

## Phase 6: Product Quality

| Item | Status | Notes |
|---|---|---|
| Command palette | Pending | Ctrl/Cmd K |
| Settings pages | Pending | |
| Haptics/sound feedback managers | Pending | optional, disableable |
| PWA manifest and offline shell | Pending | |
| Accessibility audit pass | Pending | |
| Keyboard shortcuts | Pending | |

## Phase 7: Public Site and SEO

| Item | Status | Notes |
|---|---|---|
| Marketing landing page | Pending | |
| Calculator landing pages | Pending | 9 planned |
| Metadata, JSON-LD, OG images | Pending | |
| Sitemap and robots | Pending | |

## Phase 8: Reports

| Item | Status | Notes |
|---|---|---|
| Printable report | Pending | |
| JSON export/import | Pending | versioned schema |
| Two-model comparison page | Pending | |

## Final QA

| Item | Status | Notes |
|---|---|---|
| Lint clean | Pending | |
| Typecheck clean | Pending | |
| All tests passing | Pending | |
| Production build succeeds | Pending | |
| Docs finalized | Pending | |
