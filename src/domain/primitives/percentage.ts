import { Decimal } from "./money";

/**
 * Percentage expressed in points. 13 means 13 percent.
 * Stored as Decimal to avoid drift when rates feed multiplications.
 */
export interface Percentage {
  readonly points: Decimal;
}

export function percent(points: Decimal.Value): Percentage {
  return { points: new Decimal(points) };
}

export function fraction(p: Percentage): Decimal {
  return p.points.dividedBy(100);
}

export function clampPercent(p: Percentage, min = 0, max = 100): Percentage {
  const clamped = Decimal.max(min, Decimal.min(max, p.points));
  return { points: clamped };
}

/** Remaining share after the rate, e.g. 13 percent leaves 0.87. */
export function remainingShare(p: Percentage): Decimal {
  return new Decimal(1).minus(fraction(p));
}
