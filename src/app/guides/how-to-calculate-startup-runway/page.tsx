import type { Metadata } from "next";
import { GuideShell } from "@/components/guides/guide-shell";

export const metadata: Metadata = {
  title: "How to Calculate Startup Runway - Formula & Example",
  description:
    "Calculate startup runway: the formula, a step-by-step worked example, what a healthy number looks like, and how revenue growth extends it.",
  alternates: { canonical: "/guides/how-to-calculate-startup-runway" },
};

export default function StartupRunwayGuide() {
  return (
    <GuideShell
      path="/guides/how-to-calculate-startup-runway"
      title="How to calculate startup runway"
      desc="Runway is the number of months your startup can keep operating before cash runs out. This guide shows the formula, works a real example, and explains how revenue growth changes the answer."
      sections={[
        {
          id: "what-is-runway",
          title: "What is startup runway?",
          body: (
            <>
              <p>
                <strong>Startup runway is the time a company can continue
                operating before it runs out of cash.</strong> It answers one
                question every founder carries: how long do I have before I must
                raise, cut costs, or hit profitability?
              </p>
              <p>
                Runway is usually expressed in months. A startup with{" "}
                <strong>12 months of runway</strong> can operate for one more
                year at its current spending rate even if revenue never takes
                off.
              </p>
            </>
          ),
        },
        {
          id: "formula",
          title: "The runway formula",
          body: (
            <>
              <p>With roughly flat spending, runway is simply:</p>
              <p>
                <strong>Runway (months) = cash on hand ÷ monthly net burn</strong>
              </p>
              <p>
                Where <strong>net burn</strong> is your monthly spending minus
                your monthly revenue. Spending Rs. 500,000 and earning Rs.
                200,000 means a net burn of Rs. 300,000 - you consume that
                amount of cash each month.
              </p>
              <p>
                If revenue grows, the calculation is no longer static: each
                month&apos;s shortfall shrinks, so runway stretches beyond the
                flat-burn estimate.
              </p>
            </>
          ),
        },
        {
          id: "worked-example",
          title: "Worked example",
          body: (
            <>
              <ul>
                <li>Cash on hand: Rs. 1,200,000</li>
                <li>Monthly revenue: Rs. 150,000</li>
                <li>Monthly costs: Rs. 400,000</li>
                <li>Net burn = 400,000 − 150,000 = Rs. 250,000</li>
              </ul>
              <p>
                Flat-burn runway = 1,200,000 ÷ 250,000 ={" "}
                <strong>4.8 months</strong>.
              </p>
              <p>
                Now add 8% monthly revenue growth. Revenue grows from Rs.
                150,000 by 8% every month, shrinking the shortfall each month,
                so the cash lasts past <strong>7 months</strong> - a material
                difference for fundraising timing.
              </p>
            </>
          ),
        },
        {
          id: "healthy",
          title: "How much runway should you have?",
          body: (
            <>
              <p>
                <strong>12 to 18 months is the common target</strong> if you
                plan to raise venture funding, because fundraising itself
                typically takes three to six months of your full attention.
                Investors also prefer to back a company that is not negotiating
                from desperation.
              </p>
              <p>
                A rough early benchmark: keep monthly burn between 5% and 10% of
                total funding so a new round is not needed within months of the
                last one.
              </p>
            </>
          ),
        },
        {
          id: "extend",
          title: "Ways to extend runway",
          body: (
            <ul>
              <li>
                <strong>Cut fixed costs</strong> - salaries, office,
                subscriptions. They act on every future month.
              </li>
              <li>
                <strong>Collect receivables faster</strong> - shorter payment
                terms and stronger follow-up convert paper sales into cash.
              </li>
              <li>
                <strong>Delay discretionary spend</strong> - travel, tools,
                hiring that is nice-to-have rather than must-have.
              </li>
              <li>
                <strong>Grow revenue without proportional spending</strong> -
                growth bought dollar-for-dollar leaves burn unchanged.
              </li>
            </ul>
          ),
        },
      ]}
      howToSteps={[
        {
          name: "Total the cash you can actually spend",
          text: "Bank balances you can use for operations - not receivables you have not collected, and not cash reserved for payroll tax.",
        },
        {
          name: "Estimate average monthly revenue",
          text: "Be conservative. A single paid invoice does not make a repeatable monthly revenue line.",
        },
        {
          name: "Estimate average monthly costs",
          text: "Include founder salary, annual licences spread across months, and one-off equipment purchases you know are coming.",
        },
        {
          name: "Compute net burn",
          text: "Monthly costs minus monthly revenue. Negative burn means you extend runway every single month.",
        },
        {
          name: "Divide cash by net burn",
          text: "Months of runway. For example, Rs. 1.2 million divided by Rs. 250,000 gives about 4.8 months.",
        },
        {
          name: "Stress-test with growth",
          text: "Repeat at your expected monthly revenue growth to see how much longer the cash lasts.",
        },
      ]}
      faq={[
        {
          q: "What is the startup runway formula?",
          a: "Runway (months) = cash on hand ÷ monthly net burn, where net burn is monthly costs minus monthly revenue. With growing revenue the shortfall shrinks each month and runway extends beyond the static figure.",
        },
        {
          q: "How many months of runway should a startup have?",
          a: "Most advice targets 12 to 18 months, especially before raising a round. Below three months, fundraising becomes extremely difficult because it takes three to six months to close a deal.",
        },
        {
          q: "Should founder salary count in burn?",
          a: "Yes. An unpaid founder makes runway look longer than it really is - the cost simply returns when the founder starts taking a salary.",
        },
        {
          q: "What is a good startup burn rate?",
          a: "Rather than an absolute number, most benchmarks look at burn relative to funding and runway. Keeping monthly burn around 5-10% of raised capital is common in early stages.",
        },
        {
          q: "Does runway change if revenue is growing?",
          a: "Yes. When revenue grows faster than costs, monthly net burn falls, so the same cash lasts longer. Model the growing case before assuming the flat-burn number is final.",
        },
      ]}
      related={[
        { href: "/startup-runway-calculator", label: "Runway calculator" },
        { href: "/cash-flow-calculator", label: "Cash flow calculator" },
        { href: "/saas-calculator", label: "SaaS metrics calculator" },
      ]}
    />
  );
}