import type { Metadata } from "next";
import { CalculatorShell } from "@/components/calculators/calculator-shell";
import { RoiCalculatorWidget } from "@/components/calculators/widgets/roi";

export const metadata: Metadata = {
  title: "ROI Calculator",
  description:
    "Calculate return on investment, return multiple and payback period for any project or purchase.",
  alternates: { canonical: "/roi-calculator" },
};

export default function RoiCalculatorPage() {
  return (
    <CalculatorShell
      title="ROI calculator"
      intro="Return on investment turns a spending decision into a comparable number. Enter what you invested and the yearly gain it produces to see ROI, the return multiple, and how long until the investment pays for itself."
      formula={
        <p>
          <strong>ROI = (total gain minus investment) divided by
          investment.</strong>{" "}
          The return multiple is total gain divided by investment. Payback is
          investment divided by annual gain: the time before cumulative gains
          cover the original outlay.
        </p>
      }
      example={
        <p>
          A Rs. 500,000 espresso machine adds Rs. 200,000 of yearly profit.
          Over three years that is Rs. 600,000 of gain, so{" "}
          <strong>ROI is 20 percent</strong>, the multiple is 1.2x, and payback
          takes 2.5 years. Compare that against leaving the money in a 10
          percent instrument to judge whether the risk is worth it.
        </p>
      }
      mistakes={[
        "Counting revenue as gain instead of profit attributable to the investment.",
        "Ignoring ongoing maintenance costs that reduce the yearly gain.",
        "Comparing ROIs over different horizons without annualizing.",
        "Forgetting the time value of money; a 3-year payback is riskier than a 1-year one.",
      ]}
      faq={[
        {
          q: "What is a good ROI?",
          a: "It depends on risk and alternatives. Many small businesses target at least beating safe returns by a wide margin, often 20 percent or more annually.",
        },
        {
          q: "Should I include my own labor?",
          a: "If the investment saves your time, value those hours and include them as part of the gain; otherwise you are hiding real costs.",
        },
        {
          q: "How is this different from NPV?",
          a: "NPV discounts future cash flows to today's value. ROI is simpler but ignores timing, which is why payback is shown alongside.",
        },
      ]}
      related={[
        { href: "/business-calculator", label: "Business calculator" },
        { href: "/cash-flow-calculator", label: "Cash flow calculator" },
        { href: "/startup-runway-calculator", label: "Runway calculator" },
      ]}
    >
      <RoiCalculatorWidget />
    </CalculatorShell>
  );
}
