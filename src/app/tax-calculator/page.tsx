import type { Metadata } from "next";
import { CalculatorShell } from "@/components/calculators/calculator-shell";
import { TaxCalculatorWidget } from "@/components/calculators/widgets/tax";

export const metadata: Metadata = {
  title: "Corporate Tax Calculator - Annual Tax & Loss Carryforward",
  description:
    "Estimate corporate income tax on annual profit with optional loss carryforward. Free corporate tax calculator with formula and example.",
  alternates: { canonical: "/tax-calculator" },
};

export default function TaxCalculatorPage() {
  return (
    <CalculatorShell
      path="/tax-calculator"
      title="Corporate tax calculator"
      intro="A straightforward estimate of what your business owes in corporate income tax for a year, including how prior-year losses can reduce the bill where the rules allow carryforward."
      formula={
        <p>
          <strong>Tax = taxable base times the corporate rate.</strong>{" "}
          The taxable base is profit minus any loss carried forward from earlier
          years. When carryforward exceeds profit, tax is zero and the leftover
          loss continues to future years. The effective rate is tax divided by
          pre-tax profit.
        </p>
      }
      example={
        <p>
          Profit is Rs. 1,200,000 at a 25 percent rate with Rs. 200,000 of prior
          losses. Carryforward reduces the taxable base to Rs. 1,000,000, so{" "}
          <strong>tax is Rs. 250,000</strong> and the effective rate drops to
          about 20.8 percent instead of 25.
        </p>
      }
      mistakes={[
        "Applying the corporate rate to revenue instead of profit.",
        "Assuming losses carry forward without checking local time limits and rules.",
        "Forgetting that some expenses are not deductible, which raises the real base.",
        "Ignoring advance or withholding payments already made during the year.",
      ]}
      faq={[
        {
          q: "What is Nepal's corporate rate?",
          a: "The standard rate is 25 percent, with different rates for special industries and banks. This calculator lets you enter any rate; the full app ships a Nepal preset.",
        },
        {
          q: "Does this include VAT?",
          a: "No. VAT is collected on behalf of the government and is separate from corporate income tax; see the VAT calculator.",
        },
        {
          q: "Is this a substitute for filing?",
          a: "No. It is an estimate for planning. Deductions, depreciation and local rules change the final assessment.",
        },
      ]}
      related={[
        { href: "/vat-calculator", label: "VAT calculator" },
        { href: "/profit-calculator", label: "Profit calculator" },
        { href: "/business-calculator", label: "Business calculator" },
      ]}
    >
      <TaxCalculatorWidget />
    </CalculatorShell>
  );
}
