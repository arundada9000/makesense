# MakeSense Implementation Plan

Source requirement document: `initial-idea.md`
Companion documents: `docs/FDS.md`, `docs/TRACKER.md`, `FEATURES.md`
Rule: build and verify the calculation engine before the UI that shows it.

---

## Phase 0: Repository and Planning

| Task | Output | Verify |
|---|---|---|
| Write FDS, implementation plan, tracker, feature list | docs/ | Documents reviewed against spec |
| Git init, .gitignore, restrictive LICENSE | repo root | git status clean |
| Professional README | README.md | Accurate setup instructions |

## Phase 1: Domain Engine (no UI)

Order matters: primitives first, then everything that depends on them.

| Order | Module | Contents |
|---|---|---|
| 1 | domain/primitives | Money, Currency registry, Percentage, safe division, Result-style guards |
| 2 | domain/revenue | stream normalization, gross/net revenue, MRR/ARR/ARPU |
| 3 | domain/costs | frequency normalization, fixed monthly total, variable per customer/order |
| 4 | domain/customers | growth projections with churn and market cap |
| 5 | domain/profit | waterfall to net profit, margins |
| 6 | domain/unit-economics | contribution, CAC, LTV, LTV:CAC, payback |
| 7 | domain/breakeven | customers, revenue, investment recovery, progress |
| 8 | domain/roi | ROI, return multiple, payback period |
| 9 | domain/model | canonical BusinessModel types, defaults, validation schemas |

Verification gate: Vitest suite green covering normal and edge cases from spec section 63 before any UI work starts.

## Phase 2: Core Application

| Order | Slice | Contents |
|---|---|---|
| 1 | Design system | semantic tokens, seven themes, theme provider, typography scale |
| 2 | App shell | desktop sidebar, mobile bottom nav, page transitions |
| 3 | Persistence | Dexie schema, model repository, Zustand store wiring, autosave |
| 4 | Model CRUD | create from template, rename, duplicate, archive, delete, examples seeded |
| 5 | Model editor | revenue streams, costs, investment, customers forms with Zod + RHF |
| 6 | Dashboard | metric cards, charts (revenue vs expenses, profit projection, cash balance, customer growth, MRR, break-even progress), assumption transparency popovers |

Verification gate: user can create a model, edit assumptions, and see correct live numbers.

## Phase 3: Advanced Finance

| Order | Slice | Contents |
|---|---|---|
| 1 | Cash flow engine + page | monthly statement, burn, runway, lowest balance |
| 2 | Pricing simulator | price table, demand modes, target solvers |
| 3 | SaaS metrics | MRR movement, horizons |
| 4 | Scenario engine | overrides, conservative/expected/aggressive/custom, comparison table |
| 5 | What-if simulator | multi-delta application, change summary |
| 6 | Sensitivity tables | two-variable grids with heatmap rendering |

## Phase 4: Tax and Currency

| Order | Slice | Contents |
|---|---|---|
| 1 | Tax profiles | Nepal preset first, generic presets, custom editor |
| 2 | Tax integration | profit engine consumes profile, disable switch |
| 3 | VAT/GST calculator | inclusive/exclusive, output/input/net payable |
| 4 | Currency engine | multi-currency line items, reporting conversion, rate provenance display |
| 5 | FX scenarios | plus/minus deltas on profit and cash flow |

## Phase 5: Financing

| Order | Slice | Contents |
|---|---|---|
| 1 | Founder capital | entries feeding starting cash |
| 2 | Debt engine | amortization schedule, interest totals, cash flow effect |
| 3 | Investor capital | dilution and valuation arithmetic view |
| 4 | Financing comparison | bootstrap vs debt vs investor side by side |
| 5 | Founder economics | company vs founder split view |
| 6 | Capital allocation | buckets, percentages, what-if recalculation |

## Phase 6: Product Quality

| Order | Slice | Contents |
|---|---|---|
| 1 | Command palette | Ctrl/Cmd K actions across models, pages, settings |
| 2 | Settings pages | appearance, interaction, financial defaults, accessibility, data |
| 3 | Feedback system | haptics + sound managers, progressive enhancement |
| 4 | PWA | manifest, icons, service worker shell |
| 5 | Accessibility pass | focus order, labels, chart tables, contrast audit, reduced motion |
| 6 | Keyboard shortcuts | navigation and actions, documented in-app |

## Phase 7: Public Site and SEO

| Order | Slice | Contents |
|---|---|---|
| 1 | Marketing landing page | hero, features, FAQ, CTAs |
| 2 | Calculator landing pages | break-even, ROI, profit, pricing, cash flow, runway, SaaS, LTV:CAC, VAT |
| 3 | Metadata | unique titles/descriptions, canonical URLs, OG images, JSON-LD |
| 4 | Infrastructure | sitemap.xml, robots.txt, favicon set |

## Phase 8: Reports and Comparison

| Order | Slice | Contents |
|---|---|---|
| 1 | Report builder | printable report of full model with assumptions |
| 2 | JSON export/import | versioned schema, validated import |
| 3 | Model comparison | two-model comparison page with factual observations |

## Continuous Practices

- Conventional commits at each working slice.
- Tracker (`docs/TRACKER.md`) updated when a feature passes verification.
- Lint + typecheck + tests run before each commit.
- No em dashes, no emojis in code or copy.
