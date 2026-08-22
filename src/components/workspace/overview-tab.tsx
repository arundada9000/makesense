"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Decimal } from "@/domain/primitives/money";
import { analyzeModel } from "@/domain/scenarios/compare-scenarios";
import type { BusinessModel } from "@/domain/model/types";
import { usePreferences } from "@/stores/preferences";
import { formatMoney, formatNumber, formatPercent } from "@/lib/format";
import { MetricCard, MaybeValue } from "@/components/ui/metric";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PageSection } from "@/components/ui/empty-state";

export function WorkspaceOverviewTab({ model }: { model: BusinessModel }) {
  const analysis = useMemo(() => analyzeModel(model), [model]);
  const numberStyle = usePreferences((s) => s.numberStyle);
  const currency = model.baseCurrency;
  const style = numberStyle;

  const { profit, breakEven, cashFlow, roi } = analysis;

  const chartData = profit.series.map((p) => ({
    month: p.month,
    revenue: Number(p.revenue.toDecimalPlaces(2)),
    netProfit: Number(p.netProfit.toDecimalPlaces(2)),
    operating: Number(p.operatingProfit.toDecimalPlaces(2)),
    cash: null as number | null,
  }));
  cashFlow.series.forEach((p) => {
    if (chartData[p.month]) chartData[p.month].cash = Number(p.closingCash.toDecimalPlaces(2));
  });

  const y1 = profit.series
    .slice(0, 12)
    .reduce((a, p) => a.plus(p.revenue), new Decimal(0));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <MetricCard
          label="Year 1 revenue"
          value={formatMoney(y1, currency, { style })}
          formula={{
            title: "Year 1 revenue",
            body: "Sum of projected monthly revenue for months 0 to 11 across every stream.",
          }}
        />
        <MetricCard
          label="Total net profit"
          value={formatMoney(profit.totals.netProfit, currency, {
            style,
            signed: true,
          })}
          tone={
            profit.totals.netProfit.isNegative()
              ? "negative"
              : profit.totals.netProfit.isPositive()
                ? "positive"
                : "default"
          }
          sub={`Net margin ${
            profit.margins.net !== null
              ? formatPercent(profit.margins.net, { decimals: 1 })
              : "-"
          }`}
        />
        <MetricCard
          label="Ending cash"
          value={formatMoney(cashFlow.endingBalance, currency, { style })}
          tone={cashFlow.endingBalance.isNegative() ? "negative" : "default"}
          sub={
            <MaybeValue maybe={cashFlow.runwayMonths}>
              {(months) => (
                <>Runway {formatNumber(months.toDecimalPlaces(0))} mo</>
              )}
            </MaybeValue>
          }
        />
        <MetricCard
          label="ROI"
          value={
            <MaybeValue maybe={roi.roiPercent}>
              {(roiValue) => (
                <>{formatPercent(roiValue, { decimals: 0, signed: true })}</>
              )}
            </MaybeValue>
          }
          sub={
            roi.paybackMonths !== null
              ? `Payback ${roi.paybackMonths} mo`
              : "No payback point in horizon"
          }
          formula={{
            title: "Return on investment",
            body: "(Total net profit minus initial investment) divided by initial investment.",
          }}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PageSection
          title="Revenue and net profit by month"
          description={`Horizon of ${model.projectionSettings.horizonMonths} months`}
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10 }}
                  stroke="var(--muted-foreground)"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  stroke="var(--muted-foreground)"
                  tickLine={false}
                  axisLine={false}
                  width={54}
                  tickFormatter={(v: number) => formatMoney(v, currency, { style: "compact" }).replace(/\s/g, "")}
                />
                <Tooltip content={<ChartTooltip currency={currency} />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  fill="url(#revFill)"
                />
                <Line
                  type="monotone"
                  dataKey="netProfit"
                  name="Net profit"
                  stroke="var(--success)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </PageSection>

        <PageSection title="Cash balance" description="Opening cash, debt inflows and all outflows">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10 }}
                  stroke="var(--muted-foreground)"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  stroke="var(--muted-foreground)"
                  tickLine={false}
                  axisLine={false}
                  width={54}
                  tickFormatter={(v: number) => formatMoney(v, currency, { style: "compact" }).replace(/\s/g, "")}
                />
                <Tooltip content={<ChartTooltip currency={currency} />} />
                <Line
                  type="monotone"
                  dataKey="cash"
                  name="Closing cash"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </PageSection>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <MiniStat
          label="Break-even customers"
          value={
            <MaybeValue maybe={breakEven.breakEvenCustomers}>
              {(customers) => <>{formatNumber(customers)}</>}
            </MaybeValue>
          }
          hint="Customers needed to cover fixed costs monthly"
        />
        <MiniStat
          label="Break-even revenue / mo"
          value={
            <MaybeValue maybe={breakEven.breakEvenRevenueMonthly}>
              {(revenue) => (
                <>{formatMoney(revenue, currency, { style })}</>
              )}
            </MaybeValue>
          }
          hint="Monthly revenue covering all fixed costs"
        />
        <MiniStat
          label="Lowest projected cash"
          value={
            cashFlow.lowestBalance !== null
              ? formatMoney(cashFlow.lowestBalance, currency, {
                  style,
                })
              : "-"
          }
          tone={cashFlow.lowestBalance !== null && cashFlow.lowestBalance.isNegative() ? "negative" : "default"}
          hint="Deepest dip in the cash balance; negative means a funding gap"
        />
      </div>

      <Card>
        <CardHeader title="Month by month" subtitle="First 24 months of the projection" />
        <CardBody className="px-0 py-0">
          <MonthlyTable model={model} />
        </CardBody>
      </Card>
    </div>
  );
}

function MiniStat({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  hint: string;
  tone?: "default" | "negative";
}) {
  return (
    <div className="rounded-[var(--radius-base)] border border-border bg-surface-secondary px-4 py-3">
      <p className="text-xs text-muted">{label}</p>
      <p
        className={`mt-1 text-lg font-semibold tabular-nums ${
          tone === "negative" ? "text-danger" : ""
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-[11px] leading-snug text-muted">{hint}</p>
    </div>
  );
}

function MonthlyTable({ model }: { model: BusinessModel }) {
  const analysis = useMemo(() => analyzeModel(model), [model]);
  const rows = analysis.profit.series.slice(0, 24);
  const currency = model.baseCurrency;

  return (
    <div className="max-h-80 overflow-auto rounded-b-[var(--radius-base)]">
      <table className="w-full text-xs tabular-nums">
        <thead className="sticky top-0 bg-surface-raised text-left text-[11px] uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-2 font-medium">M</th>
            <th className="px-3 py-2 text-right font-medium">Customers</th>
            <th className="px-3 py-2 text-right font-medium">Revenue</th>
            <th className="px-3 py-2 text-right font-medium">Costs</th>
            <th className="px-3 py-2 text-right font-medium">Tax</th>
            <th className="px-3 py-2 text-right font-medium">Net</th>
            <th className="hidden px-3 py-2 text-right font-medium sm:table-cell">
              Cash close
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p, i) => {
            const cf = analysis.cashFlow.series[i];
            const costs = p.variableCosts.plus(p.fixedCosts);
            return (
              <tr key={p.month} className="border-t border-border hover:bg-surface-secondary">
                <td className="px-4 py-1.5 font-medium">{p.month}</td>
                <td className="px-3 py-1.5 text-right">
                  {formatNumber(
                    analysis.profit.projection.points[p.month]?.endingCustomers ?? 0,
                    { decimals: 0 }
                  )}
                </td>
                <td className="px-3 py-1.5 text-right">
                  {formatMoney(p.revenue, currency, { style: "compact" })}
                </td>
                <td className="px-3 py-1.5 text-right">
                  {formatMoney(costs, currency, { style: "compact" })}
                </td>
                <td className="px-3 py-1.5 text-right">
                  {formatMoney(p.tax.abs(), currency, { style: "compact" })}
                </td>
                <td
                  className={`px-3 py-1.5 text-right font-medium ${
                    p.netProfit.isNegative() ? "text-danger" : ""
                  }`}
                >
                  {formatMoney(p.netProfit, currency, { style: "compact", signed: true })}
                </td>
                <td
                  className={`hidden px-3 py-1.5 text-right sm:table-cell ${
                    cf && cf.closingCash.isNegative() ? "text-danger" : ""
                  }`}
                >
                  {cf ? formatMoney(cf.closingCash, currency, { style: "compact" }) : "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
  currency,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
  label?: string | number;
  currency: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-md border border-border bg-surface-raised px-3 py-2 text-xs shadow-pop">
      <p className="font-medium">Month {label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="mt-0.5 flex justify-between gap-4 tabular-nums">
          <span className="text-muted-foreground">{entry.name}</span>
          <span>{formatMoney(entry.value, currency)}</span>
        </p>
      ))}
    </div>
  );
}
