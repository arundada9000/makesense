# MakeSense Feature List

Short descriptions of every user-facing feature. Grouped by area.

## Core Modeling

- Business model creator: start a model from a blank sheet or a business type template that prefills sensible defaults.
- Eight business types: one-time product, subscription/SaaS, service, B2B enterprise, e-commerce, marketplace, hybrid, custom.
- Multiple revenue streams: combine one-time sales, subscriptions, usage fees, commissions, setup fees, maintenance, and custom streams in one model.
- Cost modeling: fixed recurring costs, variable per-customer costs, variable per-order costs tracked separately.
- Initial investment tracking: development, equipment, branding, marketing setup kept apart from operating expenses.
- Customer growth modeling: fixed additions per month, percentage growth, or a custom month-by-month schedule.
- Churn and retention: monthly churn applied to customer projections with optional market size cap.
- Multi-currency support: NPR, USD, EUR, GBP, INR, AUD, CAD, JPY, CNY at launch with original amounts preserved.

## Financial Engine

- Revenue calculations: gross, net after discounts and refunds, monthly, annual, recurring versus one-time split.
- Profit waterfall: gross profit, operating profit, net profit computed step by step.
- Margins: gross, operating, and net margin percentages.
- Unit economics: revenue, variable cost, and contribution per customer plus contribution margin.
- CAC: customer acquisition cost from marketing spend over new customers.
- LTV and LTV:CAC: lifetime value via ARPU, margin, and churn, with manual override option.
- CAC payback: months to recover acquisition cost from monthly contribution.
- Break-even analysis: break-even customers, break-even revenue, investment recovery point, projected month.
- ROI and payback: return on investment percent, return multiple, payback period, cumulative curves.
- Cash flow projection: month-by-month inflows, outflows, closing balance, burn, lowest balance.
- Runway: months of operation left under conservative, expected, and aggressive assumptions.

## Simulators

- Pricing simulator: sweep prices across a range and see revenue, profit, margin, break-even, and ROI for each.
- Demand sensitivity mode: model how customer count responds to price, clearly labeled as an assumption.
- Target solver: enter a revenue or profit target and see required customers at different prices.
- What-if simulator: apply several changes at once (price up, customers down) and compare against the current model.
- Scenario engine: conservative, expected, aggressive, and custom scenarios with independent assumption overrides.
- Sensitivity analysis: two-variable heatmaps such as price x customers showing how outcomes move together.
- FX risk scenarios: see profit and cash flow effects if currencies strengthen or weaken by set amounts.

## Tax

- Jurisdiction-aware tax profiles: country, structure, rates, brackets, VAT/GST settings.
- Nepal tax preset: corporate income tax and 13 percent VAT defaults, fully editable.
- VAT/GST calculator: tax-inclusive and tax-exclusive pricing, output tax, input credit, net payable.
- Legal planning scenarios: retain versus distribute, depreciation, and deduction effects labeled as estimates.

## Currency

- Reporting currency conversion: consolidate mixed-currency models into one reporting currency.
- Rate provenance: every conversion shows its rate, date, and source; stale data is labeled.
- Manual exchange rates: enter rates directly when no source is available.

## Financing

- Founder capital: record founder injections as part of starting cash.
- Debt modeling: loan payments, amortization schedule, total interest, cash flow impact.
- Investor capital: amount, ownership percentage, dilution, pre-money and post-money arithmetic.
- Financing comparison: bootstrap versus debt versus investor paths using your own assumptions.
- Founder economics: separate company profit from founder take-home through salary and distribution splits.
- Capital allocation: assign available cash to hiring, marketing, product, reserves, and more with live recalculation.

## Analysis and Comparison

- Dashboard: revenue, profit, margin, ROI, break-even progress, customers, cash, and runway at a glance.
- Charts: revenue versus expenses, profit projection, cash balance, customer growth, MRR, break-even progress.
- Assumption transparency: every key metric exposes the inputs and formula behind it.
- Educational layer: plain-language explanation, formula, example, interpretation, and warnings for major metrics.
- Deterministic insights: mathematical observations derived from your numbers, never predictions.
- Model comparison: compare two saved business models side by side with factual observations only.

## Data Management

- Local-first storage: all models saved privately on your device via IndexedDB.
- Model management: create, edit, duplicate, rename, archive, delete models.
- JSON export: download any model as a versioned file.
- Validated import: bring models back safely with schema checks.
- Printable report: clean full-model report designed for print and PDF export.

## Product Experience

- Seven built-in themes: Apple Light, Apple Dark, Graphite, Ocean, Forest, Paper, High Contrast.
- Custom theme editor: accent, surfaces, radius, density, font scale with enforced readability.
- Command palette: Ctrl/Cmd K to jump to models, pages, and actions.
- Desktop sidebar and mobile bottom navigation with sheets for secondary controls.
- Progressive haptics and optional subtle sounds, both disableable.
- Reduced motion support respecting OS preferences and app-level override.
- Installable PWA: offline shell, local models usable without a connection.
- Accessibility: keyboard navigation, screen reader labels, chart data tables, high contrast support.

## Public Site

- Marketing landing page explaining the product with Start Modeling and Try Example entry points.
- Calculator landing pages: standalone educational calculators for break-even, ROI, profit, pricing, cash flow, runway, SaaS metrics, LTV:CAC, and VAT with unique SEO metadata.
- Sitemap, robots, Open Graph images, and structured data.
