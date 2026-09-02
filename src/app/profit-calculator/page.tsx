import type { Metadata } from "next";
import { CalculatorShell } from "@/components/calculators/calculator-shell";
import { ProfitCalculatorWidget } from "@/components/calculators/widgets/profit";

export const metadata: Metadata = {
  title: "Free Profit Margin Calculator - Gross, Operating & Net Margin",
  description:
    "Calculate gross, operating and net profit with margins and tax for any period. Free profit margin calculator with formula and worked example.",
  alternates: { canonical: "/profit-calculator" },
};

export default function ProfitCalculatorPage() {
  return (
    <CalculatorShell
      path="/profit-calculator"
      title="Free profit margin calculator"
      intro="Turn a revenue figure into the full profit waterfall: gross profit after direct costs, operating profit after overheads, and net profit after tax. Each stage has its own margin, and each tells a different story."
      formula={
        <p>
          <strong>Gross profit = revenue minus cost of goods sold.</strong>{" "}
          Operating profit subtracts operating expenses. Net profit subtracts
          tax. Margins are each profit divided by revenue. A healthy business
          usually shows a stable gross margin and an operating margin that
          improves with scale.
        </p>
      }
      example={
        <p>
          An agency bills Rs. 500,000 in a month. Freelancer payouts (direct
          costs) are Rs. 180,000, office and tools are Rs. 150,000, and the
          corporate rate is 25 percent. Gross margin is 64 percent, operating
          profit is Rs. 170,000, tax is Rs. 42,500, so{" "}
          <strong>net profit is Rs. 127,500</strong>, a 25.5 percent net margin.
        </p>
      }
      mistakes={[
        "Mixing personal and business expenses in operating costs.",
        "Treating one-off equipment purchases as operating expenses instead of investment.",
        "Ignoring that some months have extra costs such as annual software renewals.",
        "Reading gross margin as take-home profit; taxes and overheads still come out.",
      ]}
      faq={[
        {
          q: "What is a good net margin?",
          a: "It varies widely by industry: software often runs above 20 percent, retail is often under 5. Compare against your own history and industry benchmarks rather than a universal number.",
        },
        {
          q: "Why does my gross margin matter if I am profitable?",
          a: "Gross margin funds everything else. If it shrinks, no amount of cost cutting below the line saves the business for long.",
        },
        {
          q: "Does this include loss carryforward?",
          a: "No, this is a single-period estimate. The full app applies carryforward month by month when enabled in the tax profile.",
        },
      ]}
      related={[
        { href: "/business-calculator", label: "Business calculator" },
        { href: "/tax-calculator", label: "Tax calculator" },
        { href: "/cash-flow-calculator", label: "Cash flow calculator" },
      ]}
    >
      <ProfitCalculatorWidget />
    </CalculatorShell>
  );
}
