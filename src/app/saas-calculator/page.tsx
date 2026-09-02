import type { Metadata } from "next";
import { CalculatorShell } from "@/components/calculators/calculator-shell";
import { SaasCalculatorWidget } from "@/components/calculators/widgets/saas";

export const metadata: Metadata = {
  title: "SaaS Metrics Calculator - MRR, ARR, Churn & LTV",
  description:
    "Calculate ARR, ARPU, net customer growth, churn and LTV from MRR and subscriber counts. Free SaaS metrics calculator with formula and example.",
  alternates: { canonical: "/saas-calculator" },
};

export default function SaasCalculatorPage() {
  return (
    <CalculatorShell
      path="/saas-calculator"
      title="Free SaaS metrics calculator"
      intro="Subscription businesses live on a handful of numbers. From MRR, subscriber count, churn and new signups you get ARR, revenue per user, whether the customer base is actually growing, and lifetime value at your current churn."
      formula={
        <p>
          <strong>ARR = MRR times twelve.</strong> ARPU is MRR divided by
          subscribers. Net new customers are new minus churned. LTV under
          constant churn is ARPU divided by the monthly churn rate: losing 3
          percent per month implies an average customer life of about 33 months.
        </p>
      }
      example={
        <p>
          MRR of Rs. 500,000 across 200 subscribers means{" "}
          <strong>ARPU of Rs. 2,500 and ARR of Rs. 6 million</strong>. At 3
          percent churn you lose 6 customers a month; adding 25 leaves net
          growth of 19, or 9.5 percent monthly. LTV at this churn is about Rs.
          83,000.
        </p>
      }
      mistakes={[
        "Counting one-time setup fees as MRR.",
        "Using logo churn and revenue churn interchangeably when plans differ in price.",
        "Ignoring expansion revenue from upgrades, which can make net revenue retention exceed 100 percent.",
        "Computing LTV without gross margin; revenue per customer overstates what they are worth.",
      ]}
      faq={[
        {
          q: "What churn rate is acceptable?",
          a: "For SMB SaaS, 2 to 4 percent monthly is common early; enterprise products often run below 1 percent. The trend matters more than the level.",
        },
        {
          q: "How does this relate to LTV:CAC?",
          a: "LTV here uses revenue only. Divide by CAC after applying gross margin for the honest ratio; the dedicated LTV:CAC calculator does that.",
        },
        {
          q: "Why is ARR different from booked contracts?",
          a: "ARR annualizes current recurring revenue. Committed multi-year contracts may book more, while month-to-month customers may leave before renewing.",
        },
      ]}
      related={[
        { href: "/ltv-cac-calculator", label: "LTV:CAC calculator" },
        { href: "/revenue-calculator", label: "Revenue calculator" },
        { href: "/startup-runway-calculator", label: "Runway calculator" },
      ]}
    >
      <SaasCalculatorWidget />
    </CalculatorShell>
  );
}
