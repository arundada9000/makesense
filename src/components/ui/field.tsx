"use client";

import { forwardRef, useState } from "react";

interface FieldFrameProps {
  label: string;
  htmlFor?: string;
  help?: React.ReactNode;
  error?: string | null;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  children: React.ReactNode;
}

export function Field({
  label,
  htmlFor,
  help,
  error,
  prefix,
  suffix,
  children,
}: FieldFrameProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-xs font-medium text-muted-foreground"
      >
        {label}
      </label>
      <div className="relative flex items-center">
        {prefix ? (
          <span className="absolute left-3 text-sm text-muted pointer-events-none">
            {prefix}
          </span>
        ) : null}
        {children}
        {suffix ? (
          <span className="absolute right-3 text-xs text-muted pointer-events-none">
            {suffix}
          </span>
        ) : null}
      </div>
      {error ? (
        <p role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : help ? (
        <p className="text-xs text-muted">{help}</p>
      ) : null}
    </div>
  );
}

const baseInput =
  "h-11 w-full rounded-[var(--radius-base)] border bg-surface-secondary px-3 text-base text-foreground placeholder:text-muted transition-colors focus:border-accent focus:bg-surface focus:outline-none disabled:opacity-50";

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  hasPrefix?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput({ className = "", hasPrefix, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`${baseInput} ${hasPrefix ? "pl-9" : ""} ${
          props.type === "number" || props.inputMode === "decimal" ? "pr-3" : ""
        } ${className}`}
        {...props}
      />
    );
  }
);

/**
 * Numeric input that keeps a clean display value while the model stores raw
 * numbers. While focused it shows the raw draft; otherwise the canonical
 * value, so external updates always appear without sync effects.
 */
export function NumberInput({
  value,
  onValueChange,
  id,
  allowNegative = false,
  ...props
}: Omit<TextInputProps, "value" | "onChange"> & {
  value: number;
  onValueChange: (value: number) => void;
  allowNegative?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState("");

  const pattern = allowNegative ? /^-?\d*\.?\d*$/ : /^\d*\.?\d*$/;

  function commit(raw: string) {
    if (raw === "" || (allowNegative && raw === "-")) {
      onValueChange(0);
      return;
    }
    const parsed = parseFloat(raw);
    if (Number.isFinite(parsed)) {
      onValueChange(parsed);
    } else if (raw.endsWith(".")) {
      onValueChange(parseFloat(raw.slice(0, -1)) || 0);
    }
  }

  return (
    <TextInput
      id={id}
      {...props}
      inputMode="decimal"
      value={focused ? draft : String(value)}
      onFocus={() => {
        setFocused(true);
        setDraft(String(value));
      }}
      onChange={(e) => {
        const raw = e.target.value;
        if (!pattern.test(raw)) return;
        setDraft(raw);
        commit(raw);
      }}
      onBlur={() => {
        setFocused(false);
        commit(draft);
      }}
    />
  );
}

/** Renders domain Maybe results with reasons instead of NaN. */
export function MaybeText({
  maybe,
  render,
}: {
  maybe: { ok: true; value: unknown } | { ok: false; reason: string };
  render: (value: never) => React.ReactNode;
}) {
  if (maybe.ok) {
    return <>{render(maybe.value as never)}</>;
  }
  return <span title={maybe.reason}>-</span>;
}

export function StatValue({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "positive" | "negative" | "warning";
}) {
  const toneClass = {
    default: "",
    positive: "text-success",
    negative: "text-danger",
    warning: "text-warning",
  }[tone];
  return (
    <span
      className={`font-semibold tabular-nums tracking-tight ${toneClass}`}
    >
      {children}
    </span>
  );
}
