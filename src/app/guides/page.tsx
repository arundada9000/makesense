import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export const metadata: Metadata = {
  title: "Financial Guides - Formulas & Walkthroughs",
  description:
    "Plain-language guides to emergency funds, saving goals, common money mistakes and startup finances, plus runway, revenue estimation and LTV:CAC. Each explains the formula and links to a free calculator.",
  alternates: { canonical: "/guides" },
};

const GUIDES = [
  {
    href: "/guides/how-to-build-an-emergency-fund",
    title: "How to build an emergency fund",
    desc: "How big the fund should be, the months formula, and the step order that makes the habit stick.",
  },
  {
    href: "/guides/financial-dos-and-donts",
    title: "Money dos and don'ts",
    desc: "The habits that actually move the needle: what to automate, what to avoid, and the rules of thumb in between.",
  },
  {
    href: "/guides/common-money-mistakes",
    title: "Common money mistakes",
    desc: "The financial downfalls that sneak up on you, from lifestyle creep to timing markets, with the fix for each.",
  },
  {
    href: "/guides/best-personal-finance-books",
    title: "Best personal finance books",
    desc: "The one idea each well-known book teaches, and which book to pick for the problem you have right now.",
  },
  {
    href: "/guides/interest-rates-and-inflation",
    title: "Interest rates and inflation",
    desc: "How the market moves your money: savings yield, debt cost, buying power, and the three signals worth reading.",
  },
  {
    href: "/guides/how-to-calculate-startup-runway",
    title: "How to calculate startup runway",
    desc: "The exact formula, a worked example, and what 12 months of runway actually means for fundraising.",
  },
  {
    href: "/guides/how-to-estimate-a-companys-revenue",
    title: "How much is a company making? 7 ways to estimate revenue",
    desc: "Estimate any company's revenue without internal numbers - from pricing, public filings, headcount, traffic and unit economics.",
  },
  {
    href: "/guides/how-to-calculate-ltv-cac",
    title: "How to calculate LTV:CAC for a subscription business",
    desc: "Customer lifetime value, acquisition cost and payback, with the 3:1 rule explained through worked numbers.",
  },
];

function CollectionSchema() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://makesensebusiness.vercel.app/" },
          {
            "@type": "ListItem",
            position: 2,
            name: "Guides",
            item: "https://makesensebusiness.vercel.app/guides",
          },
        ],
      },
      {
        "@type": "CollectionPage",
        name: "Financial guides",
        hasPart: GUIDES.map((g) => ({
          "@type": "Article",
          headline: g.title,
          url: `https://makesensebusiness.vercel.app${g.href}`,
        })),
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export default function GuidesPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <CollectionSchema />
      <SiteHeader />
      <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 md:px-6">
        <header className="max-w-2xl animate-rise">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Guides & walkthroughs
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Understand the math behind your money
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Each guide explains one financial concept in plain language, walks
            through the numbers by hand, then hands you a free calculator to run
            your own figures. From your first emergency fund to your company&apos;s
            runway, no spreadsheets and no accounts.
          </p>
        </header>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {GUIDES.map((g, i) => (
            <li key={g.href} className="animate-rise-sm" style={{ animationDelay: `${Math.min(i * 0.06, 0.25)}s` }}>
              <Link
                href={g.href}
                className="lift group flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-card"
              >
                <h2 className="text-base font-semibold tracking-tight transition-colors group-hover:text-accent">
                  {g.title}
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{g.desc}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-medium text-accent">
                  Read the guide <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <section className="animate-rise mt-12 rounded-[var(--radius-lg)] border border-border bg-surface-secondary p-6 md:p-8">
          <h2 className="text-lg font-semibold tracking-tight">Skip the reading, run the numbers</h2>
          <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-muted-foreground">
Every guide ends in a free calculator. Browse all eighteen
                tools or open the full business model simulator that connects
                them.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/calculators"
              className="inline-flex h-10 items-center gap-1.5 rounded-[var(--radius-base)] bg-accent px-5 text-sm font-medium text-accent-foreground shadow-card transition-all hover:-translate-y-px hover:bg-accent-hover"
            >
              All calculators <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center rounded-[var(--radius-base)] border border-border-strong bg-surface px-5 text-sm font-medium transition-colors hover:bg-surface-secondary"
            >
              Open the app
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}