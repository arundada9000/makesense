import { BusinessModel } from "../model/types";
import { FullAnalysis } from "../scenarios/compare-scenarios";
import { Decimal } from "../primitives/money";

export type InsightTone = "neutral" | "positive" | "warning" | "critical";

export interface Insight {
  id: string;
  tone: InsightTone;
  message: string;
}

/**
 * Deterministic observations derived only from the model's own numbers.
 * These are mathematical consequences of assumptions, never predictions.
 */
export function generateInsights(
  model: BusinessModel,
  analysis: FullAnalysis
): Insight[] {
  const insights: Insight[] = [];
  const { profit, unitEconomics, breakEven, roi, cashFlow } = analysis;

  const vcPerCustomer = unitEconomics.variableCostPerCustomerMonthly;

  if (unitEconomics.arpuMonthly.ok) {
    const arpu = unitEconomics.arpuMonthly.value;
    if (arpu.greaterThan(0) && vcPerCustomer.greaterThanOrEqualTo(arpu)) {
      insights.push({
        id: "vc-exceeds-revenue",
        tone: "critical",
        message:
          "Variable costs currently exceed revenue per customer. Each additional customer increases losses.",
      });
    }
  }

  if (breakEven.investmentRecoveryCustomers.ok) {
    const v = breakEven.investmentRecoveryCustomers.value;
    if (v.greaterThan(0)) {
      insights.push({
        id: "investment-recovery",
        tone: "neutral",
        message: `You recover your initial investment after approximately ${formatCount(v)} customers under current contribution.`,
      });
    }
  }

  if (roi.roiPercent.ok && cashFlow.openingBalance.greaterThan(0)) {
    const roiValue = roi.roiPercent.value;
    insights.push({
      id: "roi-statement",
      tone: roiValue.greaterThan(0) ? "positive" : "warning",
      message: `${roiValue.greaterThan(0) ? "+" : ""}${trimDecimals(roiValue)}% ROI over the ${model.projectionSettings.horizonMonths}-month horizon relative to the initial investment.`,
    });
  }

  if (unitEconomics.cac.ok && unitEconomics.ltvToCac.ok) {
    const ratio = unitEconomics.ltvToCac.value;
    insights.push({
      id: "ltv-cac",
      tone: ratio.greaterThanOrEqualTo(3)
        ? "positive"
        : ratio.greaterThanOrEqualTo(1)
          ? "warning"
          : "critical",
      message: `LTV:CAC is ${trimDecimals(ratio)}:1. A common benchmark for sustainable acquisition is at least 3:1.`,
    });
  }

  if (cashFlow.lowestBalance !== null && cashFlow.lowestBalance.isNegative()) {
    const firstNegative = cashFlow.series.find((p) =>
      p.closingCash.isNegative()
    );
    if (firstNegative) {
      insights.push({
        id: "cash-negative",
        tone: "critical",
        message: `Your cash balance becomes negative in month ${firstNegative.month} under current assumptions. Consider financing or reducing costs before then.`,
      });
    }
  }

  if (
    !cashFlow.runwayMonths.ok &&
    cashFlow.series.length > 0 &&
    cashFlow.endingBalance.greaterThanOrEqualTo(0) &&
    profit.totals.revenue.greaterThan(0)
  ) {
    insights.push({
      id: "runway-positive",
      tone: "positive",
      message:
        "Cash flow is positive across the horizon, so traditional runway does not apply.",
    });
  }

  const recurringShare = recurringShareOf(profit);
  if (recurringShare !== null) {
    insights.push({
      id: "recurring-share",
      tone: "neutral",
      message: `${recurringShare.toFixed(0)}% of projected revenue is recurring.`,
    });
  }

  if (
    model.businessType === "b2b-enterprise" &&
    model.customers.startingCustomers > 0 &&
    model.customers.startingCustomers <= 50
  ) {
    insights.push({
      id: "concentration",
      tone: model.customers.startingCustomers < 20 ? "warning" : "neutral",
      message:
        model.customers.startingCustomers < 20
          ? "Very few customers carry the whole model. Losing one would materially change results."
          : `A small base of ${model.customers.startingCustomers} customers carries this model.`,
    });
  }

  return insights.filter((i): i is Insight => Boolean(i.message));
}

function recurringShareOf(profit: FullAnalysis["profit"]): number | null {
  const total = profit.totals.revenue;
  if (total.isZero()) return null;
  let recurring = new Decimal(0);
  for (const p of profit.revenue.series) {
    recurring = recurring.plus(p.recurringRevenue);
  }
  return Number(recurring.times(100).dividedBy(total).toDecimalPlaces(1));
}

function formatCount(value: Decimal): string {
  return value.toDecimalPlaces(0).toString();
}

function trimDecimals(value: Decimal): string {
  return value.toDecimalPlaces(1).toString();
}
