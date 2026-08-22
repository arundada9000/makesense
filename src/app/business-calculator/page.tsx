import type { Metadata } from "next";
import { CalculatorShell } from "@/components/calculators/calculator-shell";
import { BusinessCalculatorWidget } from "@/components/calculators/widgets/business";

export const metadata: Metadata = {
  title: "Business Profitability Calculator",
  description:
    "Enter price, volume and costs to see monthly and yearly profit and margin for any small business.",
  alternates: { canonical: "/business-calculator" },
};

export default function BusinessCalculatorPage() {
  return (
    <CalculatorShell
      title="Business profitability calculator"
      intro="A quick read on whether a business idea makes money: enter what you charge, how much you sell, and what it costs to deliver. You get monthly profit, margin, and a simple year-one view."
      formula={
        <p>
          <strong>Profit = revenue minus variable costs minus fixed costs.</strong>{" "}
          Revenue is price times units sold. Variable costs move with each unit;
          fixed costs such as rent and salaries do not. Margin is profit divided
          by revenue, which is the cleanest single indicator of pricing health.
        </p>
      }
      example={
        <p>
          A bakery sells 120 loaves at Rs. 150. Flour and energy cost Rs. 60 per
          loaf, rent and staff cost Rs. 6,000 per month. Revenue is Rs. 18,000,
          variable costs are Rs. 7,200, fixed costs are Rs. 6,000, so profit is{" "}
          <strong>Rs. 4,800</strong> and margin is about 26.7 percent.
        </p>
      }
      mistakes={[
        "Counting your own salary as profit instead of as a fixed cost.",
        "Using best-month sales as the normal month when estimating volume.",
        "Forgetting payment processing fees, which are variable costs on every sale.",
        "Comparing margin percentages across businesses with very different capital needs.",
      ]}
      faq={[
        {
          q: "Is margin or profit more important?",
          a: "Profit pays bills; margin shows efficiency. A low-margin business can earn a lot at scale but has little room for error, so track both.",
        },
        {
          q: "What counts as a variable cost?",
          a: "Anything that rises or falls directly with each unit sold: materials, packaging, delivery, payment fees, commissions.",
        },
        {
          q: "Should taxes be included here?",
          a: "This calculator shows pre-tax operating profit. Use the tax calculator for an after-tax estimate.",
        },
      ]}
      related={[
        { href: "/profit-calculator", label: "Profit calculator" },
        { href: "/break-even-calculator", label: "Break-even calculator" },
        { href: "/pricing-calculator", label: "Pricing calculator" },
      ]}
    >
      <BusinessCalculatorWidget />
    </CalculatorShell>
  );
}
