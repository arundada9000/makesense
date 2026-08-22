import type { Metadata } from "next";
import { CalculatorShell } from "@/components/calculators/calculator-shell";
import { PricingCalculatorWidget } from "@/components/calculators/widgets/pricing";

export const metadata: Metadata = {
  title: "Pricing Calculator",
  description:
    "Set a price from unit cost and target gross margin, and compare against competitor pricing.",
  alternates: { canonical: "/pricing-calculator" },
};

export default function PricingCalculatorPage() {
  return (
    <CalculatorShell
      title="Pricing calculator"
      intro="Cost-plus pricing is a floor, not a strategy. Enter what one sale costs you and the margin you need; this shows the minimum price that hits your target, how much markup that implies, and where it sits against a competitor."
      formula={
        <p>
          <strong>Price = unit cost divided by (1 minus target margin).</strong>{" "}
          A 60 percent margin means cost is 40 percent of price, so price is
          cost divided by 0.4. Markup is margin expressed against cost instead
          of revenue: the same 60 percent margin is a 150 percent markup.
        </p>
      }
      example={
        <p>
          A handmade bag costs Rs. 900 all-in. For a 60 percent gross margin
          you must charge <strong>Rs. 2,250</strong>. If the closest competitor
          sells at Rs. 2,500 you are 10 percent cheaper while keeping your
          target margin, which is a defensible position.
        </p>
      }
      mistakes={[
        "Forgetting hidden variable costs: payment fees, packaging, returns.",
        "Confusing markup with margin; a 50 percent markup is only a 33 percent margin.",
        "Setting price purely from cost when customers would pay more for value.",
        "Ignoring fixed-cost recovery; margin per unit must also cover overheads at realistic volume.",
      ]}
      faq={[
        {
          q: "What margin should I target?",
          a: "Enough to cover fixed costs at realistic volume plus profit. Work backwards from break-even: required margin depends on how many units you can actually sell.",
        },
        {
          q: "Is underpricing competitors always bad?",
          a: "Not if it is deliberate positioning with a cost structure that supports it. Accidental underpricing is the dangerous kind.",
        },
        {
          q: "How do discounts affect this?",
          a: "Every discount comes straight out of contribution. A 20 percent discount on a 60 percent margin product removes a third of its profit.",
        },
      ]}
      related={[
        { href: "/break-even-calculator", label: "Break-even calculator" },
        { href: "/business-calculator", label: "Business calculator" },
        { href: "/vat-calculator", label: "VAT calculator" },
      ]}
    >
      <PricingCalculatorWidget />
    </CalculatorShell>
  );
}
