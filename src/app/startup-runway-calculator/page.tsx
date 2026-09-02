import type { Metadata } from "next";
import { CalculatorShell } from "@/components/calculators/calculator-shell";
import { RunwayCalculatorWidget } from "@/components/calculators/widgets/runway";

export const metadata: Metadata = {
  title: "Free Startup Runway Calculator - Cash Burn & Runway Months",
  description:
    "Calculate how many months your startup can operate before running out of cash. Free runway calculator with formula, worked example and FAQs.",
  alternates: { canonical: "/startup-runway-calculator" },
};

export default function StartupRunwayCalculatorPage() {
  return (
    <CalculatorShell
      path="/startup-runway-calculator"
      title="Free startup runway calculator"
      intro="Runway is the number of months before your bank balance hits zero. Enter your cash, current revenue and costs, and how fast revenue grows, to see how long you can keep operating at this trajectory."
      keywords={[
        "startup runway calculator",
        "startup runway calculation",
        "cash runway calculator",
        "startup burn rate calculator",
        "how long will my startup last",
        "burn rate and runway",
        "startup cash runway",
      ]}
      featureList={[
        "Months of runway before cash hits zero",
        "Net burn computed from revenue minus costs",
        "Revenue growth simulations up to 5 years",
        "Cash balance projected 12 months out",
        "Free, local-first and private - nothing is uploaded",
      ]}
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
      howToSteps={[
        {
          name: "Step 1 - Enter cash on hand",
          text: "The amount currently in the bank accounts you can spend on operations, not receivables you have not collected.",
        },
        {
          name: "Step 2 - Enter monthly revenue and monthly costs",
          text: "Use realistic averages. The difference between them is your net burn - negative burn means you extend runway every month.",
        },
        {
          name: "Step 3 - Set monthly revenue growth",
          text: "A percentage such as 8% compounds each month and shrinks the shortfall, pushing runway beyond the static cash-divided-by-burn estimate.",
        },
        {
          name: "Step 4 - Read the runway",
          text: "The result shows net burn today, months before cash hits zero, and your cash balance 12 months out. Under 12 months means prioritising fundraising or cost cuts.",
        },
      ]}
      whatAffects={
        <p>
          Your runway is driven by the current cash balance, the gap between
          revenue and costs each month, and how quickly revenue grows. Cash-in
          timing matters too: if customers pay on 60-day terms, receipts lag the
          sales counted here. One-off outflows such as annual licences, tax
          payments or equipment purchases shorten runway in a specific month,{" "}
          <a href="/cash-flow-calculator" className="font-medium text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent">
            month-by-month cash flow projection
          </a>{" "}
          captures those spikes.
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
        {
          q: "What is the startup runway formula?",
          a: "With flat spending, runway in months equals cash on hand divided by monthly net burn (expenses minus revenue). If you burn Rs. 250,000 a month from Rs. 1.2 million in the bank, runway is 1,200,000 / 250,000 = 4.8 months.",
        },
        {
          q: "What is a healthy burn rate?",
          a: "A common target is keeping burn low enough to leave 12-18 months of runway. For pre-revenue startups, monthly burn of roughly 5-10% of total funding is common early on.",
        },
      ]}
      related={[
        { href: "/cash-flow-calculator", label: "Cash flow calculator" },
        { href: "/saas-calculator", label: "SaaS metrics calculator" },
        { href: "/roi-calculator", label: "ROI calculator" },
      ]}
      updated="September 2026"
    >
      <RunwayCalculatorWidget />
    </CalculatorShell>
  );
}