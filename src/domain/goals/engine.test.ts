import { describe, it, expect } from "vitest";

const MONTHS = 12;
import {
  buildTimeline,
  goalProgress,
  monthsToGoal,
  monthlySavingsFrom,
  personalRunway,
  planGoal,
  projectBalance,
  requiredMonthlyForDeadline,
  savingsScenarios,
  tradeoffLevers,
} from "./engine";

describe("monthsToGoal", () => {
  it("closes the gap in whole months", () => {
    expect(monthsToGoal(100000, 40000, 10000)).toBe(6);
  });

  it("rounds partial months up", () => {
    expect(monthsToGoal(100000, 40000, 8000)).toBe(8);
  });

  it("returns 0 when already reached", () => {
    expect(monthsToGoal(1000, 1200, 100)).toBe(0);
  });

  it("returns null when nothing is saved each month", () => {
    expect(monthsToGoal(5000, 0, 0)).toBeNull();
    expect(monthsToGoal(5000, 0, -300)).toBeNull();
  });
});

describe("requiredMonthlyForDeadline", () => {
  it("computes the monthly amount for a fixed deadline", () => {
    expect(requiredMonthlyForDeadline(100000, 40000, 12)).toBe(5000);
  });

  it("returns null for a past or zero deadline", () => {
    expect(requiredMonthlyForDeadline(100000, 40000, 0)).toBeNull();
  });

  it("returns 0 when the goal is already reached", () => {
    expect(requiredMonthlyForDeadline(1000, 1200, 3)).toBe(0);
  });
});

describe("goalProgress", () => {
  it("caps at 1", () => {
    expect(goalProgress(1000, 1400)).toBe(1);
  });
  it("floors at 0", () => {
    expect(goalProgress(1000, -50)).toBe(0);
  });
  it("reflects partial progress", () => {
    expect(goalProgress(2000, 500)).toBeCloseTo(0.25, 2);
  });
});

describe("projectBalance and buildTimeline", () => {
  it("projects a straight line of savings", () => {
    expect(projectBalance(1000, 500, 12)).toBe(7000);
  });

  it("builds a point for every month including the start", () => {
    const points = buildTimeline(1000, 500, 1);
    expect(points).toHaveLength(MONTHS + 1);
    expect(points[0].balance).toBe(1000);
    expect(points[12].balance).toBe(7000);
  });
});

describe("savingsScenarios", () => {
  it("stepped rates all reach the same goal", () => {
    const scenarios = savingsScenarios(100000, 40000, 10000);
    expect(scenarios.map((s) => s.monthly)).toEqual([10000, 12500, 15000, 20000]);
    expect(scenarios[0].months).toBe(6);
    expect(scenarios[1].months).toBe(5);
  });
});

describe("tradeoffLevers", () => {
  it("frees up a quarter of surplus via spending or income", () => {
    const levers = tradeoffLevers(100000, 40000, 30000, 20000);
    // surplus 10000, delta 2500. spend-less: expenses 17500, save 12500.
    // earn-more: income 32500, save 12500. Both reach the 60000 gap in 5 months.
    expect(levers).toHaveLength(2);
    for (const lever of levers) {
      expect(lever.delta).toBe(2500);
      expect(lever.months).toBe(5);
    }
    expect(levers.map((l) => l.key)).toEqual(["spend-less", "earn-more"]);
    expect(levers[0].newExpenses).toBe(17500);
    expect(levers[1].newIncome).toBe(32500);
  });
});

describe("planGoal", () => {
  it("derives surplus, gap, progress and target month", () => {
    const from = new Date(2026, 8, 1); // September 2026
    const plan = planGoal(
      {
        targetAmount: 100000,
        currentSavings: 40000,
        monthlyIncome: 30000,
        monthlyExpenses: 20000,
      },
      from
    );
    expect(plan.surplus).toBe(10000);
    expect(plan.remaining).toBe(60000);
    expect(plan.months).toBe(6);
    expect(plan.progress).toBeCloseTo(0.4, 2);
    expect(plan.target?.getFullYear()).toBe(2027);
    expect(plan.target?.getMonth()).toBe(2); // March 2027
  });

  it("returns null months for a goal with no surplus", () => {
    const plan = planGoal({
      targetAmount: 100000,
      currentSavings: 40000,
      monthlyIncome: 20000,
      monthlyExpenses: 20000,
    });
    expect(plan.months).toBeNull();
  });
});

describe("personalRunway", () => {
  it("divides savings by monthly expenses", () => {
    expect(personalRunway(30000, 3000)).toBe(10);
  });

  it("returns null when nothing is spent", () => {
    expect(personalRunway(5000, 0)).toBeNull();
  });

  it("returns 0 for negative savings", () => {
    expect(personalRunway(-100, 1000)).toBe(0);
  });
});

describe("monthlySavingsFrom", () => {
  it("rounds to two decimals", () => {
    expect(monthlySavingsFrom(3010.1, 2000)).toBe(1010.1);
  });
});