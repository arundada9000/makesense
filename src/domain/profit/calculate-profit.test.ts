import { describe, it, expect } from "vitest";
import { calculateProfit } from "./calculate-profit";
import { saasExample } from "../model/templates";
import { createEmptyModel, emptyRevenueStream } from "../model/defaults";

describe("calculateProfit", () => {
  it("walks the SaaS waterfall in month one", () => {
    const model = saasExample();
    const profit = calculateProfit(model);
    const m1 = profit.series[0];

    expect(m1.revenue.toNumber()).toBeCloseTo(147000, 0);
    expect(m1.variableCosts.toNumber()).toBeCloseTo(147 * 120, 0);
    expect(m1.grossProfit.toNumber()).toBeCloseTo(147000 - 17640, 0);
    expect(m1.fixedCosts.toNumber()).toBe(100000);
    expect(m1.operatingProfit.toNumber()).toBeCloseTo(
      147000 - 17640 - 100000,
      0
    );
    // Tax disabled by default.
    expect(m1.tax.isZero()).toBe(true);
    expect(m1.netProfit.eq(m1.operatingProfit)).toBe(true);
  });

  it("applies tax only on positive operating profit when enabled", () => {
    const model = saasExample();
    model.taxProfile.enabled = true;
    model.taxProfile.corporateTaxRatePercent = 25;
    const profit = calculateProfit(model);
    const m1 = profit.series[0];
    const expectedTax = m1.operatingProfit.times(0.25);
    expect(m1.tax.toDecimalPlaces(2).eq(expectedTax.toDecimalPlaces(2))).toBe(true);
    expect(m1.netProfit.eq(m1.operatingProfit.minus(m1.tax))).toBe(true);
  });

  it("carries losses forward before charging tax", () => {
    const model = createEmptyModel({ name: "loss", businessType: "custom" });
    model.revenueStreams = [
      emptyRevenueStream({ name: "Subs", type: "monthly", price: 1000, customerCount: 10 }),
    ];
    model.customers = {
      ...model.customers,
      startingCustomers: 0,
      growthMode: "fixed",
      fixedGrowthPerMonth: 10,
      monthlyChurnRatePercent: 0,
    };
    model.fixedCosts = [
      emptyFixed(50000),
    ];
    model.taxProfile.enabled = true;
    model.taxProfile.corporateTaxRatePercent = 20;
    model.taxProfile.lossCarryforward = true;

    const profit = calculateProfit(model);

    // Customers grow 10/month: revenue 10000..40000 in months 1-4 while the
    // fixed cost is 50000, accumulating a 100000 loss carryforward.
    expect(profit.series[3].operatingProfit.toNumber()).toBe(-10000);
    // Month 9 operating profit 40000 is fully absorbed by remaining carry.
    expect(profit.series[8].tax.isZero()).toBe(true);
    // Month 10 operating profit 50000 finally charges 20% on it.
    expect(profit.series[9].tax.toNumber()).toBe(10000);
    expect(profit.lossCarriedForwardEnd.isZero()).toBe(true);
  });

  it("computes margins as null when revenue is zero", () => {
    const model = createEmptyModel({ name: "empty", businessType: "custom" });
    const profit = calculateProfit(model);
    expect(profit.margins.gross).toBeNull();
    expect(profit.margins.net).toBeNull();
  });
});

function emptyFixed(amount: number) {
  return {
    id: `fx_${amount}`,
    name: "Fixed",
    category: "other" as const,
    kind: "fixed-recurring" as const,
    amount,
    frequency: "monthly" as const,
  };
}
