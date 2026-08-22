import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  LineChart,
  ShieldCheck,
  Wallet,
  Scale,
  Globe2,
  FileText,
  Sparkles,
} from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { CALCULATOR_DIRECTORY } from "@/lib/calculator-directory";

export const metadata: Metadata = {
  title: "MakeSense | Business Model Simulator",
  description:
    "Turn a business idea into a mathematical model. Revenue, costs, cash flow, tax, financing and scenarios — computed on your device with transparent formulas.",
  alternates: { canonical: "/" },
};

const FEATURES = [
  {
    icon: LineChart,
    title: "Full financial picture",
    body: "Revenue streams, cost structures, growth, profit waterfall, break-even, ROI and cash flow — one model, one engine, zero contradictions.",
  },
  {
    icon: Wallet,
    title: "Scenarios without spreadsheets",
    body: "Conservative to aggressive, side by side. Every number traces back to an assumption you set, so debates end quickly.",
  },
  {
    icon: Scale,
    title: "Tax aware",
    body: "Corporate tax with loss carryforward, VAT and GST splits, and a Nepal preset ready on first launch.",
  },
  {
    icon: Globe2,
    title: "Multi-currency",
    body: "Model in rupees or dollars. Conversions keep their rate, date and source attached for every figure.",
  },
  {
    icon: FileText,
    title: "Financing options",
    body: "Founder capital, amortized loans and investor dilution with implied valuation — compare funding paths before signing anything.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    body: "Everything runs and stays on this device. No account, no uploads, no analytics watching your business numbers.",
  },
];

const MARQUEE_ITEMS = [
  "Break-even",
  "MRR / ARR",
  "Runway",
  "LTV : CAC",
  "Cash flow",
  "Payback",
  "Contribution margin",
  "Dilution",
  "VAT & GST",
  "Sensitivity",
  "ROI",
  "Unit economics",
];

function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "MakeSense",
        url: "/",
      },
      {
        "@type": "Organization",
        name: "MakeSense",
        url: "/",
        founder: {
          "@type": "Person",
          name: "Arun Neupane",
          url: "https://arunneupane.vercel.app",
        },
        address: { "@type": "PostalAddress", addressLocality: "Butwal", addressCountry: "NP" },
      },
      {
        "@type": "SoftwareApplication",
        name: "MakeSense Business Model Simulator",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any modern browser",
        description:
          "Business model simulator with revenue, costs, cash flow, tax, currency, financing and scenario analysis. Local-first and free.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <OrganizationSchema />
      <SiteHeader />

      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div aria-hidden="true" className="grid-bg absolute inset-0" />
          <div
            aria-hidden="true"
            className="orb orb-a -top-32 left-[15%] h-80 w-80 bg-accent/20"
          />
          <div
            aria-hidden="true"
            className="orb orb-b right-[10%] top-24 h-72 w-72 bg-success/10"
          />
          <div className="relative mx-auto w-full max-w-6xl px-4 pb-20 pt-16 text-center md:px-6 md:pt-24">
            <span className="animate-rise-sm inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground shadow-card">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Free · No sign-up · Works offline
            </span>
            <h1 className="animate-rise d-1 mx-auto mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
              Know what your business numbers{" "}
              <span className="text-sheen">actually say</span>
            </h1>
            <p className="animate-rise d-2 mx-auto mt-5 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
              Turn an idea into a complete financial model — revenue, costs,
              customers, tax, financing. Test every scenario before you commit
              real money. All math runs on your device.
            </p>
            <div className="animate-rise d-3 mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-accent px-7 text-sm font-medium text-accent-foreground shadow-pop transition-all hover:-translate-y-0.5 hover:bg-accent-hover active:translate-y-0"
              >
                Start modeling
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/manual"
                className="inline-flex h-12 items-center rounded-full border border-border-strong bg-surface px-7 text-sm font-medium transition-colors hover:bg-surface-secondary"
              >
                Read the manual
              </Link>
            </div>
            <p className="animate-rise d-4 mt-5 font-mono text-xs tracking-wide text-muted">
              projections = f(your assumptions) — not predictions
            </p>
          </div>
        </section>

        {/* Marquee */}
        <section aria-label="What the engine computes" className="marquee overflow-hidden border-y border-border bg-surface py-3.5">
          <div className="marquee-track gap-8">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="flex shrink-0 items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent" />
                {item}
              </span>
            ))}
          </div>
        </section>

        {/* Screenshot showcase */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <div className="animate-rise relative mx-auto max-w-4xl">
            <div
              aria-hidden="true"
              className="absolute -inset-6 rounded-[28px] bg-gradient-to-b from-accent/15 to-transparent blur-2xl"
            />
            <figure className="relative overflow-hidden rounded-[var(--radius-lg)] border border-border-strong bg-surface shadow-pop">
              <div className="flex h-9 items-center gap-1.5 border-b border-border bg-surface-secondary px-4" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-danger/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
                <span className="ml-3 font-mono text-[10px] text-muted">
                  makesense — dashboard
                </span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/screenshots/dashboard.png"
                alt="The MakeSense dashboard showing model summaries, year-one revenue, margins and generated insights"
                width={1440}
                height={900}
                loading="eager"
                className="block w-full"
              />
            </figure>
            <figcaption className="mt-4 text-center text-xs text-muted">
              The dashboard: every model&apos;s health in one glance.
            </figcaption>
          </div>
        </section>

        {/* Capabilities */}
        <section
          aria-label="Capabilities"
          className="mx-auto grid w-full max-w-6xl gap-3 px-4 pb-16 sm:grid-cols-2 lg:grid-cols-3 md:px-6"
        >
          {FEATURES.map(({ icon: Icon, title, body }, i) => (
            <article
              key={title}
              style={{ animationDelay: `${Math.min(i * 0.06, 0.36)}s` }}
              className="lift animate-rise-sm group rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-card hover:border-accent/40"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-base)] bg-accent-subtle text-accent transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-3.5 text-base font-semibold tracking-tight">{title}</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{body}</p>
            </article>
          ))}
        </section>

        {/* How it works */}
        <section className="border-y border-border bg-surface-secondary">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
            <h2 className="text-center text-lg font-semibold tracking-tight">
              Idea to decision in three passes
            </h2>
            <ol className="relative mt-8 grid gap-4 sm:grid-cols-3">
              <div
                aria-hidden="true"
                className="absolute left-[16%] right-[16%] top-7 hidden border-t border-dashed border-border-strong sm:block"
              />
              {[
                {
                  step: "01",
                  title: "Describe the business",
                  body: "Pick a template or start blank. Prices, costs, growth, churn — plain numbers, saved as you type.",
                },
                {
                  step: "02",
                  title: "Read the projections",
                  body: "Monthly profit, cash, break-even and unit economics appear instantly, each formula visible on demand.",
                },
                {
                  step: "03",
                  title: "Stress-test the decision",
                  body: "Twist assumptions across scenarios and sensitivity grids, then export a report worth sharing.",
                },
              ].map((item, i) => (
                <li
                  key={item.step}
                  style={{ animationDelay: `${i * 0.08}s` }}
                  className="animate-rise-sm lift relative rounded-[var(--radius-base)] bg-surface p-5 shadow-card"
                >
                  <span className="relative z-10 flex h-8 w-14 items-center justify-center rounded-full bg-accent font-mono text-[11px] font-bold text-accent-foreground">
                    {item.step}
                  </span>
                  <h3 className="mt-3 text-sm font-semibold">{item.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Calculators preview */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Free standalone calculators
              </h2>
              <p className="mt-1 max-w-xl text-xs leading-relaxed text-muted-foreground">
                Quick answers with formulas explained. The full app connects
                them into one coherent model.
              </p>
            </div>
            <Link
              href="/calculators"
              className="group inline-flex items-center gap-1 text-xs font-medium text-accent"
            >
              All twelve calculators
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {CALCULATOR_DIRECTORY.slice(0, 6).map((calc, i) => (
              <li key={calc.slug} style={{ animationDelay: `${Math.min(i * 0.05, 0.3)}s` }} className="animate-rise-sm">
                <Link
                  href={calc.slug}
                  className="lift group flex items-center justify-between gap-3 rounded-[var(--radius-base)] border border-border bg-surface px-4 py-3.5 shadow-card"
                >
                  <span>
                    <span className="block text-sm font-medium transition-colors group-hover:text-accent">
                      {calc.name}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-muted">
                      {calc.tagline}
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Privacy band */}
        <section className="border-t border-border">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-5 px-4 py-14 text-center md:px-6">
            <span className="animate-pop-in flex h-14 w-14 items-center justify-center rounded-2xl bg-success-subtle text-success">
              <ShieldCheck className="h-7 w-7" />
            </span>
            <h2 className="animate-rise max-w-lg text-balance text-xl font-semibold tracking-tight md:text-2xl">
              Your business plan is nobody else&apos;s business
            </h2>
            <p className="animate-rise d-1 max-w-md text-xs leading-relaxed text-muted-foreground">
              Models are stored in your browser via IndexedDB and never leave
              your device. No accounts, no servers holding your data, no
              analytics on your numbers.{" "}
              <Link href="/privacy" className="font-medium text-accent hover:underline">
                Read the privacy policy
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-20 md:px-6">
          <div className="animate-rise relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface p-10 text-center shadow-card md:p-14">
            <div aria-hidden="true" className="grid-bg absolute inset-0 opacity-70" />
            <div
              aria-hidden="true"
              className="orb orb-a left-1/2 top-0 h-56 w-56 -translate-x-1/2 -translate-y-1/2 bg-accent/25"
            />
            <div className="relative">
              <h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
                Model it before you build it
              </h2>
              <p className="mx-auto mt-2.5 max-w-md text-xs leading-relaxed text-muted-foreground md:text-sm">
                Ten minutes with honest numbers beats ten months of guessing.
                Start with a template and change everything.
              </p>
              <Link
                href="/models?new=1"
                className="group mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-accent px-8 text-sm font-medium text-accent-foreground shadow-pop transition-all hover:-translate-y-0.5 hover:bg-accent-hover active:translate-y-0"
              >
                Create your first model
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-[11px] leading-relaxed text-muted">
            Projections are mathematical consequences of the assumptions you
            enter, not predictions of what will happen. Validate figures with an
            accountant before making financial commitments.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
