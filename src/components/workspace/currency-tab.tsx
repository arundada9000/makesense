"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { BusinessModel } from "@/domain/model/types";
import { analyzeModel } from "@/domain/scenarios/compare-scenarios";
import {
  convertToBase,
  defaultRateTable,
  fxScenarios,
} from "@/domain/currency/convert";
import { CURRENCIES, currencyInfo } from "@/domain/primitives/currency";
import { useModelStore } from "@/stores/model-store";
import { formatMoney } from "@/lib/format";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, NumberInput } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { MetricCard } from "@/components/ui/metric";

export function WorkspaceCurrencyTab({ model }: { model: BusinessModel }) {
  const updateModel = useModelStore((s) => s.updateModel);
  const [targetCurrency, setTargetCurrency] = useState("USD");
  const [rateInput, setRateInput] = useState<number | null>(null);

  const analysis = useMemo(() => analyzeModel(model), [model]);
  const currency = model.baseCurrency;

  const table = useMemo(
    () => defaultRateTable(targetCurrency),
    [targetCurrency]
  );

  // Rate: units of target per one unit of the model currency.
  const rate =
    rateInput !== null && rateInput > 0
      ? rateInput
      : SUGGESTED_RATES[`${currency}-${targetCurrency}`] ?? null;

  const year1Revenue = analysis.profit.series
    .slice(0, 12)
    .reduce((acc, p) => acc.plus(p.revenue), analysis.profit.totals.revenue.times(0));
  const totalCosts = analysis.profit.totals.variableCosts.plus(
    analysis.profit.totals.fixedCosts
  );

  const convertedRevenue =
    rate !== null
      ? convertToBase(year1Revenue, currency, {
          ...table,
          rates: { [currency]: rate },
        })
      : null;
  const convertedProfit =
    rate !== null
      ? convertToBase(analysis.profit.totals.netProfit, currency, {
          ...table,
          rates: { [currency]: rate },
        })
      : null;

  const fx =
    rate === null || currency === targetCurrency
      ? []
      : fxScenarios(year1Revenue, totalCosts, rate, FX_SHIFTS);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title="Reporting currency"
          subtitle={`This model keeps ${currency} as its base; view figures in another currency without changing it`}
        />
        <CardBody className="grid gap-4 sm:grid-cols-3">
          <Field label="View in" htmlFor="fx-target">
            <Select
              id="fx-target"
              value={targetCurrency}
              onChange={(e) => {
                setTargetCurrency(e.target.value);
                setRateInput(null);
              }}
            >
              {Object.values(CURRENCIES)
                .filter((c) => c.code !== currency)
                .map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.name}
                  </option>
                ))}
            </Select>
          </Field>
          <Field
            label={`Exchange rate`}
            htmlFor="fx-rate"
            help={
              rate !== null
                ? `1 ${currency} = ${rate} ${targetCurrency}`
                : "Enter a rate to convert"
            }
          >
            <NumberInput
              id="fx-rate"
              value={rate ?? 0}
              onValueChange={(v) => setRateInput(v > 0 ? v : null)}
            />
          </Field>
          <Field label="Model base" htmlFor="fx-base" help="Change the base in Assumptions">
            <div className="flex h-11 items-center rounded-[var(--radius-base)] border border-border bg-surface-secondary px-3 text-sm font-semibold">
              {currencyInfo(currency).symbol} {currency}
            </div>
          </Field>
        </CardBody>
      </Card>

      {convertedRevenue && convertedProfit ? (
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <MetricCard
            label="Year 1 revenue"
            value={formatMoney(convertedRevenue.convertedAmount, targetCurrency)}
            sub={`${formatMoney(convertedRevenue.originalAmount, currency)} original`}
          />
          <MetricCard
            label="Total net profit"
            value={formatMoney(convertedProfit.convertedAmount, targetCurrency, {
              signed: true,
            })}
            sub={`${formatMoney(convertedProfit.originalAmount, currency, { signed: true })} original`}
          />
          <MetricCard
            label="Rate used"
            value={`1 ${currency} = ${convertedRevenue.rateUsed.toDecimalPlaces(4)}`}
            sub={convertedRevenue.rateSource}
          />
          <MetricCard
            label="Originals preserved"
            value="Yes"
            sub="Conversions never overwrite base figures"
          />
        </div>
      ) : (
        <Card>
          <CardBody>
            <p className="text-xs text-muted-foreground">
              Enter an exchange rate above to see this model in{" "}
              {targetCurrency}.
            </p>
          </CardBody>
        </Card>
      )}

      {fx.length > 0 ? (
        <Card>
          <CardHeader
            title="FX risk scenarios"
            subtitle={`What a stronger or weaker ${currency} does to year 1 results in ${targetCurrency}`}
          />
          <CardBody className="px-0 py-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs tabular-nums">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted">
                    <th className="px-4 py-2.5 font-medium">Scenario</th>
                    <th className="px-3 py-2.5 text-right font-medium">Revenue</th>
                    <th className="px-3 py-2.5 text-right font-medium">Costs</th>
                    <th className="px-3 py-2.5 text-right font-medium">Margin impact</th>
                  </tr>
                </thead>
                <tbody>
                  {fx.map((point) => (
                    <tr key={point.label} className="border-b border-border last:border-0">
                      <td className="px-4 py-2.5 font-medium">{point.label}</td>
                      <td className="px-3 py-2.5 text-right">
                        {formatMoney(point.convertedRevenue, targetCurrency, {
                          style: "compact",
                        })}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        {formatMoney(point.convertedCosts, targetCurrency, {
                          style: "compact",
                        })}
                      </td>
                      <td
                        className={`px-3 py-2.5 text-right font-medium ${
                          point.profitImpact.isNegative() ? "text-danger" : "text-success"
                        }`}
                      >
                        {formatMoney(point.profitImpact, targetCurrency, {
                          style: "compact",
                          signed: true,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      ) : null}

      <Card>
        <CardHeader
          title="Switch base currency"
          subtitle="Permanently re-denominates every stored figure at the current rate"
        />
        <CardBody>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Prefer keeping models in their original currency and using the view
            above. Re-denomination is a one-way edit applied to prices, costs,
            cash and loans.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Select
              aria-label="New base currency"
              value={targetCurrency}
              onChange={(e) => setTargetCurrency(e.target.value)}
              className="max-w-48"
            >
              {Object.values(CURRENCIES)
                .filter((c) => c.code !== currency)
                .map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.name}
                  </option>
                ))}
            </Select>
            <button
              type="button"
              disabled={rate === null}
              onClick={() => {
                if (rate === null) return;
                if (
                  !window.confirm(
                    `Convert all figures from ${currency} to ${targetCurrency} at 1 ${currency} = ${rate} ${targetCurrency}? This cannot be undone.`
                  )
                )
                  return;
                const factor = rate;
                updateModel(model.id, (m) => {
                  m.baseCurrency = targetCurrency;
                  for (const s of m.revenueStreams) {
                    s.price = round2(s.price * factor);
                    s.averageOrderValue = s.averageOrderValue
                      ? round2(s.averageOrderValue * factor)
                      : undefined;
                  }
                  for (const c of [...m.fixedCosts, ...m.variableCosts]) {
                    c.amount = round2(c.amount * factor);
                  }
                  for (const i of m.investments) {
                    i.amount = round2(i.amount * factor);
                  }
                  m.projectionSettings.startingCash = round2(
                    m.projectionSettings.startingCash * factor
                  );
                  m.financing.founderCapital = round2(
                    m.financing.founderCapital * factor
                  );
                  m.financing.founderMonthlySalary = round2(
                    m.financing.founderMonthlySalary * factor
                  );
                  for (const l of m.financing.debtLoans) {
                    l.principal = round2(l.principal * factor);
                  }
                  m.marketing.monthlyBudget = round2(
                    m.marketing.monthlyBudget * factor
                  );
                });
              }}
              className="inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-base)] border border-border-strong bg-surface px-3 text-xs font-medium transition-colors hover:bg-surface-secondary disabled:opacity-50"
            >
              Convert model <ArrowRight className="h-3 w-3" /> {targetCurrency}
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

const FX_SHIFTS = [-10, -5, 5, 10];

/** Rough starter rates; users should replace with live figures. */
const SUGGESTED_RATES: Record<string, number> = {
  "NPR-USD": 0.0073,
  "USD-NPR": 137,
  "NPR-INR": 0.63,
  "INR-NPR": 1.6,
  "USD-EUR": 0.92,
  "EUR-USD": 1.09,
  "USD-GBP": 0.79,
  "GBP-USD": 1.27,
  "USD-INR": 83,
  "INR-USD": 0.012,
};
