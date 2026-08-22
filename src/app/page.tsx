import Link from "next/link";
import {
  ArrowRight,
  LineChart,
  ShieldCheck,
  Wallet,
  Scale,
  Globe2,
  FileText,
} from "lucide-react";

const FEATURES = [
  {
    icon: LineChart,
    title: "Full financial picture",
    body: "Revenue streams, cost structures, customer growth, profit waterfall, break-even, ROI and cash flow in one model.",
  },
  {
    icon: Wallet,
    title: "Scenarios without spreadsheets",
    body: "Compare conservative, expected and aggressive cases side by side. Every number traces back to an assumption you set.",
  },
  {
    icon: Scale,
    title: "Tax aware",
    body: "Corporate tax with loss carryforward, VAT and GST breakdowns, plus a Nepal preset to start from.",
  },
  {
    icon: Globe2,
    title: "Multi-currency",
    body: "Model in rupees or dollars, convert between currencies with provenance preserved for every figure.",
  },
  {
    icon: FileText,
    title: "Financing options",
    body: "Founder capital, loan amortization schedules and investor dilution so you can compare funding paths.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    body: "Everything runs and stays on your device. No accounts, no uploads, no tracking of your business numbers.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <LineChart className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="text-sm font-semibold tracking-tight">MakeSense</span>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-base)] bg-accent px-4 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
        >
          Open app <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </header>

      <main id="main-content">
        <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-14 text-center md:px-6 md:pt-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Business Model Simulator
          </p>
          <h1 className="mx-auto mt-4 max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            Know what your business numbers actually say
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
            Build a complete model of revenue, costs, customers, tax and
            financing. Test scenarios before you commit money. Runs entirely on
            your device.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-base)] bg-accent px-6 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
            >
              Start modeling <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/models?new=1"
              className="inline-flex h-11 items-center rounded-[var(--radius-base)] border border-border-strong bg-surface px-6 text-sm font-medium transition-colors hover:bg-surface-secondary"
            >
              Try a template
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted">
            Free | No sign-up | Works offline after first load
          </p>
        </section>

        <section
          aria-label="Capabilities"
          className="mx-auto grid w-full max-w-6xl gap-3 px-4 pb-16 sm:grid-cols-2 lg:grid-cols-3 md:px-6"
        >
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-card"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent-subtle text-accent">
                <Icon className="h-4.5 w-4.5" />
              </span>
              <h2 className="mt-3 text-sm font-semibold">{title}</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </section>

        <section className="border-y border-border bg-surface-secondary">
          <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
            <h2 className="text-center text-lg font-semibold tracking-tight">
              How it works
            </h2>
            <ol className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Describe your business",
                  body: "Pick a template or start blank. Enter prices, costs, growth and churn as plain numbers.",
                },
                {
                  step: "2",
                  title: "Read the projections",
                  body: "The engine computes monthly profit, cash, break-even and unit economics with every formula visible.",
                },
                {
                  step: "3",
                  title: "Stress-test decisions",
                  body: "Adjust assumptions, compare scenarios, and export a report before you spend a rupee.",
                },
              ].map((item) => (
                <li key={item.step} className="rounded-[var(--radius-base)] bg-surface p-4 shadow-card">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                    {item.step}
                  </span>
                  <h3 className="mt-2.5 text-sm font-semibold">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-12 pt-12 md:px-6">
          <h2 className="text-lg font-semibold tracking-tight">
            Free standalone calculators
          </h2>
          <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-muted-foreground">
            Quick answers for single questions, each with its formula explained.
            The full app connects them into one model.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              ["Break-even", "/break-even-calculator"],
              ["Profit margin", "/profit-calculator"],
              ["Revenue projection", "/revenue-calculator"],
              ["ROI", "/roi-calculator"],
              ["Pricing", "/pricing-calculator"],
              ["Cash flow", "/cash-flow-calculator"],
              ["Startup runway", "/startup-runway-calculator"],
              ["SaaS metrics", "/saas-calculator"],
              ["LTV:CAC", "/ltv-cac-calculator"],
              ["Corporate tax", "/tax-calculator"],
              ["VAT / GST", "/vat-calculator"],
              ["Business profitability", "/business-calculator"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="inline-flex h-9 items-center rounded-full border border-border bg-surface px-4 text-xs font-medium transition-colors hover:border-accent hover:text-accent"
              >
                {label}
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
          <p className="mx-auto max-w-2xl text-center text-xs leading-relaxed text-muted">
            Projections are mathematical consequences of the assumptions you
            enter, not predictions of what will happen. Validate figures with an
            accountant before making financial commitments.
          </p>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-xs text-muted md:px-6">
          <span>MakeSense | All rights reserved</span>
          <span>Built for founders who want clarity</span>
        </div>
      </footer>
    </div>
  );
}
