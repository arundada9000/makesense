# BUSINESS MODEL SIMULATOR

Name : MakeSense

Tagline : Make better business decisions.

## Master Product, UX, Architecture & Engineering Specification

Build a production-quality web application called:

# Business Model Simulator

This is not a simple calculator.

It is a serious **entrepreneurial financial modeling, business planning, scenario simulation, and decision-support application**.

The fundamental purpose is:

> Allow an entrepreneur to turn a business idea into a mathematical model and understand the economics before spending significant time or money building it.

A user should be able to model:

- A Rs. 500 digital product sold to 10,000 people
- A Rs. 500,000 enterprise product sold to 20 businesses
- A SaaS product charging Rs. 1,000/month
- A consulting/service business
- An e-commerce product
- A marketplace
- A hybrid business
- A startup funded through founder capital, debt, or investment

The application must calculate and visualize:

- Revenue
- Costs
- Profit
- Margins
- Break-even
- ROI
- Payback
- Unit economics
- CAC
- LTV
- LTV:CAC
- MRR
- ARR
- Customer growth
- Churn
- Cash flow
- Runway
- Pricing scenarios
- Tax planning
- VAT/GST
- Currency conversion
- FX effects
- Capital allocation
- Debt financing
- Investor financing
- Scenario analysis
- Sensitivity analysis
- Business-model comparison

The product should feel like:

> **An Apple-quality financial modeling tool for entrepreneurs.**

Do NOT build a generic admin dashboard.

Do NOT build a collection of disconnected calculators.

Build one coherent financial modeling system.

---

# 1. PRODUCT PRINCIPLE

The central architecture must be:

```text
BUSINESS MODEL
      ↓
DOMAIN ENGINE
      ↓
REVENUE
COSTS
CUSTOMERS
TAX
CURRENCY
      ↓
FINANCIAL ENGINE
      ↓
PROFIT
CASH FLOW
UNIT ECONOMICS
BREAK-EVEN
ROI
      ↓
SCENARIO ENGINE
      ↓
SENSITIVITY ANALYSIS
      ↓
REPORTING / COMPARISON
```

There must be one canonical business model.

Do NOT duplicate formulas inside components.

If the user changes:

```text
Price: Rs. 500 → Rs. 750
```

all dependent calculations must update automatically.

---

# 2. CORE TECHNOLOGY

Use:

- Next.js 16
- React
- TypeScript
- App Router
- Tailwind CSS 4
- shadcn/ui
- Radix UI primitives where appropriate
- Motion for animations
- Zustand for client application state
- React Hook Form
- Zod
- Recharts
- Lucide icons
- decimal.js for financial arithmetic
- Dexie + IndexedDB for local persistence
- Vitest
- React Testing Library
- Playwright

Use the current stable versions compatible with the project.

Do not blindly install unnecessary packages.

Keep dependencies minimal and justified.

---

# 3. CRITICAL FINANCIAL ENGINEERING RULE

JavaScript floating-point numbers must NOT be trusted for monetary calculations.

Do not build financial calculations using naive floating-point arithmetic.

Use decimal arithmetic.

Create a proper domain abstraction around:

```text
Money
Currency
Percentage
Quantity
Duration
ExchangeRate
```

For example:

```ts
Money {
  amount: Decimal
  currency: CurrencyCode
}
```

Do not scatter raw monetary numbers throughout the application.

The calculation layer must be deterministic and testable.

---

# 4. ARCHITECTURE

Use a domain-oriented architecture.

Recommended structure:

```text
src/
├── app/
│   ├── (marketing)/
│   ├── dashboard/
│   ├── models/
│   ├── calculators/
│   ├── compare/
│   ├── pricing/
│   ├── tax/
│   ├── currency/
│   └── settings/
│
├── domain/
│   ├── money/
│   ├── currency/
│   ├── revenue/
│   ├── costs/
│   ├── customers/
│   ├── profit/
│   ├── cashflow/
│   ├── unit-economics/
│   ├── breakeven/
│   ├── roi/
│   ├── pricing/
│   ├── tax/
│   ├── financing/
│   ├── scenarios/
│   └── sensitivity/
│
├── application/
│   ├── models/
│   ├── calculators/
│   ├── reports/
│   └── comparison/
│
├── infrastructure/
│   ├── persistence/
│   ├── exchange-rates/
│   ├── tax-profiles/
│   └── export/
│
├── components/
│   ├── ui/
│   ├── forms/
│   ├── charts/
│   ├── metrics/
│   ├── tables/
│   ├── sheets/
│   └── feedback/
│
├── stores/
├── hooks/
├── lib/
└── types/
```

Calculation functions must be pure.

Example:

```ts
calculateRevenue(model);
calculateCosts(model);
calculateProfit(model);
calculateBreakEven(model);
calculateUnitEconomics(model);
calculateCashFlow(model);
calculateTax(model, taxProfile);
calculateScenario(model, scenario);
```

React components should consume calculation results.

React components must NOT contain the core financial formulas.

---

# 5. DESIGN PHILOSOPHY

Use Apple's Human Interface Guidelines as inspiration for:

- hierarchy
- clarity
- accessibility
- touch targets
- predictable interactions
- motion
- adaptive layouts
- platform-aware behavior

Do NOT copy Apple's UI.

Do NOT reproduce Apple's proprietary visual assets.

Do NOT make the website look like a fake iOS clone.

The goal is:

> "Apple-quality product design applied to financial software."

The application must work beautifully on:

- Windows desktop
- macOS
- iPhone
- iPad
- Android
- touchscreen laptops
- keyboard/mouse
- trackpads

The design should adapt to the platform instead of forcing one platform's UI conventions everywhere.

---

# 6. VISUAL DESIGN

Design language:

- premium
- minimal
- sophisticated
- financial
- calm
- precise
- modern
- highly legible

Avoid:

- excessive gradients
- excessive glassmorphism
- giant glowing cards
- crypto-dashboard aesthetics
- generic Bootstrap styling
- unnecessary animations
- excessive rounded cards
- visual noise

Use:

- layered surfaces
- restrained shadows
- subtle borders
- excellent typography
- clear hierarchy
- compact financial tables
- large key metrics
- smooth transitions
- carefully designed empty states

---

# 7. THEME SYSTEM

Build a proper design-token theme system.

Themes must not be hard-coded throughout components.

Create semantic tokens for:

```text
background
surface
surface-secondary
foreground
muted
border
accent
accent-foreground
success
warning
danger
info
chart-1...
chart-N
```

Also support:

```text
radius
shadow
density
motion
typography scale
```

Built-in themes:

1. Apple Light
2. Apple Dark
3. Graphite
4. Ocean
5. Forest
6. Paper
7. High Contrast

Also support:

# Custom Theme

Allow users to customize:

- Accent color
- Background
- Surface
- Border
- Radius
- Density
- Font scale
- Chart appearance

Custom themes must still enforce readable contrast.

Never allow an invalid theme to destroy accessibility.

Persist theme preferences.

Support:

```text
System
Light
Dark
Custom
```

---

# 8. ACCESSIBILITY

Accessibility is a first-class requirement.

Do not treat accessibility as a final polish phase.

Support:

- semantic HTML
- keyboard navigation
- visible focus
- screen readers
- VoiceOver
- NVDA
- logical tab order
- ARIA where appropriate
- accessible form errors
- accessible charts
- accessible tables
- sufficient contrast
- reduced motion
- large text
- high contrast
- color-independent information
- touch accessibility
- keyboard shortcuts

Never communicate important financial information through color alone.

For example:

Do not use only:

```text
green = profit
red = loss
```

Also show:

```text
+ Rs. 2.4M
- Rs. 400K
```

Use icons/text where appropriate.

Respect:

```css
prefers-reduced-motion
```

and provide an application-level reduced-motion option.

---

# 9. TOUCH & GESTURES

Support standard gestures where useful:

- tap
- swipe
- drag
- long press
- pinch/zoom where genuinely useful

Do NOT create custom gestures for essential functionality.

Every gesture-based action must have an alternative control.

Example:

If swiping deletes something:

also provide:

```text
Delete
```

button/menu action.

Use large touch targets.

Aim for approximately 44px touch targets where practical.

Desktop controls may be denser.

---

# 10. HAPTICS

Create a centralized feedback system:

```text
FeedbackManager
├── visual()
├── haptic()
└── sound()
```

Haptics must be progressive enhancement.

Never require haptics for functionality.

Support:

```text
light
medium
heavy
success
warning
error
selection
```

Use haptics sparingly.

Examples:

- slider detent
- successful model save
- scenario switch
- destructive confirmation
- validation error
- important interaction

Detect browser/device support.

Allow users to disable haptics.

---

# 11. SOUND

Add subtle optional sound feedback.

Sound categories:

```text
click
selection
success
warning
error
save
```

Do not use annoying game-like sounds.

Respect browser autoplay policies.

Never rely on sound alone to communicate information.

Allow:

```text
Sound: On/Off
Volume
```

Provide sensible defaults.

---

# 12. MOTION

Use Motion for:

- page transitions
- sheet opening
- card expansion
- metric changes
- chart transitions
- scenario changes
- feedback

Animations should be subtle and fast.

Do not animate everything.

Support reduced motion.

When reduced motion is enabled:

- reduce movement
- reduce scale transitions
- reduce parallax
- use fades where appropriate
- disable decorative animation

---

# 13. CORE BUSINESS MODEL

A model contains:

```text
id
name
description
businessType
baseCurrency
revenueStreams[]
fixedCosts[]
variableCosts[]
recurringCosts[]
customers
marketing
taxProfile
financing
projectionSettings
scenarios[]
metadata
```

Business types:

```text
One-time Product
Subscription / SaaS
Service
B2B / Enterprise
E-commerce
Marketplace
Hybrid
Custom
```

Business type should configure defaults, not restrict the user.

---

# 14. REVENUE ENGINE

Support multiple revenue streams.

Each revenue stream:

```text
name
type
price
currency
customerCount
frequency
discount
refundRate
```

Types:

```text
One-time
Monthly
Quarterly
Yearly
Usage-based
Commission
Setup fee
Maintenance
Other
```

Calculate:

- total revenue
- monthly revenue
- annual revenue
- recurring revenue
- one-time revenue
- MRR
- ARR
- ARPU
- revenue/customer

---

# 15. COST ENGINE

Support:

## Fixed Costs

- development
- design
- branding
- legal
- equipment
- initial marketing
- setup
- office
- other

## Variable Costs

- payment fees
- delivery
- infrastructure
- support
- manufacturing
- API usage
- commission
- cost per customer
- cost per order

## Recurring Costs

- hosting
- software
- employees
- office
- maintenance
- marketing
- subscriptions

Every cost:

```text
name
category
amount
currency
frequency
```

---

# 16. INITIAL INVESTMENT

Separate initial investment from operating expenses.

Examples:

```text
Development       Rs. 800,000
Equipment         Rs. 200,000
Branding          Rs. 100,000
Initial marketing Rs. 300,000
```

Total:

```text
Initial Investment = Rs. 1,400,000
```

Do not automatically classify initial investment as a recurring expense.

---

# 17. PROFIT ENGINE

Calculate:

```text
Gross Revenue
− Discounts
− Refunds
− Direct/Variable Costs
= Gross Profit

Gross Profit
− Operating Expenses
= Operating Profit

Operating Profit
− Taxes
− Other Expenses
= Net Profit
```

Show:

- gross profit
- operating profit
- net profit
- gross margin
- operating margin
- net margin

Allow taxes to be disabled.

---

# 18. UNIT ECONOMICS

Calculate:

### Revenue/customer

```text
Revenue / Customers
```

### Variable cost/customer

```text
Variable Costs / Customers
```

### Contribution/customer

```text
Revenue/customer − Variable cost/customer
```

### Contribution margin

```text
Contribution / Revenue × 100
```

### CAC

```text
Acquisition Cost / New Customers
```

### LTV

For recurring businesses:

```text
ARPU × Gross Margin % / Monthly Churn
```

Support alternative/manual LTV models.

### LTV:CAC

```text
LTV / CAC
```

### CAC Payback

```text
CAC / Monthly Contribution per Customer
```

Handle impossible calculations gracefully.

Never display:

```text
NaN
Infinity
undefined
```

---

# 19. BREAK-EVEN

Calculate:

## Customer break-even

```text
Fixed Costs / Contribution per Customer
```

## Revenue break-even

```text
Fixed Costs / Contribution Margin %
```

Also provide:

- break-even including initial investment
- remaining investment to recover
- break-even percentage
- projected month of break-even

If contribution is zero/negative:

> Break-even cannot be reached under the current assumptions.

---

# 20. ROI & PAYBACK

Calculate:

```text
ROI =
(Net Profit − Initial Investment)
/
Initial Investment
× 100
```

Also:

- return multiple
- payback period
- cumulative profit
- cumulative cash flow

Clearly distinguish ROI from profit.

---

# 21. CUSTOMER GROWTH

Support:

### Fixed growth

```text
+100 customers/month
```

### Percentage growth

```text
+10%/month
```

### Custom monthly growth

Also support:

- starting customers
- new customers
- churn
- retention
- maximum market size (optional)

Formula:

```text
Starting Customers
+ New Customers
− Churned Customers
= Ending Customers
```

---

# 22. SAAS MODEL

Support:

- MRR
- ARR
- new MRR
- churned MRR
- expansion MRR
- contraction MRR
- customer churn
- revenue churn
- net revenue retention where enough information exists

Projection:

```text
12 months
24 months
36 months
60 months
```

---

# 23. PRICING SIMULATOR

Allow:

```text
minimum price
maximum price
step
```

Generate pricing scenarios.

For every price calculate:

- revenue
- variable costs
- gross profit
- net profit
- margin
- break-even customers
- ROI

Support:

### Constant Demand

Price changes while customer count remains constant.

### Demand Sensitivity

Allow user to model how expected demand changes with price.

Clearly label demand sensitivity as:

> Scenario assumption — not a market forecast.

Never claim the application knows the "optimal market price."

---

# 24. REVENUE / PROFIT TARGET

Allow:

```text
Target Revenue
```

and:

```text
Target Profit
```

For example:

```text
Target Revenue = Rs. 10,000,000
```

Calculate required customers at different prices.

For target profit, account for contribution margin and fixed costs.

---

# 25. CASH FLOW

Profit is NOT cash flow.

Keep these separate.

Monthly cash flow:

```text
Starting Cash
+ Revenue Inflows
+ Financing
+ Investment
− Variable Costs
− Fixed Costs
− Payroll
− Marketing
− Taxes
− Debt Payments
− Withdrawals
= Ending Cash
```

Show:

- monthly net cash flow
- ending cash
- burn
- lowest cash balance
- runway
- cash break-even

---

# 26. RUNWAY

Calculate:

```text
Available Cash
/
Average Net Monthly Burn
```

For businesses with positive cash flow, clearly state that traditional runway may not be meaningful.

Project runway under:

- conservative
- expected
- aggressive

---

# 27. TAX ENGINE

Create a jurisdiction-aware tax architecture.

Do NOT build a fake universal tax formula.

Tax profile:

```text
country
jurisdiction
taxYear
businessStructure
corporateTax
incomeTax
VAT/GST
withholdingTax
deductions
thresholds
brackets
depreciationRules
lossRules
```

The tax engine consumes a tax profile.

Do not hard-code tax rules directly into UI components.

---

# 28. TAX PLANNING

The application may provide **legal tax-planning scenarios**.

Do NOT provide instructions for tax evasion, concealment, falsifying records, hiding income, sham transactions, or illegal avoidance.

The product should instead help users understand legitimate planning.

Support scenarios such as:

- retaining profit in the business
- reinvestment
- eligible business deductions
- capital expenditure
- depreciation
- salary/compensation
- bonuses
- dividends/distributions where legally applicable
- retirement/pension contributions where applicable
- tax-loss carryforward where applicable
- business structure comparisons where supported
- VAT/GST treatment

Always label jurisdiction-dependent calculations clearly.

Display:

> Tax calculations are estimates for planning purposes and are not professional tax advice.

---

# 29. VAT / GST

Support:

```text
base price
tax rate
tax-inclusive price
tax-exclusive price
output tax
eligible input tax
net tax payable
```

Allow tax-inclusive/exclusive pricing.

Example:

```text
Base price = Rs. 1,000
VAT = 13%

Customer price = Rs. 1,130
```

Use jurisdiction-specific rates from the selected tax profile.

---

# 30. FOUNDER ECONOMICS

Separate company economics from founder economics.

Model:

```text
Company Revenue
↓
Company Costs
↓
Company Profit
↓
Company Tax
↓
Available Cash
↓
Founder Salary
Founder Distribution
Reinvestment
Reserve
↓
Founder Net Income
```

This prevents the common mistake of treating company profit as founder income.

---

# 31. CAPITAL ALLOCATION

Allow users to allocate available cash.

Example:

```text
Hiring
Marketing
Product
Infrastructure
Emergency Reserve
Equipment
Founder Distribution
Debt Repayment
```

Show allocation percentages and amounts.

Allow scenario modeling:

> What happens if I put 30% more money into marketing?

Recalculate:

- cash
- runway
- expenses
- projected revenue assumptions
- profit
- ending balance

Do not automatically predict marketing results unless the user supplies assumptions.

---

# 32. FINANCING

Support:

## Founder Capital

- amount
- date

## Debt

Inputs:

- principal
- interest rate
- term
- repayment frequency
- start date

Calculate:

- payment
- total interest
- total repayment
- amortization schedule
- effect on cash flow

## Investor Capital

Allow:

- investment amount
- ownership percentage
- dilution
- post-money valuation
- pre-money valuation

Do not attempt to predict future valuation.

---

# 33. BOOTSTRAP VS DEBT VS INVESTOR

Allow comparison:

```text
Bootstrap
Debt
Investor
```

Compare:

- cash available
- founder ownership
- debt
- interest
- repayment
- dilution
- runway
- projected financial outcomes

Use user-provided assumptions.

Do not provide investment advice.

---

# 34. CURRENCY ENGINE

Support many currencies.

At minimum:

```text
NPR
USD
EUR
GBP
INR
AUD
CAD
JPY
CNY
```

Architecture must support adding more.

Store:

```text
amount
currency
exchangeRate
rateDate
rateSource
```

Do not destroy original currency values during conversion.

Distinguish:

```text
Original Amount
Converted Reporting Amount
```

---

# 35. FX CONVERSION

Support:

- current FX rates
- historical rates
- conversion date
- reporting currency
- multi-currency revenue
- multi-currency expenses

Where live exchange rates are available, clearly display:

```text
Rate
Timestamp/date
Source
```

Do not silently present stale rates as current.

If no rate source is available:

Allow manual rate entry.

---

# 36. FX RISK

Allow scenario analysis:

```text
USD +5%
USD -5%
USD +10%
USD -10%
```

Calculate effect on:

- revenue
- costs
- profit
- cash flow

Clearly label this as scenario analysis.

---

# 37. SCENARIO ENGINE

Every model supports:

```text
Conservative
Expected
Aggressive
Custom
```

Each scenario stores independent assumptions.

Do NOT simply multiply all values by arbitrary percentages.

Override specific assumptions:

- price
- customers
- CAC
- churn
- conversion
- variable cost
- marketing
- growth
- expenses
- FX
- tax assumptions where appropriate

Compare:

```text
Revenue
Costs
Profit
Margin
ROI
Customers
Break-even
Payback
Cash
Runway
```

---

# 38. WHAT-IF SIMULATOR

Allow multiple simultaneous changes.

Example:

```text
Price        +20%
Customers    -30%
CAC          +50%
Costs        +15%
Churn        +100%
```

Compare:

```text
Current Model
vs
Modified Model
```

Show absolute and percentage changes.

---

# 39. SENSITIVITY ANALYSIS

Create dynamic sensitivity tables.

Examples:

### Price × Customers

Metric:

- Revenue
- Profit
- ROI
- Break-even

### CAC × Conversion

### Price × Variable Cost

### Customers × Churn

### FX × Revenue

Use heatmap visualization.

Do not rely exclusively on color.

Display values inside cells.

---

# 40. MASS MARKET VS HIGH-TICKET COMPARISON

This is a flagship feature.

Allow two business models to be compared.

Example:

### Model A

```text
Price = Rs. 500
Customers = 10,000
```

### Model B

```text
Price = Rs. 500,000
Customers = 20
```

Compare:

- revenue
- variable costs
- fixed costs
- profit
- margin
- initial investment
- CAC
- LTV
- break-even
- ROI
- payback
- customer concentration
- recurring revenue
- cash flow

Do NOT declare a subjective winner.

Instead show factual observations.

Example:

> Model B reaches the same revenue target with substantially fewer customers.

---

# 41. MODEL COMPARISON

Users can save multiple models:

```text
SaaS Idea
Digital Product
B2B Product
Consulting
E-commerce
Marketplace
```

Compare side-by-side.

---

# 42. DASHBOARD

The dashboard must answer the most important questions immediately.

Top metrics:

```text
Revenue
Profit
Margin
ROI
Break-even
Payback
Customers
CAC
LTV
MRR
ARR
Cash
Runway
```

Charts:

- Revenue vs expenses
- Profit projection
- Cash balance
- Customer growth
- MRR
- Break-even progress

Example:

```text
Current customers: 1,200
Break-even: 2,500

████████████░░░░░░░░
48%
```

---

# 43. ASSUMPTION TRANSPARENCY

Every important metric must allow:

> How is this calculated?

Example:

```text
Net Profit
Rs. 2,400,000

Based on:

Price                  Rs. 5,000
Customers              1,000
Variable Cost/customer Rs. 500
Fixed Costs            Rs. 800,000
Marketing              Rs. 500,000
Tax                    Rs. XXX
```

Provide formula explanations.

Never hide important assumptions.

---

# 44. EDUCATIONAL LAYER

Every major financial metric should have:

- plain-language explanation
- formula
- example
- interpretation
- warning when applicable

Example:

```text
Gross Margin

Measures how much revenue remains after direct costs.

Formula:
(Revenue − Direct Costs) / Revenue
```

This makes the tool useful for beginners and experienced entrepreneurs.

---

# 45. SEO ARCHITECTURE

The public website must be SEO-first.

Create indexable landing pages such as:

```text
/business-calculator
/profit-calculator
/revenue-calculator
/break-even-calculator
/roi-calculator
/pricing-calculator
/cash-flow-calculator
/startup-runway-calculator
/saas-calculator
/ltv-cac-calculator
/tax-calculator
/vat-calculator
/currency-converter
```

Each should have:

- unique title
- unique description
- canonical URL
- Open Graph metadata
- structured data where appropriate
- useful educational content
- internal links
- crawlable content
- semantic headings

Use Next.js Metadata API.

Create:

```text
sitemap.xml
robots.txt
favicon
apple icon
Open Graph image
```

Use JSON-LD where appropriate.

Do NOT keyword-stuff.

SEO content must be genuinely useful.

---

# 46. MARKETING SITE

Create a proper public landing page.

Hero:

> Model the business before you build the business.

Explain:

```text
Model Revenue
Understand Costs
Test Pricing
Calculate Break-even
Simulate Growth
Analyze Cash Flow
Compare Business Models
```

CTA:

```text
Start Modeling
Try Example
```

Add:

- feature sections
- screenshots/mockups
- calculator previews
- educational sections
- FAQ
- SEO content
- footer

---

# 47. CALCULATOR SEO STRATEGY

Each calculator landing page should have:

```text
Educational explanation
Calculator
Formula
Example
Common mistakes
FAQ
Related calculators
```

Example:

```text
Break-even Calculator

What is break-even?
Formula
Interactive calculator
Example
Interpretation
Related tools
```

Do not make SEO pages thin wrappers around the same calculator.

---

# 48. PWA

Make the application installable as a PWA.

Support:

- manifest
- icons
- offline shell
- cached static assets
- installability
- standalone display
- responsive app experience

Financial models stored locally must remain usable offline.

Do not pretend live exchange rates or live tax data are available offline.

Clearly indicate stale/offline data.

---

# 49. LOCAL-FIRST DATA

The initial version does not require a backend.

Persist models using:

```text
IndexedDB
```

via Dexie.

Users can:

- create
- edit
- duplicate
- rename
- archive
- delete
- export
- import

models locally.

---

# 50. IMPORT / EXPORT

Support JSON export.

Example:

```json
{
  "version": 1,
  "model": {}
}
```

Include schema versioning.

Support future migrations.

Never assume old saved models will always match the latest schema.

---

# 51. REPORT EXPORT

Create a clean printable report.

Report sections:

- Business summary
- Assumptions
- Revenue
- Costs
- Profit
- Unit economics
- Break-even
- ROI
- Cash flow
- Scenarios
- Sensitivity
- Tax assumptions
- Currency assumptions

Design it for:

```text
Print
Save as PDF
Share
```

Do not require a server for basic report generation.

---

# 52. SETTINGS

Settings should include:

## Appearance

- theme
- system/light/dark
- custom theme
- density
- font scale

## Interaction

- haptics
- sound
- animation
- reduced motion

## Financial

- default currency
- number formatting
- decimal precision
- fiscal year

## Accessibility

- high contrast
- font scale
- reduced motion

## Data

- import
- export
- reset

---

# 53. INTERNATIONALIZATION

Prepare architecture for:

- multiple languages
- locale-aware numbers
- locale-aware dates
- currency formatting
- RTL

Do not hard-code English text throughout calculation components.

Initial language can be English.

But architecture must allow localization later.

---

# 54. NUMBER FORMATTING

Support:

```text
1,000
10,000
1,000,000
1,000,000,000
```

and compact formats:

```text
1K
10K
1M
1B
```

Allow users to choose.

For financial reports, default to exact values.

Do not hide meaningful precision.

---

# 55. LARGE NUMBER HANDLING

The application must correctly handle:

```text
Rs. 500
Rs. 500,000
Rs. 5,000,000
Rs. 500,000,000
```

without UI overflow.

Use responsive formatting.

---

# 56. EMPTY STATES

Never show empty charts or broken cards.

Instead show useful messages.

Example:

> Add a revenue stream to see your revenue projection.

---

# 57. ERROR HANDLING

Never show raw errors to users.

For invalid scenarios:

```text
Contribution margin is negative.
Your variable costs exceed your revenue per customer.
```

Instead of:

```text
NaN
```

---

# 58. KEYBOARD SHORTCUTS

Support useful desktop shortcuts:

```text
Ctrl/Cmd + K
```

Command palette.

Potential actions:

```text
New model
Search models
Go to dashboard
Go to pricing
Go to scenarios
Export
```

Do not override browser/system shortcuts unnecessarily.

---

# 59. COMMAND PALETTE

Create a command palette.

Search:

- calculators
- models
- actions
- settings

Example:

```text
⌘K

Search...
────────────────────
New Business Model
Pricing Simulator
Break-even
Cash Flow
Tax Planning
Compare Models
Settings
```

---

# 60. MOBILE NAVIGATION

Desktop:

```text
Sidebar
```

Mobile:

```text
Bottom navigation
```

with access to:

```text
Home
Models
Calculate
Scenarios
More
```

Use sheets/drawers for secondary controls.

Do not force desktop tables onto mobile.

---

# 61. DASHBOARD RESPONSIVENESS

Desktop:

```text
Sidebar + content
```

Tablet:

```text
Collapsible sidebar
```

Mobile:

```text
Compact navigation
```

Cards should reflow.

Charts must resize.

Tables should scroll horizontally.

Forms should remain comfortable.

---

# 62. DEFAULT EXAMPLE

Seed a model:

## SaaS Product

```text
Price = Rs. 1,000/month
Starting Customers = 100
New Customers/month = 50
Monthly Churn = 3%
CAC = Rs. 2,000
Variable Cost/customer = Rs. 100
Monthly Fixed Costs = Rs. 100,000
Initial Investment = Rs. 1,000,000
```

Also provide:

## Micro-Payment Product

```text
Price = Rs. 500
Customers = 10,000
Initial Investment = Rs. 500,000
```

and:

## Enterprise Product

```text
Price = Rs. 500,000
Customers = 20
Initial Investment = Rs. 1,500,000
```

These examples should demonstrate the purpose of the application.

---

# 63. TESTING

Write serious tests.

Use Vitest for domain calculations.

Test:

- revenue
- costs
- profit
- margin
- break-even
- ROI
- payback
- CAC
- LTV
- LTV:CAC
- MRR
- ARR
- churn
- growth
- cash flow
- tax
- VAT/GST
- currency conversion
- FX scenarios
- debt
- financing
- scenarios
- sensitivity

Test edge cases:

```text
0 customers
0 revenue
0 price
negative profit
negative contribution
100% churn
0% churn
0 fixed costs
0 variable costs
variable cost > revenue
zero CAC
zero investment
missing tax profile
missing FX rate
large numbers
```

Use Playwright for:

- creating model
- editing model
- scenario switching
- pricing simulator
- comparison
- import/export
- theme switching
- mobile navigation
- keyboard navigation
- accessibility basics

---

# 64. ACCESSIBILITY TESTING

Test:

- keyboard-only usage
- screen reader labels
- focus management
- color contrast
- reduced motion
- large text
- high contrast
- form errors
- chart alternatives
- touch targets

Important charts must have an accessible tabular/data representation.

---

# 65. PERFORMANCE

Target:

- fast initial load
- minimal client JavaScript where possible
- server-render static marketing content
- lazy-load heavy chart modules where appropriate
- avoid unnecessary rerenders
- memoize expensive calculations only when necessary
- keep calculation engine pure and fast

Do not turn the entire application into one giant client component.

Use Server Components for static/public content where appropriate.

Use Client Components only where interactivity is required.

---

# 66. SECURITY

Even though the first version is local-first:

- validate imported JSON
- never execute imported code
- sanitize user-generated content
- do not use `eval`
- do not trust imported model schemas
- version and validate model data
- avoid unsafe HTML rendering

---

# 67. PRIVACY

The default application should be local-first.

Clearly communicate:

> Your business models are stored locally on this device.

Do not send financial model data to third-party services unless explicitly required.

If analytics are later added, keep them privacy-conscious and never transmit sensitive financial model data.

---

# 68. TAX / FINANCIAL DISCLAIMER

Include a small but clear disclaimer:

> This tool provides financial modeling and tax-planning estimates for informational purposes. Tax rules, exchange rates, and financial outcomes depend on jurisdiction, timing, assumptions, and individual circumstances. It is not legal, tax, accounting, or investment advice.

Do not make the disclaimer obnoxious.

---

# 69. NO FAKE INTELLIGENCE

Do not create fake "AI business scores."

Do not say:

> Your business has an 87% chance of success.

Do not invent market demand.

Do not pretend the calculator knows the future.

Instead say:

> Under your assumptions, projected profit is X.

and:

> If customers are 40% lower than expected, projected profit becomes Y.

The value is in transparent mathematics.

---

# 70. BUSINESS INSIGHTS

The tool may generate deterministic observations from calculations.

Examples:

> Variable costs currently exceed revenue per customer.

> You recover your initial investment after approximately 2,500 customers.

> The enterprise model reaches the target revenue with fewer customers.

> Your CAC represents 40% of first-year customer revenue.

> Your cash balance becomes negative in month 8 under the conservative scenario.

These are mathematical observations.

Do not label them as predictions.

---

# 71. FEATURE PRIORITY

Build in this order.

## Phase 1 — Domain Engine

Implement:

- money
- currency
- revenue
- costs
- customers
- profit
- margins
- break-even
- ROI
- unit economics

Test thoroughly.

## Phase 2 — Core UI

Implement:

- model creation
- dashboard
- inputs
- results
- charts
- local persistence

## Phase 3 — Advanced Finance

Implement:

- cash flow
- runway
- pricing
- SaaS
- growth
- scenarios
- sensitivity

## Phase 4 — Tax & Currency

Implement:

- tax profiles
- VAT/GST
- tax planning
- FX
- historical rates
- multi-currency

## Phase 5 — Financing

Implement:

- debt
- investor capital
- bootstrap comparison
- capital allocation
- founder economics

## Phase 6 — Product Quality

Implement:

- themes
- haptics
- sound
- gestures
- accessibility
- keyboard shortcuts
- command palette
- PWA

## Phase 7 — SEO

Implement:

- marketing pages
- calculator landing pages
- metadata
- JSON-LD
- sitemap
- robots
- OG images
- internal linking

## Phase 8 — Reports

Implement:

- print reports
- PDF-ready layouts
- JSON export/import
- comparison reports

---

# 72. QUALITY BAR

Do not stop when:

> "It works."

The application must feel like a finished commercial product.

Before completion:

- no TypeScript errors
- no lint errors
- no console errors
- no broken routes
- no placeholder UI
- no fake calculations
- no duplicated formulas
- no `any` unless genuinely justified
- no unexplained magic numbers
- no inaccessible custom controls
- no broken mobile layouts
- no NaN/Infinity in financial outputs
- no accidental data loss
- no unnecessary dependencies
- no giant monolithic components

---

# 73. CODE QUALITY

Prefer:

- small focused modules
- pure functions
- explicit types
- domain-driven naming
- composition
- reusable primitives
- clear boundaries
- comments only where reasoning is non-obvious

Avoid:

- giant components
- giant hooks
- global mutable state
- duplicated business logic
- magic constants
- business calculations in JSX
- excessive abstraction
- premature generic frameworks

---

# 74. DOCUMENTATION

Create:

```text
README.md
ARCHITECTURE.md
CALCULATIONS.md
TAX.md
CURRENCY.md
CONTRIBUTING.md
```

`CALCULATIONS.md` should document the formulas.

Example:

```text
Revenue
Revenue = Price × Customers

Break-even
Break-even Customers =
Fixed Costs / Contribution per Customer
```

Document assumptions and edge cases.

---

# 75. FINAL USER EXPERIENCE

The complete flow should be:

```text
"I have an idea."
        ↓
Create Business Model
        ↓
Enter Revenue
        ↓
Enter Customers
        ↓
Enter Costs
        ↓
Enter Investment
        ↓
Model calculates automatically
        ↓
See Revenue
        ↓
See Profit
        ↓
See Break-even
        ↓
See ROI
        ↓
Understand Unit Economics
        ↓
Test Pricing
        ↓
Test Conservative / Expected / Aggressive
        ↓
Stress-test assumptions
        ↓
Analyze Cash Flow
        ↓
Analyze Tax
        ↓
Analyze Currency / FX
        ↓
Compare Alternative Business Models
        ↓
Export Business Report
```

The product should ultimately answer:

> **"What happens if I build this business?"**

not merely:

> **"What is 500 × 10,000?"**

---

# 76. FINAL PRODUCT DEFINITION

This application is:

> **A local-first, privacy-conscious, Apple-quality business modeling platform that allows entrepreneurs to mathematically explore revenue, costs, pricing, profitability, customers, taxes, cash flow, financing, currencies, scenarios, and business-model alternatives before committing resources.**

The core philosophy is:

```text
ASSUMPTIONS
     ↓
MATHEMATICS
     ↓
TRANSPARENT RESULTS
     ↓
SCENARIOS
     ↓
BETTER DECISIONS
```

Build the calculation engine first.

Verify the mathematics.

Then build the UI.

Do not reverse this order.

A beautiful interface with incorrect financial calculations is a failed product.

A mathematically correct engine with a polished, accessible, responsive interface is the foundation for a serious product.

author : "C:\Users\arunn\Desktop\ARUN-PROFILE.md"
create a proper list of fds, implementation plan, tracker before writing the code and keep updating tracker on each successful feature implemented.
will be deployed at : https://makesensebusiness.vercel.app/

build it in this same repo keep this file safe, proper gitignore , proper professional github repo with all the files a normal repo has , license should be non usable by anyone without permission, proper readme and all the docs file, one features.md file listing all the features with short description.

ui ux is most mandatory, responsiveness, swipe/click/dblclick gestures where we can use them , use skills like impeccable and ui ux pro, donot use em dashes, long dashes and emojis. donot make anything look like ai slop.
do proper commits on each steps where necessary.
