import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { PERSONAL_FINANCE_DIRECTORY } from "@/lib/personal-finance-directory";

export const metadata: Metadata = {
  title: "Free Personal Finance Calculators - Salary, Savings & Budget Tools",
  description:
    "Free personal finance calculators: salary conversion, savings goals, income vs expenses and emergency funds, each with the formula explained and a worked example. No account, works offline.",
  alternates: { canonical: "/personal-finance" },
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
            name: "Personal finance",
            item: `${SITE_URL}/personal-finance`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "Free personal finance calculators",
        itemListElement: PERSONAL_FINANCE_DIRECTORY.map((entry, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: entry.name,
          url: `${SITE_URL}${entry.slug}`,
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

export default function PersonalFinancePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <ItemListSchema />
      <SiteHeader />
      <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 md:px-6">
        <header className="max-w-2xl animate-rise">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Free personal finance tools
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Everyday money calculators, formulas made plain
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Four small calculators answer the questions that come up at the bank,
            the pay slip, and the shopping cart: what do I really earn, when can
            I afford it, where does my money go, and what should I set aside.
            Each one shows its formula and a worked example, so the answer never
            feels like magic.
          </p>
        </header>

        <ul
          aria-label="Personal finance calculators"
          className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-2"
        >
          {PERSONAL_FINANCE_DIRECTORY.map((entry, i) => (
            <li
              key={entry.slug}
              style={{ animationDelay: `${Math.min(i * 0.05, 0.4)}s` }}
              className="animate-rise-sm"
            >
              <Link
                href={entry.slug}
                className="lift group flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-card"
              >
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
                  {entry.tagline}
                </p>
                <h2 className="mt-1.5 text-base font-semibold tracking-tight transition-colors group-hover:text-accent">
                  {entry.name}
                </h2>
                <p className="mt-1 text-xs italic leading-relaxed text-muted-foreground">
                  &ldquo;{entry.question}&rdquo;
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
            Managing money for a business too?
          </h2>
          <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-muted-foreground">
            The same honesty carries over: twelve free business calculators for
            profit, revenue, runway, LTV:CAC and more, plus the full model
            simulator. Personal and business finance often cross at the same
            question about where the money goes.
          </p>
          <Link
            href="/calculators"
            className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-[var(--radius-base)] bg-accent px-5 text-sm font-medium text-accent-foreground shadow-card transition-all hover:-translate-y-px hover:bg-accent-hover"
          >
            View business calculators <ArrowUpRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}