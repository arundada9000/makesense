"use client";

import {
  buildTimeline,
  planGoal,
  savingsScenarios,
  tradeoffLevers,
  type TradeoffLever,
} from "@/domain/goals/engine";
import type { SavingsGoal } from "@/domain/goals/types";
import { formatMoney } from "@/lib/format";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GoalTimelineChart } from "./timeline-chart";

function monthsText(months: number | null): string {
  if (months === null) return "Out of reach";
  if (months === 1) return "1 month";
  return `${months} months`;
}

function targetMonth(goal: SavingsGoal, months: number | null): string {
  if (months === null || !Number.isFinite(months)) return "-";
  const at = new Date();
  at.setMonth(at.getMonth() + months);
  return at.toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

export function goalShareUrl(goal: SavingsGoal): string {
  const params = new URLSearchParams({
    goal: String(Math.round(goal.targetAmount)),
    saved: String(Math.round(goal.currentSavings)),
    monthly: String(Math.round(Math.max(0, goal.monthlyIncome - goal.monthlyExpenses))),
  });
  return `/personal-finance/savings-goal-calculator?${params.toString()}`;
}

export function GoalCard({
  goal,
  currency,
  onEdit,
  onApplyLever,
  onDelete,
  onShare,
}: {
  goal: SavingsGoal;
  currency: string;
  onEdit: (goal: SavingsGoal) => void;
  onApplyLever: (goal: SavingsGoal, lever: TradeoffLever) => void;
  onDelete: (goal: SavingsGoal) => void;
  onShare: (goal: SavingsGoal) => void;
}) {
  const plan = planGoal(goal);
  const scenarios = savingsScenarios(goal.targetAmount, goal.currentSavings, plan.surplus);
  const levers = tradeoffLevers(
    goal.targetAmount,
    goal.currentSavings,
    goal.monthlyIncome,
    goal.monthlyExpenses
  );

  return (
    <Card>
      <CardBody className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight">{goal.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatMoney(goal.currentSavings, currency)} of{" "}
              {formatMoney(goal.targetAmount, currency)}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums ${
              plan.progress >= 1
                ? "bg-success-subtle text-success"
                : "bg-accent-subtle text-accent"
            }`}
          >
            {Math.round(plan.progress * 100)}%
          </span>
        </div>

        <div
          className="h-2 overflow-hidden rounded-full bg-surface-secondary"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(plan.progress * 100)}
          aria-label={`${goal.name} progress`}
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-500"
            style={{ width: `${plan.progress * 100}%` }}
          />
        </div>

        <dl className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <dt className="text-muted">Left to save</dt>
            <dd className="mt-0.5 font-semibold tabular-nums">
              {formatMoney(plan.remaining, currency)}
            </dd>
          </div>
          <div>
            <dt className="text-muted">Time to goal</dt>
            <dd className="mt-0.5 font-semibold tabular-nums">
              {monthsText(plan.months)}
            </dd>
          </div>
          <div>
            <dt className="text-muted">Target month</dt>
            <dd className="mt-0.5 font-semibold tabular-nums">
              {targetMonth(goal, plan.months)}
            </dd>
          </div>
        </dl>

        <div>
          <p className="text-xs font-medium text-muted-foreground">What would it take?</p>
          <ul className="mt-1.5 space-y-1">
            {scenarios.map((s, index) => (
              <li
                key={s.monthly}
                className="flex items-center justify-between rounded-md bg-surface-secondary px-2.5 py-1.5 text-xs tabular-nums"
              >
                <span className="text-muted-foreground">
                  {index === 0 ? "Today" : "Faster"}
                </span>
                <span>
                  <span className="font-medium">{formatMoney(s.monthly, currency)}</span>
                  <span className="mx-1.5 text-muted">per month</span>
                  <span className="font-medium text-accent">{monthsText(s.months)}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground">Your two levers</p>
          <div className="mt-1.5 grid grid-cols-2 gap-2">
            {levers.map((lever) => (
              <button
                key={lever.key}
                type="button"
                onClick={() => onApplyLever(goal, lever)}
                className="rounded-md border border-border px-2.5 py-1.5 text-left text-xs transition-colors hover:border-accent hover:bg-surface-secondary"
              >
                <span className="block font-medium">
                  {lever.label} {formatMoney(lever.delta, currency)}
                </span>
                <span className="mt-0.5 block text-muted tabular-nums">
                  {monthsText(lever.months)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <GoalTimelineChart points={planTimelinePoints(goal, plan.surplus)} currency={currency} />

        <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
          <Button variant="ghost" onClick={() => onShare(goal)}>
            Share
          </Button>
          <Button variant="ghost" onClick={() => onEdit(goal)}>
            Edit
          </Button>
          <Button variant="danger" onClick={() => onDelete(goal)}>
            Delete
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

function planTimelinePoints(goal: SavingsGoal, surplus: number) {
  return buildTimeline(goal.currentSavings, Math.max(0, surplus), 3);
}