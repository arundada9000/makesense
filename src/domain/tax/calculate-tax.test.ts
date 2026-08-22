import { describe, it, expect } from "vitest";
import {
  calculateVat,
  calculateVatPosition,
  estimateCorporateTax,
} from "./calculate-tax";
import { Decimal } from "../primitives/money";

describe("calculateVat", () => {
  it("adds tax to an exclusive price", () => {
    const r = calculateVat(1000, 13, false);
    expect(r.basePriceNetOfTax.toNumber()).toBe(1000);
    expect(r.taxAmount.toNumber()).toBeCloseTo(130, 6);
    expect(r.grossPriceWithTax.toNumber()).toBeCloseTo(1130, 6);
  });

  it("extracts tax from an inclusive price", () => {
    const r = calculateVat(1130, 13, true);
    expect(r.basePriceNetOfTax.toNumber()).toBeCloseTo(1000, 6);
    expect(r.taxAmount.toNumber()).toBeCloseTo(130, 6);
    expect(r.grossPriceWithTax.toNumber()).toBe(1130);
  });

  it("handles zero rate", () => {
    const r = calculateVat(500, 0, false);
    expect(r.taxAmount.isZero()).toBe(true);
  });
});

describe("calculateVatPosition", () => {
  it("nets output tax against input credit", () => {
    const r = calculateVatPosition({
      taxableSalesNet: 100000,
      vatRatePercent: 13,
      inputTaxPaid: 4000,
    });
    expect(r.outputTax.toNumber()).toBe(13000);
    expect(r.netPayable.toNumber()).toBe(9000);
  });

  it("never returns negative payable", () => {
    const r = calculateVatPosition({
      taxableSalesNet: 10000,
      vatRatePercent: 13,
      inputTaxPaid: 90000,
    });
    expect(r.netPayable.isZero()).toBe(true);
  });
});

describe("estimateCorporateTax", () => {
  it("charges the flat rate on profit", () => {
    const r = estimateCorporateTax(
      new Decimal(100000),
      { corporateTaxRatePercent: 25, lossCarryforward: false }
    );
    expect(r.tax.toNumber()).toBe(25000);
    expect(r.effectiveRatePercent.toNumber()).toBe(25);
  });

  it("consumes carried losses before charging", () => {
    const r = estimateCorporateTax(
      new Decimal(60000),
      { corporateTaxRatePercent: 25, lossCarryforward: true },
      50000
    );
    expect(r.taxableBase.toNumber()).toBe(10000);
    expect(r.tax.toNumber()).toBe(2500);
    expect(r.lossCarriedForward.isZero()).toBe(true);
  });

  it("accumulates losses when operating at a loss", () => {
    const r = estimateCorporateTax(
      new Decimal(-30000),
      { corporateTaxRatePercent: 25, lossCarryforward: true },
      10000
    );
    expect(r.tax.isZero()).toBe(true);
    expect(r.lossCarriedForward.toNumber()).toBe(40000);
  });
});
