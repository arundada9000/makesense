import Link from "next/link";
import type { Metadata } from "next";
import { Home, LayoutDashboard, Calculator } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "This page went out of business. Head back to MakeSense.",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div
        aria-hidden="true"
        className="orb orb-a -top-24 left-1/2 h-72 w-72 -translate-x-1/2 bg-accent/20"
      />
      <p className="animate-rise-sm font-mono text-sm tracking-widest text-muted">
        ERROR 404: ASSETS NOT FOUND
      </p>
      <h1 className="animate-rise d-1 mt-3 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
        This page went{" "}
        <span className="text-sheen">out of business</span>
      </h1>
      <p className="animate-rise d-2 mt-3 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
        The ledger has no record of it. Your money is safe: it was never here.
      </p>

      <div aria-hidden="true" className="animate-rise d-3 mt-8 flex gap-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{ animationDelay: `${i * 0.35}s` }}
            className="coin-bob flex h-12 w-12 items-center justify-center rounded-full border-2 border-border-strong bg-gradient-to-br from-accent to-accent-hover font-mono text-base font-bold text-accent-foreground shadow-card"
          >
            ₹
          </span>
        ))}
      </div>

      <nav
        aria-label="Recovery options"
        className="animate-rise d-4 mt-10 flex flex-wrap items-center justify-center gap-2.5"
      >
        <Link
          href="/"
          className="inline-flex h-10 items-center gap-1.5 rounded-[var(--radius-base)] bg-accent px-5 text-sm font-medium text-accent-foreground shadow-card transition-all hover:-translate-y-px hover:bg-accent-hover"
        >
          <Home className="h-4 w-4" /> Back home
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex h-10 items-center gap-1.5 rounded-[var(--radius-base)] border border-border-strong bg-surface px-5 text-sm font-medium transition-colors hover:bg-surface-secondary"
        >
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </Link>
        <Link
          href="/calculators"
          className="inline-flex h-10 items-center gap-1.5 rounded-[var(--radius-base)] px-4 text-sm text-muted-foreground transition-colors hover:text-accent"
        >
          <Calculator className="h-4 w-4" /> Calculators
        </Link>
      </nav>
    </div>
  );
}
