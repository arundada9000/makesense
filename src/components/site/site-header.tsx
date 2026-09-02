"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LineChart, Menu, Sparkles, X } from "lucide-react";
import { CALCULATOR_DIRECTORY } from "@/lib/calculator-directory";
import { PERSONAL_FINANCE_DIRECTORY } from "@/lib/personal-finance-directory";

const CALCULATOR_PATHS = new Set([
  "/calculators",
  ...CALCULATOR_DIRECTORY.map((c) => c.slug),
]);

const PERSONAL_FINANCE_PATHS = new Set([
  "/personal-finance",
  ...PERSONAL_FINANCE_DIRECTORY.map((c) => c.slug),
]);

const NAV_LINKS = [
  {
    href: "/calculators",
    label: "Calculators",
    isActive: (path: string) => CALCULATOR_PATHS.has(path),
  },
  {
    href: "/personal-finance",
    label: "Personal finance",
    isActive: (path: string) => PERSONAL_FINANCE_PATHS.has(path),
  },
  {
    href: "/guides",
    label: "Guides",
    isActive: (path: string) => path.startsWith("/guides"),
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
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

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
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-base)] text-muted-foreground transition-colors hover:bg-surface-secondary hover:text-foreground md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link
            href="/dashboard"
            className="group inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-base)] bg-accent px-4 text-xs font-semibold text-accent-foreground shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover active:translate-y-0"
          >
            <Sparkles className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-12" />
            <span className="hidden sm:inline">Open app</span>
            <span className="sm:hidden">App</span>
          </Link>
        </div>
      </div>
      {menuOpen && (
        <nav
          aria-label="Mobile menu"
          className="border-t border-border bg-background/95 px-4 py-3 backdrop-blur-xl md:hidden"
        >
          <ul className="space-y-1">
            {NAV_LINKS.map(({ href, label, isActive }) => {
              const active = isActive(pathname);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={closeMenu}
                    className={`block rounded-[var(--radius-base)] px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-surface-secondary text-foreground"
                        : "text-muted-foreground hover:bg-surface-secondary/70 hover:text-foreground"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
            <li key="manual">
              <Link
                href="/manual"
                onClick={closeMenu}
                className="block rounded-[var(--radius-base)] px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-secondary/70 hover:text-foreground"
              >
                Manual
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}