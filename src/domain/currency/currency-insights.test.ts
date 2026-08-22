import { describe, it, expect } from "vitest";
import {
  convertToBase,
  defaultRateTable,
  fxScenarios,
  lookupRate,
} from "./convert";
import { generateInsights } from "../insights/generate-insights";
import { analyzeModel } from "../scenarios/compare-scenarios";
import { saasExample } from "../model/templates";

describe("currency conversion", () => {
  it("treats base currency rate as one", () => {
    const table = defaultRateTable("NPR");
    const rate = lookupRate(table, "NPR");
    expect(rate?.rate.toNumber()).toBe(1);
  });

  it("returns null when a manual rate is missing", () => {
    const table = defaultRateTable("NPR");
    expect(lookupRate(table, "USD")).toBeNull();
    const converted = convertToBase(100, "USD", table);
    expect(converted).toBeNull();
  });

  it("preserves the original amount on conversion", () => {
    const table = defaultRateTable("NPR");
    table.rates["USD"] = 132.5;
    const converted = convertToBase(500, "USD", table);
    expect(converted).not.toBeNull();
    if (converted) {
      expect(converted.originalAmount.toNumber()).toBe(500);
      expect(converted.originalCurrency).toBe("USD");
      expect(converted.convertedAmount.toNumber()).toBe(66250);
      expect(converted.rateSource).toBe("manual entry");
    }
  });
});

describe("fxScenarios", () => {
  it("applies shifts symmetrically and reports profit impact", () => {
    const points = fxScenarios(10000, 2000, 1.3, [-10, -5, 5, 10]);
    expect(points).toHaveLength(4);
    const up = points.find((p) => p.shiftPercent === 10)!;
    expect(up.convertedRevenue.toNumber()).toBeCloseTo(14300, 6);
    const down = points.find((p) => p.shiftPercent === -10)!;
    expect(down.profitImpact.lessThan(up.profitImpact)).toBe(true);
  });
});

describe("generateInsights", () => {
  it("emits deterministic observations for the SaaS example", () => {
    const model = saasExample();
    const insights = generateInsights(model, analyzeModel(model));
    expect(insights.length).toBeGreaterThan(0);
    const recurring = insights.find((i) => i.id === "recurring-share");
    expect(recurring).toBeDefined();
  });

  it("warns when variable costs exceed revenue per customer", () => {
    const model = saasExample();
    model.revenueStreams[0].price = 100;
    model.variableCosts[0].amount = 150;
    const insights = generateInsights(model, analyzeModel(model));
    expect(insights.some((i) => i.id === "vc-exceeds-revenue")).toBe(true);
  });
});
