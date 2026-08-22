# MakeSense Functional Design Specification

Product: MakeSense Business Model Simulator
Tagline: Make better business decisions.
Deployment target: https://makesensebusiness.vercel.app/
Source requirement document: `initial-idea.md`
Status: Living document. Updated when scope changes.

---

## 1. Purpose

MakeSense turns a business idea into a mathematical model so an entrepreneur can understand the economics of the idea before spending significant time or money building it.

It is a financial modeling, business planning, scenario simulation, and decision support application. It is not a collection of disconnected calculators and not a generic admin dashboard.

The product answers one question: "What happens if I build this business?"

## 2. Product Principles

1. One canonical business model. All calculations derive from a single model object.
2. No duplicated formulas. Calculation functions live only in the domain layer.
3. Deterministic mathematics. Decimal arithmetic everywhere money is involved.
4. Assumption transparency. Every important metric exposes its inputs and formula.
5. No fake intelligence. Results are stated as consequences of user assumptions, never as forecasts.
6. Local first. Models persist in IndexedDB on the device. No backend required for v1.
7. Accessible by construction. Keyboard, screen reader, contrast, reduced motion are requirements, not polish.
8. Platform aware design. Apple quality bar applied to financial software without imitating Apple visual assets.

## 3. System Context

```text
User assumptions (forms)
        |
        v
Canonical Business Model (Zustand + Dexie persistence)
        |
        v
Domain Engine (pure functions, decimal.js)
   revenue / costs / customers / tax / currency
        |
        v
Financial Engine (pure functions)
   profit / cash flow / unit economics / break-even / roi
        |
        v
Scenario Engine (assumption overrides)
        |
        v
Sensitivity Analysis
        |
        v
UI: dashboard, editors, simulators, comparisons, reports
```

React components consume calculation results. Components never contain core formulas.

## 4. Canonical Data Model

### 4.1 BusinessModel

| Field | Type | Notes |
|---|---|---|
| id | string | UUID |
| name | string | Required |
| description | string | Optional |
| businessType | enum | one-time-product, subscription-saas, service, b2b-enterprise, ecommerce, marketplace, hybrid, custom |
| baseCurrency | CurrencyCode | ISO 4217 |
| revenueStreams | RevenueStream[] | At least zero |
| initialInvestment | InvestmentItem[] | Separate from operating expenses |
| fixedCosts | CostItem[] | Monthly recurring operating costs |
| variableCosts | CostItem[] | Per customer or per order |
| customers | CustomerAssumptions | Growth model |
| marketing | MarketingAssumptions | CAC inputs |
| taxProfile | TaxProfile | Jurisdiction aware |
| financing | Financing | Founder capital, debt, investor |
| projectionSettings | ProjectionSettings | Horizon in months, starting cash |
| scenarios | Scenario[] | Conservative, expected, aggressive, custom |
| metadata | ModelMetadata | createdAt, updatedAt, archived |

### 4.2 RevenueStream

| Field | Type | Notes |
|---|---|---|
| id | string | |
| name | string | |
| type | enum | one-time, monthly, quarterly, yearly, usage-based, commission, setup-fee, maintenance, other |
| price | Money | Decimal amount plus currency |
| customerCount | number | Initial customers for the stream |
| frequency | enum | Billing frequency |
| discountPercent | Percentage | Applied to gross price |
| refundRate | Percentage | Portion refunded |

### 4.3 CostItem

| Field | Type | Notes |
|---|---|---|
| id | string | |
| name | string | |
| category | enum | development, design, branding, legal, equipment, marketing, hosting, software, employees, office, payment-fees, delivery, infrastructure, support, manufacturing, api-usage, commission, other |
| kind | enum | initial, fixed-recurring, variable-per-customer, variable-per-order |
| amount | Money | |
| currency | CurrencyCode | |
| frequency | enum | one-time, monthly, quarterly, yearly |

### 4.4 CustomerAssumptions

startingCustomers, growthMode (fixed | percentage | custom-monthly), fixedGrowthPerMonth, percentageGrowthPerMonth, customMonthlyGrowth[], monthlyChurnRate, maxMarketSize (optional).

Formula: ending = starting + new - churned, capped at maxMarketSize when provided.

### 4.5 TaxProfile

country, jurisdiction label, businessStructure, enabled flag, corporateTaxRate, vatOrGst { enabled, rate, priceIncludesTax }, incomeTaxBrackets[], deductions, lossCarryforwardEnabled, notes. The engine consumes profiles; no rules hard-coded in UI. Nepal profile ships first (25 percent corporate, 13 percent VAT) alongside generic profiles.

### 4.6 Financing

founderCapital { items[]: amount, date }, debt[] { principal, annualInterestRate, termMonths, frequency, startDate }, investor { amount, ownershipPercent } with derived pre-money and post-money valuation.

### 4.7 Scenario

Named set of overrides over specific assumption paths (price, customers, growth, churn, CAC, variable cost, marketing spend, expenses, FX delta). Never a blanket percentage multiplication of outputs.

### 4.8 Money value object

```ts
interface Money {
  readonly amount: Decimal
  readonly currency: CurrencyCode
}
```

Raw monetary numbers do not travel through components. Exchange conversions keep the original amount and attach rate, date, source, and converted reporting amount.

## 5. Functional Requirements

Priority: M1 must have v1, S1 should have, C1 could have later.

### FR-100 Domain primitives

- FR-101 M1 Money type wrapping decimal.js with add, subtract, multiply, allocate, compare, format-safe conversion.
- FR-102 M1 Currency registry with NPR, USD, EUR, GBP, INR, AUD, CAD, JPY, CNY and extension point for more.
- FR-103 M1 Percentage and Quantity types with safe division helpers that return explicit "not computable" states instead of NaN or Infinity.
- FR-104 M1 ExchangeRate value object storing rate, date, source; manual entry supported when no provider is available.

### FR-200 Revenue engine

- FR-201 M1 Multiple revenue streams per model with types from section 4.2.
- FR-202 M1 Compute gross revenue, net revenue after discounts and refunds, monthly, annual, recurring vs one-time split.
- FR-203 M1 Compute MRR, ARR, ARPU from recurring streams.
- FR-204 S1 Usage-based and commission stream calculators with explicit volume assumptions.

### FR-300 Cost engine

- FR-301 M1 Fixed recurring, variable per customer, variable per order, and initial investment cost kinds.
- FR-302 M1 Normalize all costs to monthly equivalents using frequency.
- FR-303 M1 Initial investment is never treated as a recurring operating expense.
- FR-304 M1 Compute total fixed monthly, variable per customer, total period costs.

### FR-400 Customers and growth

- FR-401 M1 Fixed, percentage, and custom monthly growth with churn and optional market cap.
- FR-402 M1 Project customer counts across horizon producing monthly series.
- FR-403 M1 Churn applied before growth within each month.

### FR-500 Profit engine

- FR-501 M1 Gross profit, operating profit, net profit waterfall per month and totals.
- FR-502 M1 Gross margin, operating margin, net margin percentages.
- FR-503 M1 Taxes applied through TaxProfile with disable switch.

### FR-600 Unit economics

- FR-601 M1 Revenue per customer, variable cost per customer, contribution per customer, contribution margin.
- FR-602 M1 CAC from acquisition spend divided by new customers.
- FR-603 M1 LTV via ARPU times gross margin percent divided by churn; manual override supported.
- FR-604 M1 LTV to CAC ratio and CAC payback months.
- FR-605 M1 Impossible calculations degrade to explanatory empty states, never NaN.

### FR-700 Break-even

- FR-701 M1 Customer break-even and revenue break-even from contribution math.
- FR-702 M1 Break-even including initial investment recovery.
- FR-703 M1 Break-even progress percent and projected month of break-even on charts.

### FR-800 ROI and payback

- FR-801 M1 ROI percent, return multiple, payback period in months.
- FR-802 M1 Cumulative profit and cumulative cash flow series.

### FR-900 Cash flow

- FR-901 M1 Monthly cash flow statement: opening cash, inflows, outflows by group, closing cash.
- FR-902 M1 Burn, lowest cash balance, runway months, cash break-even detection.
- FR-903 S1 Runway under conservative, expected, aggressive burn.

### FR-1000 Pricing simulator

- FR-1001 M1 Price range with step; table of revenue, profit, margin, break-even customers, ROI per price point.
- FR-1002 M1 Constant demand mode and demand sensitivity mode with explicit "scenario assumption" labeling.
- FR-1003 M1 Target revenue and target profit solvers returning required customers at given prices.

### FR-1100 SaaS metrics

- FR-1101 M1 New MRR, churned MRR, expansion and contraction placeholders where inputs exist, net revenue retention when computable.
- FR-1102 M1 Horizons 12, 24, 36, 60 months.

### FR-1200 Scenarios and what-if

- FR-1201 M1 Conservative, expected, aggressive, custom scenarios storing independent assumption overrides.
- FR-1202 M1 Side-by-side comparison across revenue, costs, profit, margin, ROI, customers, break-even, payback, cash, runway.
- FR-1203 M1 What-if simulator applying multiple simultaneous deltas against the current model with absolute and percent change output.

### FR-1300 Sensitivity analysis

- FR-1301 M1 Two-variable sensitivity tables for price x customers, price x variable cost, CAC x conversion, customers x churn, FX x revenue.
- FR-1302 M1 Heatmap visualization with values printed in cells; color never the sole carrier of meaning.

### FR-1400 Comparison

- FR-1401 M1 Compare any two saved models across revenue, costs, profit, margin, investment, CAC, LTV, break-even, ROI, payback, concentration, cash flow.
- FR-1402 M1 Output factual observations only, no subjective winner declaration.

### FR-1500 Tax

- FR-1501 M1 TaxProfile editor with country presets and full custom mode.
- FR-1502 M1 Corporate/income tax computation integrated into profit engine with disable option.
- FR-1503 M1 VAT/GST calculator: inclusive and exclusive pricing, output tax, eligible input tax, net payable.
- FR-1504 S1 Legal planning scenarios: retain versus distribute, depreciation, deduction effects. Always labeled jurisdiction dependent estimates, never advice.

### FR-1600 Currency and FX

- FR-1601 M1 Multi-currency line items with original amounts preserved.
- FR-1602 M1 Reporting currency conversion with visible rate, date, source; stale and offline rates clearly indicated.
- FR-1603 S1 FX risk scenarios at plus and minus 5 and 10 percent showing effect on revenue, costs, profit, cash flow.

### FR-1700 Financing

- FR-1701 M1 Founder capital entries.
- FR-1702 M1 Debt: amortized payment schedule, total interest, effect on cash flow.
- FR-1703 M1 Investor capital: amount, ownership, dilution, pre and post money valuation displayed as arithmetic, not prediction.
- FR-1704 S1 Bootstrap vs debt vs investor comparison using user assumptions only.

### FR-1800 Founder economics and capital allocation

- FR-1801 S1 Company profit to available cash to founder salary/distribution/reinvestment/reserve split.
- FR-1802 S1 Allocation buckets with percentages and amounts plus what-if recalculation.

### FR-1900 Persistence, import, export

- FR-1901 M1 Dexie/IndexedDB storage of all models locally.
- FR-1902 M1 Create, edit, duplicate, rename, archive, delete models.
- FR-1903 M1 JSON export `{ version, model }` with schema versioning and validated import with migration hook.
- FR-1904 M1 Printable report view covering summary, assumptions, statements, scenarios, sensitivity, tax and currency assumptions.

### FR-2000 App experience

- FR-2001 M1 Dashboard answering key questions immediately: revenue, profit, margin, ROI, break-even progress, customers, cash, runway, MRR/ARR when applicable.
- FR-2002 M1 Desktop sidebar navigation; mobile bottom navigation; sheets for secondary controls.
- FR-2003 M1 Theme system with semantic tokens, seven built-in themes, system/light/dark/custom, persisted preferences, enforced readable contrast.
- FR-2004 M1 Command palette (Ctrl/Cmd K) for models, pages, actions, settings.
- FR-2005 S1 FeedbackManager with progressive haptics and optional subtle sounds, both user-disableable.
- FR-2006 M1 Reduced motion support at OS and application level.
- FR-2007 M1 PWA installable with offline shell; local models fully usable offline; live data staleness labeled.
- FR-2008 S1 Keyboard shortcuts documented inside the app.

### FR-2100 Education layer

- FR-2101 M1 Every major metric offers "How is this calculated?" with plain language explanation, formula, example, interpretation, warnings.
- FR-2102 M1 Deterministic insight generation (mathematical observations only), explicitly not predictions.

### FR-2200 Public site and SEO

- FR-2201 M1 Marketing landing page with hero, features, FAQ, CTAs (Start Modeling, Try Example).
- FR-2202 M1 Calculator landing pages with unique metadata, canonical URLs, educational content, formula, example, common mistakes, FAQ, related tools; genuinely useful, not thin wrappers.
- FR-2203 M1 sitemap.xml, robots.txt, favicon set, OG image, JSON-LD where appropriate, Next.js Metadata API throughout.

## 6. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-01 | No floating point drift in monetary results; decimal.js everywhere money flows. |
| NFR-02 | TypeScript strict; no unjustified `any`; domain layer has zero React imports. |
| NFR-03 | Vitest coverage of every domain module including edge cases listed in spec section 63. |
| NFR-04 | Playwright smoke suite for create/edit/scenario/pricing/import-export/theme/mobile nav/keyboard basics. |
| NFR-05 | WCAG 2.1 AA targets: contrast, focus visibility, labels, chart alternatives as tables. |
| NFR-06 | Responsive from 360px phones to wide desktops; tables scroll horizontally on small screens. |
| NFR-07 | Touch targets approximately 44px on touch devices; desktop may be denser. |
| NFR-08 | Server rendered static marketing content; client bundles limited to interactive app routes. |
| NFR-09 | Imported JSON validated with Zod; no eval; no unsafe HTML. |
| NFR-10 | Financial data stays on device; privacy notice communicates local-first storage. |
| NFR-11 | No em dashes or emojis anywhere in product copy or docs. |
| NFR-12 | Disclaimer present but unobtrusive: estimates, not professional advice. |

## 7. Edge Cases Treated As Requirements

Zero customers, zero revenue, zero price, negative profit, negative contribution, 100 percent churn, 0 percent churn, zero fixed costs, zero variable costs, variable cost above revenue, zero CAC, zero investment, missing tax profile, missing FX rate, very large amounts up to billions. Each must render a sensible message or value.

## 8. Out of Scope for v1

- Backend accounts, sync, collaboration.
- Live exchange rate provider integration (manual rates plus clear sourcing instead).
- Invoicing, bookkeeping, actuals tracking.
- AI generated insights or success probability scores.
- Localization beyond architecture readiness (English first).
