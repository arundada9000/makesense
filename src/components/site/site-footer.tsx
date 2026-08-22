import Link from "next/link";

const COLUMNS: { title: string; links: Array<[string, string]> }[] = [
  {
    title: "Product",
    links: [
      ["Open the app", "/dashboard"],
      ["Model templates", "/models?new=1"],
      ["Compare models", "/compare"],
      ["Printable reports", "/manual#reports"],
    ],
  },
  {
    title: "Calculators",
    links: [
      ["Break-even", "/break-even-calculator"],
      ["Startup runway", "/startup-runway-calculator"],
      ["SaaS metrics", "/saas-calculator"],
      ["All 12 calculators", "/calculators"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["User manual", "/manual"],
      ["Keyboard shortcuts", "/manual#shortcuts"],
      ["Formula reference", "/manual#formulas"],
      ["FAQ", "/manual#faq"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy policy", "/privacy"],
      ["Terms and disclaimer", "/terms"],
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface-secondary">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <p className="text-sm font-semibold tracking-tight">MakeSense</p>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">
              A business model simulator that runs entirely on your device.
              Model revenue, costs, tax, financing and scenarios with
              transparent formulas — no account, no uploads, no tracking.
            </p>
            <p className="mt-3 text-xs text-muted">Made in Butwal, Nepal</p>
          </div>
          {COLUMNS.map(({ title, links }) => (
            <nav key={title} aria-label={title}>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                {title}
              </p>
              <ul className="mt-3 space-y-2">
                {links.map(([label, href]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-xs text-muted-foreground transition-colors hover:text-accent"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted">
          <p>© 2026 MakeSense. Projections are not predictions.</p>
          <p>
            Built by{" "}
            <a
              href="https://arunneupane.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
            >
              Arun Neupane
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
