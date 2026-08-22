export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
      <div aria-hidden="true" className="flex gap-3" role="presentation">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{ animationDelay: `${i * 0.3}s` }}
            className="coin-bob flex h-10 w-10 items-center justify-center rounded-full border border-border bg-gradient-to-br from-accent to-accent-hover font-mono text-sm font-bold text-accent-foreground shadow-card"
          >
            ₹
          </span>
        ))}
      </div>
      <p className="text-xs font-medium tracking-wide text-muted">
        Crunching the numbers…
      </p>
      <div className="w-full max-w-xs space-y-2" aria-hidden="true">
        <div className="shimmer h-3 w-full rounded-full" />
        <div className="shimmer h-3 w-4/5 rounded-full" />
        <div className="shimmer h-3 w-3/5 rounded-full" />
      </div>
    </div>
  );
}
