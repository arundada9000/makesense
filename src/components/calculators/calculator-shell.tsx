import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface FaqItem {
  q: string;
  a: string;
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
    <div className="min-h-dvh">
      <header className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          MakeSense
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-base)] bg-accent px-4 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
        >
          Open the full app <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </header>

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

      <footer className="border-t border-border py-6 text-center text-xs text-muted">
        MakeSense | All rights reserved
      </footer>
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
