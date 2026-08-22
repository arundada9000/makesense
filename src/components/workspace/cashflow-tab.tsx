"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BusinessModel } from "@/domain/model/types";
import { analyzeModel } from "@/domain/scenarios/compare-scenarios";
import { usePreferences } from "@/stores/preferences";
import { formatMoney, formatNumber } from "@/lib/format";
import { MetricCard, MaybeValue } from "@/components/ui/metric";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PageSection } from "@/components/ui/empty-state";

export function WorkspaceCashFlowTab({ model }: { model: BusinessModel }) {
  const analysis = useMemo(() => analyzeModel(model), [model]);
  const numberStyle = usePreferences((s) => s.numberStyle);
  const currency = model.baseCurrency;
  const style = numberStyle;
  const { cashFlow } = analysis;

  const chartData = cashFlow.series.map((p) => ({
    month: p.month,
    inflow: Number(p.inflows.plus(p.financingInflow).toDecimalPlaces(2)),
    outflow: Number(
      p.operatingOutflows.plus(p.debtPayments).plus(p.founderDrawings).abs().toDecimalPlaces(2)
    ),
    closing: Number(p.closingCash.toDecimalPlaces(2)),
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <MetricCard
          label="Opening cash"
          value={formatMoney(cashFlow.openingBalance, currency, { style })}
          sub="Starting cash plus founder capital"
        />
        <MetricCard
          label="Ending cash"
          value={formatMoney(cashFlow.endingBalance, currency, { style })}
          tone={cashFlow.endingBalance.isNegative() ? "negative" : "positive"}
          sub={`Month ${cashFlow.series[cashFlow.series.length - 1]?.month ?? 0}`}
        />
        <MetricCard
          label="Lowest balance"
          value={
            cashFlow.lowestBalance !== null
              ? formatMoney(cashFlow.lowestBalance, currency, { style })
              : "-"
          }
          tone={
            cashFlow.lowestBalance !== null && cashFlow.lowestBalance.isNegative()
              ? "negative"
              : "default"
          }
          sub="Deepest dip; negative means a funding gap"
        />
        <MetricCard
          label="Runway"
          value={
            <MaybeValue maybe={cashFlow.runwayMonths}>
              {(months) => <>{formatNumber(months.toDecimalPlaces(1))} mo</>}
            </MaybeValue>
          }
          tone={cashFlow.runwayMonths.ok && cashFlow.runwayMonths.value.lessThan(6) ? "warning" : "default"}
          sub={
            cashFlow.averageMonthlyBurn !== null
              ? `Burn ${formatMoney(cashFlow.averageMonthlyBurn.abs(), currency, { style })}/mo`
              : "No average burn"
          }
        />
      </div>

      <PageSection
        title="Monthly flows"
        description="Inflows versus outflows before the closing balance line"
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
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
                tickFormatter={(v: number) =>
                  formatMoney(v, currency, { style: "compact" }).replace(/\s/g, "")
                }
              />
              <Tooltip content={<FlowTooltip currency={currency} />} />
              <ReferenceLine y={0} stroke="var(--border-strong)" />
              <Bar dataKey="inflow" name="Inflows" fill="var(--success)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="outflow" name="Outflows">
                {chartData.map((d) => (
                  <Cell key={d.month} fill="var(--danger)" opacity={0.75} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </PageSection>

      <Card>
        <CardHeader
          title="Cash flow statement"
          subtitle="Profit is not cash. This adds capital events and debt movements."
        />
        <CardBody className="px-0 py-0">
          <div className="max-h-96 overflow-auto rounded-b-[var(--radius-base)]">
            <table className="w-full text-xs tabular-nums">
              <thead className="sticky top-0 bg-surface-raised text-left text-[11px] uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-2 font-medium">M</th>
                  <th className="px-3 py-2 text-right font-medium">Open</th>
                  <th className="px-3 py-2 text-right font-medium">In</th>
                  <th className="px-3 py-2 text-right font-medium">Financing</th>
                  <th className="px-3 py-2 text-right font-medium">Out</th>
                  <th className="px-3 py-2 text-right font-medium">Debt</th>
                  <th className="px-3 py-2 text-right font-medium">Close</th>
                </tr>
              </thead>
              <tbody>
                {cashFlow.series.map((p) => (
                  <tr key={p.month} className="border-t border-border hover:bg-surface-secondary">
                    <td className="px-4 py-1.5 font-medium">{p.month}</td>
                    <td className="px-3 py-1.5 text-right">
                      {formatMoney(p.openingCash, currency, { style: "compact" })}
                    </td>
                    <td className="px-3 py-1.5 text-right text-success">
                      +{formatMoney(p.inflows, currency, { style: "compact" })}
                    </td>
                    <td className="px-3 py-1.5 text-right">
                      {p.financingInflow.isZero()
                        ? "-"
                        : `+${formatMoney(p.financingInflow, currency, { style: "compact" })}`}
                    </td>
                    <td className="px-3 py-1.5 text-right text-danger">
                      -{formatMoney(p.operatingOutflows.abs(), currency, { style: "compact" })}
                    </td>
                    <td className="px-3 py-1.5 text-right">
                      {p.debtPayments.isZero()
                        ? "-"
                        : `-${formatMoney(p.debtPayments.abs(), currency, { style: "compact" })}`}
                    </td>
                    <td
                      className={`px-3 py-1.5 text-right font-medium ${
                        p.closingCash.isNegative() ? "text-danger" : ""
                      }`}
                    >
                      {formatMoney(p.closingCash, currency, { style: "compact" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {model.financing.debtLoans.length > 0 ? (
        <Card>
          <CardHeader title="Loan schedules" subtitle="Level payments split into interest and principal" />
          <CardBody className="space-y-4">
            {Array.from(cashFlow.loanSchedules.entries()).map(([id, schedule]) => {
              const loan = model.financing.debtLoans.find((l) => l.id === id);
              if (!loan) return null;
              return (
                <div key={id} className="rounded-[var(--radius-base)] border border-border bg-surface-secondary p-3">
                  <p className="text-sm font-medium">{loan.name}</p>
                  <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs sm:grid-cols-4">
                    <Stat label="Principal" value={formatMoney(loan.principal, currency, { style })} />
                    <Stat label="Rate" value={`${loan.annualInterestRatePercent}% / yr`} />
                    <Stat label="Term" value={`${loan.termMonths} mo`} />
                    <Stat
                      label="Total interest"
                      value={formatMoney(schedule.totalInterest, currency, { style })}
                    />
                  </dl>
                </div>
              );
            })}
          </CardBody>
        </Card>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-0.5 font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

function FlowTooltip({
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
