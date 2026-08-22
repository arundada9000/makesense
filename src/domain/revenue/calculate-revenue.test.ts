import { describe, it, expect } from "vitest";
import { calculateRevenue } from "./calculate-revenue";
import { projectCustomers } from "../customers/project-customers";
import { saasExample } from "../model/templates";
import { createEmptyModel, emptyRevenueStream } from "../model/defaults";
import { Decimal } from "../primitives/money";

describe("calculateRevenue", () => {
  it("computes SaaS MRR from starting customers", () => {
    const model = saasExample();
    const projection = projectCustomers(model.customers, model.projectionSettings.horizonMonths);
    const revenue = calculateRevenue(model, projection);
    expect(revenue.mrrNow.toNumber()).toBe(100000);
    expect(revenue.arrNow.toNumber()).toBe(1200000);
  });

  it("grows monthly revenue with the projected base", () => {
    const model = saasExample();
    const projection = projectCustomers(model.customers, 12);
    const revenue = calculateRevenue(model, projection);
    // Month 1: (100 - 3 + 50) = 147 customers x Rs. 1,000
    expect(revenue.series[0].recurringRevenue.toNumber()).toBeCloseTo(147000, 0);
    expect(revenue.series[11].recurringRevenue.toNumber()).toBeGreaterThan(
      revenue.series[0].recurringRevenue.toNumber()
    );
  });

  it("recognizes the initial cohort for one-time products in month 0", () => {
    const model = saasExample();
    model.revenueStreams = [
      emptyRevenueStream({
        name: "Sales",
        type: "one-time",
        price: 500,
        customerCount: 10000,
      }),
    ];
    model.customers = {
      ...model.customers,
      startingCustomers: 10000,
      fixedGrowthPerMonth: 0,
    };
    const projection = projectCustomers(model.customers, 12);
    const revenue = calculateRevenue(model, projection);
    expect(revenue.series[0].oneTimeRevenue.toNumber()).toBe(5_000_000);
    expect(revenue.series[5].totalRevenue.toNumber()).toBe(0);
  });

  it("applies discounts and refunds to net price", () => {
    const model = createEmptyModel({ name: "d", businessType: "custom" });
    model.revenueStreams = [
      emptyRevenueStream({
        name: "License",
        type: "monthly",
        price: 1000,
        discountPercent: 10,
        refundRate: 10,
        customerCount: 100,
      }),
    ];
    model.customers = { ...model.customers, growthMode: "none" };
    const projection = projectCustomers(model.customers, 3);
    const revenue = calculateRevenue(model, projection);
    // Net per customer = 1000 * 0.9 * 0.9 = 810
    expect(revenue.recurringPerCustomerMonthly.toNumber()).toBeCloseTo(810, 6);
  });

  it("normalizes yearly streams to a monthly equivalent", () => {
    const model = createEmptyModel({ name: "y", businessType: "subscription-saas" });
    model.revenueStreams = [
      emptyRevenueStream({
        name: "Annual plan",
        type: "yearly",
        price: 12000,
        customerCount: 10,
      }),
    ];
    model.customers = { ...model.customers, startingCustomers: 1, growthMode: "none" };
    const projection = projectCustomers(model.customers, 2);
    const revenue = calculateRevenue(model, projection);
    expect(revenue.mrrNow.toNumber()).toBe(1000);
    expect(revenue.arrNow.toNumber()).toBe(12000);
  });

  it("returns zero totals for a model without streams", () => {
    const model = createEmptyModel({ name: "e", businessType: "custom" });
    const projection = projectCustomers(model.customers, 12);
    const revenue = calculateRevenue(model, projection);
    expect(revenue.horizonTotals.totalRevenue.isZero()).toBe(true);
  });

  it("handles usage-based pricing through units", () => {
    const model = createEmptyModel({ name: "u", businessType: "custom" });
    model.revenueStreams = [
      emptyRevenueStream({
        name: "API calls",
        type: "usage-based",
        price: 2,
        usageUnitsPerMonth: 500,
        customerCount: 100,
      }),
    ];
    model.customers = { ...model.customers, growthMode: "none" };
    const projection = projectCustomers(model.customers, 1);
    const revenue = calculateRevenue(model, projection);
    expect(revenue.recurringPerCustomerMonthly.toNumber()).toBe(1000);
  });

  it("keeps large values exact with decimals", () => {
    const model = createEmptyModel({ name: "big", businessType: "one-time-product" });
    model.revenueStreams = [
      emptyRevenueStream({
        name: "Sales",
        type: "one-time",
        price: 499.99,
        customerCount: 1000000,
      }),
    ];
    model.customers = { ...model.customers, startingCustomers: 1000000 };
    const projection = projectCustomers(model.customers, 1);
    const revenue = calculateRevenue(model, projection);
    expect(revenue.series[0].oneTimeRevenue.eq(new Decimal("499990000"))).toBe(true);
  });
});
