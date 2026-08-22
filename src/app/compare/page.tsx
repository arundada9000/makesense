"use client";

import { useMemo, useState } from "react";
import { analyzeModel, compareAnalyses } from "@/domain/scenarios/compare-scenarios";
import { useModelStore } from "@/stores/model-store";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatMoney, formatNumber, formatPercent } from "@/lib/format";

export default function ComparePage() {
  const models = useModelStore((s) => s.models);
  const hydrated = useModelStore((s) => s.hydrated);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const active = models.filter((m) => !m.metadata.archived);

  function toggle(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  const rows = useMemo(() => {
    if (selectedIds.length < 2) return [];
    const entries = selectedIds
      .map((id) => models.find((m) => m.id === id))
      .filter((m): m is NonNullable<typeof m> => Boolean(m))
      .map((m) => ({ name: m.name, analysis: analyzeModel(m) }));
    return compareAnalyses(entries);
  }, [models, selectedIds]);

  const currency = useMemo(() => {
    const first = models.find((m) => m.id === selectedIds[0]);
    return first?.baseCurrency ?? "NPR";
  }, [models, selectedIds]);

  if (!hydrated) {
    return <div className="h-64 animate-pulse rounded-[var(--radius-base)] bg-surface-secondary" />;
  }

  return (
    <div className="space-y-5 py-2">
      <header>
        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
          Compare
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Select two or more models to see their metrics side by side.
        </p>
      </header>

      {active.length === 0 ? (
        <EmptyState
          title="Nothing to compare"
          description="Create at least two models first."
        />
      ) : (
        <>
          <Card>
            <CardHeader
              title="Models"
              subtitle={`${selectedIds.length} selected`}
            />
            <CardBody className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {active.map((m) => (
                <label
                  key={m.id}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-[var(--radius-base)] border px-3 py-2.5 text-sm transition-colors ${
                    selectedIds.includes(m.id)
                      ? "border-accent bg-accent-subtle"
                      : "border-border bg-surface-secondary hover:border-border-strong"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(m.id)}
                    onChange={() => toggle(m.id)}
                    className="h-4 w-4 accent-[var(--accent)]"
                  />
                  <span className="truncate">{m.name}</span>
                </label>
              ))}
            </CardBody>
          </Card>

          {selectedIds.length >= 2 ? (
            <Card>
              <CardHeader title="Metrics" subtitle="Totals across each model's horizon" />
              <CardBody className="px-0 py-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm tabular-nums">
                    <thead>
                      <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                        <th className="px-4 py-2.5 font-medium">Metric</th>
                        {selectedIds.map((id) => (
                          <th key={id} className="px-4 py-2.5 text-right font-medium">
                            {models.find((m) => m.id === id)?.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr key={row.metric} className="border-b border-border last:border-0">
                          <td className="px-4 py-2.5 text-xs text-muted-foreground">
                            {row.label}
                          </td>
                          {row.values.map((v, i) => (
                            <td key={i} className="px-4 py-2.5 text-right font-medium">
                              {formatCell(row.metric, v, currency)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          ) : (
            <EmptyState
              title="Select at least two models"
              description="Metrics appear here once you pick models above."
            />
          )}
        </>
      )}
    </div>
  );
}

function formatCell(
  metric: string,
  value: import("@/domain/primitives/money").Decimal | null,
  currency: string
): string {
  if (value === null) return "-";
  switch (metric) {
    case "netMargin":
    case "roi":
      return formatPercent(value, { decimals: 1 });
    case "endingCustomers":
    case "breakEvenCustomers":
    case "paybackMonths":
    case "runwayMonths":
      return formatNumber(value, { decimals: 1 });
    default:
      return formatMoney(value, currency, { style: "compact", signed: true });
  }
}
