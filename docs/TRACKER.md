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
| Vitest domain test suite | Done | 74 tests across 11 files, all passing |

## Phase 2: Core Application

| Item | Status | Notes |
|---|---|---|
| Design tokens and theme system (7 themes) | Done | globals.css tokens, ThemeProvider applies data-theme/density/motion |
| App shell: sidebar, mobile bottom nav | Done | desktop sidebar with model list, 5-slot mobile nav, safe-area padding |
| Dexie persistence layer | Done | makesense DB v1, models table, import validation |
| Model CRUD with templates and examples | Done | zustand store, seed on first run, duplicate/archive/delete |
| Model editor forms | Done | assumptions tab: basics, customers, streams, fixed and variable costs, investment |
| Dashboard metrics and charts | Done | metric cards, revenue/cash charts, monthly table, insights |
| Models gallery | Done | cards with summary metrics, template picker dialog, archive view |
| Compare page | Done | multi-select table via compareAnalyses |
| Settings page | Done | themes, density, font scale, number style, export/import/reset |
| Workspace overview tab | Done | KPIs, charts, break-even stats, month-by-month table |
| Landing page rewrite | Done | hero, capabilities, how it works, disclaimer |
| Cash flow workspace tab | Done | flow chart, statement table, loan schedules, runway stats |
| Scenarios workspace tab | Done | custom scenario CRUD, override editor, comparison table |
| Financing workspace tab | Done | founder capital, salary, loan CRUD, investor equity, dilution |
| Tax workspace tab | Done | country presets, VAT split, corporate estimate, effective rates |

## Phase 3: Advanced Finance

| Item | Status | Notes |
|---|---|---|
| Cash flow page | Done | workspace cash flow tab with chart, statement, loan schedules |
| Pricing simulator | Done | pricing calculator landing page |
| SaaS metrics page | Done | SaaS calculator landing page |
| Scenario engine UI | Done | scenarios tab with override editor and comparison table |
| What-if simulator | Done | sensitivity tab re-runs full engine per cell |
| Sensitivity tables | Done | two-variable grid, color coded, metric selector |

## Phase 4: Tax and Currency

| Item | Status | Notes |
|---|---|---|
| Tax profiles and Nepal preset | Done | tax tab presets: NP, IN, US, GB, AU, CA, DE |
| VAT/GST calculator | Done | tax tab split plus dedicated /vat-calculator page |
| Currency conversion with provenance | Done | currency tab shows rate, date, source; originals preserved |
| FX scenarios | Done | shift table for foreign revenue/costs |

## Phase 5: Financing

| Item | Status | Notes |
|---|---|---|
| Founder capital | Done | financing tab, enters cash at month 0 |
| Debt amortization | Done | loan CRUD with level payment schedules in cash flow and financing tabs |
| Investor capital and dilution | Done | investment amount, ownership percent, implied valuation, profit share |
| Financing comparison | Deferred | compare funding paths via scenarios; core pieces shipped |
| Founder economics | Done | founder salary as drawings, capital summary rows |
| Capital allocation | Deferred | covered indirectly by investment and cost items |

## Phase 6: Product Quality

| Item | Status | Notes |
|---|---|---|
| Command palette | Done | Ctrl/Cmd K, pages and model search |
| Settings pages | Done | themes, density, font scale, number style, data management |
| Haptics/sound feedback managers | Done | FeedbackProvider with WebAudio ticks and vibration, off by default |
| PWA manifest and offline shell | Done | manifest, icon, runtime-caching service worker registered in production |
| Accessibility audit pass | Done | skip link, landmarks, labeled inputs, visible focus rings |
| Keyboard shortcuts | Done | Ctrl/Cmd K palette plus D/M/C/comma navigation keys |

## Phase 7: Public Site and SEO

| Item | Status | Notes |
|---|---|---|
| Marketing landing page | Done | hero, capabilities, how it works, calculator links, disclaimer |
| Calculator landing pages | Done | all 12 routes with unique metadata, formula, example, mistakes, FAQ, related links |
| Metadata, JSON-LD, OG images | Done | per-page canonicals, WebApplication plus FAQPage schema, generated OG image |
| Sitemap and robots | Done | app routes excluded from crawling |

## Phase 8: Reports

| Item | Status | Notes |
|---|---|---|
| Printable report | Done | /models/[id]/report with print styles and save-as-PDF |
| JSON export/import | Done | per-model export on report page; full backup export/import in settings |
| Two-model comparison page | Done | /compare supports any number of models |

## Final QA

| Item | Status | Notes |
|---|---|---|
| Lint clean | Done | zero errors, zero warnings |
| Typecheck clean | Done | tsc --noEmit passes |
| All tests passing | Done | 74 domain tests green |
| Production build succeeds | Done | next build compiles 24 routes, static generation verified |
| Docs finalized | Done | specs, implementation plan, and tracker synchronized |

## Phase 9: Product Enhancements & Landing Redesign

| Item | Status | Notes |
|---|---|---|
| Custom cursor app route fix | Done | dataset.cursor cleanup synchronized on route transitions |
| Header active state and hover polish | Done | usePathname with active route pills and hover transitions |
| Footer socials and author links | Done | Added GitHub, Twitter/X, LinkedIn, Portfolio SVG links |
| Text scroll reveal animations | Done | Lightweight intersection-observer ScrollReveal on doc pages |
| Em-dash (—) cleanup | Done | Replaced all em dashes across documentation, meta, and UI copy |
| Landing page hero and badge redesign | Done | Replaced AI badge with bespoke craft pill, improved typography |
| Interactive product showcase | Done | ShowcasePreview multi-tab interactive workspace preview |
| Landing page motion and micro-interactions | Done | LiveSimulator sandbox, ScrollReveal stagger, zero lag |
| Final verification and build test | Done | Typecheck, 74 domain tests, and next build verified green |

