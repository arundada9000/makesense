import { Decimal } from "@/domain/primitives/money";
import { currencyInfo } from "@/domain/primitives/currency";

export type NumberStyle = "exact" | "compact";

const COMPACT_THRESHOLDS: Array<{ limit: number; suffix: string }> = [
  { limit: 1e9, suffix: "B" },
  { limit: 1e6, suffix: "M" },
  { limit: 1e3, suffix: "K" },
];

function toDecimal(value: Decimal | number | null | undefined): Decimal | null {
  if (value === null || value === undefined) return null;
  return value instanceof Decimal ? value : new Decimal(value);
}

/**
 * Formats a monetary amount with the currency's symbol. Compact mode keeps
 * large figures readable in cards while exact mode preserves every digit for
 * reports and tables.
 */
export function formatMoney(
  value: Decimal | number | null | undefined,
  currency: string,
  options?: { style?: NumberStyle; signed?: boolean; decimals?: number }
): string {
  const d = toDecimal(value);
  if (d === null) return "-";
  const info = currencyInfo(currency);
  const style = options?.style ?? "exact";
  const signed = options?.signed ?? false;

  const negative = d.isNegative();
  const abs = d.abs();

  let body: string;
  if (style === "compact" && abs.greaterThanOrEqualTo(1000)) {
    const t = COMPACT_THRESHOLDS.find((x) => abs.greaterThanOrEqualTo(x.limit))!;
    const scaled = abs.dividedBy(t.limit).toDecimalPlaces(1);
    body = `${scaled.toString()}${t.suffix}`;
  } else {
    const decimals = options?.decimals ?? info.decimals;
    body = abs.toDecimalPlaces(decimals).toFixed(decimals);
    // Group thousands.
    const [intPart, fracPart] = body.split(".");
    const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    body = fracPart ? `${grouped}.${fracPart}` : grouped;
  }

  const sign = negative ? "-" : signed && !d.isZero() ? "+" : "";
  return `${sign}${info.symbol} ${body}`;
}

/** Formats a bare number with grouping and optional compact style. */
export function formatNumber(
  value: Decimal | number | null | undefined,
  options?: { style?: NumberStyle; decimals?: number; signed?: boolean }
): string {
  const d = toDecimal(value);
  if (d === null) return "-";
  const style = options?.style ?? "exact";
  const signed = options?.signed ?? false;
  const negative = d.isNegative();
  const abs = d.abs();

  let body: string;
  if (style === "compact" && abs.greaterThanOrEqualTo(1000)) {
    const t = COMPACT_THRESHOLDS.find((x) => abs.greaterThanOrEqualTo(x.limit))!;
    body = `${abs.dividedBy(t.limit).toDecimalPlaces(1)}${t.suffix}`;
  } else {
    const decimals = options?.decimals ?? 0;
    const fixed = abs.toDecimalPlaces(decimals).toFixed(decimals);
    const [intPart, fracPart] = fixed.split(".");
    body = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (fracPart) body = `${body}.${fracPart}`;
  }

  const sign = negative ? "-" : signed && !d.isZero() ? "+" : "";
  return `${sign}${body}`;
}

/** Formats a percent expressed in points, e.g. 13 -> "13%". */
export function formatPercent(
  value: Decimal | number | null | undefined,
  options?: { decimals?: number; signed?: boolean }
): string {
  const d = toDecimal(value);
  if (d === null) return "-";
  const decimals = options?.decimals ?? 0;
  const sign = options?.signed && !d.isZero() && !d.isNegative() ? "+" : "";
  return `${sign}${d.toDecimalPlaces(decimals).toFixed(decimals)}%`;
}

/** Formats a ratio such as LTV:CAC. */
export function formatRatio(value: Decimal | number | null | undefined): string {
  const d = toDecimal(value);
  if (d === null) return "-";
  return `${d.toDecimalPlaces(2).toFixed(2)}:1`;
}

export function formatMonths(value: Decimal | number | null): string {
  if (value === null) return "-";
  const d = toDecimal(value)!;
  if (!Number.isFinite(d.toNumber())) return "-";
  const months = d.toDecimalPlaces(1);
  if (months.lessThan(1)) {
    const weeks = months.times(4.33).toDecimalPlaces(1);
    return `${weeks.toString()} wk`;
  }
  return `${months.toString()} mo`;
}
