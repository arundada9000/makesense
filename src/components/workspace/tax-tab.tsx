"use client";

import { useMemo } from "react";
import type { BusinessModel } from "@/domain/model/types";
import { analyzeModel } from "@/domain/scenarios/compare-scenarios";
import {
  calculateVat,
  estimateCorporateTax,
} from "@/domain/tax/calculate-tax";
import { useModelStore } from "@/stores/model-store";
import { formatMoney, formatPercent } from "@/lib/format";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, NumberInput, TextInput } from "@/components/ui/field";
import { Select } from "@/components/ui/select";

const COUNTRY_PRESETS: Array<{
  id: string;
  label: string;
  corporateRate: number;
  vatRate: number;
  vatName: string;
}> = [
  { id: "NP", label: "Nepal", corporateRate: 25, vatRate: 13, vatName: "VAT" },
  { id: "IN", label: "India", corporateRate: 25.17, vatRate: 18, vatName: "GST" },
  { id: "US", label: "United States", corporateRate: 21, vatRate: 0, vatName: "Sales tax" },
  { id: "GB", label: "United Kingdom", corporateRate: 25, vatRate: 20, vatName: "VAT" },
  { id: "AU", label: "Australia", corporateRate: 30, vatRate: 10, vatName: "GST" },
  { id: "CA", label: "Canada", corporateRate: 15, vatRate: 5, vatName: "GST" },
  { id: "DE", label: "Germany", corporateRate: 29.9, vatRate: 19, vatName: "VAT" },
];

export function WorkspaceTaxTab({ model }: { model: BusinessModel }) {
  const updateModel = useModelStore((s) => s.updateModel);
  const patch = (fn: (m: BusinessModel) => void) =>
    void updateModel(model.id, fn);

  const analysis = useMemo(() => analyzeModel(model), [model]);
  const t = model.taxProfile;
  const currency = model.baseCurrency;

  // VAT breakdown on the year-1 revenue figure.
  const year1Revenue = analysis.profit.series
    .slice(0, 12)
    .reduce(
      (acc, p) => acc.plus(p.revenue),
      analysis.profit.totals.revenue.times(0)
    );
  const vat = useMemo(
    () =>
      calculateVat(year1Revenue, t.vatRatePercent, t.vatPriceIncludesTax),
    [year1Revenue, t.vatRatePercent, t.vatPriceIncludesTax]
  );

  const corporateEstimate = useMemo(
    () =>
      estimateCorporateTax(analysis.profit.totals.netProfit, {
        corporateTaxRatePercent: t.corporateTaxRatePercent,
        lossCarryforward: t.lossCarryforward,
      }),
    [
      analysis.profit.totals.netProfit,
      t.corporateTaxRatePercent,
      t.lossCarryforward,
    ]
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title="Tax profile"
          subtitle="Applied inside the profit waterfall every month"
        />
        <CardBody className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Country preset" htmlFor="tax-country">
            <Select
              id="tax-country"
              value={t.country}
              onChange={(e) => {
                const preset = COUNTRY_PRESETS.find((p) => p.id === e.target.value);
                patch((m) => {
                  m.taxProfile.country = e.target.value;
                  if (preset) {
                    m.taxProfile.countryLabel = preset.label;
                    m.taxProfile.corporateTaxRatePercent = preset.corporateRate;
                    m.taxProfile.vatRatePercent = preset.vatRate;
                  }
                });
              }}
            >
              {COUNTRY_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
              {!COUNTRY_PRESETS.some((p) => p.id === t.country) ? (
                <option value={t.country}>{t.countryLabel || t.country}</option>
              ) : null}
            </Select>
          </Field>
          <Field label="Business structure" htmlFor="tax-structure" help="Free text, e.g. Pvt Ltd">
            <TextInput
              id="tax-structure"
              value={t.businessStructure}
              onChange={(e) =>
                patch((m) => void (m.taxProfile.businessStructure = e.target.value))
              }
            />
          </Field>
          <Field label="Corporate tax %" htmlFor="tax-rate" suffix="%">
            <NumberInput
              id="tax-rate"
              value={t.corporateTaxRatePercent}
              onValueChange={(v) =>
                patch(
                  (m) =>
                    void (m.taxProfile.corporateTaxRatePercent = Math.min(100, v))
                )
              }
            />
          </Field>
          <Field label={`${vatName(t)} %`} htmlFor="tax-vat" suffix="%">
            <NumberInput
              id="tax-vat"
              value={t.vatRatePercent}
              onValueChange={(v) =>
                patch((m) => void (m.taxProfile.vatRatePercent = Math.min(100, v)))
              }
            />
          </Field>
          <Field label="Prices include tax?" htmlFor="tax-inclusive">
            <Select
              id="tax-inclusive"
              value={t.vatPriceIncludesTax ? "yes" : "no"}
              onChange={(e) =>
                patch(
                  (m) =>
                    void (m.taxProfile.vatPriceIncludesTax = e.target.value === "yes")
                )
              }
            >
              <option value="yes">Yes, prices are tax inclusive</option>
              <option value="no">No, tax is added on top</option>
            </Select>
          </Field>
          <Field label="Loss carryforward" htmlFor="tax-loss">
            <Select
              id="tax-loss"
              value={t.lossCarryforward ? "yes" : "no"}
              onChange={(e) =>
                patch(
                  (m) =>
                    void (m.taxProfile.lossCarryforward = e.target.value === "yes")
                )
              }
            >
              <option value="yes">Carry losses forward</option>
              <option value="no">No carryforward</option>
            </Select>
          </Field>
          <label className="flex items-center justify-between gap-3 rounded-[var(--radius-base)] border border-border bg-surface-secondary px-3 py-2.5 sm:col-span-2 lg:col-span-3">
            <span className="text-sm">Enable taxes in projections</span>
            <input
              type="checkbox"
              checked={t.enabled}
              onChange={(e) => patch((m) => void (m.taxProfile.enabled = e.target.checked))}
              className="h-4 w-4 accent-[var(--accent)]"
            />
          </label>
        </CardBody>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Year 1 revenue tax split"
            subtitle={
              t.vatPriceIncludesTax
                ? `Prices include ${vatName(t)}; shown net of tax`
                : `${vatName(t)} added on top of prices`
            }
          />
          <CardBody>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs sm:grid-cols-3">
              <Row
                label={t.vatPriceIncludesTax ? "Net revenue" : "Gross revenue"}
                value={formatMoney(vat.basePriceNetOfTax, currency)}
              />
              <Row label={`${vatName(t)} at ${t.vatRatePercent}%`} value={formatMoney(vat.taxAmount, currency)} />
              <Row
                label={t.vatPriceIncludesTax ? "Customer pays" : "Total with tax"}
                value={formatMoney(vat.grossPriceWithTax, currency)}
              />
            </dl>
            <p className="mt-3 text-[11px] leading-relaxed text-muted">
              Based on projected year 1 revenue of{" "}
              {formatMoney(year1Revenue, currency)}. Change the VAT fields above
              to recompute.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Corporate tax estimate"
            subtitle={`On total horizon profit of ${formatMoney(analysis.profit.totals.netProfit, currency, { signed: true })}`}
          />
          <CardBody>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs sm:grid-cols-3">
              <Row label="Taxable base" value={formatMoney(corporateEstimate.taxableBase, currency)} />
              <Row label={`Tax at ${t.corporateTaxRatePercent}%`} value={formatMoney(corporateEstimate.tax, currency)} />
              <Row
                label="Profit after tax"
                value={formatMoney(
                  analysis.profit.totals.netProfit,
                  currency,
                  { signed: true }
                )}
              />
            </dl>
            <p className="mt-3 text-[11px] leading-relaxed text-muted">
              The monthly waterfall already applies this rate with loss
              carryforward when enabled. This card restates the totals for the
              whole horizon.
            </p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Effective rates" subtitle="What the model actually paid" />
        <CardBody>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs sm:grid-cols-4">
            <Row
              label="Total tax in projection"
              value={formatMoney(analysis.profit.totals.tax, currency)}
            />
            <Row
              label="Operating profit"
              value={formatMoney(analysis.profit.totals.operatingProfit, currency, { signed: true })}
            />
            <Row
              label="Effective tax rate"
              value={
                analysis.profit.totals.operatingProfit.isPositive()
                  ? formatPercent(
                      analysis.profit.totals.tax
                        .dividedBy(analysis.profit.totals.operatingProfit)
                        .times(100),
                      { decimals: 1 }
                    )
                  : "-"
              }
            />
            <Row
              label="Net margin"
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

function vatName(t: BusinessModel["taxProfile"]): string {
  const preset = COUNTRY_PRESETS.find((p) => p.id === t.country);
  return preset?.vatName ?? "VAT";
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold tabular-nums">{value}</dd>
    </div>
  );
}
