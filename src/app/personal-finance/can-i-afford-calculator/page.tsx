import type { Metadata } from "next";
import { CalculatorShell } from "@/components/calculators/calculator-shell";
import { CanIAffordWidget } from "@/components/calculators/widgets/can-i-afford";

const SECTION = { name: "Personal finance", href: "/personal-finance" };

export const metadata: Metadata = {
  title: "Can I Afford It Calculator - How Long Until I Can Buy It",
  description:
    "Find out how long it takes to afford something, whether a small purchase or a big one. Free 'can I afford it' calculator with monthly surplus, amount still needed and time to goal.",
  alternates: { canonical: "/personal-finance/can-i-afford-calculator" },
};

export default function CanIAffordPage() {
  return (
    <CalculatorShell
      path="/personal-finance/can-i-afford-calculator"
      section={SECTION}
      title="Free can I afford it calculator"
      intro="Enter the price of the thing you want, what you already have, your monthly income and your monthly expenses. MakeSense shows your surplus, the amount still needed and how long it takes if you put aside the full surplus or only part of it."
      keywords={[
        "can I afford it calculator",
        "how long until I can afford",
        "can I afford calculator",
        "when can I buy calculator",
        "how much do I need to save to afford",
        "price savings affordability calculator",
      ]}
      featureList={[
        "Time to afford any purchase",
        "Work with a partial savings rate",
        "Understand your monthly surplus",
        "Free, no account, nothing is uploaded",
      ]}
      formula={
        <p>
          <strong>Months to afford = (price - current savings) / (surplus x savings rate).</strong>{" "}
          Your monthly surplus is income minus expenses. The savings rate is the
          share of that surplus you actually put aside, so saving only half of
          your surplus doubles the time. The result rounds up to whole months.
        </p>
      }
      example={
        <p>
          A purchase costs Rs. 100,000 and you have Rs. 5,000 saved. With Rs.
          35,000 income and Rs. 25,000 expenses each month, your surplus is Rs.
          10,000. Putting all of it aside,{" "}
          <strong>the Rs. 95,000 gap closes in about 10 months</strong>. Putting
          aside only half your surplus, it takes about 19 months instead.
        </p>
      }
      whatAffects={
        <p>
          The biggest lever is the amount you actually set aside, which is why
          the calculator lets you choose a savings rate instead of assuming you
          bank your entire surplus. Cutting expenses or raising income enlarges
          the surplus; lowering the price or adding to savings shrinks the gap.
          All four behave exactly as you would expect.
        </p>
      }
      mistakes={[
        "Counting your whole surplus as savings when part of it goes to irregular costs.",
        "Forgetting money already saved, which makes the gap look bigger than it is.",
        "Ignoring that the price may change by the time you get there.",
        "Assuming income and expenses stay fixed for many months ahead.",
      ]}
      faq={[
        {
          q: "How do I know if I can afford something?",
          a: "Compare the amount still needed against what you can save each month. If the time that takes is acceptable to you, you can afford it; if not, the purchase is out of reach at your current rate.",
        },
        {
          q: "Why do you use monthly expenses instead of just income?",
          a: "Because what you can set aside is income minus expenses, not income alone. Using the surplus is what makes the estimate close to real.",
        },
        {
          q: "Should I save 100% of my surplus?",
          a: "Not necessarily. Emergencies and surprises happen. The calculator lets you try a lower savings rate to see a more realistic timeline.",
        },
        {
          q: "What if my expenses are higher than my income?",
          a: "Then the monthly surplus is negative and the gap never closes. That is a signal to cut spending or raise income before taking on a new purchase.",
        },
      ]}
      related={[
        { href: "/personal-finance/savings-goal-calculator", label: "Savings goal" },
        { href: "/personal-finance/year-from-now-calculator", label: "Year from now" },
        { href: "/personal-finance/income-expense-calculator", label: "Income and expenses" },
      ]}
      updated="September 2026"
    >
      <CanIAffordWidget />
    </CalculatorShell>
  );
}