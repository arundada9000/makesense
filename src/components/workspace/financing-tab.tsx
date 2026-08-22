"use client";

import { useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Decimal } from "@/domain/primitives/money";
import type { BusinessModel } from "@/domain/model/types";
import { analyzeModel } from "@/domain/scenarios/compare-scenarios";
import { useModelStore } from "@/stores/model-store";
import { formatMoney, formatPercent } from "@/lib/format";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, NumberInput, TextInput } from "@/components/ui/field";
import { MetricCard } from "@/components/ui/metric";

export function WorkspaceFinancingTab({ model }: { model: BusinessModel }) {
  const updateModel = useModelStore((s) => s.updateModel);
  const patch = (fn: (m: BusinessModel) => void) =>
    void updateModel(model.id, fn);

  const analysis = useMemo(() => analyzeModel(model), [model]);
  const currency = model.baseCurrency;
  const f = model.financing;

  const investorDilution =
    f.investorEquity && f.investorEquity.ownershipPercent > 0
      ? analysis.profit.totals.netProfit
          .times(f.investorEquity.ownershipPercent)
          .dividedBy(100)
      : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <MetricCard
          label="Founder capital"
          value={formatMoney(f.founderCapital, currency)}
          sub="Enters cash at month 0"
        />
        <MetricCard
          label="Debt principal"
          value={formatMoney(
            f.debtLoans.reduce((sum, l) => sum + l.principal, 0),
            currency
          )}
          sub={`${f.debtLoans.length} loan${f.debtLoans.length === 1 ? "" : "s"}`}
        />
        <MetricCard
          label="Total interest"
          value={formatMoney(
            Array.from(analysis.cashFlow.loanSchedules.values()).reduce(
              (sum, s) => sum.plus(s.totalInterest),
              new Decimal(0)
            ),
            currency
          )}
          sub="Across all loans over their terms"
        />
        <MetricCard
          label="Investor share of profit"
          value={
            investorDilution !== null
              ? formatMoney(investorDilution, currency, { signed: true })
              : "-"
          }
          sub={
            f.investorEquity
              ? `${f.investorEquity.ownershipPercent}% ownership`
              : "No investor recorded"
          }
        />
      </div>

      <Card>
        <CardHeader title="Founder finances" subtitle="Capital you put in and salary you take out" />
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <Field label="Founder capital" htmlFor="fin-capital" help="Added to starting cash">
            <NumberInput
              id="fin-capital"
              value={f.founderCapital}
              onValueChange={(v) => patch((m) => void (m.financing.founderCapital = v))}
            />
          </Field>
          <Field
            label="Founder monthly salary"
            htmlFor="fin-salary"
            help="Treated as a founder drawing in cash flow"
          >
            <NumberInput
              id="fin-salary"
              value={f.founderMonthlySalary}
              onValueChange={(v) =>
                patch((m) => void (m.financing.founderMonthlySalary = v))
              }
            />
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Loans"
          subtitle="Level monthly payments; principal lands as a financing inflow at start month"
          actions={
            <Button
              variant="secondary"
              onClick={() =>
                patch((m) =>
                  void m.financing.debtLoans.push({
                    id: `loan-${Date.now().toString(36)}`,
                    name: "New loan",
                    principal: 0,
                    annualInterestRatePercent: 10,
                    termMonths: 36,
                    startMonth: 0,
                  })
                )
              }
            >
              <Plus className="h-3.5 w-3.5" /> Add loan
            </Button>
          }
        />
        <CardBody className="space-y-3">
          {f.debtLoans.length === 0 ? (
            <p className="text-xs text-muted-foreground">No loans recorded.</p>
          ) : null}
          {f.debtLoans.map((loan) => {
            const schedule = analysis.cashFlow.loanSchedules.get(loan.id);
            const idPrefix = `loan-${loan.id}`;
            return (
              <div
                key={loan.id}
                className="rounded-[var(--radius-base)] border border-border bg-surface-secondary p-3"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    {loan.name || "Loan"}
                    {schedule
                      ? ` | payment ${formatMoney(schedule.monthlyPayment, currency)}`
                      : ""}
                  </p>
                  <Button
                    variant="ghost"
                    aria-label={`Remove ${loan.name}`}
                    onClick={() =>
                      patch(
                        (m) =>
                          void (m.financing.debtLoans = m.financing.debtLoans.filter(
                            (l) => l.id !== loan.id
                          ))
                      )
                    }
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  <Field label="Name" htmlFor={`${idPrefix}-name`}>
                    <TextInput
                      id={`${idPrefix}-name`}
                      value={loan.name}
                      onChange={(e) =>
                        patch((m) => {
                          const t = m.financing.debtLoans.find((l) => l.id === loan.id);
                          if (t) t.name = e.target.value;
                        })
                      }
                    />
                  </Field>
                  <Field label="Principal" htmlFor={`${idPrefix}-principal`}>
                    <NumberInput
                      id={`${idPrefix}-principal`}
                      value={loan.principal}
                      onValueChange={(v) =>
                        patch((m) => {
                          const t = m.financing.debtLoans.find((l) => l.id === loan.id);
                          if (t) t.principal = v;
                        })
                      }
                    />
                  </Field>
                  <Field label="Interest % / yr" htmlFor={`${idPrefix}-rate`} suffix="%">
                    <NumberInput
                      id={`${idPrefix}-rate`}
                      value={loan.annualInterestRatePercent}
                      onValueChange={(v) =>
                        patch((m) => {
                          const t = m.financing.debtLoans.find((l) => l.id === loan.id);
                          if (t) t.annualInterestRatePercent = v;
                        })
                      }
                    />
                  </Field>
                  <Field label="Term months" htmlFor={`${idPrefix}-term`}>
                    <NumberInput
                      id={`${idPrefix}-term`}
                      value={loan.termMonths}
                      onValueChange={(v) =>
                        patch((m) => {
                          const t = m.financing.debtLoans.find((l) => l.id === loan.id);
                          if (t) t.termMonths = Math.max(1, Math.round(v));
                        })
                      }
                    />
                  </Field>
                  <Field label="Start month" htmlFor={`${idPrefix}-start`}>
                    <NumberInput
                      id={`${idPrefix}-start`}
                      value={loan.startMonth}
                      onValueChange={(v) =>
                        patch((m) => {
                          const t = m.financing.debtLoans.find((l) => l.id === loan.id);
                          if (t) t.startMonth = Math.max(0, Math.round(v));
                        })
                      }
                    />
                  </Field>
                </div>
              </div>
            );
          })}
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Investor equity"
          subtitle="Optional; shows dilution of projected profit"
        />
        <CardBody className="grid gap-4 sm:grid-cols-3">
          <Field label="Investment amount" htmlFor="inv-amount">
            <NumberInput
              id="inv-amount"
              value={f.investorEquity?.investmentAmount ?? 0}
              onValueChange={(v) =>
                patch((m) => {
                  m.financing.investorEquity = {
                    investmentAmount: v,
                    ownershipPercent: m.financing.investorEquity?.ownershipPercent ?? 0,
                  };
                })
              }
            />
          </Field>
          <Field label="Ownership %" htmlFor="inv-pct" suffix="%">
            <NumberInput
              id="inv-pct"
              value={f.investorEquity?.ownershipPercent ?? 0}
              onValueChange={(v) =>
                patch((m) => {
                  m.financing.investorEquity = {
                    investmentAmount: m.financing.investorEquity?.investmentAmount ?? 0,
                    ownershipPercent: Math.min(100, Math.max(0, v)),
                  };
                })
              }
            />
          </Field>
          <Field
            label="Implied valuation"
            htmlFor="inv-val"
            help="Investment divided by ownership"
          >
            <div className="flex h-11 items-center rounded-[var(--radius-base)] border border-border bg-surface-secondary px-3 text-sm font-semibold tabular-nums">
              {f.investorEquity && f.investorEquity.ownershipPercent > 0
                ? formatMoney(
                    (f.investorEquity.investmentAmount * 100) /
                      f.investorEquity.ownershipPercent,
                    currency
                  )
                : "-"}
            </div>
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Financing summary" subtitle="How the money moves" />
        <CardBody>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs sm:grid-cols-4">
            <SummaryRow
              label="Capital at month 0"
              value={formatMoney(
                model.projectionSettings.startingCash + f.founderCapital,
                currency
              )}
            />
            <SummaryRow
              label="Monthly debt service"
              value={formatMoney(
                Array.from(analysis.cashFlow.loanSchedules.values()).reduce(
                  (sum, s) => sum.plus(s.monthlyPayment),
                  new Decimal(0)
                ),
                currency
              )}
            />
            <SummaryRow
              label="Monthly drawings"
              value={formatMoney(f.founderMonthlySalary, currency)}
            />
            <SummaryRow
              label="Net margin after tax"
              value={
                analysis.profit.margins.net !== null
                  ? formatPercent(analysis.profit.margins.net, { decimals: 1 })
                  : "-"
              }
            />
          </dl>
        </CardBody>
      </Card>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold tabular-nums">{value}</dd>
    </div>
  );
}
