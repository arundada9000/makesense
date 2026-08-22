import { describe, it, expect } from "vitest";
import { calculateBreakEven } from "./calculate-breakeven";
import { calculateRoi } from "../roi/calculate-roi";
import { calculateProfit } from "../profit/calculate-profit";
import { saasExample, enterpriseExample } from "../model/templates";

describe("calculateBreakEven", () => {
  it("computes customer and revenue break-even for the SaaS example", () => {
    const model = saasExample();
    const profit = calculateProfit(model);
    const be = calculateBreakEven(model, profit);

    expect(be.breakEvenCustomers.ok).toBe(true);
    if (be.breakEvenCustomers.ok) {
      // Fixed 100000 / contribution 880
      expect(be.breakEvenCustomers.value.toNumber()).toBeCloseTo(
        100000 / 880,
        2
      );
    }
    expect(be.breakEvenRevenueMonthly.ok).toBe(true);
    expect(be.progressPercent).not.toBeNull();
  });

  it("reports unreachable break-even when contribution is negative", () => {
    const model = saasExample();
    model.revenueStreams[0].price = 50;
    const profit = calculateProfit(model);
    const be = calculateBreakEven(model, profit);
    expect(be.breakEvenCustomers.ok).toBe(false);
    if (!be.breakEvenCustomers.ok) {
      expect(be.breakEvenCustomers.reason).toMatch(
        /Contribution per customer is zero or negative/
      );
    }
  });

  it("includes investment recovery in the with-investment figure", () => {
    const model = saasExample();
    const profit = calculateProfit(model);
    const be = calculateBreakEven(model, profit);

    expect(be.breakEvenCustomersWithInvestment.ok).toBe(true);
    expect(be.investmentRecoveryCustomers.ok).toBe(true);
    if (
      be.breakEvenCustomersWithInvestment.ok &&
      be.breakEvenCustomers.ok
    ) {
      expect(
        be.breakEvenCustomersWithInvestment.value.greaterThan(
          be.breakEvenCustomers.value
        )
      ).toBe(true);
    }
  });

  it("returns zero customer break-even when only investment remains", () => {
    const model = enterpriseExample();
    model.fixedCosts = [];
    model.variableCosts = [];
    const profit = calculateProfit(model);
    const be = calculateBreakEven(model, profit);
    expect(be.breakEvenCustomers.ok).toBe(true);
    if (be.breakEvenCustomers.ok) {
      expect(be.breakEvenCustomers.value.isZero()).toBe(true);
    }
    if (be.breakEvenCustomersWithInvestment.ok) {
      // Investment still spreads over the horizon and needs customers.
      expect(
        be.breakEvenCustomersWithInvestment.value.toNumber()
      ).toBeGreaterThan(0);
    }
  });
});

describe("calculateRoi", () => {
  it("explains missing ROI when there is no investment", () => {
    const model = saasExample();
    model.investments = [];
    model.financing.founderCapital = 0;
    const profit = calculateProfit(model);
    const roi = calculateRoi(model, profit);
    expect(roi.roiPercent.ok).toBe(false);
    if (!roi.roiPercent.ok) {
      expect(roi.roiPercent.reason).toMatch(/No initial investment/);
    }
  });

  it("computes ROI and multiple against the investment", () => {
    const model = saasExample();
    const profit = calculateProfit(model);
    const roi = calculateRoi(model, profit);

    expect(roi.roiPercent.ok).toBe(true);
    if (roi.roiPercent.ok) {
      const expected = profit.totals.netProfit
        .minus(1000000)
        .times(100)
        .dividedBy(1000000);
      expect(roi.roiPercent.value.toDecimalPlaces(4).eq(
        expected.toDecimalPlaces(4)
      )).toBe(true);
    }
    if (roi.returnMultiple.ok) {
      expect(
        roi.returnMultiple.value.toNumber()
      ).toBeCloseTo(profit.totals.netProfit.dividedBy(1000000).toNumber(), 6);
    }
  });

  it("tracks cumulative net profit series length", () => {
    const model = saasExample();
    const profit = calculateProfit(model);
    const roi = calculateRoi(model, profit);
    expect(roi.cumulativeNetProfit).toHaveLength(
      model.projectionSettings.horizonMonths
    );
  });
});
