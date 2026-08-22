import { describe, it, expect } from "vitest";
import { projectCustomers } from "./project-customers";
import { CustomerAssumptions } from "../model/types";

function base(overrides?: Partial<CustomerAssumptions>): CustomerAssumptions {
  return {
    startingCustomers: 100,
    growthMode: "fixed",
    fixedGrowthPerMonth: 50,
    percentageGrowthPerMonth: 0,
    customMonthlyGrowth: [],
    monthlyChurnRatePercent: 3,
    ...overrides,
  };
}

describe("projectCustomers", () => {
  it("applies churn before growth", () => {
    // 100 - 3% churn = 97, then +50 = 147.
    const result = projectCustomers(base(), 1);
    expect(result.points[0].endingCustomers).toBeCloseTo(147, 0);
    expect(result.points[0].churnedCustomers).toBeCloseTo(3, 0);
    expect(result.points[0].newCustomers).toBeCloseTo(50, 0);
  });

  it("compounds percentage growth", () => {
    const result = projectCustomers(
      base({ growthMode: "percentage", percentageGrowthPerMonth: 10 }),
      2
    );
    // m1: 97 * 1.10 = 106.7 ; m2: (106.7 - 3.201 churn) * 1.10
    const m2 = result.points[1].endingCustomers;
    expect(m2).toBeGreaterThan(result.points[0].endingCustomers);
  });

  it("respects the market size cap", () => {
    const result = projectCustomers(base({ maxMarketSize: 120 }), 6);
    for (const p of result.points) {
      expect(p.endingCustomers).toBeLessThanOrEqual(120);
    }
    expect(result.points[5].endingCustomers).toBeCloseTo(120, 0);
  });

  it("never drops below zero with negative fixed growth", () => {
    const result = projectCustomers(
      base({ fixedGrowthPerMonth: -200 }),
      3
    );
    for (const p of result.points) {
      expect(p.endingCustomers).toBeGreaterThanOrEqual(0);
    }
  });

  it("uses custom monthly growth schedule", () => {
    const result = projectCustomers(
      base({
        growthMode: "custom-monthly",
        customMonthlyGrowth: [10, 20, 30],
      }),
      4
    );
    expect(result.points[0].newCustomers).toBeCloseTo(10, 0);
    expect(result.points[1].newCustomers).toBeCloseTo(20, 0);
    expect(result.points[2].newCustomers).toBeCloseTo(30, 0);
    expect(result.points[3].newCustomers).toBeCloseTo(0, 0);
  });

  it("handles zero churn", () => {
    const result = projectCustomers(base({ monthlyChurnRatePercent: 0 }), 2);
    expect(result.totalChurned).toBe(0);
    expect(result.points[1].endingCustomers).toBe(200);
  });
});
