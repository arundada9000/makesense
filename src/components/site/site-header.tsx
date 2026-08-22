"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LineChart, Sparkles } from "lucide-react";
import { CALCULATOR_DIRECTORY } from "@/lib/calculator-directory";

const CALCULATOR_PATHS = new Set([
  "/calculators",
  ...CALCULATOR_DIRECTORY.map((c) => c.slug),
]);

const NAV_LINKS = [
  {
    href: "/calculators",
    label: "Calculators",
    isActive: (path: string) => CALCULATOR_PATHS.has(path),
  },
  {
    href: "/manual",
    label: "Manual",
    isActive: (path: string) => path.startsWith("/manual"),
  },
  {
    href: "/privacy",
    label: "Privacy",
    isActive: (path: string) => path === "/privacy" || path === "/terms",
  },
];

export function SiteLogo() {
  return (
    <span className="flex items-center gap-2.5 group">
      <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-base)] bg-accent text-accent-foreground shadow-card transition-all duration-300 group-hover:scale-105 group-hover:-rotate-6 group-hover:shadow-pop">
        <LineChart className="h-4 w-4" strokeWidth={2.5} />
      </span>
      <span className="flex flex-col">
        <span className="text-sm font-semibold tracking-tight transition-colors group-hover:text-accent">
          MakeSense
        </span>
      </span>
    </span>
  );
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          aria-label="MakeSense home"
          className="rounded-[var(--radius-base)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <SiteLogo />
        </Link>
        <nav aria-label="Marketing" className="hidden items-center gap-1.5 md:flex">
          {NAV_LINKS.map(({ href, label, isActive }) => {
            const active = isActive(pathname);
            return (
              <Link
                key={href}
                href={href}
                className={`relative rounded-[var(--radius-base)] px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                  active
                    ? "bg-surface-secondary text-foreground shadow-xs border border-border/80 font-semibold"
                    : "text-muted-foreground hover:bg-surface-secondary/70 hover:text-foreground border border-transparent"
                }`}
              >
                {label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1.5 left-1/2 h-0.5 w-3 -translate-x-1/2 rounded-full bg-accent"
                  />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2.5">
          <Link
            href="/manual"
            className="hidden h-9 items-center rounded-[var(--radius-base)] px-3.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-secondary hover:text-foreground sm:inline-flex md:hidden lg:inline-flex"
          >
            Manual
          </Link>
          <Link
            href="/dashboard"
            className="group inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-base)] bg-accent px-4 text-xs font-semibold text-accent-foreground shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover active:translate-y-0"
          >
            <Sparkles className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-12" />
            <span>Open app</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
