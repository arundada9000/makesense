import { BusinessModel, CostItem } from "../model/types";
import { Decimal } from "../primitives/money";

const FREQUENCY_DIVISOR: Record<CostItem["frequency"], Decimal> = {
  monthly: new Decimal(1),
  quarterly: new Decimal(3),
  yearly: new Decimal(12),
  "one-time": new Decimal(1),
};

/** Normalizes a cost amount to its monthly equivalent. */
export function monthlyEquivalent(item: CostItem): Decimal {
  if (item.frequency === "one-time") return new Decimal(0);
  return new Decimal(Math.max(0, item.amount)).dividedBy(
    FREQUENCY_DIVISOR[item.frequency]
  );
}

export interface CostLineSummary {
  id: string;
  name: string;
  category: CostItem["category"];
  kind: CostItem["kind"];
  monthlyAmount: Decimal;
}

export interface CostsCalculation {
  currency: string;
  fixedMonthlyTotal: Decimal;
  variablePerCustomerMonthly: Decimal;
  initialInvestmentTotal: Decimal;
  fixedLines: CostLineSummary[];
  variableLines: CostLineSummary[];
  investmentLines: Array<{
    id: string;
    name: string;
    category: string;
    amount: Decimal;
  }>;
}

/**
 * Sums operating costs. Initial investment is reported separately and never
 * treated as a recurring expense.
 */
export function calculateCosts(model: BusinessModel): CostsCalculation {
  const fixedLines: CostLineSummary[] = model.fixedCosts.map((c) => ({
    id: c.id,
    name: c.name,
    category: c.category,
    kind: c.kind,
    monthlyAmount: monthlyEquivalent(c),
  }));

  // Variable-per-order items convert to a per-customer monthly figure using
  // the assumed order frequency per customer.
  const variableLines: CostLineSummary[] = model.variableCosts.map((c) => {
    if (c.kind === "variable-per-order") {
      const orders = Math.max(0, c.ordersPerCustomerPerMonth ?? 1);
      return {
        id: c.id,
        name: c.name,
        category: c.category,
        kind: c.kind,
        monthlyAmount: new Decimal(Math.max(0, c.amount)).times(orders),
      };
    }
    return {
      id: c.id,
      name: c.name,
      category: c.category,
      kind: c.kind,
      monthlyAmount: monthlyEquivalent(c),
    };
  });

  const fixedMonthlyTotal = fixedLines.reduce(
    (acc, line) => acc.plus(line.monthlyAmount),
    new Decimal(0)
  );
  const variablePerCustomerMonthly = variableLines.reduce(
    (acc, line) => acc.plus(line.monthlyAmount),
    new Decimal(0)
  );

  const investmentLines = model.investments.map((i) => ({
    id: i.id,
    name: i.name,
    category: i.category,
    amount: new Decimal(Math.max(0, i.amount)),
  }));
  const initialInvestmentTotal = investmentLines.reduce(
    (acc, line) => acc.plus(line.amount),
    new Decimal(0)
  );

  return {
    currency: model.baseCurrency,
    fixedMonthlyTotal,
    variablePerCustomerMonthly,
    initialInvestmentTotal,
    fixedLines,
    variableLines,
    investmentLines,
  };
}
