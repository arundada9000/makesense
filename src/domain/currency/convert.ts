import { Decimal } from "../primitives/money";

export interface ExchangeRate {
  /** Units of target currency per one unit of source currency. */
  rate: Decimal;
  from: string;
  to: string;
  rateDate: string;
  source: string;
}

/** Manual fallback table used when no provider is configured. */
export interface RateTable {
  baseCurrency: string;
  /** Rate = units of base per 1 unit of key currency. */
  rates: Record<string, number>;
  rateDate: string;
  source: string;
}

export const MANUAL_SOURCE = "manual entry";

export function defaultRateTable(baseCurrency: string): RateTable {
  return {
    baseCurrency,
    rates: {},
    rateDate: new Date().toISOString().slice(0, 10),
    source: MANUAL_SOURCE,
  };
}

export function lookupRate(
  table: RateTable,
  fromCurrency: string
): ExchangeRate | null {
  if (fromCurrency === table.baseCurrency) {
    return {
      rate: new Decimal(1),
      from: fromCurrency,
      to: table.baseCurrency,
      rateDate: table.rateDate,
      source: "base currency",
    };
  }
  const value = table.rates[fromCurrency];
  if (value === undefined || !Number.isFinite(value) || value <= 0) return null;
  return {
    rate: new Decimal(value),
    from: fromCurrency,
    to: table.baseCurrency,
    rateDate: table.rateDate,
    source: table.source,
  };
}

export interface ConvertedAmount {
  originalAmount: Decimal;
  originalCurrency: string;
  convertedAmount: Decimal;
  reportingCurrency: string;
  rateUsed: Decimal;
  rateDate: string;
  rateSource: string;
}

/**
 * Converts into the reporting currency. Original values are preserved on the
 * result so nothing is destroyed during conversion.
 */
export function convertToBase(
  amount: Decimal.Value,
  fromCurrency: string,
  table: RateTable
): ConvertedAmount | null {
  const rate = lookupRate(table, fromCurrency);
  if (rate === null) return null;
  const original = new Decimal(amount);
  return {
    originalAmount: original,
    originalCurrency: fromCurrency,
    convertedAmount: original.times(rate.rate),
    reportingCurrency: table.baseCurrency,
    rateUsed: rate.rate,
    rateDate: rate.rateDate,
    rateSource: rate.source,
  };
}

export interface FxScenarioPoint {
  label: string;
  shiftPercent: number;
  convertedRevenue: Decimal;
  convertedCosts: Decimal;
  profitImpact: Decimal;
}

/**
 * FX risk scenarios. Applies symmetric shifts to a foreign-currency revenue
 * and cost pair and reports the effect in the reporting currency.
 */
export function fxScenarios(
  foreignRevenue: Decimal.Value,
  foreignCosts: Decimal.Value,
  unitsOfBasePerForeign: Decimal.Value,
  shifts: number[] = [-10, -5, 5, 10]
): FxScenarioPoint[] {
  const rev = new Decimal(foreignRevenue);
  const costs = new Decimal(foreignCosts);
  const rate = new Decimal(unitsOfBasePerForeign);

  return shifts.map((shift) => {
    const shiftedRate = rate.times(1 + shift / 100);
    const convertedRevenue = rev.times(shiftedRate);
    const convertedCosts = costs.times(shiftedRate);
    return {
      label: `Rate ${shift > 0 ? "+" : ""}${shift}%`,
      shiftPercent: shift,
      convertedRevenue,
      convertedCosts,
      profitImpact: convertedRevenue.minus(convertedCosts),
    };
  });
}
