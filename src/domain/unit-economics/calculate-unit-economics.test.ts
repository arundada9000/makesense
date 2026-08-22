import { describe, it, expect } from "vitest";
import { calculateUnitEconomics } from "./calculate-unit-economics";
import { calculateProfit } from "../profit/calculate-profit";
import { saasExample } from "../model/templates";

describe("calculateUnitEconomics", () => {
  const model = saasExample();
  const profit = calculateProfit(model);
  const unit = calculateUnitEconomics(model, profit);

  it("derives ARPU from recurring streams", () => {
    expect(unit.arpuMonthly.ok).toBe(true);
    if (unit.arpuMonthly.ok) {
      expect(unit.arpuMonthly.value.toNumber()).toBe(1000);
    }
  });

  it("computes contribution per customer", () => {
    expect(unit.contributionPerCustomerMonthly.ok).toBe(true);
    if (unit.contributionPerCustomerMonthly.ok) {
      // ARPU 1000 - variable 120 = 880
      expect(unit.contributionPerCustomerMonthly.value.toNumber()).toBe(880);
    }
  });

  it("computes CAC from marketing over new customers", () => {
    expect(unit.cac.ok).toBe(true);
    if (unit.cac.ok) {
      // 100000 x 12 months / total new customers in the horizon.
      const expected =
        (100000 * 12) / profit.projection.totalNew;
      expect(unit.cac.value.toNumber()).toBeCloseTo(expected, 4);
    }
  });

  it("computes LTV via churn formula", () => {
    expect(unit.ltv.ok).toBe(true);
    if (unit.ltv.ok) {
      // LTV = ARPU x gross margin / churn. Gross margin month-based; verify
      // against the first-month margin share.
      const marginShare = profit.margins.gross
        ? profit.margins.gross.dividedBy(100)
        : null;
      expect(marginShare).not.toBeNull();
      const expected = 1000 * Number(marginShare) / 0.03;
      expect(unit.ltv.value.value.toNumber()).toBeCloseTo(expected, 2);
      expect(unit.ltv.value.source).toBe("formula");
    }
  });

  it("prefers a manual LTV override", () => {
    const withOverride = calculateUnitEconomics(model, profit, 50000);
    expect(withOverride.ltv.ok).toBe(true);
    if (withOverride.ltv.ok) {
      expect(withOverride.ltv.value.source).toBe("manual");
      expect(withOverride.ltv.value.value.toNumber()).toBe(50000);
    }
  });

  it("explains why LTV is impossible at zero churn", () => {
    const noChurn = { ...saasExample() };
    noChurn.customers = {
      ...noChurn.customers,
      monthlyChurnRatePercent: 0,
    };
    const p = calculateProfit(noChurn);
    const u = calculateUnitEconomics(noChurn, p);
    expect(u.ltv.ok).toBe(false);
    if (!u.ltv.ok) {
      expect(u.ltv.reason).toMatch(/Churn is zero/);
    }
  });

  it("flags negative contribution instead of returning nonsense", () => {
    const badModel = saasExample();
    badModel.revenueStreams[0].price = 50;
    const p = calculateProfit(badModel);
    const u = calculateUnitEconomics(badModel, p);
    expect(u.contributionPerCustomerMonthly.ok).toBe(true);
    if (u.contributionPerCustomerMonthly.ok) {
      expect(u.contributionPerCustomerMonthly.value.isNegative()).toBe(true);
    }
    expect(u.cacPaybackMonths.ok).toBe(false);
  });

  it("handles zero customers gracefully", () => {
    const zero = saasExample();
    zero.customers.startingCustomers = 0;
    zero.customers.growthMode = "none";
    zero.marketing.monthlyBudget = 0;
    const p = calculateProfit(zero);
    const u = calculateUnitEconomics(zero, p);
    expect(u.arpuMonthly.ok).toBe(false);
    expect(u.cac.ok).toBe(false);
  });
});
