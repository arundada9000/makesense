import Link from "next/link";
import { Globe, ExternalLink } from "lucide-react";
import { InstallButton } from "@/components/site/install-button";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const COLUMNS: { title: string; links: Array<[string, string]> }[] = [
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
    title: "Personal finance",
    links: [
      ["Salary calculator", "/personal-finance/salary-calculator"],
      ["Savings goal calculator", "/personal-finance/savings-goal-calculator"],
      ["Can I afford it", "/personal-finance/can-i-afford-calculator"],
      ["Year from now", "/personal-finance/year-from-now-calculator"],
      ["Income and expenses", "/personal-finance/income-expense-calculator"],
      ["Emergency fund", "/personal-finance/emergency-fund-calculator"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["User manual", "/manual"],
      ["How to build an emergency fund", "/guides/how-to-build-an-emergency-fund"],
      ["Money dos and don'ts", "/guides/financial-dos-and-donts"],
      ["Common money mistakes", "/guides/common-money-mistakes"],
      ["Best finance books", "/guides/best-personal-finance-books"],
      ["Interest rates and inflation", "/guides/interest-rates-and-inflation"],
      ["Startup runway guide", "/guides/how-to-calculate-startup-runway"],
      ["Estimate a company's revenue", "/guides/how-to-estimate-a-companys-revenue"],
      ["LTV:CAC guide", "/guides/how-to-calculate-ltv-cac"],
      ["All guides", "/guides"],
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

const SOCIAL_LINKS = [
  {
    name: "Portfolio",
    href: "https://arunneupane.vercel.app",
    icon: Globe,
  },
  {
    name: "GitHub",
    href: "https://github.com/arunneupane",
    icon: GithubIcon,
  },
  {
    name: "Twitter",
    href: "https://x.com/arunneupane",
    icon: TwitterIcon,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/arunneupane",
    icon: LinkedinIcon,
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface-secondary">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold tracking-tight">MakeSense</p>
              <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">
                Calculators and a full simulator for business and everyday
                finance, running entirely on your device with transparent
                formulas: no account, no uploads, no tracking.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <InstallButton />
            </div>
            <div className="flex items-center gap-2 pt-1">
              {SOCIAL_LINKS.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Arun Neupane's ${name}`}
                  className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-base)] border border-border/80 bg-surface text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent-subtle hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
            <p className="text-xs text-muted">Made in Butwal, Nepal</p>
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
          <p className="flex items-center gap-1.5">
            <span>Built by</span>
            <a
              href="https://arunneupane.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
            >
              <span>Arun Neupane</span>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}