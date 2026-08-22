import { describe, it, expect } from "vitest";
import { calculateCosts, monthlyEquivalent } from "./calculate-costs";
import { saasExample } from "../model/templates";
import { emptyCostItem, createEmptyModel } from "../model/defaults";

describe("monthlyEquivalent", () => {
  it("normalizes frequencies to months", () => {
    expect(
      monthlyEquivalent(
        emptyCostItem("fixed-recurring", { amount: 300, frequency: "quarterly" })
      ).toNumber()
    ).toBe(100);
    expect(
      monthlyEquivalent(
        emptyCostItem("fixed-recurring", { amount: 1200, frequency: "yearly" })
      ).toNumber()
    ).toBe(100);
    expect(
      monthlyEquivalent(
        emptyCostItem("fixed-recurring", { amount: 500, frequency: "monthly" })
      ).toNumber()
    ).toBe(500);
    expect(
      monthlyEquivalent(
        emptyCostItem("fixed-recurring", { amount: 999, frequency: "one-time" })
      ).toNumber()
    ).toBe(0);
  });
});

describe("calculateCosts", () => {
  it("sums the SaaS example fixed costs and variable per customer", () => {
    const model = saasExample();
    const costs = calculateCosts(model);
    expect(costs.fixedMonthlyTotal.toNumber()).toBe(100000);
    expect(costs.variablePerCustomerMonthly.toNumber()).toBe(120);
    expect(costs.initialInvestmentTotal.toNumber()).toBe(1000000);
  });

  it("keeps investment out of operating totals", () => {
    const costs = calculateCosts(saasExample());
    const operating =
      costs.fixedMonthlyTotal.plus(costs.variablePerCustomerMonthly);
    expect(costs.initialInvestmentTotal.greaterThan(operating)).toBe(true);
    expect(costs.fixedLines).toHaveLength(2);
  });

  it("converts per-order costs using order frequency", () => {
    const model = createEmptyModel({ name: "o", businessType: "ecommerce" });
    model.variableCosts = [
      emptyCostItem("variable-per-order", {
        name: "Delivery",
        category: "delivery",
        amount: 80,
        frequency: "monthly",
        ordersPerCustomerPerMonth: 2,
      }),
    ];
    const costs = calculateCosts(model);
    expect(costs.variablePerCustomerMonthly.toNumber()).toBe(160);
  });

  it("returns zeros for an empty model", () => {
    const model = createEmptyModel({ name: "z", businessType: "custom" });
    const costs = calculateCosts(model);
    expect(costs.fixedMonthlyTotal.toNumber()).toBe(0);
    expect(costs.initialInvestmentTotal.toNumber()).toBe(0);
  });
});
