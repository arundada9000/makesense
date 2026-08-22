import { BusinessModel } from "../model/types";
import { Decimal } from "../primitives/money";
import { Maybe, maybeDivide, none, some } from "../primitives/safe-math";
import { ProfitCalculation } from "../profit/calculate-profit";

export interface BreakEvenCalculation {
  currency: string;
  /** Customers needed to cover monthly fixed costs. */
  breakEvenCustomers: Maybe<Decimal>;
  /** Monthly revenue needed to cover fixed costs. */
  breakEvenRevenueMonthly: Maybe<Decimal>;
  /** Customers needed including investment recovery across the horizon. */
  breakEvenCustomersWithInvestment: Maybe<Decimal>;
  investmentRecoveryCustomers: Maybe<Decimal>;
  /** Progress of current starting customers toward break-even. */
  progressPercent: Decimal | null;
  projectedBreakEvenMonth: number | null;
}

/**
 * Break-even from contribution math. When contribution per customer is zero
 * or negative, break-even is unreachable and a reason is returned instead.
 */
export function calculateBreakEven(
  model: BusinessModel,
  profit: ProfitCalculation
): BreakEvenCalculation {
  const unit = profit.revenue.recurringPerCustomerMonthly
    .minus(profit.costs.variablePerCustomerMonthly);
  const oneTimeContribution = profit.revenue.oneTimePerNewCustomer;

  // Contribution blends recurring contribution with one-time contribution so
  // product businesses break even on sales volume rather than subscriptions.
  const blended = unit.plus(oneTimeContribution);

  const fixed = profit.costs.fixedMonthlyTotal;
  const investment = profit.costs.initialInvestmentTotal;
  const horizon = Math.max(1, model.projectionSettings.horizonMonths);

  const beCustomers: Maybe<Decimal> =
    fixed.isZero() && investment.isZero()
      ? some(new Decimal(0))
      : blended.lessThanOrEqualTo(0)
        ? none(
            "Contribution per customer is zero or negative. Break-even cannot be reached under the current assumptions."
          )
        : maybeDivide(fixed, blended);

  const cmPercent = profit.margins.gross;
  const beRevenue: Maybe<Decimal> =
    cmPercent === null
      ? none("No revenue is projected, so revenue break-even is undefined.")
      : cmPercent.lessThanOrEqualTo(0)
        ? none(
            "Gross margin is not positive, so a revenue break-even point cannot be computed."
          )
        : some(fixed.times(100).dividedBy(cmPercent));

  const monthlyInvestmentLoad = investment.dividedBy(horizon);
  const totalToCover = fixed.plus(monthlyInvestmentLoad);
  const beWithInvestment: Maybe<Decimal> =
    totalToCover.isZero()
      ? some(new Decimal(0))
      : blended.lessThanOrEqualTo(0)
        ? none(
            "Contribution per customer is zero or negative. Break-even cannot be reached under the current assumptions."
          )
        : maybeDivide(totalToCover, blended);

  const recoveryCustomers: Maybe<Decimal> =
    investment.isZero()
      ? some(new Decimal(0))
      : blended.lessThanOrEqualTo(0)
        ? none("Contribution cannot recover the investment at current assumptions.")
        : maybeDivide(investment, blended,
            "Contribution per customer is zero.");

  let progressPercent: Decimal | null = null;
  if (beCustomers.ok) {
    if (beCustomers.value.isZero()) {
      progressPercent = new Decimal(100);
    } else {
      const current = Math.max(0, model.customers.startingCustomers);
      progressPercent = Decimal.min(
        new Decimal(100),
        new Decimal(current).times(100).dividedBy(beCustomers.value)
      );
    }
  }

  // First month where cumulative operating profit (excluding tax timing and
  // financing) turns non-negative.
  let projectedMonth: number | null = null;
  let cumulative = new Decimal(0);
  for (const p of profit.series) {
    cumulative = cumulative.plus(p.operatingProfit);
    if (!cumulative.isNegative()) {
      projectedMonth = p.month;
      break;
    }
  }
  if (
    projectedMonth === null &&
    profit.costs.fixedMonthlyTotal.isZero() &&
    profit.totals.operatingProfit.greaterThanOrEqualTo(0)
  ) {
    projectedMonth = 1;
  }

  return {
    currency: model.baseCurrency,
    breakEvenCustomers: beCustomers,
    breakEvenRevenueMonthly: beRevenue,
    breakEvenCustomersWithInvestment: beWithInvestment,
    investmentRecoveryCustomers: recoveryCustomers,
    progressPercent,
    projectedBreakEvenMonth: projectedMonth,
  };
}
