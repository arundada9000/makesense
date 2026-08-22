import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { ScrollReveal } from "./scroll-reveal";

/**
 * Shared chrome for static document pages: privacy, terms, manual.
 * Sections are plain semantic HTML so search and answer engines can lift
 * headings directly.
 */
export function DocPage({
  title,
  intro,
  updated = "August 2026",
  children,
}: {
  title: string;
  intro: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main-content" className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 md:px-6">
        <article>
          <header className="animate-rise">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{intro}</p>
            <p className="mt-2 text-xs text-muted">Last updated: {updated}</p>
          </header>
          <div className="mt-10 space-y-10">{children}</div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

export function DocSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <ScrollReveal>
      <section aria-labelledby={id} className="scroll-mt-24" id={id}>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground [&_a]:font-medium [&_a]:text-accent [&_code]:rounded [&_code]:border [&_code]:border-border [&_code]:bg-surface-secondary [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_strong]:text-foreground">
          {children}
        </div>
      </section>
    </ScrollReveal>
  );
}
