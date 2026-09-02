import type { Metadata } from "next";
import { GuideShell } from "@/components/guides/guide-shell";

export const metadata: Metadata = {
  title: "How to Calculate LTV:CAC - Formula, Example & the 3:1 Rule",
  description:
    "Calculate LTV:CAC for a subscription business: customer lifetime value, acquisition cost, payback period and why 3:1 is the common health threshold. Worked example included.",
  alternates: { canonical: "/guides/how-to-calculate-ltv-cac" },
};

export default function CalculateLtvCacGuide() {
  return (
    <GuideShell
      path="/guides/how-to-calculate-ltv-cac"
      title="How to calculate LTV:CAC for a subscription business"
      desc="LTV:CAC compares what a customer is worth over their lifetime with what it costs to acquire them. This guide covers the formula, a worked example, payback period, and why 3:1 is the usual target."
      sections={[
        {
          id: "what-it-means",
          title: "What LTV:CAC measures",
          body: (
            <>
              <p>
                <strong>Customer lifetime value (LTV)</strong> is the profit a
                customer contributes over the whole time they stay.{" "}
                <strong>Customer acquisition cost (CAC)</strong> is everything
                spent to win that customer. The ratio tells you whether the
                economics of acquiring customers work.
              </p>
              <p>
                A ratio below <strong>1:1</strong> means every customer is a net
                loss. The widely cited healthy floor is <strong>3:1</strong>{" "}
                - enough to fund growth and cushioned against estimates being
                optimistic.
              </p>
            </>
          ),
        },
        {
          id: "ltv-formula",
          title: "The LTV formula",
          body: (
            <p>
              <strong>
                LTV = average revenue per user (ARPU) × gross margin ÷ monthly
                churn rate
              </strong>
            </p>
          ),
        },
        {
          id: "worked-example",
          title: "Worked example",
          body: (
            <>
              <ul>
                <li>ARPU (monthly revenue per customer): Rs. 1,500</li>
                <li>Gross margin: 70%</li>
                <li>Monthly churn: 4%</li>
                <li>CAC: Rs. 6,000</li>
              </ul>
              <p>
                LTV = 1,500 × 0.70 ÷ 0.04 = Rs. 26,250
              </p>
              <p>
                LTV:CAC = 26,250 ÷ 6,000 = <strong>4.4:1</strong>
              </p>
              <p>
                Payback = CAC ÷ contribution per month = 6,000 ÷ 1,050 ={" "}
                <strong>5.7 months</strong> - recovered in under half a year,
                which comfortably supports reinvesting in acquisition.
              </p>
            </>
          ),
        },
        {
          id: "payback",
          title: "Why payback matters as much as the ratio",
          body: (
            <>
              <p>
                A great ratio can still starve you of cash if payback is long.
                Every customer acquired ties up acquisition spend until their
                contributions recover it.{" "}
                <strong>Under 12 months is the usual target</strong> for
                self-funded growth, because cash recovered within a year funds
                the next cohort of customers.
              </p>
            </>
          ),
        },
        {
          id: "mistakes",
          title: "Common mistakes",
          body: (
            <ul>
              <li>
                <strong>Using revenue instead of gross margin in LTV.</strong>{" "}
                Hosting and support costs are real; revenue-only LTV overstates
                customer worth.
              </li>
              <li>
                <strong>Understating CAC.</strong> Sales salaries and tooling
                belong in acquisition cost, not just ad spend.
              </li>
              <li>
                <strong>Assuming churn is constant.</strong> Early cohorts
                usually churn faster than the blended average.
              </li>
              <li>
                <strong>Chasing a very high ratio.</strong> A 10:1 ratio often
                means you are underspending on growth the market would support.
              </li>
            </ul>
          ),
        },
      ]}
      howToSteps={[
        {
          name: "Calculate ARPU",
          text: "Monthly recurring revenue divided by the number of customers. Exclude one-time setup fees.",
        },
        {
          name: "Estimate gross margin",
          text: "The percentage of revenue left after serving the customer - hosting, support, payment fees, delivery.",
        },
        {
          name: "Find monthly churn",
          text: "Customers lost in a month divided by customers at the start of the month. At 4% churn, the average customer stays about 25 months.",
        },
        {
          name: "Compute LTV",
          text: "ARPU × gross margin ÷ churn. For Rs. 1,500 × 0.70 ÷ 0.04 = Rs. 26,250.",
        },
        {
          name: "Compute CAC",
          text: "All acquisition spend in a period, including sales salaries, divided by new customers won in that period.",
        },
        {
          name: "Divide LTV by CAC",
          text: "The ratio. Also divide CAC by monthly contribution to get the payback period in months.",
        },
      ]}
      faq={[
        {
          q: "What is the LTV:CAC formula?",
          a: "LTV = ARPU × gross margin ÷ monthly churn. LTV:CAC divides that LTV by customer acquisition cost. Example: Rs. 26,250 LTV ÷ Rs. 6,000 CAC = 4.4:1.",
        },
        {
          q: "Is 3:1 the only good LTV:CAC ratio?",
          a: "Below 3:1 most businesses struggle to fund growth from their own economics, but far above it can mean underspending on sales. The right number depends on your industry and cash position.",
        },
        {
          q: "What is a good CAC payback period?",
          a: "Under 12 months is the typical target for self-funded growth so recovered cash can finance the next cohort. Longer payback can be fine with external capital.",
        },
        {
          q: "Should LTV use revenue or gross margin?",
          a: "Gross margin. Revenue-only LTV overstates what a customer is worth because serving them costs money.",
        },
        {
          q: "How does churn affect LTV?",
          a: "LTV is inversely proportional to churn: halving monthly churn doubles LTV. It is the single most sensitive input in the formula.",
        },
      ]}
      related={[
        { href: "/ltv-cac-calculator", label: "LTV:CAC calculator" },
        { href: "/saas-calculator", label: "SaaS metrics calculator" },
        { href: "/revenue-calculator", label: "Revenue projection calculator" },
      ]}
    />
  );
}