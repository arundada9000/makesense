import type { Metadata } from "next";
import { DocSection } from "@/components/site/doc-page";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export const metadata: Metadata = {
  title: "User Manual",
  description:
    "How to use MakeSense: build your first business model, read projections, simulate scenarios, plan tax and financing, compare models and export reports.",
  alternates: { canonical: "/manual" },
};

const SHORTCUTS: Array<[string, string]> = [
  ["Ctrl or Cmd + K", "Open or close the command palette; search pages and models"],
  ["D", "Go to Dashboard"],
  ["M", "Go to Models"],
  ["C", "Go to Compare"],
  [",", "Open Settings"],
];

const FORMULAS: Array<[string, string]> = [
  ["Gross profit", "Revenue − variable costs"],
  ["Operating profit", "Gross profit − fixed costs"],
  ["Net profit", "Operating profit − interest − corporate tax"],
  ["Contribution margin", "(Price − variable cost per unit) ÷ price"],
  ["Break-even units", "Fixed costs ÷ contribution margin per unit"],
  ["Break-even revenue", "Break-even units × price"],
  ["ROI", "(Net gain − investment) ÷ investment"],
  ["Payback period", "Months until cumulative net cash covers the investment"],
  ["CAC", "Acquisition spend in month ÷ new customers that month"],
  ["LTV", "ARPU × gross margin ÷ monthly churn rate"],
  ["MRR / ARR", "Active customers × ARPU, annualized for ARR"],
  ["Runway", "Cash balance ÷ average monthly burn"],
  ["Loan payment", "Level installment amortized over term at monthly rate"],
  ["VAT (inclusive)", "Net = gross ÷ (1 + rate); tax = gross − net"],
];

export default function ManualPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main-content" className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 md:px-6">
        <article>
          <header className="animate-rise">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              User manual
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              How to use MakeSense
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Everything you need to go from an idea to a stress-tested business
              model. Ten minutes here is enough to run your first simulation.
            </p>
          </header>

          <nav aria-label="On this page" className="animate-rise d-1 mt-8 rounded-[var(--radius-lg)] border border-border bg-surface p-4 shadow-card">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">On this page</p>
            <ul className="mt-2 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
              {[
                ["#getting-started", "Getting started"],
                ["#concepts", "Core concepts"],
                ["#first-model", "Build your first model"],
                ["#reading-results", "Reading the results"],
                ["#scenarios", "Scenarios and sensitivity"],
                ["#financing", "Financing and investors"],
                ["#tax-currency", "Tax and currency"],
                ["#dashboard-compare", "Dashboard and comparing"],
                ["#reports", "Reports and backups"],
                ["#settings", "Settings"],
                ["#shortcuts", "Keyboard shortcuts"],
                ["#formulas", "Formula reference"],
                ["#faq", "FAQ"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="transition-colors hover:text-accent">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-10 space-y-10">
            <DocSection id="getting-started" title="Getting started">
              <p>
                No account is needed. Open{" "}
                <strong>the app</strong> from any page header. On first launch,
                MakeSense offers starter templates: digital product, SaaS,
                consulting, e-commerce and more. A template is just a prefilled
                model — every number is editable afterwards.
              </p>
              <p>
                Prefer to start clean? Choose <code>Blank</code>. You can also
                import a JSON backup from another device via{" "}
                <strong>Settings → Data</strong>.
              </p>
            </DocSection>

            <DocSection id="concepts" title="Core concepts">
              <dl className="space-y-3 [&_dt]:font-medium [&_dt]:text-foreground">
                <div>
                  <dt>Model</dt>
                  <dd>
                    One business idea with all its assumptions: basics
                    (currency, horizon), customers, revenue streams, cost items
                    and investments.
                  </dd>
                </div>
                <div>
                  <dt>Projection</dt>
                  <dd>
                    The engine simulates your model month by month for the whole
                    horizon (up to five years). Every metric on every screen is
                    computed from this single simulation, so screens never
                    disagree.
                  </dd>
                </div>
                <div>
                  <dt>Scenario</dt>
                  <dd>
                    A named set of overrides on top of the base case (for
                    example: price up 10%, growth down 20%). Scenarios never
                    modify your base assumptions.
                  </dd>
                </div>
                <div>
                  <dt>Sensitivity table</dt>
                  <dd>
                    A grid that re-runs the entire simulation across two ranges
                    you pick, such as price versus customer volume, so you can
                    see where the business breaks.
                  </dd>
                </div>
                <div>
                  <dt>Tax profile</dt>
                  <dd>
                    Corporate rate plus VAT settings per country. Nepal&apos;s
                    preset (25% corporate, 13% VAT) ships by default; seven
                    other presets are one click away.
                  </dd>
                </div>
              </dl>
            </DocSection>

            <DocSection id="first-model" title="Build your first model">
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  Click <strong>New model</strong> (sidebar on desktop, center
                  button on mobile) and pick the closest template.
                </li>
                <li>
                  In <strong>Assumptions → Basics</strong>, set the model name,
                  currency and projection horizon.
                </li>
                <li>
                  Under <strong>Customers</strong>, enter how many customers you
                  start with and how fast they grow. Churn matters more than
                  growth for subscriptions.
                </li>
                <li>
                  Under <strong>Revenue streams</strong>, add each way you earn:
                  price, billing frequency, optional growth, and costs tied to
                  each sale.
                </li>
                <li>
                  Under <strong>Costs</strong>, add fixed items (rent, salaries,
                  tools) and variable ones (payment fees, packaging).
                </li>
                <li>
                  Under <strong>Investment</strong>, add anything you must spend
                  before launch so payback and ROI reflect reality.
                </li>
              </ol>
              <p>
                Every field saves as you type. There is nothing to press — the
                workspace recalculates instantly.
              </p>
            </DocSection>

            <DocSection id="reading-results" title="Reading the results">
              <ul className="list-disc space-y-1.5 pl-5">
                <li><strong>Overview tab:</strong> headline metrics, revenue/profit chart, and the monthly table.</li>
                <li><strong>Cash flow tab:</strong> money in vs out, running cash balance, break-even month, and loan schedules.</li>
                <li><strong>Unit economics strip:</strong> CAC, LTV, LTV:CAC ratio, payback months.</li>
                <li>
                  A value shown as <em>—</em> means it is not computable yet (for
                  example, break-even when the model never turns profitable),
                  not zero. Hover or tap for the reason.
                </li>
              </ul>
            </DocSection>

            <DocSection id="scenarios" title="Scenarios and sensitivity">
              <p>
                The <strong>Scenarios</strong> tab lists Conservative, Expected
                and Aggressive by default. Edit any scenario to override
                specific assumptions — price, growth, churn, costs. The
                comparison table re-simulates every scenario side by side.
              </p>
              <p>
                The <strong>Sensitivity</strong> tab answers &ldquo;what
                if&rdquo; at scale: choose two variables and ranges, pick a
                metric like first-year profit, and read the grid. Green cells
                are healthy; red cells are losses.
              </p>
            </DocSection>

            <DocSection id="financing" title="Financing and investors">
              <p>
                The <strong>Financing</strong> tab handles three sources of
                money:
              </p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li><strong>Founder capital</strong> enters cash before month one; founder salary runs as drawings.</li>
                <li><strong>Loans</strong> produce level-payment amortization schedules visible in Cash flow, with interest split per month.</li>
                <li>
                  <strong>Investor equity</strong> shows dilution and implied
                  valuation: enter the amount raised and the ownership percent
                  given up, and the valuation math is shown transparently.
                </li>
              </ul>
            </DocSection>

            <DocSection id="tax-currency" title="Tax and currency">
              <p>
                <strong>Tax:</strong> pick a country preset or enter rates
                manually. The tab computes VAT/GST splits (tax-inclusive or
                exclusive prices) and estimates corporate tax with loss
                carryforward.
              </p>
              <p>
                <strong>Currency:</strong> view any model converted to another
                currency. Reference rates show their date and source, original
                figures stay intact, and you can apply optimistic or pessimistic
                FX shifts for foreign revenue and costs. Switching a model&apos;s
                base currency is explicit and permanent.
              </p>
            </DocSection>

            <DocSection id="dashboard-compare" title="Dashboard and comparing models">
              <p>
                The <strong>Dashboard</strong> summarizes every active model:
                year-one revenue, margin, runway and generated observations
                (&ldquo;break-even happens in month 9&rdquo;, &ldquo;cash goes
                negative in month 14&rdquo;).
              </p>
              <p>
                <strong>Compare</strong> selects multiple models and puts their
                metrics in one factual table — useful when choosing between two
                ideas or pricing structures.
              </p>
            </DocSection>

            <DocSection id="reports" title="Reports and backups">
              <p>
                Every model has a <strong>Report</strong> page designed for
                printing: use your browser&apos;s Print → Save as PDF to share
                with partners or a bank. Each report also exports the model as
                versioned JSON.
              </p>
              <p>
                For everything at once, <strong>Settings → Data</strong> exports
                a full backup (all models and preferences) and imports backups
                back in. Do this regularly; there is no cloud sync.
              </p>
            </DocSection>

            <DocSection id="settings" title="Settings">
              <p>
                Themes (including dark mode and high contrast), density, font
                scale, compact number style, reduced motion, sound/haptic
                feedback and the default currency all live in Settings. Choices
                apply immediately and persist on this device.
              </p>
            </DocSection>

            <DocSection id="shortcuts" title="Keyboard shortcuts">
              <div className="overflow-hidden rounded-[var(--radius-base)] border border-border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-secondary text-muted-foreground">
                    <tr>
                      <th scope="col" className="px-3 py-2 font-medium">Keys</th>
                      <th scope="col" className="px-3 py-2 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SHORTCUTS.map(([keys, action]) => (
                      <tr key={keys} className="border-t border-border">
                        <td className="whitespace-nowrap px-3 py-2 font-mono">{keys}</td>
                        <td className="px-3 py-2">{action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>Shortcuts pause while you are typing in any field.</p>
            </DocSection>

            <DocSection id="formulas" title="Formula reference">
              <p>
                These are the exact definitions used by the engine. Decimal
                arithmetic is used throughout to avoid floating-point drift.
              </p>
              <div className="overflow-hidden rounded-[var(--radius-base)] border border-border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-secondary text-muted-foreground">
                    <tr>
                      <th scope="col" className="px-3 py-2 font-medium">Metric</th>
                      <th scope="col" className="px-3 py-2 font-medium">Definition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FORMULAS.map(([name, def]) => (
                      <tr key={name} className="border-t border-border">
                        <td className="whitespace-nowrap px-3 py-2 font-medium text-foreground">{name}</td>
                        <td className="px-3 py-2 font-mono">{def}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DocSection>

            <DocSection id="faq" title="FAQ">
              <dl className="space-y-4 [&_dt]:font-medium [&_dt]:text-foreground">
                <div>
                  <dt>Is my data safe?</dt>
                  <dd>
                    It stays in your browser and never reaches a server. See the{" "}
                    <a href="/privacy">privacy policy</a>. Keep exported backups
                    of important models.
                  </dd>
                </div>
                <div>
                  <dt>Does it work offline?</dt>
                  <dd>
                    Yes. After the first load, the app installs an offline shell
                    and works without internet.
                  </dd>
                </div>
                <div>
                  <dt>Can I use it on my phone?</dt>
                  <dd>
                    Yes — the layout adapts, including bottom navigation and
                    touch-friendly charts.
                  </dd>
                </div>
                <div>
                  <dt>Are the tax numbers filing-ready?</dt>
                  <dd>
                    No. They are planning estimates. Confirm with an accountant
                    before filing; deductions and timing rules vary.
                  </dd>
                </div>
                <div>
                  <dt>Why does a metric show &ldquo;—&rdquo;?</dt>
                  <dd>
                    It cannot be computed from current assumptions, often
                    because the model never breaks even within the horizon. Fix
                    the assumption and it appears.
                  </dd>
                </div>
              </dl>
            </DocSection>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
