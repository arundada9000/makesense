import Link from "next/link";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export interface FaqItem {
  q: string;
  a: string;
}

export interface HowToStep {
  name?: string;
  text: string;
}

const SITE_URL = "https://makesensebusiness.vercel.app";
const PUBLISHED = "2026-09-01";
const MODIFIED = "2026-09-01";

/** Schema.org JSON-LD (Article + HowTo + FAQ) for answer-engine friendly guides. */
function StructuredData({
  path,
  title,
  desc,
  faq,
  howToSteps,
}: {
  path: string;
  title: string;
  desc: string;
  faq: FaqItem[];
  howToSteps?: HowToStep[];
}) {
  const url = `${SITE_URL}${path}`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: title,
        description: desc,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        author: { "@type": "Person", name: "Arun Neupane" },
        publisher: {
          "@type": "Organization",
          name: "MakeSense",
          logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
        },
        datePublished: PUBLISHED,
        dateModified: MODIFIED,
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides` },
          { "@type": "ListItem", position: 3, name: title, item: url },
        ],
      },
      ...(howToSteps && howToSteps.length
        ? [
            {
              "@type": "HowTo",
              name: `How to calculate ${title.toLowerCase().replace(/^how to calculate /, "")}`,
              description: desc,
              step: howToSteps.map((s, i) => ({
                "@type": "HowToStep",
                position: i + 1,
                ...(s.name ? { name: s.name } : {}),
                text: s.text,
              })),
            },
          ]
        : []),
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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/**
 * Shared layout for educational guides. Combines a table of contents, full
 * article body, related calculators and author/source signals so the page works
 * for both people and answer engines.
 */
export function GuideShell({
  path,
  title,
  desc,
  sections,
  howToSteps,
  faq,
  related,
}: {
  path: string;
  title: string;
  desc: string;
  sections: Array<{ id: string; title: string; body: React.ReactNode }>;
  howToSteps?: HowToStep[];
  faq: FaqItem[];
  related: Array<{ href: string; label: string }>;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <StructuredData path={path} title={title} desc={desc} faq={faq} howToSteps={howToSteps} />
      <SiteHeader />

      <main id="main-content" className="mx-auto w-full max-w-4xl px-4 pb-16 md:px-6">
        <article>
          <header className="pt-8 md:pt-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              <Link href="/guides" className="transition-colors hover:text-accent-hover">
                Guides
              </Link>
            </p>
            <h1 className="mt-2 text-balance text-2xl font-semibold tracking-tight md:text-4xl">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
              {desc}
            </p>
            <p className="mt-3 flex items-center gap-3 text-[11px] text-muted">
              <span>MakeSense</span>
              <span>·</span>
              <time dateTime={MODIFIED}>Updated September 2026</time>
              <span>·</span>
              <span>3 min read</span>
            </p>
          </header>

          <nav
            aria-label="Table of contents"
            className="mt-8 rounded-[var(--radius-base)] border border-border bg-surface-secondary/60 p-4"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              On this page
            </p>
            <ol className="mt-2 space-y-1.5">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-xs text-muted-foreground transition-colors hover:text-accent"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-10 space-y-10">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="text-lg font-semibold tracking-tight md:text-xl">{s.title}</h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground [&_strong]:text-foreground [&_li]:mt-1.5">
                  {s.body}
                </div>
              </section>
            ))}
            {howToSteps && howToSteps.length > 0 && (
              <section id="steps" className="scroll-mt-24">
                <h2 className="text-lg font-semibold tracking-tight md:text-xl">
                  Step-by-step calculation
                </h2>
                <ol className="mt-3 space-y-3">
                  {howToSteps.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-subtle font-mono text-[11px] font-bold text-accent"
                      >
                        {i + 1}
                      </span>
                      <div className="text-sm leading-relaxed text-muted-foreground [&_strong]:text-foreground">
                        {step.name && <strong className="block">{step.name}</strong>}
                        <p>{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>

          {faq.length > 0 && (
            <section id="faq" className="mt-10 scroll-mt-24">
              <h2 className="text-lg font-semibold tracking-tight md:text-xl">
                Frequently asked questions
              </h2>
              <div className="mt-3 space-y-2">
                {faq.map((item) => (
                  <details
                    key={item.q}
                    className="rounded-[var(--radius-base)] border border-border bg-surface px-4 py-3"
                  >
                    <summary className="cursor-pointer text-sm font-medium">{item.q}</summary>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}

          <section id="related" className="mt-10 scroll-mt-24">
            <h2 className="text-lg font-semibold tracking-tight md:text-xl">Related calculators</h2>
            <div className="mt-3 flex flex-wrap gap-2">
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
          </section>
        </article>

        <p className="mt-10 rounded-[var(--radius-base)] border border-dashed border-border-strong bg-surface-secondary p-4 text-xs leading-relaxed text-muted">
          This guide is for education, not financial advice. Validate important
          figures with an accountant before making financial commitments.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}