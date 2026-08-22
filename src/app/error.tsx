"use client";

import { RotateCcw, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div
        aria-hidden="true"
        className="orb orb-b right-1/4 top-1/3 h-64 w-64 bg-danger/15"
      />
      <span className="animate-pop-in flex h-14 w-14 items-center justify-center rounded-full bg-danger-subtle text-danger">
        <AlertTriangle className="h-6 w-6" />
      </span>
      <p className="animate-rise-sm mt-5 font-mono text-sm tracking-widest text-muted">
        UNEXPECTED LIQUIDATION
      </p>
      <h1 className="animate-rise d-1 mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
        The books refused to balance
      </h1>
      <p className="animate-rise d-2 mt-3 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
        Something went wrong on this screen. Your models are safe on this
        device; nothing was lost.
      </p>
      <div className="animate-rise d-3 mt-8 flex flex-wrap items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-10 items-center gap-1.5 rounded-[var(--radius-base)] bg-accent px-5 text-sm font-medium text-accent-foreground shadow-card transition-all hover:-translate-y-px hover:bg-accent-hover"
        >
          <RotateCcw className="h-4 w-4" /> Refinance and retry
        </button>
        <Link
          href="/dashboard"
          className="inline-flex h-10 items-center rounded-[var(--radius-base)] border border-border-strong bg-surface px-5 text-sm font-medium transition-colors hover:bg-surface-secondary"
        >
          Go to dashboard
        </Link>
      </div>
      {error.digest ? (
        <p className="mt-6 font-mono text-[11px] text-muted">
          Ref: {error.digest}
        </p>
      ) : null}
    </div>
  );
}
