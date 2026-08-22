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
  Zap,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ShowcasePreview } from "@/components/site/showcase-preview";
import { LiveSimulator } from "@/components/site/live-simulator";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { CALCULATOR_DIRECTORY } from "@/lib/calculator-directory";

export const metadata: Metadata = {
  title: "MakeSense | Business Model Simulator",
  description:
    "Turn a business idea into a mathematical model. Revenue, costs, cash flow, tax, financing and scenarios, computed on your device with transparent formulas.",
  alternates: { canonical: "/" },
};

const FEATURES = [
  {
    icon: LineChart,
    title: "Full financial picture",
    body: "Revenue streams, cost structures, growth, profit waterfall, break-even, ROI, and cash flow in one coherent model with zero formula contradictions.",
  },
  {
    icon: Wallet,
    title: "Scenarios without spreadsheets",
    body: "Conservative to aggressive, side by side. Every number traces back to an assumption you set, so debates end quickly with pure math.",
  },
  {
    icon: Scale,
    title: "Tax aware",
    body: "Corporate tax with loss carryforward, VAT and GST splits, and a Nepal preset ready on first launch alongside customizable global profiles.",
  },
  {
    icon: Globe2,
    title: "Multi-currency",
    body: "Model in rupees, dollars, or euros. Conversions keep their rate, date, and source attached for every figure without floating-point errors.",
  },
  {
    icon: FileText,
    title: "Financing options",
    body: "Founder capital, amortized loans, and investor dilution with implied valuation: compare funding paths before signing anything.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    body: "Everything runs and stays on your device in IndexedDB. No account, no uploads, and no analytics tracking your financial numbers.",
  },
];

const MARQUEE_ITEMS = [
  "Break-even Analysis",
  "MRR / ARR Dynamics",
  "Runway Simulation",
  "LTV : CAC Unit Economics",
  "12-Month Cash Flow",
  "Payback Multiples",
  "Contribution Margins",
  "Investor Dilution",
  "VAT & GST Split",
  "Two-Variable Sensitivity",
  "ROI Waterfall",
  "Debt Amortization",
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
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
          <div aria-hidden="true" className="grid-bg absolute inset-0" />
          <div
            aria-hidden="true"
            className="orb orb-a -top-32 left-[15%] h-80 w-80 bg-accent/20"
          />
          <div
            aria-hidden="true"
            className="orb orb-b right-[10%] top-24 h-72 w-72 bg-success/10"
          />
          
          <div className="relative mx-auto w-full max-w-5xl px-4 text-center md:px-6">
            {/* Handcrafted Badge */}
            <div className="animate-rise-sm inline-flex items-center gap-2 rounded-full border border-border/90 bg-surface/90 px-3.5 py-1.5 shadow-card backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="text-xs font-medium tracking-tight text-foreground">
                Mathematical Modeling Engine
              </span>
              <span className="h-3 w-px bg-border" />
              <span className="font-mono text-[11px] text-muted">
                Decimal.js &bull; Local-First
              </span>
            </div>

            <h1 className="animate-rise d-1 mx-auto mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
              Know what your business numbers{" "}
              <span className="text-sheen">actually say</span>
            </h1>

            <p className="animate-rise d-2 mx-auto mt-5 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
              Turn your business idea into a complete mathematical model: revenue,
              costs, customers, tax, and financing. Stress-test every scenario
              before spending real capital.
            </p>

            <div className="animate-rise d-3 mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href="/dashboard"
                className="group inline-flex h-12 items-center gap-2 rounded-[var(--radius-base)] bg-accent px-7 text-sm font-semibold text-accent-foreground shadow-pop transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover active:translate-y-0"
              >
                <span>Start modeling free</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/manual"
                className="inline-flex h-12 items-center rounded-[var(--radius-base)] border border-border-strong bg-surface px-6 text-sm font-medium transition-all duration-200 hover:bg-surface-secondary hover:border-accent/40"
              >
                Read user manual
              </Link>
            </div>

            <div className="animate-rise d-4 mt-6 flex flex-wrap items-center justify-center gap-4 text-[11px] text-muted font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                No registration required
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                Runs 100% offline
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                Zero floating-point drift
              </span>
            </div>
          </div>
        </section>

        {/* Marquee */}
        <section aria-label="Engine Capabilities" className="marquee overflow-hidden border-y border-border bg-surface py-3.5">
          <div className="marquee-track gap-8">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="flex shrink-0 items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
                {item}
              </span>
            ))}
          </div>
        </section>

        {/* Interactive Workspace Showcase */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                Interactive Workspace
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                Explore every dimension of your business
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground md:text-sm">
                Switch between core views below to see how MakeSense connects
                assumptions, statements, and scenario analysis into one coherent model.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <ShowcasePreview />
          </ScrollReveal>
        </section>

        {/* Live Mini-Simulator Sandbox */}
        <section className="border-y border-border bg-surface-secondary/50 py-16 md:py-24">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
            <ScrollReveal>
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-subtle px-3 py-1 text-xs font-semibold text-accent">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Instant Math
                </span>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
                  Try the calculation engine in real-time
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground md:text-sm">
                  Adjust the sliders below to see live unit economics and break-even
                  points recalculate instantly on your device.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <LiveSimulator />
            </ScrollReveal>
          </div>
        </section>

        {/* Capabilities Grid */}
        <section aria-label="Capabilities" className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <ScrollReveal>
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                Built For Decisions
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                Everything required to model real business economics
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body }, i) => (
              <ScrollReveal key={title} delay={i * 60}>
                <article className="lift group h-full rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-card hover:border-accent/40">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-base)] bg-accent-subtle text-accent transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3.5 text-base font-semibold tracking-tight">{title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{body}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="border-y border-border bg-surface-secondary">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-24">
            <ScrollReveal>
              <div className="text-center max-w-xl mx-auto">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                  Workflow
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                  Idea to decision in three passes
                </h2>
              </div>
            </ScrollReveal>

            <ol className="relative mt-12 grid gap-4 sm:grid-cols-3">
              <div
                aria-hidden="true"
                className="absolute left-[16%] right-[16%] top-7 hidden border-t border-dashed border-border-strong sm:block"
              />
              {[
                {
                  step: "01",
                  title: "Describe the business",
                  body: "Pick a template or start blank. Prices, costs, growth, and churn: enter plain numbers, saved instantly as you type.",
                },
                {
                  step: "02",
                  title: "Read the projections",
                  body: "Monthly profit, cash trajectory, break-even point, and unit economics appear instantly with every formula inspectable.",
                },
                {
                  step: "03",
                  title: "Stress-test the decision",
                  body: "Twist assumptions across scenarios and two-variable sensitivity grids, then export a report ready for partners or banks.",
                },
              ].map((item, i) => (
                <ScrollReveal key={item.step} delay={i * 80}>
                  <li className="lift relative h-full rounded-[var(--radius-base)] border border-border bg-surface p-5 shadow-card">
                    <span className="relative z-10 flex h-8 w-14 items-center justify-center rounded-full bg-accent font-mono text-[11px] font-bold text-accent-foreground">
                      {item.step}
                    </span>
                    <h3 className="mt-3.5 text-sm font-semibold">{item.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
                  </li>
                </ScrollReveal>
              ))}
            </ol>
          </div>
        </section>

        {/* Calculators Preview */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <ScrollReveal>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                  Standalone Tools
                </p>
                <h2 className="mt-1.5 text-2xl font-semibold tracking-tight">
                  Twelve free business calculators
                </h2>
                <p className="mt-1 max-w-xl text-xs leading-relaxed text-muted-foreground">
                  Quick answers with formulas and worked examples. The full app connects
                  them into one coherent financial model.
                </p>
              </div>
              <Link
                href="/calculators"
                className="group inline-flex items-center gap-1 text-xs font-semibold text-accent transition-colors hover:underline"
              >
                <span>View all twelve calculators</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </ScrollReveal>

          <ul className="mt-8 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {CALCULATOR_DIRECTORY.slice(0, 6).map((calc, i) => (
              <ScrollReveal key={calc.slug} delay={i * 50}>
                <li>
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
              </ScrollReveal>
            ))}
          </ul>
        </section>

        {/* Privacy Section */}
        <section className="border-t border-border bg-surface-secondary/40">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-5 px-4 py-16 text-center md:px-6">
            <ScrollReveal>
              <div className="flex flex-col items-center gap-4">
                <span className="animate-pop-in flex h-14 w-14 items-center justify-center rounded-2xl bg-success-subtle text-success shadow-card">
                  <ShieldCheck className="h-7 w-7" />
                </span>
                <h2 className="max-w-lg text-balance text-xl font-semibold tracking-tight md:text-2xl">
                  Your business model is nobody else&apos;s business
                </h2>
                <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
                  Models are stored privately on your device via IndexedDB. No accounts,
                  no external servers holding your proprietary spreadsheets, and zero tracking.{" "}
                  <Link href="/privacy" className="font-medium text-accent hover:underline">
                    Read the privacy policy
                  </Link>
                  .
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 md:px-6">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-border-strong bg-surface p-10 text-center shadow-card md:p-14">
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
                  Start with a template and customize everything.
                </p>
                <Link
                  href="/models?new=1"
                  className="group mt-6 inline-flex h-12 items-center gap-2 rounded-[var(--radius-base)] bg-accent px-8 text-sm font-semibold text-accent-foreground shadow-pop transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover active:translate-y-0"
                >
                  <span>Create your first model</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
            <p className="mx-auto mt-8 max-w-2xl text-center text-[11px] leading-relaxed text-muted">
              Projections are mathematical consequences of the assumptions you
              enter, not predictions of what will happen. Validate figures with an
              accountant before making financial commitments.
            </p>
          </ScrollReveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
