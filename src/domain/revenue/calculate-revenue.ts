import { BusinessModel, RevenueStream } from "../model/types";
import { Decimal } from "../primitives/money";
import { remainingShare } from "../primitives/percentage";
import {
  CustomerProjection,
} from "../customers/project-customers";

const FREQUENCY_DIVISOR: Record<string, Decimal> = {
  monthly: new Decimal(1),
  maintenance: new Decimal(1),
  other: new Decimal(1),
  quarterly: new Decimal(3),
  yearly: new Decimal(12),
};

export function isOneTimeStream(stream: RevenueStream): boolean {
  return stream.type === "one-time" || stream.type === "setup-fee";
}

/** Net price received per unit after discount and refunds. */
export function netUnitPrice(stream: RevenueStream): Decimal {
  const price = new Decimal(Math.max(0, stream.price));
  return price
    .times(remainingShare({ points: new Decimal(stream.discountPercent) }))
    .times(remainingShare({ points: new Decimal(stream.refundRate) }));
}

/**
 * Recurring streams contribute a normalized net amount per active customer
 * per month. Usage-based multiplies the unit price by assumed monthly units.
 * Commission takes a percentage of the average order value.
 */
export function recurringMonthlyPerCustomer(
  stream: RevenueStream
): Decimal | null {
  if (isOneTimeStream(stream)) return null;
  const net = netUnitPrice(stream);
  if (stream.type === "usage-based") {
    const units = Math.max(0, stream.usageUnitsPerMonth ?? 0);
    return net.times(units);
  }
  if (stream.type === "commission") {
    const aov = new Decimal(Math.max(0, stream.averageOrderValue ?? 0));
    const rate = Decimal.max(0, new Decimal(stream.commissionPercent ?? 0)).dividedBy(100);
    return aov.times(rate).times(remainingShare({ points: new Decimal(stream.refundRate) }));
  }
  const divisor = FREQUENCY_DIVISOR[stream.type] ?? new Decimal(1);
  return net.dividedBy(divisor);
}

export interface RevenueSeriesPoint {
  month: number;
  recurringRevenue: Decimal;
  oneTimeRevenue: Decimal;
  totalRevenue: Decimal;
}

export interface RevenueCalculation {
  currency: string;
  /** Combined net recurring revenue per customer per month. */
  recurringPerCustomerMonthly: Decimal;
  /** Net one-time revenue per newly acquired customer. */
  oneTimePerNewCustomer: Decimal;
  series: RevenueSeriesPoint[];
  horizonTotals: {
    recurringRevenue: Decimal;
    oneTimeRevenue: Decimal;
    totalRevenue: Decimal;
  };
  /** Current run-rate figures based on starting customers. */
  mrrNow: Decimal;
  arrNow: Decimal;
  grossMonthlyBeforeAdjustments: Decimal;
  discountAmountMonthly: Decimal;
  refundAmountMonthly: Decimal;
}

/**
 * Projects revenue across the horizon. Month 0 additionally recognizes the
 * starting cohort for one-time streams (the initial stock of customers buys
 * once). Recurring streams follow the projected active customer base.
 */
export function calculateRevenue(
  model: BusinessModel,
  projection: CustomerProjection
): RevenueCalculation {
  let recurringPerCustomerMonthly = new Decimal(0);
  let oneTimePerNewCustomer = new Decimal(0);
  let grossMonthly = new Decimal(0);
  let discountMonthly = new Decimal(0);
  let refundMonthly = new Decimal(0);

  for (const stream of model.revenueStreams) {
    const price = new Decimal(Math.max(0, stream.price));
    const discountShare = remainingShare({
      points: new Decimal(stream.discountPercent),
    });
    const refundShare = remainingShare({
      points: new Decimal(stream.refundRate),
    });
    discountMonthly = discountMonthly.plus(
      price.times(new Decimal(1).minus(discountShare))
    );
    refundMonthly = refundMonthly.plus(price.times(discountShare).times(new Decimal(1).minus(refundShare)));

    const perCustomer = recurringMonthlyPerCustomer(stream);
    if (perCustomer !== null) {
      recurringPerCustomerMonthly = recurringPerCustomerMonthly.plus(perCustomer);
    } else {
      oneTimePerNewCustomer = oneTimePerNewCustomer.plus(netUnitPrice(stream));
    }
    grossMonthly = grossMonthly.plus(price);
  }

  const series: RevenueSeriesPoint[] = projection.points.map((point) => {
    const active = new Decimal(point.endingCustomers);
    const recurringRevenue = recurringPerCustomerMonthly.times(active);
    const oneTimeRevenue = oneTimePerNewCustomer.times(
      new Decimal(point.newCustomers)
    );
    return {
      month: point.month,
      recurringRevenue,
      oneTimeRevenue,
      totalRevenue: recurringRevenue.plus(oneTimeRevenue),
    };
  });

  // Initial cohort purchases recognized at month 0.
  if (series.length > 0 && oneTimePerNewCustomer.greaterThan(0)) {
    const initialCohort = new Decimal(projection.startingCustomers);
    series[0].oneTimeRevenue = series[0].oneTimeRevenue.plus(
      oneTimePerNewCustomer.times(initialCohort)
    );
    series[0].totalRevenue = series[0].recurringRevenue.plus(
      series[0].oneTimeRevenue
    );
  }

  const totals = series.reduce(
    (acc, p) => ({
      recurringRevenue: acc.recurringRevenue.plus(p.recurringRevenue),
      oneTimeRevenue: acc.oneTimeRevenue.plus(p.oneTimeRevenue),
      totalRevenue: acc.totalRevenue.plus(p.totalRevenue),
    }),
    {
      recurringRevenue: new Decimal(0),
      oneTimeRevenue: new Decimal(0),
      totalRevenue: new Decimal(0),
    }
  );

  return {
    currency: model.baseCurrency,
    recurringPerCustomerMonthly,
    oneTimePerNewCustomer,
    series,
    horizonTotals: totals,
    mrrNow: recurringPerCustomerMonthly.times(
      Math.max(0, model.customers.startingCustomers)
    ),
    arrNow: recurringPerCustomerMonthly
      .times(Math.max(0, model.customers.startingCustomers))
      .times(12),
    grossMonthlyBeforeAdjustments: grossMonthly,
    discountAmountMonthly: discountMonthly,
    refundAmountMonthly: refundMonthly,
  };
}
