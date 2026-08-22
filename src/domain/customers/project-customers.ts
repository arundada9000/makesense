import { CustomerAssumptions } from "../model/types";
import { Decimal } from "../primitives/money";

export interface CustomerProjectionPoint {
  month: number;
  newCustomers: number;
  churnedCustomers: number;
  endingCustomers: number;
}

export interface CustomerProjection {
  points: CustomerProjectionPoint[];
  startingCustomers: number;
  endingCustomers: number;
  totalNew: number;
  totalChurned: number;
}

function growthForMonth(
  assumptions: CustomerAssumptions,
  monthIndex: number
): number {
  switch (assumptions.growthMode) {
    case "none":
      return 0;
    case "fixed":
      return assumptions.fixedGrowthPerMonth;
    case "percentage":
      return 0;
    case "custom-monthly":
      return assumptions.customMonthlyGrowth[monthIndex] ?? 0;
  }
}

/**
 * Projects the customer base month by month. Churn is applied before growth
 * within each month. Percentage growth adds a share of the post-churn base.
 * An optional market cap limits the ending count.
 */
export function projectCustomers(
  assumptions: CustomerAssumptions,
  horizonMonths: number
): CustomerProjection {
  const churnFraction = Decimal.max(
    0,
    Decimal.min(100, new Decimal(assumptions.monthlyChurnRatePercent))
  ).dividedBy(100);

  const pctGrowth = Decimal.max(
    -100,
    new Decimal(assumptions.percentageGrowthPerMonth)
  ).dividedBy(100);

  const cap = assumptions.maxMarketSize;
  let current = Math.max(0, assumptions.startingCustomers);
  const points: CustomerProjectionPoint[] = [];
  let totalNew = 0;
  let totalChurned = 0;

  for (let m = 0; m < horizonMonths; m += 1) {
    const churnedDecimal = new Decimal(current).times(churnFraction);
    const afterChurn = new Decimal(current).minus(churnedDecimal);

    let added: Decimal;
    if (assumptions.growthMode === "percentage") {
      added = afterChurn.times(pctGrowth);
      if (added.lessThan(0)) added = afterChurn.abs().times(pctGrowth);
    } else {
      added = new Decimal(growthForMonth(assumptions, m));
      if (added.lessThan(0)) {
        // A negative fixed growth shrinks the base but never below zero.
        added = Decimal.max(afterChurn.neg(), added);
      }
    }

    let ending = afterChurn.plus(added);
    if (cap !== undefined && cap >= 0) {
      ending = Decimal.min(ending, new Decimal(cap));
    }
    if (ending.lessThan(0)) ending = new Decimal(0);

    const churned = Number(churnedDecimal.toDecimalPlaces(2));
    const newCount = Number(
      ending.minus(current).plus(churnedDecimal).toDecimalPlaces(2)
    );

    totalChurned += churned;
    totalNew += newCount;

    points.push({
      month: m + 1,
      newCustomers: newCount,
      churnedCustomers: churned,
      endingCustomers: Number(ending.toDecimalPlaces(2)),
    });

    current = Number(ending.toDecimalPlaces(4));
  }

  return {
    points,
    startingCustomers: assumptions.startingCustomers,
    endingCustomers: current,
    totalNew,
    totalChurned,
  };
}
