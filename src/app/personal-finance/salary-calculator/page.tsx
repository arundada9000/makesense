import type { Metadata } from "next";
import { CalculatorShell } from "@/components/calculators/calculator-shell";
import { SalaryCalculatorWidget } from "@/components/calculators/widgets/salary";

const SECTION = { name: "Personal finance", href: "/personal-finance" };

export const metadata: Metadata = {
  title: "Salary Calculator - Convert Hourly, Daily, Monthly, Yearly",
  description:
    "Convert your salary between hourly, daily, weekly, monthly and yearly income. Free salary calculator with formula, example and FAQs.",
  alternates: { canonical: "/personal-finance/salary-calculator" },
};

export default function SalaryCalculatorPage() {
  return (
    <CalculatorShell
      path="/personal-finance/salary-calculator"
      section={SECTION}
      title="Free salary calculator"
      intro="Enter one number about what you earn, monthly, yearly, weekly, daily or hourly, and see the same income expressed in every other pay period. No more back-of-the-envelope conversions."
      keywords={[
        "salary calculator",
        "monthly to yearly salary",
        "hourly rate calculator",
        "annual income calculator",
        "salary converter",
        "how much do I earn per year",
        "salary to hourly",
      ]}
      featureList={[
        "Income converted across hourly, daily, weekly, monthly and yearly",
        "Works from any single pay period you know",
        "Assumes a standard 40-hour week and 52-week year",
        "Free, local-first and private, nothing is uploaded",
      ]}
      formula={
        <p>
          <strong>Pick one basis, then scale it.</strong> A yearly salary divided
          by 52 gives a weekly figure; dividing a weekly figure by 40 gives an
          hourly rate. The monthly figure assumes about 4.33 weeks per month, so
          a Rs. 100,000 monthly salary is roughly Rs. 1,200,000 a year and about
          Rs. 577 per hour at a 40-hour week.
        </p>
      }
      example={
        <p>
          You are offered Rs. 80,000 a month. Across a 40-hour week that is{" "}
          <strong>Rs. 960,000 a year, about Rs. 18,462 a week, about Rs. 3,692 a
          day, and about Rs. 462 an hour</strong>. Comparing two offers becomes
          simple when both are on the same basis.
        </p>
      }
      whatAffects={
        <p>
          The result assumes a standard 40-hour week and 52 paid weeks. Overtime,
          unpaid leaves, bonuses and holidays change the real per-hour figure in
          either direction. For take-home pay, subtract your tax and the
          deductions shown on your pay slip; this calculator shows gross income.
        </p>
      }
      mistakes={[
        "Using 4 weeks for a month when there are about 4.33.",
        "Comparing a monthly offer with a yearly one without converting both.",
        "Forgetting unpaid breaks or months with no income when work is irregular.",
        "Treating gross income as take-home; tax still comes out.",
      ]}
      faq={[
        {
          q: "How do I convert monthly salary to yearly?",
          a: "Multiply the monthly figure by 12. A Rs. 80,000 monthly salary is Rs. 960,000 a year. To go further, divide yearly by 52 for weekly or by 2,080 for hourly.",
        },
        {
          q: "How do I calculate an hourly rate from a salary?",
          a: "Divide the yearly salary by total working hours. With a 40-hour week and 52 weeks, that is 2,080 hours, so a Rs. 960,000 salary is about Rs. 462 an hour.",
        },
        {
          q: "Is this gross or take-home pay?",
          a: "Gross. Tax, insurance and other deductions lower the amount in your bank account; those vary by country and personal situation.",
        },
        {
          q: "How many working weeks are assumed?",
          a: "52 paid weeks and a 40-hour week. The monthly number assumes about 4.33 weeks, matching the real calendar.",
        },
      ]}
      related={[
        { href: "/personal-finance/income-expense-calculator", label: "Income and expenses" },
        { href: "/personal-finance/savings-goal-calculator", label: "Savings goal" },
      ]}
      updated="September 2026"
    >
      <SalaryCalculatorWidget />
    </CalculatorShell>
  );
}