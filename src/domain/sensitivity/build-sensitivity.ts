import { BusinessModel } from "../model/types";
import { Decimal } from "../primitives/money";
import { applyScenario } from "../scenarios/apply-scenario";
import { analyzeModel } from "../scenarios/compare-scenarios";

export type SensitivityMetric = "revenue" | "netProfit" | "roi" | "endingCustomers";

export const SENSITIVITY_METRICS: ReadonlyArray<{
  id: SensitivityMetric;
  label: string;
}> = [
  { id: "revenue", label: "Revenue" },
  { id: "netProfit", label: "Net Profit" },
  { id: "roi", label: "ROI" },
  { id: "endingCustomers", label: "Ending Customers" },
];

export interface SensitivityAxis {
  label: string;
  /** Percent changes applied to the axis variable, e.g. [-20, -10, 0, 10, 20]. */
  steps: number[];
}

export interface SensitivityCell {
  xStep: number;
  yStep: number;
  value: Decimal | null;
}

export interface SensitivityTable {
  metric: SensitivityMetric;
  xAxis: SensitivityAxis;
  yAxis: SensitivityAxis;
  cells: SensitivityCell[];
  baselineValue: Decimal | null;
}

type AxisVariable =
  | "price"
  | "startingCustomers"
  | "churnPercent"
  | "variableCosts"
  | "monthlyMarketing";

function overrideFor(variable: AxisVariable, step: number) {
  switch (variable) {
    case "price":
      return { field: "price" as const, op: "percent-change" as const, value: step };
    case "startingCustomers":
      return {
        field: "startingCustomers" as const,
        op: "percent-change" as const,
        value: step,
      };
    case "churnPercent":
      // Churn uses absolute point shifts so 0 percent stays meaningful.
      return { field: "churnPercent" as const, op: "set" as const, value: Math.max(0, step) };
    case "variableCosts":
      return {
        field: "variableCosts" as const,
        op: "percent-change" as const,
        value: step,
      };
    case "monthlyMarketing":
      return {
        field: "monthlyMarketing" as const,
        op: "percent-change" as const,
        value: step,
      };
  }
}

function readMetric(
  analysis: ReturnType<typeof analyzeModel>,
  metric: SensitivityMetric
): Decimal | null {
  switch (metric) {
    case "revenue":
      return analysis.profit.totals.revenue;
    case "netProfit":
      return analysis.profit.totals.netProfit;
    case "roi":
      return analysis.roi.roiPercent.ok ? analysis.roi.roiPercent.value : null;
    case "endingCustomers":
      return new Decimal(analysis.profit.projection.endingCustomers);
  }
}

/**
 * Builds a two-variable sensitivity grid by re-running the full engine for
 * every cell combination of two percent-shifted assumptions.
 */
export function buildSensitivityTable(
  model: BusinessModel,
  metric: SensitivityMetric,
  xAxisVar: AxisVariable,
  yAxisVar: AxisVariable,
  xSteps: number[],
  ySteps: number[]
): SensitivityTable {
  const cells: SensitivityCell[] = [];

  let baselineValue: Decimal | null = null;

  for (const yStep of ySteps) {
    for (const xStep of xSteps) {
      let working = model;
      if (xStep !== 0) {
        working = applyScenario(working, {
          id: "sens-x",
          name: "x",
          overrides: [overrideFor(xAxisVar, xStep)],
        });
      }
      if (yStep !== 0) {
        working = applyScenario(working, {
          id: "sens-y",
          name: "y",
          overrides:
            xAxisVar === yAxisVar
              ? [{ ...overrideFor(yAxisVar, yStep) }]
              : [overrideFor(yAxisVar, yStep)],
        });
      }
      const analysis = analyzeModel(working);
      const value = readMetric(analysis, metric);
      if (xStep === 0 && yStep === 0) baselineValue = value;
      cells.push({ xStep, yStep, value });
    }
  }

  return {
    metric,
    xAxis: { label: axisLabel(xAxisVar), steps: xSteps },
    yAxis: { label: axisLabel(yAxisVar), steps: ySteps },
    cells,
    baselineValue,
  };
}

export function axisLabel(variable: AxisVariable): string {
  switch (variable) {
    case "price":
      return "Price change";
    case "startingCustomers":
      return "Customer change";
    case "churnPercent":
      return "Monthly churn";
    case "variableCosts":
      return "Variable cost change";
    case "monthlyMarketing":
      return "Marketing spend change";
  }
}
