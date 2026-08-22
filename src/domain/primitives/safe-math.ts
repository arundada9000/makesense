import { Decimal } from "./money";

/**
 * Explicit computability. Financial results that cannot be derived from the
 * current assumptions surface a reason string instead of NaN or Infinity.
 */
export type Maybe<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly reason: string };

export function some<T>(value: T): Maybe<T> {
  return { ok: true, value };
}

export function none<T = never>(reason: string): Maybe<T> {
  return { ok: false, reason };
}

export function mapMaybe<T, U>(
  m: Maybe<T>,
  fn: (value: T) => U
): Maybe<U> {
  return m.ok ? some(fn(m.value)) : m;
}

export function maybeDivide(
  numerator: Decimal.Value,
  denominator: Decimal.Value,
  reasonIfZero = "Division by zero"
): Maybe<Decimal> {
  const d = new Decimal(denominator);
  if (d.isZero()) return none(reasonIfZero);
  return some(new Decimal(numerator).dividedBy(d));
}

export function unwrapOr<T>(m: Maybe<T>, fallback: T): T {
  return m.ok ? m.value : fallback;
}

export function isFiniteNumber(value: number): boolean {
  return Number.isFinite(value);
}
