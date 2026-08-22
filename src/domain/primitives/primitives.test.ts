import { describe, it, expect } from "vitest";
import {
  money,
  add,
  subtract,
  multiply,
  allocate,
  Decimal,
} from "./money";
import { percent, fraction } from "./percentage";
import { maybeDivide } from "./safe-math";

describe("Money primitives", () => {
  it("adds and subtracts without float drift", () => {
    const a = money(0.1, "NPR");
    const b = money(0.2, "NPR");
    expect(add(a, b).amount.toNumber()).toBe(0.3);
  });

  it("refuses to combine currencies", () => {
    const a = money(1, "NPR");
    const b = money(1, "USD");
    expect(() => add(a, b)).toThrow(/Currency mismatch/);
  });

  it("multiplies by factors", () => {
    const a = money(500, "NPR");
    expect(multiply(a, 10000).amount.toNumber()).toBe(5_000_000);
  });

  it("allocates with largest remainder so parts sum to the whole", () => {
    const total = money(100, "NPR");
    const parts = allocate(total, [1, 1, 1]);
    const summed = parts.reduce(
      (acc: Decimal, p) => acc.plus(p.amount),
      new Decimal(0)
    );
    expect(summed.toNumber()).toBe(100);
  });
});

describe("Percentage", () => {
  it("converts points to fractions", () => {
    expect(fraction(percent(13)).toNumber()).toBe(0.13);
  });
});

describe("maybeDivide", () => {
  it("returns none for zero denominators", () => {
    const result = maybeDivide(10, 0);
    expect(result.ok).toBe(false);
  });

  it("returns some for valid divisions", () => {
    const result = maybeDivide(10, 4);
    expect(result.ok && result.value.toNumber()).toBe(2.5);
  });

  it("subtract keeps sign", () => {
    const a = money(100, "NPR");
    const b = money(250, "NPR");
    expect(subtract(a, b).amount.isNegative()).toBe(true);
  });
});
