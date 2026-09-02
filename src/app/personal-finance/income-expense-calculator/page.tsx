import type { Metadata } from "next";
import { CalculatorShell } from "@/components/calculators/calculator-shell";
import { IncomeExpenseWidget } from "@/components/calculators/widgets/income-expense";

const SECTION = { name: "Personal finance", href: "/personal-finance" };

export const metadata: Metadata = {
  title: "Income vs Expenses Calculator - Surplus, Deficit and Savings Rate",
  description:
    "Compare monthly income with monthly expenses to see what is left over and your savings rate. Free income and expenses calculator with a worked example.",
  alternates: { canonical: "/personal-finance/income-expense-calculator" },
};

export default function IncomeExpensePage() {
  return (
    <CalculatorShell
      path="/personal-finance/income-expense-calculator"
      section={SECTION}
      title="Free income and expenses calculator"
      intro="Put your monthly income on one side and your monthly expenses on the other. The calculator shows instantly whether you are living on a surplus or a deficit, what share of your income is genuinely yours, and the yearly picture."
      keywords={[
        "income vs expenses calculator",
        "income and expenses calculator",
        "savings rate calculator",
        "where does my money go",
        "monthly surplus calculator",
        "can I afford my monthly expenses",
      ]}
      featureList={[
        "Monthly money left over, positive or negative",
        "Savings rate expressed as a percentage",
        "Yearly projection from the monthly picture",
        "Local-first and private, nothing is uploaded",
      ]}
      formula={
        <p>
          <strong>Surplus = income - expenses.</strong> When the result is
          positive it is money you keep each month; when negative it is a gap
          funded by borrowing or savings. The savings rate is{" "}
          <strong>surplus / income</strong>, so if 20% of your take-home pay is
          left over, your savings rate is 20%.
        </p>
      }
      example={
        <p>
          You bring home Rs. 60,000 a month and spend Rs. 42,000. That leaves{" "}
          <strong>Rs. 18,000, a 30% savings rate and Rs. 216,000 a year</strong>{" "}
          that can fund savings, goals, or repayments.
        </p>
      }
      whatAffects={
        <p>
          The outcome changes with how complete and honest your expense list is.
          Occasional costs like repairs, gifts or yearly subscriptions are often
          missed, which makes the real monthly figure higher than it looks. Using
          an average of a few months of actual spending gives a fairer answer
          than one optimistic month.
        </p>
      }
      mistakes={[
        "Comparing gross income with after-tax spending.",
        "Leaving out irregular costs that arrive once a year or once a quarter.",
        "Treating one month as typical when income or expenses vary a lot.",
        "Calling a balance sheet asset 'income' to make the surplus look better.",
      ]}
      faq={[
        {
          q: "How do I calculate what is left of my income each month?",
          a: "Subtract your full monthly expenses from your monthly income. Whatever is left over is your surplus; if the number is negative you are spending more than you earn.",
        },
        {
          q: "What is a good savings rate?",
          a: "A healthy starting target is 20% of after-tax income. More is better, but any consistent positive rate puts you ahead of most households.",
        },
        {
          q: "What should count as an expense?",
          a: "Every rupee that leaves your account: rent, food, transport, bills, subscriptions, insurance, debt payments and anything you spend on wants. Being complete matters more than being exact.",
        },
        {
          q: "How often should I run this check?",
          a: "Monthly for most people, after payday. Comparing three to six months shows a trend and catches expense creep before it becomes a deficit.",
        },
      ]}
      related={[
        { href: "/personal-finance/savings-goal-calculator", label: "Savings goal" },
        { href: "/personal-finance/emergency-fund-calculator", label: "Emergency fund" },
      ]}
      updated="September 2026"
    >
      <IncomeExpenseWidget />
    </CalculatorShell>
  );
}