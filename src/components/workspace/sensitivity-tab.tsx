"use client";

import { useMemo, useState } from "react";
import type { BusinessModel } from "@/domain/model/types";
import {
  AXIS_VARIABLES,
  SENSITIVITY_METRICS,
  buildSensitivityTable,
  type AxisVariable,
  type SensitivityMetric,
} from "@/domain/sensitivity/build-sensitivity";
import { usePreferences } from "@/stores/preferences";
import { formatMoney, formatNumber, formatPercent } from "@/lib/format";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";

const DEFAULT_STEPS = [-20, -10, 0, 10, 20];

export function WorkspaceSensitivityTab({ model }: { model: BusinessModel }) {
  const [metric, setMetric] = useState<SensitivityMetric>("netProfit");
  const [xVar, setXVar] = useState<AxisVariable>("price");
  const [yVar, setYVar] = useState<AxisVariable>("startingCustomers");
  const numberStyle = usePreferences((s) => s.numberStyle);

  const table = useMemo(
    () => buildSensitivityTable(model, metric, xVar, yVar, DEFAULT_STEPS, DEFAULT_STEPS),
    [model, metric, xVar, yVar]
  );

  const currency = model.baseCurrency;

  function format(v: import("@/domain/primitives/money").Decimal | null): string {
    if (v === null) return "-";
    switch (metric) {
      case "roi":
        return formatPercent(v, { decimals: 0 });
      case "endingCustomers":
        return formatNumber(v);
      default:
        return formatMoney(v, currency, { style: numberStyle === "exact" ? "exact" : "compact" });
    }
  }

  // Color scale relative to the best and worst cells in the grid.
  const numericCells = table.cells
    .map((c) => (c.value ? c.value.toNumber() : null))
    .filter((v): v is number => v !== null);
  const min = Math.min(...numericCells);
  const max = Math.max(...numericCells);

  function cellTone(value: number): string {
    if (!Number.isFinite(min) || !Number.isFinite(max) || max === min) return "";
    const t = (value - min) / (max - min); // 0 worst, 1 best
    if (t >= 0.8) return "bg-success-subtle";
    if (t >= 0.6) return "bg-success-subtle/60";
    if (t <= 0.2) return "bg-danger-subtle";
    if (t <= 0.4) return "bg-danger-subtle/50";
    return "";
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title="Sensitivity analysis"
          subtitle="Re-runs the full engine for every combination of two shifted assumptions"
        />
        <CardBody className="grid gap-4 sm:grid-cols-3">
          <Field label="Metric" htmlFor="sens-metric">
            <Select
              id="sens-metric"
              value={metric}
              onChange={(e) => setMetric(e.target.value as SensitivityMetric)}
            >
              {SENSITIVITY_METRICS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Across (columns)" htmlFor="sens-x">
            <Select
              id="sens-x"
              value={xVar}
              onChange={(e) => setXVar(e.target.value as AxisVariable)}
            >
              {AXIS_VARIABLES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Against (rows)" htmlFor="sens-y">
            <Select
              id="sens-y"
              value={yVar}
              onChange={(e) => setYVar(e.target.value as AxisVariable)}
            >
              {AXIS_VARIABLES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </Select>
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title={`${SENSITIVITY_METRICS.find((m) => m.id === metric)?.label} grid`}
          subtitle={`Baseline: ${format(table.baselineValue)} | green favors you, red hurts`}
        />
        <CardBody className="px-0 py-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs tabular-nums">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted">
                  <th className="px-4 py-2.5 font-medium">
                    {table.yAxis.label} \ {table.xAxis.label}
                  </th>
                  {table.xAxis.steps.map((step) => (
                    <th key={step} className="px-3 py-2.5 text-right font-medium">
                      {formatStep(xVar, step)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.yAxis.steps.map((yStep) => (
                  <tr key={yStep} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium">{formatStep(yVar, yStep)}</td>
                    {table.xAxis.steps.map((xStep) => {
                      const cell = table.cells.find(
                        (c) => c.xStep === xStep && c.yStep === yStep
                      );
                      const value = cell?.value;
                      return (
                        <td
                          key={xStep}
                          className={`px-3 py-2 text-right font-medium ${cell && value ? cellTone(value.toNumber()) : ""}`}
                        >
                          {xStep === 0 && yStep === 0 ? (
                            <span className="rounded bg-accent-subtle px-1.5 py-0.5 text-accent">
                              {format(value ?? null)}
                            </span>
                          ) : (
                            format(value ?? null)
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <p className="px-1 text-xs leading-relaxed text-muted">
        Churn shifts are absolute percentage points; every other axis is a
        percent change from the current assumption. The grid re-computes the
        entire projection for each cell, so results always reflect the full
        model including tax.
      </p>
    </div>
  );
}

function formatStep(variable: AxisVariable, step: number): string {
  if (variable === "churnPercent") {
    return `${step}% churn`;
  }
  return `${step > 0 ? "+" : ""}${step}%`;
}
