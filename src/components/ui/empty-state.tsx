import { Card } from "./card";

/**
 * Replaces empty charts and broken numbers with guidance, never raw errors.
 */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-[var(--radius-base)] border border-dashed border-border-strong bg-surface-secondary px-6 py-10 text-center">
      <p className="text-sm font-medium">{title}</p>
      {description ? (
        <p className="max-w-md text-xs text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export function NotComputable({ reason }: { reason: string }) {
  return (
    <span
      className="inline-flex cursor-help items-baseline"
      title={reason}
      tabIndex={0}
      role="note"
      aria-label={`Not computable: ${reason}`}
    >
      -
    </span>
  );
}

/** Section-level wrapper giving pages a consistent heading rhythm. */
export function PageSection({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeaderWrapper title={title} description={description} actions={actions} />
      <div className="px-4 py-4 md:px-5">{children}</div>
    </Card>
  );
}

function CardHeaderWrapper({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions}
    </div>
  );
}
