/**
 * Pure math for savings goals and personal runway. Everything here is plain
 * numbers rounded to two decimals so the same functions power the widgets,
 * the Goal Studio and the unit tests.
 */

import type { SavingsGoal } from "./types";

export const MONTHS_PER_YEAR = 12;
export const MONTHS_PER_WEEK = 4.33;

export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** What a person can actually set aside every month. */
export function monthlySavingsFrom(income: number, expenses: number): number {
  return round2(income - expenses);
}

/** The gap still to close, never negative. */
export function amountToGoal(target: number, current: number): number {
  return Math.max(0, round2(target - current));
}

/**
 * Whole months until the goal is reached. Returns 0 when already reached and
 * null when the goal is unreachable with the current monthly amount.
 */
export function monthsToGoal(
  target: number,
  current: number,
  monthly: number
): number | null {
  const amount = amountToGoal(target, current);
  if (amount <= 0) return 0;
  if (monthly <= 0) return null;
  return Math.ceil(amount / monthly);
}

/** The monthly amount needed to close the gap within a given number of months. */
export function requiredMonthlyForDeadline(
  target: number,
  current: number,
  months: number
): number | null {
  const amount = amountToGoal(target, current);
  if (amount <= 0) return 0;
  if (months <= 0 || !Number.isFinite(months)) return null;
  return round2(amount / months);
}

/** Progress from 0 to 1 for a savings goal. */
export function goalProgress(target: number, current: number): number {
  if (target <= 0) return 1;
  return Math.min(1, Math.max(0, current / target));
}

/** Balance expected after a set number of months of steady saving. */
export function projectBalance(
  current: number,
  monthly: number,
  months: number
): number {
  return round2(current + monthly * months);
}

export interface TimelinePoint {
  month: number;
  at: Date;
  balance: number;
}

/**
 * Builds a monthly projection starting this month. The final point is the
 * month the goal is reached (clamped to `limit` months to keep charts sane).
 */
export function buildTimeline(
  current: number,
  monthly: number,
  goalYears = 3,
  from = new Date()
): TimelinePoint[] {
  const limit = goalYears * MONTHS_PER_YEAR;
  const points: TimelinePoint[] = [];
  const cursor = new Date(from);
  for (let month = 0; month <= limit; month += 1) {
    points.push({
      month,
      at: new Date(cursor),
      balance: projectBalance(current, monthly, month),
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return points;
}

export interface SavingsScenario {
  monthly: number;
  months: number | null;
}

/**
 * "What would it take": the current rate plus stepped increases, so a user
 * sees how much faster a goal lands if they save more each month.
 */
export function savingsScenarios(
  target: number,
  current: number,
  monthly: number
): SavingsScenario[] {
  const base = Math.max(0, monthly);
  const steps = [1, 1.25, 1.5, 2];
  return steps.map((factor) => {
    const m = round2(base * factor);
    return {
      monthly: m,
      months: monthsToGoal(target, current, m),
    };
  });
}

export interface TradeoffLever {
  key: "spend-less" | "earn-more";
  label: string;
  delta: number;
  newIncome: number;
  newExpenses: number;
  months: number | null;
}

/**
 * The two real levers that close the same gap: spend less or earn more. Both
 * free up the same amount per month (a quarter of today's surplus) but change
 * a different number, so the choice stays personal.
 */
export function tradeoffLevers(
  target: number,
  current: number,
  income: number,
  expenses: number
): TradeoffLever[] {
  const surplus = monthlySavingsFrom(income, expenses);
  const delta = round2(Math.max(0, surplus) * 0.25);
  const newIncome = round2(income + delta);
  const newExpenses = round2(Math.max(0, expenses - delta));
  return [
    {
      key: "spend-less",
      label: "Spend less",
      delta,
      newIncome: income,
      newExpenses,
      months: monthsToGoal(target, current, monthlySavingsFrom(income, newExpenses)),
    },
    {
      key: "earn-more",
      label: "Earn more",
      delta,
      newIncome,
      newExpenses: expenses,
      months: monthsToGoal(target, current, monthlySavingsFrom(newIncome, expenses)),
    },
  ];
}

export interface SavingsGoalPlan {
  surplus: number;
  remaining: number;
  months: number | null;
  progress: number;
  target: Date | null;
  monthlyNeededToBeatDeadlineByHalf: number | null;
}

/** Everything a goal card needs in one call. */
export function planGoal(
  goal: Pick<
    SavingsGoal,
    "targetAmount" | "currentSavings" | "monthlyIncome" | "monthlyExpenses"
  >,
  from = new Date()
): SavingsGoalPlan {
  const surplus = monthlySavingsFrom(goal.monthlyIncome, goal.monthlyExpenses);
  const remaining = amountToGoal(goal.targetAmount, goal.currentSavings);
  const months = monthsToGoal(goal.targetAmount, goal.currentSavings, surplus);

  let target: Date | null = null;
  if (months !== null && Number.isFinite(months)) {
    target = new Date(from);
    target.setMonth(target.getMonth() + months);
  }

  // A nudge, not a command: what it would take to arrive in half the time.
  const monthlyNeededToBeatDeadlineByHalf =
    months !== null && months > 0
      ? requiredMonthlyForDeadline(goal.targetAmount, goal.currentSavings, Math.max(1, Math.ceil(months / 2)))
      : null;

  return {
    surplus,
    remaining,
    months,
    progress: goalProgress(goal.targetAmount, goal.currentSavings),
    target,
    monthlyNeededToBeatDeadlineByHalf,
  };
}

/** Months of personal runway before savings run out, null when nothing is spent. */
export function personalRunway(
  savings: number,
  monthlyExpenses: number
): number | null {
  if (monthlyExpenses <= 0) return null;
  if (savings < 0) return 0;
  return round2(savings / monthlyExpenses);
}