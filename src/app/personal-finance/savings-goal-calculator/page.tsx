import type { Metadata } from "next";
import { CalculatorShell } from "@/components/calculators/calculator-shell";
import { SavingsGoalWidget } from "@/components/calculators/widgets/savings-goal";

const SECTION = { name: "Personal finance", href: "/personal-finance" };

export const metadata: Metadata = {
  title: "Savings Goal Calculator - How Long to Save, When Can I Afford It",
  description:
    "Find out how many months it takes to reach a savings goal and how much to save each month. Free savings goal calculator with a worked example.",
  alternates: { canonical: "/personal-finance/savings-goal-calculator" },
};

export default function SavingsGoalPage() {
  return (
    <CalculatorShell
      path="/personal-finance/savings-goal-calculator"
      section={SECTION}
      title="Free savings goal calculator"
      intro="Tell it what you are saving for, what you already have, and what you can put aside each month. The calculator returns how long it will take, the amount still needed, and the exact month you get there."
      keywords={[
        "savings goal calculator",
        "how long to save calculator",
        "when can I afford",
        "time to reach savings goal",
        "how much to save each month",
        "goal savings calculator",
      ]}
      featureList={[
        "Months to reach any savings goal",
        "Rough date when the goal is reached",
        "Works with any currency",
        "Free, no account, nothing is uploaded",
      ]}
      formula={
        <p>
          <strong>Months to goal = (goal - current savings) / monthly savings.</strong>
          The result is rounded up to whole months, because you reach the goal
          only when a full month of saving lands on or past the target. The
          projected date simply adds those months to today.
        </p>
      }
      example={
        <p>
          You want to buy something for Rs. 100,000 and you already have Rs.
          10,000 saved. Saving Rs. 5,000 a month,{" "}
          <strong>
            the Rs. 90,000 gap closes in 18 months, landing around March 2028
          </strong>
          . Saving Rs. 7,500 a month shortens it to 12 months.
        </p>
      }
      whatAffects={
        <p>
          The result only changes with the three numbers you enter. Keeping the
          goal fixed, the fastest lever is usually the monthly amount: each extra
          rupee saved shortens the timeline directly. Income and expense details
          matter only through how much you can actually set aside, which is what
          the income and expenses calculator measures.
        </p>
      }
      mistakes={[
        "Forgetting money you already saved when setting the starting point.",
        "Ignoring that reaching a goal a month early still counts as done.",
        "Assuming the full monthly amount arrives even in months with extra costs.",
        "Rounding interest and bonuses into the plan as if they were guaranteed.",
      ]}
      faq={[
        {
          q: "How do I work out how long it takes to save for something?",
          a: "Subtract what you already have from the goal, then divide by how much you save each month. The result is the number of months needed.",
        },
        {
          q: "How much should I save each month to reach a goal in time?",
          a: "Divide the remaining amount by the number of months available. If you have 12 months and Rs. 90,000 left to save, you need Rs. 7,500 a month.",
        },
        {
          q: "What counts as savings for a goal?",
          a: "Anything you can set aside without breaking your normal spending: part of income left over after expenses, plus any bonuses or windfalls you are sure will arrive.",
        },
        {
          q: "Should I include interest on savings?",
          a: "You can, but this calculator keeps it simple and ignores interest. Any interest you get just helps you reach the goal slightly sooner than shown.",
        },
      ]}
      related={[
        { href: "/personal-finance/emergency-fund-calculator", label: "Emergency fund" },
        { href: "/personal-finance/income-expense-calculator", label: "Income and expenses" },
      ]}
      updated="September 2026"
    >
      <SavingsGoalWidget />
    </CalculatorShell>
  );
}