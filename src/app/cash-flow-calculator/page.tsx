import type { Metadata } from "next";
import { CalculatorShell } from "@/components/calculators/calculator-shell";
import { CashFlowCalculatorWidget } from "@/components/calculators/widgets/cashflow";

export const metadata: Metadata = {
  title: "Cash Flow Calculator",
  description:
    "Project your cash balance month by month from opening cash, inflows and outflows.",
  alternates: { canonical: "/cash-flow-calculator" },
};

export default function CashFlowCalculatorPage() {
  return (
    <CalculatorShell
      title="Cash flow calculator"
      intro="Profitable businesses still die from empty bank accounts. This projects your actual cash balance forward from what you hold today, what comes in each month, and what goes out."
      formula={
        <p>
          <strong>Closing cash = opening cash plus inflows minus
          outflows.</strong>{" "}
          Repeat monthly and the balance compounds in either direction. When net
          flow is negative, months until zero is opening cash divided by the
          monthly shortfall.
        </p>
      }
      example={
        <p>
          You hold Rs. 300,000. Customers pay Rs. 400,000 a month but salaries,
          rent and suppliers take Rs. 350,000. Net flow is positive Rs. 50,000,
          so after six months you hold{" "}
          <strong>Rs. 600,000</strong>. Flip the flows and the same business is
          out of money in six months despite being profitable on paper.
        </p>
      }
      mistakes={[
        "Recording revenue when invoiced instead of when cash actually arrives.",
        "Leaving out annual costs such as insurance or tax payments that hit one month hard.",
        "Ignoring loan principal repayments, which are cash out but not expenses.",
        "Assuming customers always pay on time; late receivables are the classic cash killer.",
      ]}
      faq={[
        {
          q: "How is this different from profit?",
          a: "Profit is revenue minus costs when earned. Cash flow is money moving in and out when paid. A sale made on 60-day credit is profit today and cash two months from now.",
        },
        {
          q: "What buffer should I keep?",
          a: "A common rule is three to six months of fixed costs. The runway calculator shows how long your current buffer lasts.",
        },
        {
          q: "Do taxes belong here?",
          a: "Yes, tax payments are real cash outflows even though they are calculated on paper profits.",
        },
      ]}
      related={[
        { href: "/startup-runway-calculator", label: "Runway calculator" },
        { href: "/profit-calculator", label: "Profit calculator" },
        { href: "/roi-calculator", label: "ROI calculator" },
      ]}
    >
      <CashFlowCalculatorWidget />
    </CalculatorShell>
  );
}
