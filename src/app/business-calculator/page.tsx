import type { Metadata } from "next";
import { CalculatorShell } from "@/components/calculators/calculator-shell";
import { BusinessCalculatorWidget } from "@/components/calculators/widgets/business";

export const metadata: Metadata = {
  title: "Free Business Profitability Calculator - Profit & Loss Snapshot",
  description:
    "Enter price, volume and costs to see monthly and yearly profit and margin for any small business. Free profitability calculator with formula and example.",
  alternates: { canonical: "/business-calculator" },
};

export default function BusinessCalculatorPage() {
  return (
    <CalculatorShell
      path="/business-calculator"
      title="Free business profitability calculator"
      intro="A quick read on whether a business idea makes money: enter what you charge, how much you sell, and what it costs to deliver. You get monthly profit, margin, and a simple year-one view."
      keywords={[
        "profitability calculator",
        "business calculator",
        "business profit calculator",
        "profit and loss calculator",
        "how much is my company making",
        "estimate business profit",
        "small business profitability",
      ]}
      featureList={[
        "Monthly and yearly profit from revenue and costs",
        "Net margin as a percentage of sales",
        "Breaks revenue into variable and fixed costs",
        "Year-one view for planning",
        "Free, local-first and private - nothing is uploaded",
      ]}
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
      whatAffects={
        <p>
          Profitability depends on three levers: price, volume, and the split
          between variable and fixed costs. Raising price lifts margin on every
          unit but can cut demand; cutting variable costs improves margin with
          no volume risk; volume spreads fixed costs over more units. A healthy
          business usually shows stable gross margin with{" "}
          <a href="/profit-calculator" className="font-medium text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent">
            operating and net margins
          </a>{" "}
          that improve as it scales.
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
        {
          q: "How can I estimate how much a company is making?",
          a: "Start on a per-unit basis: price times estimated volume gives revenue, then subtract variable and fixed costs to reach profit. For a company you cannot inspect directly, triangulate across pricing, public benchmarks, employee counts and unit economics. See the guide on estimating a company's revenue for the full method.",
        },
      ]}
      related={[
        { href: "/profit-calculator", label: "Profit calculator" },
        { href: "/break-even-calculator", label: "Break-even calculator" },
        { href: "/pricing-calculator", label: "Pricing calculator" },
      ]}
      updated="September 2026"
    >
      <BusinessCalculatorWidget />
    </CalculatorShell>
  );
}