import type { Metadata } from "next";
import { CalculatorShell } from "@/components/calculators/calculator-shell";
import { RevenueCalculatorWidget } from "@/components/calculators/widgets/revenue";

export const metadata: Metadata = {
  title: "Revenue Projection Calculator",
  description:
    "Project revenue over any horizon from price, starting volume and monthly growth.",
  alternates: { canonical: "/revenue-calculator" },
};

export default function RevenueCalculatorPage() {
  return (
    <CalculatorShell
      title="Revenue projection calculator"
      intro="Compound growth is easy to underestimate. Enter a starting price and volume, a monthly growth rate, and see how revenue builds month by month across your chosen horizon."
      formula={
        <p>
          <strong>Revenue in month n = price times units, where units grow
          every month.</strong>{" "}
          Units in month n equal starting units times (1 + growth) raised to the
          power of n minus 1. Small monthly growth rates compound into large
          differences over a year: 5 percent monthly is about 80 percent annual.
        </p>
      }
      example={
        <p>
          A course sells at Rs. 2,500 with 80 sales in month one growing 5
          percent monthly. Month one brings Rs. 200,000; by month twelve volume
          reaches about 136 sales and{" "}
          <strong>the year totals roughly Rs. 3.18 million</strong>, far more
          than twelve flat months would suggest.
        </p>
      }
      mistakes={[
        "Applying growth forever without a market ceiling.",
        "Confusing revenue growth with customer growth when prices also change.",
        "Assuming linear growth when your plan says percentage growth.",
        "Forgetting refunds and discounts, which reduce realized revenue below the headline.",
      ]}
      faq={[
        {
          q: "Should I use optimistic or realistic growth?",
          a: "Model both. The full app lets you save conservative, expected and aggressive scenarios side by side so the range becomes part of the decision.",
        },
        {
          q: "How do I include seasonal spikes?",
          a: "Use the custom monthly schedule in the full app, which accepts a different growth value for each month.",
        },
        {
          q: "Does this account for churn?",
          a: "No, this projects gross volume. For subscription businesses use the SaaS calculator which nets churn against new customers.",
        },
      ]}
      related={[
        { href: "/saas-calculator", label: "SaaS metrics calculator" },
        { href: "/business-calculator", label: "Business calculator" },
        { href: "/pricing-calculator", label: "Pricing calculator" },
      ]}
    >
      <RevenueCalculatorWidget />
    </CalculatorShell>
  );
}
