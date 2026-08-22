import { BusinessModel } from "../model/types";
import { Decimal, money, Money } from "../primitives/money";
import {
  CostsCalculation,
  calculateCosts,
} from "../costs/calculate-costs";
import {
  RevenueCalculation,
  calculateRevenue,
} from "../revenue/calculate-revenue";
import {
  CustomerProjection,
  projectCustomers,
} from "../customers/project-customers";

export interface ProfitSeriesPoint {
  month: number;
  revenue: Decimal;
  variableCosts: Decimal;
  grossProfit: Decimal;
  fixedCosts: Decimal;
  operatingProfit: Decimal;
  tax: Decimal;
  netProfit: Decimal;
}

export interface ProfitCalculation {
  currency: string;
  series: ProfitSeriesPoint[];
  totals: {
    revenue: Decimal;
    variableCosts: Decimal;
    grossProfit: Decimal;
    fixedCosts: Decimal;
    operatingProfit: Decimal;
    tax: Decimal;
    netProfit: Decimal;
  };
  margins: {
    gross: Decimal | null;
    operating: Decimal | null;
    net: Decimal | null;
  };
  projection: CustomerProjection;
  costs: CostsCalculation;
  revenue: RevenueCalculation;
  lossCarriedForwardEnd: Decimal;
}

/**
 * Full profit waterfall per month:
 * revenue - variable = gross; gross - fixed = operating;
 * operating - tax = net. Losses may carry forward when the profile allows it.
 */
export function calculateProfit(model: BusinessModel): ProfitCalculation {
  const horizon = Math.max(1, model.projectionSettings.horizonMonths);
  const projection = projectCustomers(model.customers, horizon);
  const costs = calculateCosts(model);
  const revenue = calculateRevenue(model, projection);

  const taxEnabled = model.taxProfile.enabled;
  const taxRate = Decimal.max(
    0,
    new Decimal(model.taxProfile.corporateTaxRatePercent)
  ).dividedBy(100);
  let lossCarryforward = new Decimal(0);

  const series: ProfitSeriesPoint[] = [];

  for (let i = 0; i < horizon; i += 1) {
    const point = projection.points[i];
    const active = new Decimal(Math.max(0, point.endingCustomers));
    const rev = revenue.series[i].totalRevenue;
    const variable = costs.variablePerCustomerMonthly.times(active);
    const gross = rev.minus(variable);
    const operating = gross.minus(costs.fixedMonthlyTotal);

    let tax = new Decimal(0);
    if (taxEnabled && operating.greaterThan(0)) {
      let taxable = operating;
      if (model.taxProfile.lossCarryforward && lossCarryforward.greaterThan(0)) {
        const offsetUsed = Decimal.min(lossCarryforward, operating);
        taxable = operating.minus(offsetUsed);
        lossCarryforward = lossCarryforward.minus(offsetUsed);
      }
      tax = taxable.times(taxRate);
    } else if (
      taxEnabled &&
      operating.lessThan(0) &&
      model.taxProfile.lossCarryforward
    ) {
      lossCarryforward = lossCarryforward.plus(operating.abs());
    }

    const net = operating.minus(tax);

    series.push({
      month: point.month,
      revenue: rev,
      variableCosts: variable,
      grossProfit: gross,
      fixedCosts: costs.fixedMonthlyTotal,
      operatingProfit: operating,
      tax,
      netProfit: net,
    });
  }

  const totals = series.reduce(
    (acc, p) => ({
      revenue: acc.revenue.plus(p.revenue),
      variableCosts: acc.variableCosts.plus(p.variableCosts),
      grossProfit: acc.grossProfit.plus(p.grossProfit),
      fixedCosts: acc.fixedCosts.plus(p.fixedCosts),
      operatingProfit: acc.operatingProfit.plus(p.operatingProfit),
      tax: acc.tax.plus(p.tax),
      netProfit: acc.netProfit.plus(p.netProfit),
    }),
    {
      revenue: new Decimal(0),
      variableCosts: new Decimal(0),
      grossProfit: new Decimal(0),
      fixedCosts: new Decimal(0),
      operatingProfit: new Decimal(0),
      tax: new Decimal(0),
      netProfit: new Decimal(0),
    }
  );

  const marginOf = (profit: Decimal): Decimal | null =>
    totals.revenue.isZero() ? null : profit.times(100).dividedBy(totals.revenue);

  return {
    currency: model.baseCurrency,
    series,
    totals,
    margins: {
      gross: marginOf(totals.grossProfit),
      operating: marginOf(totals.operatingProfit),
      net: marginOf(totals.netProfit),
    },
    projection,
    costs,
    revenue,
    lossCarriedForwardEnd: lossCarryforward,
  };
}

export function moneyOf(amount: Decimal, currency: string): Money {
  return money(amount, currency);
}
