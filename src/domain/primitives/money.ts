import Decimal from "decimal.js";

Decimal.set({ precision: 28, rounding: Decimal.ROUND_HALF_UP });

export { Decimal };

/**
 * Monetary value locked to a currency. All arithmetic in the application flows
 * through this module so floating point drift never reaches a user-visible
 * number. Model inputs arrive as plain numbers (JSON friendly) and are wrapped
 * once at the calculation boundary.
 */
export interface Money {
  readonly amount: Decimal;
  readonly currency: string;
}

export function money(amount: Decimal.Value, currency: string): Money {
  return { amount: new Decimal(amount), currency };
}

export function zero(currency: string): Money {
  return money(0, currency);
}

function assertSameCurrency(a: Money, b: Money): void {
  if (a.currency !== b.currency) {
    throw new Error(
      `Currency mismatch: ${a.currency} cannot be combined with ${b.currency}`
    );
  }
}

export function add(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  return money(a.amount.plus(b.amount), a.currency);
}

export function subtract(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  return money(a.amount.minus(b.amount), a.currency);
}

export function multiply(a: Money, factor: Decimal.Value): Money {
  return money(a.amount.times(factor), a.currency);
}

export function compareAmount(a: Money, b: Money): number {
  assertSameCurrency(a, b);
  return a.amount.comparedTo(b.amount);
}

export function isNegative(a: Money): boolean {
  return a.amount.isNegative();
}

export function isZero(a: Money): boolean {
  return a.amount.isZero();
}

export function sumAmounts(amounts: readonly Decimal[]): Decimal {
  return amounts.reduce<Decimal>(
    (acc, next) => acc.plus(next),
    new Decimal(0)
  );
}

export function sum(list: readonly Money[], currency: string): Money {
  return money(sumAmounts(list.map((m) => m.amount)), currency);
}

export function minOf(a: Money, b: Money): Money {
  return a.amount.lessThanOrEqualTo(b.amount) ? a : b;
}

/**
 * Split an amount across weights using the largest remainder method so the
 * parts always reassemble to the original amount.
 */
export function allocate(
  a: Money,
  weights: readonly Decimal.Value[]
): Money[] {
  const totalWeight = weights.reduce(
    (acc: Decimal, w) => acc.plus(w),
    new Decimal(0)
  );
  if (totalWeight.isZero()) {
    return weights.map(() => zero(a.currency));
  }
  const raw = weights.map((w) =>
    a.amount.times(new Decimal(w)).div(totalWeight)
  );
  const floored = raw.map((r) =>
    r.toDecimalPlaces(2, Decimal.ROUND_DOWN)
  );
  let remainder = a.amount.minus(
    floored.reduce((acc: Decimal, f) => acc.plus(f), new Decimal(0))
  );
  const order = raw
    .map((r, i) => ({ i, frac: r.minus(floored[i]) }))
    .sort((x, y) => y.frac.comparedTo(x.frac));
  const result = [...floored];
  let k = 0;
  while (remainder.greaterThan(0) && order.length > 0) {
    const idx = order[k % order.length].i;
    result[idx] = result[idx].plus(0.01);
    remainder = remainder.minus(0.01);
    k += 1;
  }
  return result.map((amount) => money(amount, a.currency));
}
