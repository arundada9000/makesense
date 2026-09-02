import type { Metadata } from "next";
import { CalculatorShell } from "@/components/calculators/calculator-shell";
import { YearFromNowWidget } from "@/components/calculators/widgets/year-from-now";

const SECTION = { name: "Personal finance", href: "/personal-finance" };

export const metadata: Metadata = {
  title: "Year From Now Calculator - Project Your Savings in 12, 24, 36 Months",
  description:
    "See where your money will be one, two and three years from now. Free year from now calculator that projects savings from income, expenses and growth.",
  alternates: { canonical: "/personal-finance/year-from-now-calculator" },
};

export default function YearFromNowPage() {
  return (
    <CalculatorShell
      path="/personal-finance/year-from-now-calculator"
      section={SECTION}
      title="Free year from now calculator"
      intro="Enter your monthly income, monthly expenses, current savings and any income growth. MakeSense projects your balance 12, 24 and 36 months ahead, and shows what a raise does to the timeline."
      keywords={[
        "year from now calculator",
        "savings projection calculator",
        "where will my money be in a year",
        "financial projection 12 months",
        "future savings calculator",
        "how much will I have saved next year",
      ]}
      featureList={[
        "Balance at 12, 24 and 36 months",
        "Optional income growth for a raise",
        "Works with any currency",
        "Free, no account, nothing is uploaded",
      ]}
      formula={
        <p>
          <strong>Balance in N months = current savings + (income - expenses) x N.</strong>{" "}
          When income grows, each month earns more than the last: the monthly
          surplus compounds at the growth rate. The calculator shows both the
          flat line and the raised path so you can see the difference a pay
          increase makes.
        </p>
      }
      example={
        <p>
          With Rs. 30,000 saved, Rs. 40,000 income and Rs. 28,000 expenses each
          month, your surplus is Rs. 12,000.{" "}
          <strong>One year from now that is about Rs. 174,000 saved</strong>, two
          years about Rs. 318,000 and three years about Rs. 462,000. A 10% raise
          that lands next year pushes the three-year number higher still.
        </p>
      }
      whatAffects={
        <p>
          The projection only grows when income beats expenses. A negative
          surplus makes the line slope down, which is worth seeing before it
          surprises you. Income growth compounds month by month in this
          calculator, so even a small yearly raise becomes visible over three
          years.
        </p>
      }
      mistakes={[
        "Assuming the full raise lands in month one instead of over the year.",
        "Forgetting irregular yearly costs like insurance or renewals.",
        "Treating a one-time bonus as monthly income.",
        "Ignoring the projection when the surplus is negative.",
      ]}
      faq={[
        {
          q: "What does 'year from now' mean?",
          a: "It is the balance you expect in 12 months from today, built from current savings plus each month of surplus. The calculator extends the same line to 24 and 36 months.",
        },
        {
          q: "How is income growth calculated?",
          a: "The raised income applies month by month at the yearly rate. A 10% growth rate lifts each month's income by 10/12 of the month before, so the surplus rises gradually.",
        },
        {
          q: "Does this account for inflation?",
          a: "No. It projects the same rupee value you save today. Inflation would eat into what those savings buy, which is why the projection is an estimate, not a promise.",
        },
        {
          q: "Can I use it for a savings goal instead?",
          a: "Yes. The savings goal calculator is sharper for a specific target, while this one is better for a broad 'where will I be' view across three years.",
        },
      ]}
      related={[
        { href: "/personal-finance/savings-goal-calculator", label: "Savings goal" },
        { href: "/personal-finance/can-i-afford-calculator", label: "Can I afford it" },
        { href: "/personal-finance/income-expense-calculator", label: "Income and expenses" },
      ]}
      updated="September 2026"
    >
      <YearFromNowWidget />
    </CalculatorShell>
  );
}