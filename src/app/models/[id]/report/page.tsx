"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { ArrowLeft, Printer, Download } from "lucide-react";
import type { BusinessModel } from "@/domain/model/types";
import { analyzeModel } from "@/domain/scenarios/compare-scenarios";
import { applyScenario } from "@/domain/scenarios/apply-scenario";
import { generateInsights } from "@/domain/insights/generate-insights";
import { useModelStore } from "@/stores/model-store";
import { formatMoney, formatNumber, formatPercent, formatRatio } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function ReportPage() {
  const params = useParams<{ id: string }>();
  const models = useModelStore((s) => s.models);
  const hydrated = useModelStore((s) => s.hydrated);
  const model = useMemo(
    () => models.find((m) => m.id === params?.id),
    [models, params?.id]
  );

  if (!hydrated) {
    return <div className="h-64 animate-pulse rounded-[var(--radius-base)] bg-surface-secondary" />;
  }

  if (!model) {
    return (
      <EmptyState
        title="Model not found"
        action={
          <Link href="/models">
            <Button variant="primary">Back to models</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="py-2">
      <div className="mb-4 flex items-center justify-between gap-3 print:hidden">
        <Link
          href={`/models/${model.id}`}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Back to workspace"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5" /> Print or save PDF
          </Button>
          <ExportModelButton model={model} />
        </div>
      </div>

      <ReportBody model={model} />
    </div>
  );
}

function ExportModelButton({ model }: { model: BusinessModel }) {
  function download() {
    const blob = new Blob([JSON.stringify(model, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${model.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.makesense.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <Button variant="secondary" onClick={download}>
      <Download className="h-3.5 w-3.5" /> Export JSON
    </Button>
  );
}

function ReportBody({ model }: { model: BusinessModel }) {
  const analysis = useMemo(() => analyzeModel(model), [model]);
  const insights = useMemo(() => generateInsights(model, analysis), [model, analysis]);
  const currency = model.baseCurrency;
  const { profit, unitEconomics, breakEven, roi, cashFlow } = analysis;

  return (
    <article className="mx-auto max-w-3xl space-y-6 bg-surface p-6 shadow-card print:max-w-none print:shadow-none md:p-10">
      <header className="border-b border-border pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-accent">
          MakeSense projection report
        </p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight">{model.name}</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {model.businessType.replace(/-/g, " ")} | {currency} |{" "}
          {model.projectionSettings.horizonMonths} month horizon | generated{" "}
          {new Date().toLocaleDateString()}
        </p>
        {model.description ? (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {model.description}
          </p>
        ) : null}
      </header>

      <Section title="Headline results">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs sm:grid-cols-3">
          <Row label="Total revenue" value={formatMoney(profit.totals.revenue, currency)} />
          <Row
            label="Total costs"
            value={formatMoney(profit.totals.variableCosts.plus(profit.totals.fixedCosts), currency)}
          />
          <Row label="Tax" value={formatMoney(profit.totals.tax, currency)} />
          <Row
            label="Net profit"
            value={formatMoney(profit.totals.netProfit, currency, { signed: true })}
            tone={profit.totals.netProfit.isNegative() ? "negative" : undefined}
          />
          <Row
            label="Net margin"
            value={
              profit.margins.net !== null ? formatPercent(profit.margins.net, { decimals: 1 }) : "-"
            }
          />
          <Row label="Ending cash" value={formatMoney(cashFlow.endingBalance, currency)} />
          <Row
            label="Break-even month"
            value={
              breakEven.projectedBreakEvenMonth !== null
                ? `M${breakEven.projectedBreakEvenMonth}`
                : "Not reached"
            }
          />
          <Row
            label="ROI"
            value={
              roi.roiPercent.ok ? formatPercent(roi.roiPercent.value, { signed: true }) : "-"
            }
          />
          <Row
            label="Payback"
            value={roi.paybackMonths !== null ? `${roi.paybackMonths} mo` : "-"}
          />
        </dl>
      </Section>

      <Section title="Unit economics">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs sm:grid-cols-3">
          <Row
            label="ARPU / month"
            value={unitEconomics.arpuMonthly.ok ? formatMoney(unitEconomics.arpuMonthly.value, currency) : "-"}
          />
          <Row
            label="Contribution / customer"
            value={
              unitEconomics.contributionPerCustomerMonthly.ok
                ? formatMoney(unitEconomics.contributionPerCustomerMonthly.value, currency)
                : "-"
            }
          />
          <Row
            label="CAC"
            value={unitEconomics.cac.ok ? formatMoney(unitEconomics.cac.value, currency) : "-"}
          />
          <Row
            label="LTV"
            value={
              unitEconomics.ltv.ok
                ? formatMoney(unitEconomics.ltv.value.value, currency)
                : "-"
            }
          />
          <Row
            label="LTV : CAC"
            value={unitEconomics.ltvToCac.ok ? formatRatio(unitEconomics.ltvToCac.value) : "-"}
          />
          <Row
            label="CAC payback"
            value={
              unitEconomics.cacPaybackMonths.ok
                ? `${unitEconomics.cacPaybackMonths.value.toDecimalPlaces(1)} mo`
                : "-"
            }
          />
        </dl>
      </Section>

      <Section title="Key assumptions">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs sm:grid-cols-3">
          <Row label="Starting customers" value={formatNumber(model.customers.startingCustomers)} />
          <Row
            label="Growth"
            value={
              model.customers.growthMode === "none"
                ? "None"
                : model.customers.growthMode === "fixed"
                  ? `${formatNumber(model.customers.fixedGrowthPerMonth)} / mo`
                  : model.customers.growthMode === "percentage"
                    ? `${model.customers.percentageGrowthPerMonth}% / mo`
                    : "Custom schedule"
            }
          />
          <Row label="Monthly churn" value={`${model.customers.monthlyChurnRatePercent}%`} />
          <Row label="Marketing budget" value={`${formatMoney(model.marketing.monthlyBudget, currency)} / mo`} />
          <Row label="Starting cash" value={formatMoney(model.projectionSettings.startingCash, currency)} />
          <Row label="Founder capital" value={formatMoney(model.financing.founderCapital, currency)} />
          <Row
            label="Tax rate"
            value={model.taxProfile.enabled ? `${model.taxProfile.corporateTaxRatePercent}%` : "Disabled"}
          />
          <Row
            label={`${model.taxProfile.countryLabel || "VAT"} rate`}
            value={model.taxProfile.vatEnabled ? `${model.taxProfile.vatRatePercent}%` : "Disabled"}
          />
          <Row
            label="Revenue streams"
            value={formatNumber(model.revenueStreams.length)}
          />
        </dl>
        {model.revenueStreams.length > 0 ? (
          <table className="mt-4 w-full text-xs tabular-nums">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted">
                <th className="py-1.5 font-medium">Stream</th>
                <th className="px-3 py-1.5 text-right font-medium">Type</th>
                <th className="px-3 py-1.5 text-right font-medium">Price</th>
              </tr>
            </thead>
            <tbody>
              {model.revenueStreams.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="py-1.5">{s.name}</td>
                  <td className="px-3 py-1.5 text-right capitalize">{s.type.replace(/-/g, " ")}</td>
                  <td className="px-3 py-1.5 text-right">{formatMoney(s.price, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </Section>

      <Section title={`Monthly projection (first ${Math.min(24, profit.series.length)} months)`}>
        <table className="w-full text-xs tabular-nums">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted">
              <th className="py-1.5 font-medium">M</th>
              <th className="px-3 py-1.5 text-right font-medium">Customers</th>
              <th className="px-3 py-1.5 text-right font-medium">Revenue</th>
              <th className="px-3 py-1.5 text-right font-medium">Net</th>
              <th className="px-3 py-1.5 text-right font-medium">Cash close</th>
            </tr>
          </thead>
          <tbody>
            {profit.series.slice(0, 24).map((p, i) => (
              <tr key={p.month} className="border-b border-border last:border-0">
                <td className="py-1.5 font-medium">{p.month}</td>
                <td className="px-3 py-1.5 text-right">
                  {formatNumber(profit.projection.points[p.month]?.endingCustomers ?? 0)}
                </td>
                <td className="px-3 py-1.5 text-right">{formatMoney(p.revenue, currency)}</td>
                <td className={`px-3 py-1.5 text-right ${p.netProfit.isNegative() ? "text-danger" : ""}`}>
                  {formatMoney(p.netProfit, currency)}
                </td>
                <td className="px-3 py-1.5 text-right">
                  {cashFlow.series[i] ? formatMoney(cashFlow.series[i].closingCash, currency) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      {model.scenarios.length > 0 ? (
        <Section title="Scenarios">
          <table className="w-full text-xs tabular-nums">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted">
                <th className="py-1.5 font-medium">Scenario</th>
                <th className="px-3 py-1.5 text-right font-medium">Revenue</th>
                <th className="px-3 py-1.5 text-right font-medium">Net profit</th>
                <th className="px-3 py-1.5 text-right font-medium">Margin</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-1.5 font-medium">Base</td>
                <td className="px-3 py-1.5 text-right">{formatMoney(profit.totals.revenue, currency)}</td>
                <td className="px-3 py-1.5 text-right">{formatMoney(profit.totals.netProfit, currency)}</td>
                <td className="px-3 py-1.5 text-right">
                  {profit.margins.net !== null ? formatPercent(profit.margins.net, { decimals: 1 }) : "-"}
                </td>
              </tr>
              {model.scenarios.map((s) => {
                const a = analyzeModel(applyScenario(model, s));
                return (
                  <tr key={s.id} className="border-b border-border last:border-0">
                    <td className="py-1.5 font-medium">{s.name}</td>
                    <td className="px-3 py-1.5 text-right">{formatMoney(a.profit.totals.revenue, currency)}</td>
                    <td className="px-3 py-1.5 text-right">{formatMoney(a.profit.totals.netProfit, currency)}</td>
                    <td className="px-3 py-1.5 text-right">
                      {a.profit.margins.net !== null
                        ? formatPercent(a.profit.margins.net, { decimals: 1 })
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Section>
      ) : null}

      {insights.length > 0 ? (
        <Section title="Observations">
          <ul className="space-y-1.5 text-xs leading-relaxed">
            {insights.map((insight) => (
              <li key={insight.id} className="flex gap-2">
                <span aria-hidden>-</span>
                {insight.message}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <footer className="border-t border-border pt-3 text-[11px] leading-relaxed text-muted">
        Every figure above is a mathematical consequence of the listed
        assumptions, not a prediction. Validate with an accountant before making
        financial commitments. Generated locally by MakeSense.
      </footer>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2.5 text-sm font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "negative";
}) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-muted">{label}</dt>
      <dd className={`mt-0.5 text-sm font-semibold tabular-nums ${tone === "negative" ? "text-danger" : ""}`}>
        {value}
      </dd>
    </div>
  );
}
