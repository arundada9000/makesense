import type { Metadata } from "next";
import { CalculatorShell } from "@/components/calculators/calculator-shell";
import { RunwayCalculatorWidget } from "@/components/calculators/widgets/runway";

export const metadata: Metadata = {
  title: "Startup Runway Calculator",
  description:
    "Calculate how many months your cash lasts given burn rate and revenue growth.",
  alternates: { canonical: "/startup-runway-calculator" },
};

export default function StartupRunwayCalculatorPage() {
  return (
    <CalculatorShell
      title="Startup runway calculator"
      intro="Runway is the number of months before your bank balance hits zero. Enter your cash, current revenue and costs, and how fast revenue grows, to see how long you can keep operating at this trajectory."
      formula={
        <p>
          <strong>Runway = months until cumulative (revenue minus costs)
          exhausts starting cash.</strong>{" "}
          With flat burn it is simply cash divided by monthly loss. With growing
          revenue the shortfall shrinks each month, so runway extends beyond
          what a static calculation suggests.
        </p>
      }
      example={
        <p>
          You hold Rs. 1.2 million, spend Rs. 400,000 a month and earn Rs.
          150,000, so net burn is Rs. 250,000. A static view says under five
          months. With 8 percent monthly revenue growth,{" "}
          <strong>runway stretches past seven months</strong>, which may be the
          difference between raising calmly and raising in a panic.
        </p>
      }
      mistakes={[
        "Using average burn that hides upcoming hires or annual renewals.",
        "Assuming growth without checking where new customers come from.",
        "Forgetting founder salary; unpaid founders make runway look longer than it is.",
        "Raising money when runway is already under three months; fundraising takes longer than that.",
      ]}
      faq={[
        {
          q: "How much runway should I aim for?",
          a: "At least 12 to 18 months if you plan to raise funding, since fundraising itself consumes three to six months of attention.",
        },
        {
          q: "Does revenue growth really extend runway?",
          a: "Yes, as long as growth does not require proportional spending increases. Growth bought with equal spending leaves burn unchanged.",
        },
        {
          q: "What is the fastest way to extend runway?",
          a: "Cut fixed costs, collect receivables faster, or delay discretionary spending. All three act immediately on the balance.",
        },
      ]}
      related={[
        { href: "/cash-flow-calculator", label: "Cash flow calculator" },
        { href: "/saas-calculator", label: "SaaS metrics calculator" },
        { href: "/roi-calculator", label: "ROI calculator" },
      ]}
    >
      <RunwayCalculatorWidget />
    </CalculatorShell>
  );
}
