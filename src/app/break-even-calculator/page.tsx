import type { Metadata } from "next";
import { CalculatorShell } from "@/components/calculators/calculator-shell";
import { BreakEvenCalculatorWidget } from "@/components/calculators/widgets/breakeven";

export const metadata: Metadata = {
  title: "Break-Even Calculator",
  description:
    "Find the units and revenue per month needed to cover fixed costs, and track progress toward break-even.",
  alternates: { canonical: "/break-even-calculator" },
};

export default function BreakEvenCalculatorPage() {
  return (
    <CalculatorShell
      title="Break-even calculator"
      intro="Break-even answers one question: how much must you sell before the business stops losing money? Enter your monthly fixed costs, what you charge, and what each sale costs you to deliver."
      formula={
        <p>
          <strong>Break-even units = fixed costs divided by contribution per
          unit.</strong>{" "}
          Contribution per unit is price minus variable cost. If contribution is
          zero or negative, no volume ever reaches break-even, which is the
          single most important early warning in business modeling.
        </p>
      }
      example={
        <p>
          Fixed costs are Rs. 150,000 per month. Each product sells at Rs.
          2,500 with Rs. 900 of variable cost, contributing Rs. 1,600.{" "}
          <strong>94 units per month</strong> covers fixed costs, about Rs.
          235,000 of revenue. Selling 90 today means you are 96 percent of the
          way there.
        </p>
      }
      mistakes={[
        "Leaving out semi-fixed costs such as part-time staff that step up with volume.",
        "Using list price instead of realized price after discounts.",
        "Forgetting that variable costs often include payment fees of 2 to 3 percent.",
        "Treating break-even as a one-time milestone; it moves whenever costs or prices move.",
      ]}
      faq={[
        {
          q: "Is break-even the same as profitability?",
          a: "It is the threshold. Past break-even every additional unit contributes profit equal to its contribution margin.",
        },
        {
          q: "How does investment fit in?",
          a: "Break-even here covers ongoing operations. Recovering an initial investment takes longer; the full app computes investment recovery separately.",
        },
        {
          q: "What if I have multiple products?",
          a: "Use a weighted average contribution based on your sales mix, or model each stream separately in the full app.",
        },
      ]}
      related={[
        { href: "/business-calculator", label: "Business calculator" },
        { href: "/pricing-calculator", label: "Pricing calculator" },
        { href: "/startup-runway-calculator", label: "Runway calculator" },
      ]}
    >
      <BreakEvenCalculatorWidget />
    </CalculatorShell>
  );
}
