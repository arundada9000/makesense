import type { Metadata } from "next";
import { GuideShell } from "@/components/guides/guide-shell";

export const metadata: Metadata = {
  title: "Money Dos and Don'ts - the Habits That Actually Move the Needle",
  description:
    "Personal finance dos and don'ts in one plain list: what to automate, what to avoid, and the rules of thumb that keep small choices from becoming big problems.",
  alternates: { canonical: "/guides/financial-dos-and-donts" },
};

export default function DosAndDontsGuide() {
  return (
    <GuideShell
      path="/guides/financial-dos-and-donts"
      title="Money dos and don'ts"
      desc="Most money outcomes come from a short list of repeated habits, not clever tricks. This is that list: what to do on autopilot, what to stop entirely, and a few rules of thumb for the decisions in between."
      sections={[
        {
          id: "dos",
          title: "The dos",
          body: (
            <>
              <ul>
                <li>
                  <strong>Do pay yourself first.</strong> Move savings out of the
                  spending account on payday, before bills and before
                  discretionary buys. What you never see, you never miss.
                </li>
                <li>
                  <strong>Do automate everything that repeats.</strong> Transfers,
                  bill payments, investing contributions, debt minimums: if it
                  happens monthly, let the calendar happen automatically.
                </li>
                <li>
                  <strong>Do keep an emergency buffer.</strong> One month of
                  essentials to start, three to six eventually. It is the reason
                  every other rule never has to break.
                </li>
                <li>
                  <strong>Do run your real numbers.</strong> &quot;Save a bit more&quot; is
                  not a plan. Calculate your surplus, pick a target and a
                  monthly amount, and write both down.
                </li>
                <li>
                  <strong>Do review once a quarter.</strong> Subscriptions you
                  forgot, prices that rose, salary that changed. Ten minutes a
                  quarter catches most drift.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "donts",
          title: "The don'ts",
          body: (
            <>
              <ul>
                <li>
                  <strong>Don&apos;t carry high-interest debt into a savings plan.</strong>{" "}
                  A 30% credit card balance destroys most gains from saving.
                  Clear it before aggressive saving.
                </li>
                <li>
                  <strong>Don&apos;t make money decisions tired or angry.</strong>
                  Impulse purchases, late-night trades and &quot;treat yourself&quot; buys
                  all come from the same low-attention state.
                </li>
                <li>
                  <strong>Don&apos;t mix business and personal money.</strong> One
                  account, one card. Mixed money hides how the business is
                  actually doing.
                </li>
                <li>
                  <strong>Don&apos;t chase get-rich promises.</strong> Fixed returns,
                  urgency, guaranteed income and &quot;only for today&quot; are the same
                  pattern every time.
                </li>
                <li>
                  <strong>Don&apos;t let lifestyle grow with every raise.</strong>
                  Promotions are how savings rates jump; the raise you spend is
                  the raise you never see again.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "rules-of-thumb",
          title: "Rules of thumb that hold up",
          body: (
            <ul>
              <li>
                <strong>50/30/20</strong> - about 50% of income to needs, 30% to
                wants, 20% to saving and debt. A starting layout, not a law.
              </li>
              <li>
                <strong>Emergency fund = 3 to 6 months of essentials.</strong>{" "}
                Irregular income? Push to 6 to 12.
              </li>
              <li>
                <strong>Big fixed costs at a third of income.</strong> Housing
                above roughly a third squeezes everything else.
              </li>
              <li>
                <strong>Wait 24 hours before buys over a small threshold.</strong>{" "}
                The number differs per person; the waiting period is what does
                the work.
              </li>
              <li>
                <strong>One savings goal at a time.</strong> Two big goals
                progress slower than one, because motivation is divisible.
              </li>
            </ul>
          ),
        },
        {
          id: "order",
          title: "Putting it in order",
          body: (
            <ol>
              <li>Build the starter emergency buffer (one month of essentials).</li>
              <li>Clear high-interest debt while still saving the buffer&apos;s minimum.</li>
              <li>Grow the buffer to full size with a fixed monthly transfer.</li>
              <li>Start the first real savings goal with the same automation.</li>
              <li>Review every quarter; repeat.</li>
            </ol>
          ),
        },
      ]}
      faq={[
        {
          q: "What is the 50/30/20 rule?",
          a: "It splits after-tax income into 50% for needs, 30% for wants and 20% for savings and debt. It is a starting structure, not a strict law, and the percentages can flex around your actual costs.",
        },
        {
          q: "Should I save before or after paying off debt?",
          a: "Both, but in sequence: keep saving a small starter buffer while paying minimums, then focus the extra money on high-interest debt, then return to full saving.",
        },
        {
          q: "How do I stop impulse spending?",
          a: "The most reliable method is a forced waiting period plus separate spending money: a fixed amount in the spending account each month, and a 24-hour rule for anything above it.",
        },
        {
          q: "Do I need a budget?",
          a: "You need an agreement with yourself about the numbers. A full zero-based budget works for some; for others, automation plus a savings rate does the same job with far less effort.",
        },
      ]}
      related={[
        { href: "/personal-finance/income-expense-calculator", label: "Income and expenses calculator" },
        { href: "/personal-finance/emergency-fund-calculator", label: "Emergency fund calculator" },
        { href: "/personal-finance/savings-goal-calculator", label: "Savings goal calculator" },
      ]}
    />
  );
}