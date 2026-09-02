import type { Metadata } from "next";
import { GuideShell } from "@/components/guides/guide-shell";

export const metadata: Metadata = {
  title: "Common Money Mistakes - the Financial Downfalls That Sneak Up on You",
  description:
    "The financial downfalls that rarely announce themselves: lifestyle creep, high-interest debt, no buffer, status purchases and more, with the fix for each.",
  alternates: { canonical: "/guides/common-money-mistakes" },
};

export default function MoneyMistakesGuide() {
  return (
    <GuideShell
      path="/guides/common-money-mistakes"
      title="Common money mistakes and the downfalls they cause"
      desc="Most serious money trouble is not one big disaster. It is a small recurring mistake given years. Here are the downfalls worth naming, why each one compounds, and the cheap fix for all of them."
      sections={[
        {
          id: "lifestyle-creep",
          title: "Lifestyle creep",
          body: (
            <>
              <p>
                <strong>The pattern:</strong> every raise upgrades a category -
                larger apartment, nicer car, pricier habits - until spending
                grows lockstep with income and the savings rate never moves.
              </p>
              <p>
                <strong>Why it&apos;s a downfall:</strong> it silently converts the
                most powerful money lever (a rising savings rate) into zero
                progress.
              </p>
              <p>
                <strong>The fix:</strong> on payday, push the raise straight to
                savings first and live on the previous budget for a month. Bank
                the increase before the lifestyle sees it.
              </p>
            </>
          ),
        },
        {
          id: "high-interest-debt",
          title: "High-interest debt treated casually",
          body: (
            <>
              <p>
                <strong>The pattern:</strong> credit card balances get a
                minimum-payment habit, &quot;just for this month&quot;, which becomes a
                permanent 20-40% a year cost.
              </p>
              <p>
                <strong>Why it&apos;s a downfall:</strong> compounding works against
                you while you borrow and for you while you save. The same
                interest that grows savings at 5% eats savings at 30%.
              </p>
              <p>
                <strong>The fix:</strong> treat the balance like an emergency.
                Pay more than the minimum, target the highest-rate card first,
                and stop adding to it while it exists.
              </p>
            </>
          ),
        },
        {
          id: "no-buffer",
          title: "No emergency buffer",
          body: (
            <>
              <p>
                <strong>The pattern:</strong> savings exist but everything is in
                goals or investments, so any surprise forces either a sale or a
                new debt.
              </p>
              <p>
                <strong>Why it&apos;s a downfall:</strong> emergencies are not rare;
                they are certain. Join the buffer and the savings goal in one
                pot and the first expense quietly cancels the goal.
              </p>
              <p>
                <strong>The fix:</strong> keep the buffer separate and
                low-risk, sized at months of essentials, and restore it first
                after you use it.
              </p>
            </>
          ),
        },
        {
          id: "status-purchases",
          title: "Buying status before runway",
          body: (
            <>
              <p>
                <strong>The pattern:</strong> the new phone, watch, car or
                desk is bought to feel successful, usually right before the
                income that justified it disappears.
              </p>
              <p>
                <strong>Why it&apos;s a downfall:</strong> status items carry ongoing
                costs (insurance, repairs, upgrades) and time-value - the money
                is gone at the exact moment it is most needed.
              </p>
              <p>
                <strong>The fix:</strong> ask one question before upgrading any
                status category: would I buy this if nobody would see it? Then
                run the can-I-afford-it check on real numbers, not feelings.
              </p>
            </>
          ),
        },
        {
          id: "timing-the-market",
          title: "Timing markets and chasing tips",
          body: (
            <>
              <p>
                <strong>The pattern:</strong> selling after prices fall,
                buying after they soar, and parking meaningful money in
                whatever is trendy this week.
              </p>
              <p>
                <strong>Why it&apos;s a downfall:</strong> you buy the narrative at
                its peak and sell at its floor. The worst timing behaviour is
                the most human and the most reliably punished.
              </p>
              <p>
                <strong>The fix:</strong> decide an allocation on paper, buy on
                a fixed schedule, and redefine success as sticking to the plan.
                Ignore the week&apos;s advice entirely.
              </p>
            </>
          ),
        },
        {
          id: "mixing-business",
          title: "Mixing business and personal money",
          body: (
            <>
              <p>
                <strong>The pattern:</strong> one account for the shop and the
                household, so profit, personal spending and tax money are
                indistinguishable.
              </p>
              <p>
                <strong>Why it&apos;s a downfall:</strong> you cannot read the
                business&apos;s health, cannot truthfully say if it is profitable,
                and cannot separate what the family spends from what the
                company earned.
              </p>
              <p>
                <strong>The fix:</strong> separate accounts, a fixed owner draw
                instead of casual dips, and let the profit calculator give the
                business an honest reading.
              </p>
            </>
          ),
        },
        {
          id: "no-plan",
          title: "Drifting without numbers",
          body: (
            <>
              <p>
                <strong>The pattern:</strong> no target, no savings rate, no
                review; money is handled by vague intentions and whatever feels
                okay this month.
              </p>
              <p>
                <strong>Why it&apos;s a downfall:</strong> behaviour without numbers
                is hostage to mood. Intentions quietly lose to friction.
              </p>
              <p>
                <strong>The fix:</strong> write three numbers down: monthly
                surplus, savings rate, and next goal&apos;s target. Reviewing them
                every quarter is enough to stay honest.
              </p>
            </>
          ),
        },
      ]}
      faq={[
        {
          q: "What is the most common money mistake?",
          a: "Living at the edge of income, so raises become spending instead of savings. Lifestyle creep is the quietest and most widespread downfall because it feels like success at the time.",
        },
        {
          q: "Is credit card debt really that bad?",
          a: "At typical rates it is one of the most expensive ways to borrow. If the card charges 30% a year and savings earn 5%, every rupee of balance costs six times what a rupee saved earns.",
        },
        {
          q: "How do I fix a money mistake I've already made?",
          a: "Name the category, stop the behaviour, then pick one concrete number to move: the balance to clear, the buffer to rebuild, or the savings rate to hit. Small corrections repeated beat dramatic ones abandoned.",
        },
        {
          q: "Should I avoid all risk in markets?",
          a: "No. The mistake is deciding by mood and narrative, not risk itself. A fixed plan you do not change under pressure usually does the job; the plan matters more than the pick.",
        },
      ]}
      related={[
        { href: "/personal-finance/savings-goal-calculator", label: "Savings goal calculator" },
        { href: "/personal-finance/can-i-afford-calculator", label: "Can I afford it calculator" },
        { href: "/business-calculator", label: "Business profitability calculator" },
      ]}
    />
  );
}