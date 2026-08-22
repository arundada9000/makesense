import { BusinessModel } from "../model/types";
import { Decimal } from "../primitives/money";
import { calculateProfit, ProfitCalculation } from "../profit/calculate-profit";
import {
  UnitEconomicsCalculation,
  calculateUnitEconomics,
} from "../unit-economics/calculate-unit-economics";
import {
  BreakEvenCalculation,
  calculateBreakEven,
} from "../breakeven/calculate-breakeven";
import { RoiCalculation, calculateRoi } from "../roi/calculate-roi";
import {
  CashFlowCalculation,
  calculateCashFlow,
} from "../cashflow/calculate-cashflow";

export interface FullAnalysis {
  profit: ProfitCalculation;
  unitEconomics: UnitEconomicsCalculation;
  breakEven: BreakEvenCalculation;
  roi: RoiCalculation;
  cashFlow: CashFlowCalculation;
}

/** One canonical entry point that runs the whole engine on a model. */
export function analyzeModel(model: BusinessModel): FullAnalysis {
  const profit = calculateProfit(model);
  const unitEconomics = calculateUnitEconomics(model, profit);
  const breakEven = calculateBreakEven(model, profit);
  const roi = calculateRoi(model, profit);
  const cashFlow = calculateCashFlow(model, profit);
  return { profit, unitEconomics, breakEven, roi, cashFlow };
}

export type ComparisonMetricId =
  | "revenue"
  | "netProfit"
  | "netMargin"
  | "roi"
  | "endingCustomers"
  | "breakEvenCustomers"
  | "paybackMonths"
  | "endingCash"
  | "runwayMonths"
  | "mrrNow"
  | "cac"
  | "ltvCac";

export interface ScenarioComparisonRow {
  metric: ComparisonMetricId;
  label: string;
  values: Array<Decimal | null>;
}

function decimalOrNull(value: Decimal | null | undefined): Decimal | null {
  return value == null ? null : value;
}

/** Compares the same metrics across several analyzed models. */
export function compareAnalyses(
  entries: Array<{ name: string; analysis: FullAnalysis }>
): ScenarioComparisonRow[] {
  const pick = (a: FullAnalysis): Array<Decimal | null> => [
    decimalOrNull(a.profit.totals.revenue),
    decimalOrNull(a.profit.totals.netProfit),
    decimalOrNull(a.profit.margins.net),
    a.roi.roiPercent.ok ? a.roi.roiPercent.value : null,
    new Decimal(a.profit.projection.endingCustomers),
    a.breakEven.breakEvenCustomers.ok
      ? a.breakEven.breakEvenCustomers.value
      : null,
    a.roi.paybackMonths !== null ? new Decimal(a.roi.paybackMonths) : null,
    decimalOrNull(a.cashFlow.endingBalance),
    a.cashFlow.runwayMonths.ok ? a.cashFlow.runwayMonths.value : null,
    decimalOrNull(a.profit.revenue.mrrNow),
    a.unitEconomics.cac.ok ? a.unitEconomics.cac.value : null,
    a.unitEconomics.ltvToCac.ok ? a.unitEconomics.ltvToCac.value : null,
  ];

  const labels: Record<ComparisonMetricId, string> = {
    revenue: "Revenue",
    netProfit: "Net Profit",
    netMargin: "Net Margin",
    roi: "ROI",
    endingCustomers: "Ending Customers",
    breakEvenCustomers: "Break-even Customers",
    paybackMonths: "Payback Months",
    endingCash: "Ending Cash",
    runwayMonths: "Runway Months",
    mrrNow: "MRR",
    cac: "CAC",
    ltvCac: "LTV:CAC",
  };

  const ids: ComparisonMetricId[] = [
    "revenue",
    "netProfit",
    netMarginKey(),
    "roi",
    "endingCustomers",
    "breakEvenCustomers",
    "paybackMonths",
    "endingCash",
    "runwayMonths",
    "mrrNow",
    "cac",
    "ltvCac",
  ];

  function netMarginKey(): ComparisonMetricId {
    return "netMargin";
  }

  const rows = ids.map((id, index) => ({
    metric: id,
    label: labels[id],
    values: entries.map((e) => pick(e.analysis)[index]),
  }));

  return rows.filter((row) =>
    row.values.some((v) => v !== null)
  );
}
