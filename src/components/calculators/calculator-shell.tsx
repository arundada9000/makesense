import Link from "next/link";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Breadcrumbs } from "@/components/site/breadcrumbs";

export interface FaqItem {
  q: string;
  a: string;
}

export interface HowToStep {
  name?: string;
  text: string;
}

export interface CalcSection {
  name: string;
  href: string;
}

const SITE_URL = "https://makesensebusiness.vercel.app";

/** Schema.org JSON-LD for rich results, answer engines and AI crawlers. */
function StructuredData({
  path,
  title,
  intro,
  faq,
  keywords,
  featureList,
  howToSteps,
  section,
}: {
  path: string;
  title: string;
  intro: string;
  faq: FaqItem[];
  keywords?: string[];
  featureList?: string[];
  howToSteps?: HowToStep[];
  section: CalcSection;
}) {
  const url = `${SITE_URL}${path}`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: section.name,
            item: `${SITE_URL}${section.href}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: title,
            item: url,
          },
        ],
      },
      {
        "@type": "WebApplication",
        name: title,
        url,
        description: intro,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        inLanguage: "en",
        softwareVersion: "1.0",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        author: { "@type": "Person", name: "Arun Neupane" },
        publisher: { "@type": "Organization", name: "MakeSense" },
        ...(featureList?.length ? { featureList } : {}),
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
      ...(howToSteps && howToSteps.length
        ? [
            {
              "@type": "HowTo",
              name: `How to calculate ${title.toLowerCase()}`,
              description: `Step-by-step ${title.toLowerCase()} calculation with a worked example.`,
              step: howToSteps.map((s, i) => ({
                "@type": "HowToStep",
                position: i + 1,
                ...(s.name ? { name: s.name } : {}),
                text: s.text,
              })),
            },
          ]
        : []),
      ...(keywords?.length
        ? [
            {
              "@type": "DefinedTermSet",
              name: title,
              hasDefinedTerm: keywords.map((k) => ({
                "@type": "DefinedTerm",
                name: k,
              })),
            },
          ]
        : []),
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/**
 * Shared layout for standalone calculator landing pages. Each page supplies
 * its own interactive widget plus genuinely useful educational content so no
 * page is a thin wrapper around another.
 */
export function CalculatorShell({
  path,
  title,
  intro,
  children,
  formula,
  example,
  mistakes,
  faq,
  related,
  relatedDisclaimers,
  keywords,
  featureList,
  howToSteps,
  whatAffects,
  updated,
  section = { name: "Calculators", href: "/calculators" },
}: {
  path: string;
  title: string;
  intro: string;
  children: React.ReactNode;
  formula: React.ReactNode;
  example: React.ReactNode;
  mistakes: string[];
  faq: FaqItem[];
  related: Array<{ href: string; label: string }>;
  relatedDisclaimers?: string[];
  keywords?: string[];
  featureList?: string[];
  howToSteps?: HowToStep[];
  whatAffects?: React.ReactNode;
  updated?: string;
  section?: CalcSection;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <StructuredData
        path={path}
        title={title}
        intro={intro}
        faq={faq}
        keywords={keywords}
        featureList={featureList}
        howToSteps={howToSteps}
        section={section}
      />
      <SiteHeader />

      <main id="main-content" className="mx-auto w-full max-w-4xl px-4 pb-16 md:px-6">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: section.name, href: section.href },
            { name: title },
          ]}
        />
        <section className="pt-4 md:pt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Free calculator
          </p>
          <h1 className="text-balance text-2xl font-semibold tracking-tight md:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
            {intro}
          </p>
          {updated && (
            <p className="mt-2 text-[11px] text-muted">Last updated: {updated}</p>
          )}
        </section>

        <section aria-label="Interactive calculator" className="mt-8">
          {children}
        </section>

        <Section title="How the formula works">{formula}</Section>
        <Section title="Worked example">{example}</Section>
        {howToSteps && howToSteps.length > 0 && (
          <Section title="How to use the calculator">
            <ol className="space-y-3">
              {howToSteps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-subtle font-mono text-[11px] font-bold text-accent"
                  >
                    {i + 1}
                  </span>
                  <div>
                    {step.name && <strong className="block text-sm">{step.name}</strong>}
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>
        )}
        {whatAffects && <Section title="What affects the result">{whatAffects}</Section>}
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
            <Link
              href={section.href}
              className="inline-flex h-9 items-center rounded-full border border-border bg-surface px-4 text-xs font-medium transition-colors hover:border-accent hover:text-accent"
            >
              All {section.name.toLowerCase()}
            </Link>
          </div>
        </Section>

        <p className="mt-10 rounded-[var(--radius-base)] border border-dashed border-border-strong bg-surface-secondary p-4 text-xs leading-relaxed text-muted">
          Results are arithmetic on the numbers you enter, not predictions.
          Validate important figures with an accountant before making financial
          commitments.
          {relatedDisclaimers?.length
            ? ` ${relatedDisclaimers.join(" ")}`
            : ""}
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