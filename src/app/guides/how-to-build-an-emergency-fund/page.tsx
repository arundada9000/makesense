import type { Metadata } from "next";
import { GuideShell } from "@/components/guides/guide-shell";

export const metadata: Metadata = {
  title: "How to Build an Emergency Fund - How Much and How Fast",
  description:
    "Build an emergency fund the practical way: the right target in months of expenses, how to math it out, and the order that actually works.",
  alternates: { canonical: "/guides/how-to-build-an-emergency-fund" },
};

export default function EmergencyFundGuide() {
  return (
    <GuideShell
      path="/guides/how-to-build-an-emergency-fund"
      title="How to build an emergency fund"
      desc="An emergency fund is cash you can touch without penalty when something expensive and unexpected happens. This guide explains how big it should be, how to calculate the target, and the step order that makes the habit stick."
      sections={[
        {
          id: "why",
          title: "Why the fund comes first",
          body: (
            <>
              <p>
                <strong>An emergency fund exists so an emergency does not become
                a debt problem.</strong> A laptop dies, a car needs a repair, a
                job ends: the fund pays for it directly instead of pushing the
                cost onto a credit card at 30%+ a year.
              </p>
              <p>
                It also does quiet work for the rest of your money. When the
                buffer exists, you can invest without panic-selling, take a
                slightly riskier job, and start a business knowing rent is
                covered. Every other part of personal finance is easier with
                this base in place.
              </p>
            </>
          ),
        },
        {
          id: "how-much",
          title: "How much: the months formula",
          body: (
            <>
              <p>
                The standard target is{" "}
                <strong>3 to 6 months of essential living expenses</strong>,
                where expenses means rent, food, transport, utilities and debt
                minimums - not dining out and subscriptions.
              </p>
              <p>
                The formula is: <strong>target = monthly essentials x months of
                cover</strong>. If your essentials are Rs. 42,000 a month and you
                want 6 months, the goal is Rs. 252,000.
              </p>
              <p>
                Raise the multiplier when your income is irregular:
                <strong> 6 to 12 months</strong> makes sense for freelancers,
                commission earners and two-income households with one unstable
                job, because the window to find a replacement is longer.
              </p>
            </>
          ),
        },
        {
          id: "order",
          title: "The order that actually works",
          body: (
            <>
              <ul>
                <li>
                  <strong>Start small, start fast.</strong> A first goal of one
                  month of expenses is better than a six-month goal that stalls
                  for two years.
                </li>
                <li>
                  <strong>Automate the transfer.</strong> Money that moves to a
                  separate account on payday is savings; money that waits for
                  willpower is spending.
                </li>
                <li>
                  <strong>Use a separate account.</strong> Physically apart from
                  your spending account, ideally a low-risk option you can reach
                  within a day or two.
                </li>
                <li>
                  <strong>Top it back up first.</strong> When you use the fund,
                  restoring it becomes the first priority before new savings
                  goals.
                </li>
              </ul>
              <p>
                A useful trick: treat the emergency fund as a monthly bill. If
                the transfer happens on the first of the month like rent, it
                rarely gets skipped.
              </p>
            </>
          ),
        },
        {
          id: "mistakes",
          title: "Common mistakes to avoid",
          body: (
            <ul>
              <li>
                <strong>Counting investments as the buffer.</strong> Shares and
                the emergency fund serve different purposes; selling shares at a
                bad time costs you twice.
              </li>
              <li>
                <strong>Mixing the fund with savings goals.</strong> A single pot
                for emergencies plus a MacBook means one surprise cancels the
                MacBook.
              </li>
              <li>
                <strong>Setting the target once and never re-running it.</strong>
                When rent and food costs rise, the target rises with them.
              </li>
              <li>
                <strong>Oversaving into cash forever.</strong> Six to twelve
                months is plenty; beyond that the same rupees are usually better
                working somewhere else.
              </li>
            </ul>
          ),
        },
      ]}
      howToSteps={[
        {
          name: "List your essential monthly costs",
          text: "Rent or mortgage, food, transport, utilities, insurance premiums and minimum debt payments. Ignore non-essentials.",
        },
        {
          name: "Pick your months of cover",
          text: "3 to 6 for stable income, 6 to 12 for irregular income or a single-income household.",
        },
        {
          name: "Multiply them",
          text: "Essentials x months of cover = your target. For example, Rs. 42,000 x 6 = Rs. 252,000.",
        },
        {
          name: "Set a monthly amount",
          text: "Divide the gap between what you have and the target by how much you can save each month, then automate it.",
        },
        {
          name: "Recheck every six months",
          text: "Recompute essentials and adjust the target when your cost of living changes.",
        },
      ]}
      faq={[
        {
          q: "How much should be in an emergency fund?",
          a: "3 to 6 months of essential expenses for stable income, 6 to 12 months for freelancers or those with irregular income, calculated as essentials x months of cover.",
        },
        {
          q: "Is the emergency fund the same as savings?",
          a: "No. The emergency fund is specifically for unexpected costs and never gets spent on planned purchases. Keep it in a separate account from goal savings.",
        },
        {
          q: "Should I pay off debt before building the fund?",
          a: "Build a small starter buffer (about one month) first, then pay off high-interest debt, then grow the buffer to full size. Skipping the buffer entirely makes any surprise push you back into debt.",
        },
        {
          q: "Where should I keep the emergency fund?",
          a: "Somewhere low-risk and quickly reachable, like a savings account or fixed deposit with short lock-in - not invested in shares or locked away for years.",
        },
      ]}
      related={[
        { href: "/personal-finance/emergency-fund-calculator", label: "Emergency fund calculator" },
        { href: "/personal-finance/income-expense-calculator", label: "Income and expenses calculator" },
        { href: "/personal-finance/savings-goal-calculator", label: "Savings goal calculator" },
      ]}
    />
  );
}