import type { Metadata } from "next";
import { CalculatorShell } from "@/components/calculators/calculator-shell";
import { LtvCacCalculatorWidget } from "@/components/calculators/widgets/ltvcac";

export const metadata: Metadata = {
  title: "LTV to CAC Ratio Calculator",
  description:
    "Calculate customer lifetime value, acquisition cost, the LTV:CAC ratio and payback period.",
  alternates: { canonical: "/ltv-cac-calculator" },
};

export default function LtvCacCalculatorPage() {
  return (
    <CalculatorShell
      title="LTV:CAC calculator"
      intro="The single most telling ratio in a subscription business: how much a customer is worth versus what they cost to acquire. Enter monthly revenue per customer, gross margin, churn, and acquisition cost."
      formula={
        <p>
          <strong>LTV = ARPU times gross margin divided by monthly
          churn.</strong>{" "}
          The LTV:CAC ratio divides that by acquisition cost. Above 3:1 is
          generally healthy; below 1:1 you lose money on every customer. CAC
          payback shows how many months of contribution recover the acquisition
          spend.
        </p>
      }
      example={
        <p>
          Customers pay Rs. 1,500 a month at a 70 percent gross margin and 4
          percent churn. LTV is Rs. 26,250. With a Rs. 6,000 CAC the ratio is{" "}
          <strong>4.4:1</strong> with payback under six months, which supports
          spending more on acquisition.
        </p>
      }
      mistakes={[
        "Using revenue instead of gross margin in LTV; hosting and support costs are real.",
        "Counting only ad spend as CAC when salaries of sales staff are part of acquisition.",
        "Assuming churn stays constant forever; early cohorts usually churn faster.",
        "Chasing a very high ratio by underspending on growth when the market allows more.",
      ]}
      faq={[
        {
          q: "Why 3:1 specifically?",
          a: "Below about 3:1 most businesses struggle to fund growth from their own economics; far above it may signal underinvestment in sales.",
        },
        {
          q: "Should payback be shorter than 12 months?",
          a: "Ideally yes for self-funded growth, since cash recovered within a year can fund the next cohort of customers.",
        },
        {
          q: "How do annual plans change this?",
          a: "Annual prepayment improves cash timing but not the ratio itself; model the discount you give for annual terms honestly.",
        },
      ]}
      related={[
        { href: "/saas-calculator", label: "SaaS metrics calculator" },
        { href: "/pricing-calculator", label: "Pricing calculator" },
        { href: "/break-even-calculator", label: "Break-even calculator" },
      ]}
    >
      <LtvCacCalculatorWidget />
    </CalculatorShell>
  );
}
