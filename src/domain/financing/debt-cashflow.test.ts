import { describe, it, expect } from "vitest";
import { amortizeLoan } from "./debt";
import { calculateCashFlow } from "../cashflow/calculate-cashflow";
import { calculateProfit } from "../profit/calculate-profit";
import { saasExample } from "../model/templates";

describe("amortizeLoan", () => {
  it("produces a level payment schedule that retires the balance", () => {
    const loan = {
      id: "loan1",
      name: "Bank loan",
      principal: 1000000,
      annualInterestRatePercent: 12,
      termMonths: 12,
      startMonth: 0,
    };
    const schedule = amortizeLoan(loan);

    expect(schedule.payments).toHaveLength(12);
    const finalPayment =
      schedule.payments[schedule.payments.length - 1];
    expect(finalPayment.remainingBalance.toNumber()).toBeCloseTo(0, 4);

    // All payments equal within rounding.
    for (const p of schedule.payments) {
      expect(p.payment.toDecimalPlaces(2).eq(
        schedule.monthlyPayment.toDecimalPlaces(2)
      )).toBe(true);
    }
    expect(schedule.totalInterest.greaterThan(0)).toBe(true);
  });

  it("splits zero interest evenly", () => {
    const schedule = amortizeLoan({
      id: "l",
      name: "Family loan",
      principal: 120000,
      annualInterestRatePercent: 0,
      termMonths: 12,
      startMonth: 0,
    });
    expect(schedule.monthlyPayment.toNumber()).toBe(10000);
    expect(schedule.totalInterest.isZero()).toBe(true);
  });
});

describe("calculateCashFlow", () => {
  it("starts from cash plus founder capital", () => {
    const model = saasExample();
    model.financing.founderCapital = 200000;
    const profit = calculateProfit(model);
    const cf = calculateCashFlow(model, profit);
    // startingCash 1200000 + founder 200000
    expect(cf.openingBalance.toNumber()).toBe(1400000);
  });

  it("tracks a declining then recovering balance", () => {
    const model = saasExample();
    const profit = calculateProfit(model);
    const cf = calculateCashFlow(model, profit);
    expect(cf.series).toHaveLength(model.projectionSettings.horizonMonths);
    expect(cf.lowestBalance).not.toBeNull();
    expect(cf.endingBalance.toNumber()).toBe(
      cf.series[cf.series.length - 1].closingCash.toNumber()
    );
  });

  it("subtracts debt service and reports schedules", () => {
    const model = saasExample();
    model.financing.debtLoans = [
      {
        id: "d1",
        name: "Startup loan",
        principal: 600000,
        annualInterestRatePercent: 10,
        termMonths: 24,
        startMonth: 0,
      },
    ];
    const profit = calculateProfit(model);
    const cf = calculateCashFlow(model, profit);

    // Principal arrives as a financing inflow in month 1.
    expect(cf.openingBalance.toNumber()).toBe(1200000);
    const m1 = cf.series[0];
    expect(m1.financingInflow.toNumber()).toBe(600000);
    expect(m1.debtPayments.greaterThan(0)).toBe(true);
    expect(cf.loanSchedules.get("d1")).toBeDefined();
  });

  it("states when runway is not meaningful under positive flow", () => {
    const model = saasExample();
    model.revenueStreams[0].price = 50000;
    const profit = calculateProfit(model);
    const cf = calculateCashFlow(model, profit);
    expect(!cf.runwayMonths.ok || cf.runwayMonths.value.greaterThan(120)).toBe(true);
  });
});
