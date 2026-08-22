import { Decimal } from "../primitives/money";
import { TaxProfile } from "../model/types";

export interface VatBreakdown {
  basePriceNetOfTax: Decimal;
  taxAmount: Decimal;
  grossPriceWithTax: Decimal;
}

/**
 * VAT/GST decomposition. When the entered price includes tax the base is
 * recovered by dividing; otherwise tax is added on top.
 */
export function calculateVat(
  price: Decimal.Value,
  ratePercent: Decimal.Value,
  priceIncludesTax: boolean
): VatBreakdown {
  const p = Decimal.max(0, new Decimal(price));
  const rate = Decimal.max(0, new Decimal(ratePercent)).dividedBy(100);

  if (priceIncludesTax) {
    const net = p.dividedBy(new Decimal(1).plus(rate));
    return {
      basePriceNetOfTax: net,
      taxAmount: p.minus(net),
      grossPriceWithTax: p,
    };
  }
  const tax = p.times(rate);
  return {
    basePriceNetOfTax: p,
    taxAmount: tax,
    grossPriceWithTax: p.plus(tax),
  };
}

export interface VatPositionInput {
  /** Total output sales net of VAT for the period. */
  taxableSalesNet: Decimal.Value;
  vatRatePercent: Decimal.Value;
  /** Eligible input tax paid on purchases for the period. */
  inputTaxPaid: Decimal.Value;
}

export interface VatPositionResult {
  outputTax: Decimal;
  inputTaxCredit: Decimal;
  netPayable: Decimal;
}

/** Net VAT position over a period: output tax minus eligible input credit. */
export function calculateVatPosition(
  input: VatPositionInput
): VatPositionResult {
  const sales = Decimal.max(0, new Decimal(input.taxableSalesNet));
  const rate = Decimal.max(0, new Decimal(input.vatRatePercent)).dividedBy(100);
  const outputTax = sales.times(rate);
  const inputTaxCredit = Decimal.max(0, new Decimal(input.inputTaxPaid));
  return {
    outputTax,
    inputTaxCredit,
    netPayable: Decimal.max(0, outputTax.minus(inputTaxCredit)),
  };
}

export interface CorporateTaxEstimate {
  taxableBase: Decimal;
  tax: Decimal;
  effectiveRatePercent: Decimal;
  lossCarriedForward: Decimal;
}

/**
 * Straightforward corporate tax estimate on operating profit with optional
 * loss carryforward consumed before charging tax.
 */
export function estimateCorporateTax(
  operatingProfit: Decimal.Value,
  profile: Pick<TaxProfile, "corporateTaxRatePercent" | "lossCarryforward">,
  priorLossCarryforward?: Decimal.Value
): CorporateTaxEstimate {
  const profit = new Decimal(operatingProfit);
  const rate = Decimal.max(0, new Decimal(profile.corporateTaxRatePercent));
  let carry = profile.lossCarryforward
    ? Decimal.max(0, new Decimal(priorLossCarryforward ?? 0))
    : new Decimal(0);

  if (!profit.greaterThan(0)) {
    const newCarry = profile.lossCarryforward
      ? carry.plus(profit.abs())
      : carry;
    return {
      taxableBase: new Decimal(0),
      tax: new Decimal(0),
      effectiveRatePercent: new Decimal(0),
      lossCarriedForward: newCarry,
    };
  }

  const offsetUsed = Decimal.min(carry, profit);
  const taxable = profit.minus(offsetUsed);
  carry = carry.minus(offsetUsed);
  const tax = taxable.times(rate).dividedBy(100);

  return {
    taxableBase: taxable,
    tax,
    effectiveRatePercent: profit.isZero()
      ? new Decimal(0)
      : tax.times(100).dividedBy(profit),
    lossCarriedForward: carry,
  };
}
