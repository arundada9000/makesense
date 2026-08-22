"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Decimal } from "@/domain/primitives/money";
import { useModelStore } from "@/stores/model-store";
import { usePreferences } from "@/stores/preferences";
import { analyzeModel } from "@/domain/scenarios/compare-scenarios";
import { generateInsights } from "@/domain/insights/generate-insights";
import { formatMoney, formatNumber, formatPercent } from "@/lib/format";
import { MetricCard, MaybeValue, TrendBadge } from "@/components/ui/metric";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  const models = useModelStore((s) => s.models);
  const hydrated = useModelStore((s) => s.hydrated);
  const activeModelId = useModelStore((s) => s.activeModelId);
  const numberStyle = usePreferences((s) => s.numberStyle);

  const model = useMemo(
    () => models.find((m) => m.id === activeModelId) ?? models[0],
    [models, activeModelId]
  );

  const analysis = useMemo(() => (model ? analyzeModel(model) : null), [model]);
  const insights = useMemo(
    () => (model && analysis ? generateInsights(model, analysis) : []),
    [model, analysis]
  );

  if (!hydrated) {
    return (
      <div className="space-y-4 pt-2">
        <div className="h-8 w-48 animate-pulse rounded-md bg-surface-secondary" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-[var(--radius-base)] bg-surface-secondary"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!model || !analysis) {
    return (
      <div className="pt-6">
        <EmptyState
          title="No models yet"
          description="Create your first business model to see revenue, profit and cash flow projections here."
          action={
            <Link href="/models?new=1">
              <Button variant="primary" size="md">
                <Plus className="h-4 w-4" /> Create a model
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const currency = model.baseCurrency;
  const style = numberStyle;
  const { profit, unitEconomics, breakEven, cashFlow } = analysis;

  const year1Revenue = profit.series
    .slice(0, 12)
    .reduce((acc, p) => acc.plus(p.revenue), new Decimal(0));

  const lastPoint = profit.series[profit.series.length - 1];
  const prevPoint =
    profit.series.length > 1
      ? profit.series[profit.series.length - 2]
      : null;
  const momPercent = prevPoint && !prevPoint.netProfit.isZero()
    ? lastPoint.netProfit.minus(prevPoint.netProfit).dividedBy(prevPoint.netProfit.abs()).times(100).toNumber()
    : null;

  return (
    <div className="space-y-6 py-2">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            Active model
          </p>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
            {model.name}
          </h1>
        </div>
        <Link href={`/models/${model.id}`}>
          <Button variant="secondary">Open workspace</Button>
        </Link>
      </header>

      <section aria-label="Key metrics">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Year 1 revenue"
            value={formatMoney(year1Revenue, currency, { style })}
            sub={`${formatNumber(model.customers.startingCustomers)} starting customers`}
            formula={{
              title: "Year 1 revenue",
              body: "Sum of projected monthly revenue across all streams for months 0 to 11.",
            }}
          />
          <MetricCard
            label={`Net profit, month ${lastPoint.month}`}
            value={formatMoney(lastPoint.netProfit, currency, {
              style,
              signed: true,
            })}
            tone={numberTone(lastPoint.netProfit)}
            sub={
              momPercent !== null ? (
                <TrendBadge
                  delta={momPercent}
                  format={(v) => `${v.toFixed(0)}% MoM`}
                />
              ) : undefined
            }
            formula={{
              title: "Net profit",
              body: "Revenue minus variable costs, fixed costs and tax for the latest projected month.",
            }}
          />
          <MetricCard
            label="Break-even month"
            value={
              breakEven.projectedBreakEvenMonth !== null
                ? `M${breakEven.projectedBreakEvenMonth}`
                : "Not reached"
            }
            tone={
              breakEven.projectedBreakEvenMonth === null ? "warning" : "default"
            }
            sub="From the customer projection"
            formula={{
              title: "Break-even",
              body: "The first month where active customers cover monthly fixed costs at current contribution per customer.",
            }}
          />
          <MetricCard
            label="LTV : CAC"
            value={
              <MaybeValue maybe={unitEconomics.ltvToCac}>
                {(ratio) => <span>{ratio.toDecimalPlaces(2).toFixed(2)}:1</span>}
              </MaybeValue>
            }
            tone={
              unitEconomics.ltvToCac.ok && unitEconomics.ltvToCac.value.lessThan(3)
                ? "warning"
                : "default"
            }
            sub={
              unitEconomics.cacPaybackMonths.ok
                ? `CAC payback ${unitEconomics.cacPaybackMonths.value.toDecimalPlaces(1)} mo`
                : undefined
            }
            formula={{
              title: "Unit economics",
              body: "Lifetime value divided by customer acquisition cost. Above 3:1 is generally considered healthy.",
            }}
          />
        </div>
      </section>

      <section aria-label="Projection overview" className="grid gap-3 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Projection overview"
            subtitle={`${profit.series.length} months | ${currency}`}
          />
          <CardBody>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
              <StatRow
                label="Total revenue"
                value={formatMoney(profit.totals.revenue, currency, { style })}
              />
              <StatRow
                label="Total costs"
                value={formatMoney(
                  profit.totals.variableCosts.plus(profit.totals.fixedCosts),
                  currency,
                  { style }
                )}
              />
              <StatRow
                label="Tax paid"
                value={formatMoney(profit.totals.tax, currency, { style })}
              />
              <StatRow
                label="Net profit"
                value={formatMoney(profit.totals.netProfit, currency, {
                  style,
                  signed: true,
                })}
                tone={numberTone(profit.totals.netProfit)}
              />
              <StatRow
                label="Ending cash"
                value={formatMoney(cashFlow.endingBalance, currency, { style })}
                tone={numberTone(cashFlow.endingBalance)}
              />
              <StatRow
                label="Net margin"
                value={
                  profit.margins.net !== null
                    ? formatPercent(profit.margins.net, { decimals: 1 })
                    : "-"
                }
              />
            </dl>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Insights" subtitle="Derived from your assumptions" />
          <CardBody>
            {insights.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Add more assumptions to generate observations.
              </p>
            ) : (
              <ul className="space-y-2.5">
                {insights.slice(0, 5).map((insight) => (
                  <li key={insight.id} className="flex gap-2 text-xs leading-relaxed">
                    <span
                      aria-hidden
                      className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                        insight.tone === "positive"
                          ? "bg-success"
                          : insight.tone === "warning"
                            ? "bg-warning"
                            : insight.tone === "critical"
                              ? "bg-danger"
                              : "bg-accent"
                      }`}
                    />
                    {insight.message}
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </section>

      <section aria-label="All models" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {models
          .filter((m) => !m.metadata.archived)
          .slice(0, 6)
          .map((m) => (
            <Link key={m.id} href={`/models/${m.id}`} className="group">
              <Card className="p-4 transition-shadow group-hover:shadow-pop">
                <p className="truncate text-sm font-medium">{m.name}</p>
                <p className="mt-0.5 text-xs capitalize text-muted-foreground">
                  {m.businessType.replace("-", " ")} |{" "}
                  {m.projectionSettings.horizonMonths} months
                </p>
              </Card>
            </Link>
          ))}
      </section>
    </div>
  );
}

function StatRow({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "positive" | "negative";
}) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd
        className={`mt-0.5 text-sm font-semibold tabular-nums ${
          tone === "positive" ? "text-success" : tone === "negative" ? "text-danger" : ""
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function numberTone(d: Decimal): "default" | "positive" | "negative" {
  if (d.isZero()) return "default";
  return d.isPositive() ? "positive" : "negative";
}
