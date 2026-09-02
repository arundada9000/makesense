import type { Metadata } from "next";
import { GuideShell } from "@/components/guides/guide-shell";

export const metadata: Metadata = {
  title: "Interest Rates and Inflation in 2026 - How They Move Your Money",
  description:
    "What interest rates and inflation are doing and why it matters: savings yield, debt cost, buying power, and the three market signals worth reading.",
  alternates: { canonical: "/guides/interest-rates-and-inflation" },
};

export default function InterestRatesGuide() {
  return (
    <GuideShell
      path="/guides/interest-rates-and-inflation"
      title="Interest rates and inflation: how the market moves your money"
      desc="Central banks raise and lower interest rates, and inflation eats the value of cash. This guide explains what both are doing in plain terms, which of your numbers they touch, and the few market signals actually worth watching in 2026."
      sections={[
        {
          id: "what-they-are",
          title: "What interest rates and inflation are doing",
          body: (
            <>
              <p>
                <strong>Interest rates are the price of borrowing money.</strong>{" "}
                When a central bank holds rates high, loans get more expensive
                and savings accounts and fixed deposits tend to pay noticeably
                more. When it cuts rates, borrowing gets cheaper and safe
                savings yields usually drift down.
              </p>
              <p>
                <strong>Inflation is the rate at which prices rise.</strong> At
                low single-digit inflation, cash slowly loses buying power. At
                high inflation, the same rupee buys visibly less each year. The
                two are linked: central banks lean on interest rates to keep
                inflation from running away.
              </p>
              <p>
                In 2026, the market picture people are actually forecasting is
                about the direction of both - whether rates stay where they are,
                or start falling and pull deposit yields down with them. The
                habit that matters is not predicting the number, but reading
                what a change would do to your plan.
              </p>
            </>
          ),
        },
        {
          id: "touchpoints",
          title: "Which of your numbers they touch",
          body: (
            <ul>
              <li>
                <strong>Savings yield:</strong> higher rates mean your fixed
                deposits and savings accounts earn more. A rate cut means
                locking a good yield while you can.
              </li>
              <li>
                <strong>Debt cost:</strong> floating-rate loans (many personal
                and home loans) reprice when the central bank moves. A cut
                lowers your monthly interest; a hike raises it.
              </li>
              <li>
                <strong>Buying power:</strong> inflation quietly shrinks what
                your savings goal can buy. A target set in today&apos;s rupees buys
                slightly less a few years from now.
              </li>
              <li>
                <strong>Emergency buffer:</strong> cash in a low-yield account
                fades against inflation, but the buffer&apos;s job is safety, not
                growth. Accept the trade-off deliberately.
              </li>
            </ul>
          ),
        },
        {
          id: "signals",
          title: "Three market signals worth reading",
          body: (
            <>
              <p>
                Market news is noise. These three signals tell you something
                real:
              </p>
              <ul>
                <li>
                  <strong>Where the central bank&apos;s rate has been trending.</strong>
                  One cut means little; a series of them is a signal about
                  deposit yields to come.
                </li>
                <li>
                  <strong>Reported inflation versus your own basket.</strong> If
                  the prices you actually pay (rent, transport, food) are rising
                  faster than the official number, plan for a higher personal
                  inflation rate.
                </li>
                <li>
                  <strong>What fixed deposits and savings accounts are paying
                  today.</strong> That is the honest price of safe money right
                  now - the benchmark against which any other plan is judged.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "what-to-do",
          title: "What to do with the signal",
          body: (
            <>
              <p>
                <strong>When rates look set to fall:</strong> lock longer-term
                deposits while yields are better, refinance floating debt if a
                cut is announced, and keep buying assets on schedule regardless
                of the noise.
              </p>
              <p>
                <strong>When inflation is running above your savings yield:</strong>
                cash savings after the buffer are losing purchasing power, so
                the case for a diversified investment plan grows. The emergency
                buffer itself stays in cash either way.
              </p>
              <p>
                <strong>Always:</strong> model the numbers before reacting.
                Inflation adjusts what a savings goal costs, interest rates
                adjust what a loan costs. Put your own figures into a
                projection instead of guessing from headlines.
              </p>
            </>
          ),
        },
        {
          id: "mistakes",
          title: "Mistakes people make with market news",
          body: (
            <ul>
              <li>
                <strong>Re-arranging the whole plan on one headline.</strong> A
                single rate move rarely changes a 24-month savings plan.
              </li>
              <li>
                <strong>Confusing nominal yield with real growth.</strong> A 6%
                deposit at 5% inflation preserves money; it does not double it.
              </li>
              <li>
                <strong>Chasing deposit yields across banks for tiny gaps.</strong>{" "}
                The difference is usually less than the disruption.
              </li>
              <li>
                <strong>Ignoring personal inflation.</strong> The national number
                is an average; your basket can deviate for years.
              </li>
            </ul>
          ),
        },
      ]}
      faq={[
        {
          q: "Do high interest rates mean I should pay off debt before saving?",
          a: "Usually yes for high-rate debt. When borrowing costs more than saving earns, clearing debt is the best guaranteed return available. Model both paths with your real numbers first.",
        },
        {
          q: "How does inflation affect a savings goal?",
          a: "A goal set in today's prices buys less in the future. If you expect 5% inflation, a Rs. 100,000 target cost in two years would need roughly Rs. 110,000 in today's-money planning to buy the same thing.",
        },
        {
          q: "Should I keep my emergency fund in cash during high inflation?",
          a: "Yes. The buffer's job is to be there in a crisis, not to beat inflation. Keep it liquid and low-risk; the money you can tolerate losing is what fights inflation elsewhere.",
        },
        {
          q: "What should I do if savings yields are dropping?",
          a: "Recheck deposit terms and lock what you need, then focus on the amount you save rather than the yield you chase. Compounding on a higher monthly amount beats a slightly better rate on a small balance.",
        },
      ]}
      related={[
        { href: "/personal-finance/year-from-now-calculator", label: "Year from now calculator" },
        { href: "/personal-finance/savings-goal-calculator", label: "Savings goal calculator" },
        { href: "/personal-finance/emergency-fund-calculator", label: "Emergency fund calculator" },
      ]}
    />
  );
}