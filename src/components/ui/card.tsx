import { forwardRef } from "react";

export const Card = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function Card({ className = "", ...props }, ref) {
  return (
    <div
      ref={ref}
      className={`bg-surface border border-border rounded-[var(--radius-base)] shadow-card ${className}`}
      {...props}
    />
  );
});

export function CardHeader({
  title,
  subtitle,
  actions,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3 border-b border-border md:px-5">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
        {subtitle ? (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}

export function CardBody({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`px-4 py-[var(--card-gap)] md:px-5 ${className}`}
      {...props}
    />
  );
}
