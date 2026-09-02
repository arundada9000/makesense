"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TimelinePoint } from "@/domain/goals/engine";
import { formatMoney } from "@/lib/format";

function monthLabel(at: Date): string {
  return at.toLocaleDateString(undefined, {
    month: "short",
    year: "2-digit",
  });
}

function GoalTooltip({
  active,
  payload,
  label,
  currency,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  currency: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-md border border-border bg-surface-raised px-3 py-2 text-xs shadow-pop">
      <p className="font-medium">{label}</p>
      <p className="mt-0.5 flex justify-between gap-4 tabular-nums">
        <span className="text-muted-foreground">Saved</span>
        <span>{formatMoney(payload[0].value, currency)}</span>
      </p>
    </div>
  );
}

export function GoalTimelineChart({
  points,
  currency,
}: {
  points: TimelinePoint[];
  currency: string;
}) {
  const data = points.map((p) => ({ label: monthLabel(p.at), balance: p.balance }));
  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="goalFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10 }}
            stroke="var(--muted-foreground)"
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10 }}
            stroke="var(--muted-foreground)"
            tickLine={false}
            axisLine={false}
            width={54}
            tickFormatter={(v: number) =>
              formatMoney(v, currency, { style: "compact" }).replace(/\s/g, "")
            }
          />
          <Tooltip content={<GoalTooltip currency={currency} />} />
          <Area
            type="monotone"
            dataKey="balance"
            name="Saved"
            stroke="var(--accent)"
            strokeWidth={2}
            fill="url(#goalFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}