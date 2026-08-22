import { BusinessModel } from "../model/types";
import { Decimal } from "../primitives/money";
import { Maybe, none, some } from "../primitives/safe-math";
import { ProfitCalculation } from "../profit/calculate-profit";

export interface RoiCalculation {
  currency: string;
  /** (Total net profit - initial investment) / initial investment x 100. */
  roiPercent: Maybe<Decimal>;
  /** Total net profit divided by investment. */
  returnMultiple: Maybe<Decimal>;
  /** First month cumulative net profit covers the investment. */
  paybackMonths: number | null;
  cumulativeNetProfit: Decimal[];
}

export function calculateRoi(
  model: BusinessModel,
  profit: ProfitCalculation
): RoiCalculation {
  const investment = profit.costs.initialInvestmentTotal;

  const roiPercent: Maybe<Decimal> = investment.isZero()
    ? none(
        "No initial investment recorded, so ROI is undefined. Add investment items or record founder capital."
      )
    : some(
        profit.totals.netProfit
          .minus(investment)
          .times(100)
          .dividedBy(investment)
      );

  const returnMultiple: Maybe<Decimal> = investment.isZero()
    ? none("No initial investment recorded.")
    : some(profit.totals.netProfit.dividedBy(investment));

  let paybackMonths: number | null = null;
  const cumulative: Decimal[] = [];
  let running = new Decimal(0);
  for (const p of profit.series) {
    running = running.plus(p.netProfit);
    cumulative.push(running);
    if (paybackMonths === null && running.greaterThanOrEqualTo(investment)) {
      paybackMonths = p.month;
    }
  }

  void model;

  return {
    currency: model.baseCurrency,
    roiPercent,
    returnMultiple,
    paybackMonths,
    cumulativeNetProfit: cumulative,
  };
}
