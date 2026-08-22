import Link from "next/link";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export interface FaqItem {
  q: string;
  a: string;
}

/** Schema.org JSON-LD for rich results on calculator pages. */
function StructuredData({
  title,
  intro,
  faq,
}: {
  title: string;
  intro: string;
  faq: FaqItem[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "/" },
          { "@type": "ListItem", position: 2, name: "Calculators", item: "/calculators" },
          { "@type": "ListItem", position: 3, name: title },
        ],
      },
      {
        "@type": "WebApplication",
        name: title,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        description: intro,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      // Structured content is fully controlled by us, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Shared layout for standalone calculator landing pages. Each page supplies
 * its own interactive widget plus genuinely useful educational content so no
 * page is a thin wrapper around another.
 */
export function CalculatorShell({
  title,
  intro,
  children,
  formula,
  example,
  mistakes,
  faq,
  related,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
  formula: React.ReactNode;
  example: React.ReactNode;
  mistakes: string[];
  faq: FaqItem[];
  related: Array<{ href: string; label: string }>;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <StructuredData title={title} intro={intro} faq={faq} />
      <SiteHeader />

      <main id="main-content" className="mx-auto w-full max-w-4xl px-4 pb-16 md:px-6">
        <section className="pt-8 md:pt-12">
          <h1 className="text-balance text-2xl font-semibold tracking-tight md:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
            {intro}
          </p>
        </section>

        <section aria-label="Interactive calculator" className="mt-8">
          {children}
        </section>

        <Section title="How the formula works">{formula}</Section>
        <Section title="Worked example">{example}</Section>
        <Section title="Common mistakes">
          <ul className="space-y-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {mistakes.map((m) => (
              <li key={m} className="flex gap-2">
                <span aria-hidden>-</span>
                {m}
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Frequently asked questions">
          <div className="space-y-2">
            {faq.map((item) => (
              <details
                key={item.q}
                className="rounded-[var(--radius-base)] border border-border bg-surface px-4 py-3"
              >
                <summary className="cursor-pointer text-sm font-medium">
                  {item.q}
                </summary>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </Section>
        <Section title="Related tools">
          <div className="flex flex-wrap gap-2">
            {related.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="inline-flex h-9 items-center rounded-full border border-border bg-surface px-4 text-xs font-medium transition-colors hover:border-accent hover:text-accent"
              >
                {r.label}
              </Link>
            ))}
          </div>
        </Section>

        <p className="mt-10 rounded-[var(--radius-base)] border border-dashed border-border-strong bg-surface-secondary p-4 text-xs leading-relaxed text-muted">
          Results are arithmetic on the numbers you enter, not predictions.
          Validate important figures with an accountant before making financial
          commitments.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground [&_strong]:text-foreground">
        {children}
      </div>
    </section>
  );
}
