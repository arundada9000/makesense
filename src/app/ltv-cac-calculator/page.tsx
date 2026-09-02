import type { Metadata } from "next";
import { CalculatorShell } from "@/components/calculators/calculator-shell";
import { LtvCacCalculatorWidget } from "@/components/calculators/widgets/ltvcac";

export const metadata: Metadata = {
  title: "Free LTV:CAC Calculator - Customer Lifetime Value & CAC",
  description:
    "Calculate customer lifetime value, acquisition cost, the LTV:CAC ratio and payback period. Free LTV CAC calculator with formula and example.",
  alternates: { canonical: "/ltv-cac-calculator" },
};

export default function LtvCacCalculatorPage() {
  return (
    <CalculatorShell
      path="/ltv-cac-calculator"
      title="Free LTV:CAC calculator"
      intro="The single most telling ratio in a subscription business: how much a customer is worth versus what they cost to acquire. Enter monthly revenue per customer, gross margin, churn, and acquisition cost."
      keywords={[
        "ltv cac calculator",
        "customer lifetime value calculator",
        "cac calculator",
        "customer acquisition cost calculator",
        "ltv cac ratio calculator",
        "customer payback period calculator",
      ]}
      featureList={[
        "Customer lifetime value from ARPU, margin and churn",
        "LTV:CAC ratio with a health threshold",
        "CAC payback period in months",
        "Gross-margin-aware LTV, not revenue-only",
        "Free, local-first and private - nothing is uploaded",
      ]}
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
      howToSteps={[
        {
          name: "Step 1 - Enter monthly revenue per customer (ARPU)",
          text: "Average monthly revenue across customers, before costs.",
        },
        {
          name: "Step 2 - Enter gross margin",
          text: "Percentage of revenue left after serving the customer - hosting, support, and delivery. Skipping this overstates LTV.",
        },
        {
          name: "Step 3 - Enter monthly churn",
          text: "The share of customers leaving each month. At 4% churn the average customer lasts about 25 months.",
        },
        {
          name: "Step 4 - Enter customer acquisition cost (CAC)",
          text: "All-in cost to acquire one paying customer, including sales and marketing salaries, not just ad spend.",
        },
        {
          name: "Step 5 - Read the ratio and payback",
          text: "Above 3:1 is generally healthy; payback under 12 months supports self-funded growth.",
        },
      ]}
      whatAffects={
        <p>
          The LTV:CAC ratio is most sensitive to churn - a customer at 2 percent
          monthly churn is worth roughly twice the LTV of one at 4 percent. Gross
          margin decides how much of that revenue is yours. CAC is commonly
          understated when salaries or tooling are excluded. Trend matters more
          than a single snapshot: early cohorts usually churn faster, and{" "}
          <a href="/saas-calculator" className="font-medium text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent">
            expansion revenue
          </a>{" "}
          now and then can lift LTV without new signups.
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
        {
          q: "What is the LTV:CAC formula?",
          a: "LTV = (ARPU × gross margin) / monthly churn rate. The LTV:CAC ratio divides that LTV by customer acquisition cost. For example, Rs. 26,250 LTV divided by Rs. 6,000 CAC gives a 4.4:1 ratio.",
        },
      ]}
      related={[
        { href: "/saas-calculator", label: "SaaS metrics calculator" },
        { href: "/pricing-calculator", label: "Pricing calculator" },
        { href: "/break-even-calculator", label: "Break-even calculator" },
      ]}
      updated="September 2026"
    >
      <LtvCacCalculatorWidget />
    </CalculatorShell>
  );
}