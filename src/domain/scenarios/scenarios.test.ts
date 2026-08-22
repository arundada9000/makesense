import { describe, it, expect } from "vitest";
import { applyScenario } from "./apply-scenario";
import { compareAnalyses, analyzeModel } from "./compare-scenarios";
import { buildSensitivityTable } from "../sensitivity/build-sensitivity";
import { saasExample } from "../model/templates";

describe("applyScenario", () => {
  it("never mutates the base model", () => {
    const model = saasExample();
    const before = model.revenueStreams[0].price;
    applyScenario(model, {
      id: "s",
      name: "Price up",
      overrides: [{ field: "price", op: "percent-change", value: 20 }],
    });
    expect(model.revenueStreams[0].price).toBe(before);
  });

  it("applies percent changes to prices", () => {
    const model = saasExample();
    const modified = applyScenario(model, {
      id: "s",
      name: "Price up",
      overrides: [{ field: "price", op: "percent-change", value: 20 }],
    });
    expect(modified.revenueStreams[0].price).toBeCloseTo(1200, 4);
  });

  it("sets absolute values", () => {
    const model = saasExample();
    const modified = applyScenario(model, {
      id: "s",
      name: "Churn reset",
      overrides: [{ field: "churnPercent", op: "set", value: 5 }],
    });
    expect(modified.customers.monthlyChurnRatePercent).toBe(5);
  });

  it("clamps churn between zero and one hundred", () => {
    const model = saasExample();
    const modified = applyScenario(model, {
      id: "s",
      name: "Churn spike",
      overrides: [{ field: "churnPercent", op: "percent-change", value: 10000 }],
    });
    expect(modified.customers.monthlyChurnRatePercent).toBeLessThanOrEqual(100);
  });

  it("returns the same model when no overrides exist", () => {
    const model = saasExample();
    expect(applyScenario(model, null)).toBe(model);
  });
});

describe("analyzeModel and comparison", () => {
  it("produces a full analysis from the canonical entry point", () => {
    const analysis = analyzeModel(saasExample());
    expect(analysis.profit.series.length).toBe(12);
    expect(analysis.cashFlow.series.length).toBe(12);
  });

  it("compares scenarios across shared metrics", () => {
    const base = analyzeModel(saasExample());
    const stressed = analyzeModel(
      applyScenario(saasExample(), {
        id: "s2",
        name: "Stress",
        overrides: [
          { field: "churnPercent", op: "set", value: 8 },
          { field: "price", op: "percent-change", value: -10 },
        ],
      })
    );

    const rows = compareAnalyses([
      { name: "Expected", analysis: base },
      { name: "Stressed", analysis: stressed },
    ]);

    const revenueRow = rows.find((r) => r.metric === "revenue");
    expect(revenueRow).toBeDefined();
    if (revenueRow) {
      // Stressed churn and lower price reduce total revenue.
      expect(revenueRow.values[1]!.lessThan(revenueRow.values[0]!)).toBe(true);
    }
  });
});

describe("buildSensitivityTable", () => {
  it("builds a price x customers grid with the baseline at center", () => {
    const table = buildSensitivityTable(
      saasExample(),
      "netProfit",
      "price",
      "startingCustomers",
      [-20, 0, 20],
      [0, -30]
    );
    expect(table.cells).toHaveLength(6);
    const center = table.cells.find((c) => c.xStep === 0 && c.yStep === 0);
    expect(center).toBeDefined();
    expect(table.baselineValue).not.toBeNull();

    const better = table.cells.find((c) => c.xStep === 20 && c.yStep === 0);
    expect(better!.value!.greaterThan(center!.value!)).toBe(true);
  }, 20000);
});
