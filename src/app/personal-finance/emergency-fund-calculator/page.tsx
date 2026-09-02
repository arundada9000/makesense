import type { Metadata } from "next";
import { CalculatorShell } from "@/components/calculators/calculator-shell";
import { EmergencyFundWidget } from "@/components/calculators/widgets/emergency-fund";

const SECTION = { name: "Personal finance", href: "/personal-finance" };

export const metadata: Metadata = {
  title: "Emergency Fund Calculator - How Much to Save and How Long",
  description:
    "Work out the emergency fund you need for months of expenses and how long it takes to build. Free emergency fund calculator with a worked example.",
  alternates: { canonical: "/personal-finance/emergency-fund-calculator" },
};

export default function EmergencyFundPage() {
  return (
    <CalculatorShell
      path="/personal-finance/emergency-fund-calculator"
      section={SECTION}
      title="Free emergency fund calculator"
      intro="An emergency fund is the money that keeps you afloat when income stops or a large bill arrives. Enter your monthly expenses, how many months of cover you want, what is already set aside, and the calculator tells you the target and how long it takes to build."
      keywords={[
        "emergency fund calculator",
        "how much should I save for emergencies",
        "emergency savings calculator",
        "6 months of expenses",
        "how to build an emergency fund",
        "rainy day fund calculator",
      ]}
      featureList={[
        "Target fund size from monthly expenses",
        "Months of cover as the safety target",
        "Time needed to build it at your current rate",
        "Free and local-first, nothing is uploaded",
      ]}
      formula={
        <p>
          <strong>Target = monthly expenses x months of cover.</strong> A common
          thumb rule is 3 to 6 months for stable jobs and 6 to 12 months for
          freelancers or commission-based work. The time to build is{" "}
          <strong>(target - already saved) / monthly savings</strong>.
        </p>
      }
      example={
        <p>
          Your essential bills come to Rs. 42,000 a month and you want 6 months
          of cover. That is a <strong>Rs. 252,000 target</strong>. With Rs. 80,000
          already saved and Rs. 6,000 a month to spare,{" "}
          <strong>the remaining Rs. 172,000 takes about 29 months</strong> to
          finish.
        </p>
      }
      whatAffects={
        <p>
          Your target is driven by essential expenses only, not your full
          spending, because a leaner budget stretches the fund further in a real
          emergency. The time to build depends on how much you can set aside
          without skipping fixed costs. More cover is more security, but it also
          ties up money that could earn or work elsewhere.
        </p>
      }
      mistakes={[
        "Setting a target without counting what is already saved.",
        "Including optional spending like entertainment in essential expenses.",
        "Picking the same months of cover regardless of how steady the income is.",
        "Treating the fund as finished before it is actually saved.",
      ]}
      faq={[
        {
          q: "How much should I have in an emergency fund?",
          a: "Multiply your essential monthly expenses by the months of cover you want. Three months is the minimum for most people, six is comfortable, and 6 to 12 suits irregular income.",
        },
        {
          q: "What expenses should the fund cover?",
          a: "Only essentials: rent, food, transport, utilities, insurance and unavoidable debt payments. Luxury spending is optional and should not set the target.",
        },
        {
          q: "How long does it take to build an emergency fund?",
          a: "Divide what is still missing by what you can save monthly. If Rs. 120,000 is missing and you save Rs. 10,000 a month, it takes 12 months.",
        },
        {
          q: "Where should I keep an emergency fund?",
          a: "Somewhere safe, liquid and separate from everyday spending, like a high-yield savings account. It must be reachable quickly without being easy to spend by accident.",
        },
      ]}
      related={[
        { href: "/personal-finance/savings-goal-calculator", label: "Savings goal" },
        { href: "/personal-finance/income-expense-calculator", label: "Income and expenses" },
      ]}
      updated="September 2026"
    >
      <EmergencyFundWidget />
    </CalculatorShell>
  );
}