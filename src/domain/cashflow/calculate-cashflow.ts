import { BusinessModel } from "../model/types";
import { Decimal } from "../primitives/money";
import { Maybe, none, some } from "../primitives/safe-math";
import { ProfitCalculation } from "../profit/calculate-profit";
import {
  LoanSchedule,
  amortizeLoan,
  debtInflowForMonth,
  debtServiceForMonth,
} from "../financing/debt";

export interface CashFlowPoint {
  month: number;
  openingCash: Decimal;
  inflows: Decimal;
  financingInflow: Decimal;
  operatingOutflows: Decimal;
  debtPayments: Decimal;
  founderDrawings: Decimal;
  closingCash: Decimal;
}

export interface CashFlowCalculation {
  currency: string;
  series: CashFlowPoint[];
  openingBalance: Decimal;
  lowestBalance: Decimal | null;
  endingBalance: Decimal;
  averageMonthlyBurn: Decimal | null;
  runwayMonths: Maybe<Decimal>;
  cashBreakEvenMonth: number | null;
  loanSchedules: Map<string, LoanSchedule>;
}

/**
 * Monthly cash movement. Profit is not cash: this statement adds starting
 * cash, capital injections and debt principal, then subtracts operating
 * outflows, debt service, taxes already in net profit, and founder drawings.
 */
export function calculateCashFlow(
  model: BusinessModel,
  profit: ProfitCalculation
): CashFlowCalculation {
  const schedules = new Map<string, LoanSchedule>();
  for (const loan of model.financing.debtLoans) {
    schedules.set(loan.id, amortizeLoan(loan));
  }

  const investorAmount = model.financing.investorEquity
    ? Math.max(0, model.financing.investorEquity.investmentAmount)
    : 0;

  const opening = new Decimal(Math.max(0, model.projectionSettings.startingCash))
    .plus(Math.max(0, model.financing.founderCapital))
    .plus(investorAmount);

  const series: CashFlowPoint[] = [];
  let previousClosing = opening;
  let lowest: Decimal | null = null;

  for (let i = 0; i < profit.series.length; i += 1) {
    const p = profit.series[i];
    // Net profit already includes tax. Cash outflow is costs plus tax, so we
    // rebuild it from components to avoid double counting.
    const operatingOutflows = p.variableCosts
      .plus(p.fixedCosts)
      .plus(p.tax);
    const inflow = p.revenue;
    const financingInflow = debtInflowForMonth(
      model.financing.debtLoans,
      i
    );
    const debtPayment = debtServiceForMonth(
      model.financing.debtLoans,
      schedules,
      i
    );
    const drawings = Decimal.max(0, new Decimal(model.financing.founderMonthlySalary));

    const closing = previousClosing
      .plus(inflow)
      .plus(financingInflow)
      .minus(operatingOutflows)
      .minus(debtPayment)
      .minus(drawings);

    if (lowest === null || closing.lessThan(lowest)) {
      lowest = closing;
    }

    series.push({
      month: p.month,
      openingCash: previousClosing,
      inflows: inflow,
      financingInflow,
      operatingOutflows,
      debtPayments: debtPayment,
      founderDrawings: drawings,
      closingCash: closing,
    });

    previousClosing = closing;
  }

  const endingBalance = previousClosing;
  const negativeFlows = series.filter((s) =>
    s.closingCash.lessThan(s.openingCash)
  );
  const burnValues = negativeFlows.map((s) =>
    s.openingCash.minus(s.closingCash)
  );
  const averageBurn =
    burnValues.length > 0
      ? burnValues.reduce((a, b) => a.plus(b), new Decimal(0)).dividedBy(
          burnValues.length
        )
      : null;

  const runwayMonths: Maybe<Decimal> =
    averageBurn === null || averageBurn.isZero()
      ? series.length > 0 && endingBalance.greaterThanOrEqualTo(0)
        ? none(
            "Cash flow is positive under current assumptions, so a traditional runway is not meaningful."
          )
        : none("No burn detected.")
      : some(endingBalance.dividedBy(averageBurn));

  const cashBreakEvenMonth =
    series.find((s) => !s.closingCash.isNegative())?.month ?? null;

  return {
    currency: model.baseCurrency,
    series,
    openingBalance: opening,
    lowestBalance: lowest,
    endingBalance,
    averageMonthlyBurn: averageBurn,
    runwayMonths,
    cashBreakEvenMonth,
    loanSchedules: schedules,
  };
}
