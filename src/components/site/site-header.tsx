import Link from "next/link";
import { LineChart } from "lucide-react";

const NAV_LINKS = [
  { href: "/calculators", label: "Calculators" },
  { href: "/manual", label: "Manual" },
  { href: "/privacy", label: "Privacy" },
];

export function SiteLogo() {
  return (
    <span className="flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-accent-foreground shadow-card transition-transform duration-300 hover:-rotate-6">
        <LineChart className="h-4 w-4" strokeWidth={2.5} />
      </span>
      <span className="text-sm font-semibold tracking-tight">MakeSense</span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" aria-label="MakeSense home" className="transition-opacity hover:opacity-80">
          <SiteLogo />
        </Link>
        <nav aria-label="Marketing" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-[var(--radius-base)] px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-secondary hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/manual"
            className="hidden h-9 items-center rounded-[var(--radius-base)] px-3 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex md:hidden lg:inline-flex"
          >
            Manual
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-base)] bg-accent px-4 text-sm font-medium text-accent-foreground shadow-card transition-all hover:-translate-y-px hover:bg-accent-hover active:translate-y-0"
          >
            Open app
          </Link>
        </div>
      </div>
    </header>
  );
}
