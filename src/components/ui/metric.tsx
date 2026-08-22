import type { Maybe } from "@/domain/primitives/safe-math";
import { Card } from "./card";
import { NotComputable } from "./empty-state";

/**
 * Large key metric with optional trend line, sign-aware coloring and a
 * "How is this calculated?" affordance for assumption transparency.
 */
export function MetricCard({
  label,
  value,
  sub,
  tone = "default",
  formula,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  tone?: "default" | "positive" | "negative" | "warning";
  /** Explanation shown on demand; keeps assumptions transparent. */
  formula?: { title: string; body: React.ReactNode };
}) {
  const valueClass = {
    default: "",
    positive: "text-success",
    negative: "text-danger",
    warning: "text-warning",
  }[tone];

  return (
    <Card className="p-4 md:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {formula ? <InfoDot title={formula.title} body={formula.body} /> : null}
      </div>
      <div
        className={`mt-2 text-2xl font-semibold tracking-tight tabular-nums ${valueClass}`}
      >
        {value}
      </div>
      {sub ? (
        <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
      ) : null}
    </Card>
  );
}

function InfoDot({ title, body }: { title: string; body: React.ReactNode }) {
  return (
    <details className="group relative">
      <summary
        className="flex h-5 w-5 cursor-pointer list-none items-center justify-center rounded-full border border-border-strong text-[10px] font-bold text-muted-foreground hover:text-foreground"
        aria-label={`How is this calculated? ${title}`}
      >
        i
      </summary>
      <div
        role="note"
        className="absolute right-0 top-7 z-20 w-64 rounded-[var(--radius-base)] border border-border bg-surface-raised p-3 text-xs shadow-pop"
      >
        <p className="font-semibold">{title}</p>
        <div className="mt-1 leading-relaxed text-muted-foreground">{body}</div>
      </div>
    </details>
  );
}

/** Renders a Maybe-wrapped metric value with its reason on hover. */
export function MaybeValue<T>({
  maybe,
  children,
}: {
  maybe: Maybe<T>;
  children: (value: T) => React.ReactNode;
}) {
  if (maybe.ok) return <>{children(maybe.value)}</>;
  return <NotComputable reason={maybe.reason} />;
}

export function TrendBadge({
  delta,
  format,
}: {
  delta: number | null;
  format: (v: number) => string;
}) {
  if (delta === null || !Number.isFinite(delta)) {
    return <span className="text-xs text-muted">-</span>;
  }
  const positive = delta > 0;
  const negative = delta < 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium ${
        positive
          ? "bg-success-subtle text-success"
          : negative
            ? "bg-danger-subtle text-danger"
            : "bg-surface-secondary text-muted-foreground"
      }`}
    >
      {positive ? "+" : ""}
      {format(delta)}
    </span>
  );
}
