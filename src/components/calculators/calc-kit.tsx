"use client";

import { useMemo, useState } from "react";
import { Card, CardBody } from "@/components/ui/card";
import { Field, NumberInput } from "@/components/ui/field";

/**
 * Compact result strip shared by every standalone calculator.
 */
export function CalcResult({
  rows,
}: {
  rows: Array<{ label: string; value: string; tone?: "positive" | "negative" | "accent" }>;
}) {
  return (
    <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {rows.map((r) => (
        <div key={r.label}>
          <dt className="text-[11px] uppercase tracking-wide text-muted">{r.label}</dt>
          <dd
            className={`mt-0.5 text-lg font-semibold tabular-nums ${
              r.tone === "positive"
                ? "text-success"
                : r.tone === "negative"
                  ? "text-danger"
                  : r.tone === "accent"
                    ? "text-accent"
                    : ""
            }`}
          >
            {r.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function CalcCard({
  title,
  children,
  result,
}: {
  title: string;
  children: React.ReactNode;
  result: React.ReactNode;
}) {
  return (
    <Card>
      <CardBody className="space-y-4">
        <p className="text-sm font-semibold">{title}</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
        <div className="border-t border-border pt-4">{result}</div>
      </CardBody>
    </Card>
  );
}

/** Formats a number with grouping and a fixed suffix like currency. */
export function useMoney(symbol: string) {
  return (v: number, decimals = 2) =>
    `${symbol} ${v.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
}

/**
 * Compact rendering of large money values (1000 -> "Rs. 1k", 2500000 ->
 * "Rs. 2.5M") so inputs stay readable. Returns null when the number is too
 * small to need shortening.
 */
export function compactMoney(symbol: string, value: number): string | null {
  if (!Number.isFinite(value) || Math.abs(value) < 1000) return null;
  const units = [
    { div: 1e9, suffix: "B" },
    { div: 1e6, suffix: "M" },
    { div: 1e3, suffix: "k" },
  ];
  for (const { div, suffix } of units) {
    if (Math.abs(value) >= div) {
      const scaled = value / div;
      const abs = Math.abs(scaled);
      const decimals = abs < 10 ? 1 : abs < 100 ? 1 : 0;
      const text = scaled
        .toFixed(decimals)
        .replace(/\.0$/, "");
      return `${symbol} ${text}${suffix}`;
    }
  }
  return null;
}

/**
 * Money input with a compact read-under hint ("= Rs. 25k") so long zero
 * strings are easy to parse at a glance.
 */
export function MoneyField({
  label,
  htmlFor,
  value,
  onValueChange,
  symbol = "Rs.",
  help,
  allowNegative = false,
}: {
  label: string;
  htmlFor: string;
  value: number;
  onValueChange: (value: number) => void;
  symbol?: string;
  help?: React.ReactNode;
  allowNegative?: boolean;
}) {
  const compact = compactMoney(symbol, value);
  return (
    <Field
      label={label}
      htmlFor={htmlFor}
      help={
        !help && !compact ? undefined : (
          <>
            {help ? <span className="block">{help}</span> : null}
            {compact ? <span className={`${help ? "block" : ""} text-muted-foreground`}> = {compact}</span> : null}
          </>
        )
      }
    >
      <NumberInput
        id={htmlFor}
        value={value}
        onValueChange={onValueChange}
        allowNegative={allowNegative}
      />
    </Field>
  );
}

export function useCalcState<T extends Record<string, number>>(initial: T) {
  const [values, setValues] = useState<T>(initial);
  const setters = useMemo(() => {
    const map = {} as { [K in keyof T]: (v: number) => void };
    for (const key of Object.keys(initial) as Array<keyof T>) {
      map[key] = (v: number) => setValues((prev) => ({ ...prev, [key]: v }));
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [values, setters] as const;
}

export { NumberInput, Field };
