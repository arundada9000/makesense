import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { CALCULATOR_DIRECTORY } from "@/lib/calculator-directory";

export const metadata: Metadata = {
  title: "Free Business Calculators - Startup, Profit & Finance Tools",
  description:
    "Twelve free business calculators: break-even, profit margin, revenue, ROI, pricing, cash flow, startup runway, SaaS metrics, LTV:CAC, corporate tax and VAT, each with formulas explained.",
  alternates: { canonical: "/calculators" },
};

const SITE_URL = "https://makesensebusiness.vercel.app";

function ItemListSchema() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Calculators",
            item: `${SITE_URL}/calculators`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "Free business calculators",
        itemListElement: CALCULATOR_DIRECTORY.map((calc, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: calc.name,
          url: `${SITE_URL}${calc.slug}`,
        })),
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default function CalculatorsPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <ItemListSchema />
      <SiteHeader />
      <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 md:px-6">
        <header className="max-w-2xl animate-rise">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Free calculator directory
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Twelve free business calculators, formulas explained
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Each free calculator solves one real question with the exact formula
            shown, worked examples, and the mistakes people commonly make. When
            one question is not enough, the{" "}
            <Link href="/models?new=1" className="font-medium text-accent hover:underline">
              full simulator
            </Link>{" "}
            connects them into a single model.
          </p>
        </header>

        <ul
          aria-label="Calculators"
          className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {CALCULATOR_DIRECTORY.map((calc, i) => (
            <li key={calc.slug} style={{ animationDelay: `${Math.min(i * 0.05, 0.4)}s` }} className="animate-rise-sm">
              <Link
                href={calc.slug}
                className="lift group flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-card"
              >
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
                  {calc.tagline}
                </p>
                <h2 className="mt-1.5 text-base font-semibold tracking-tight transition-colors group-hover:text-accent">
                  {calc.name}
                </h2>
                <p className="mt-1 text-xs italic leading-relaxed text-muted-foreground">
                  &ldquo;{calc.question}&rdquo;
                </p>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-medium text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  Open calculator <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <section className="animate-rise mt-12 rounded-[var(--radius-lg)] border border-border bg-surface-secondary p-6 md:p-8">
          <h2 className="text-lg font-semibold tracking-tight">
            Need all of it in one place?
          </h2>
          <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-muted-foreground">
            The simulator links these calculations into one coherent model with
            scenarios, sensitivity tables, financing schedules, and tax, then
            prints a report you can take to a bank or partner.
          </p>
          <Link
            href="/dashboard"
            className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-[var(--radius-base)] bg-accent px-5 text-sm font-medium text-accent-foreground shadow-card transition-all hover:-translate-y-px hover:bg-accent-hover"
          >
            Open the app <ArrowUpRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}