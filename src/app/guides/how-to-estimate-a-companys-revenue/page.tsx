import type { Metadata } from "next";
import { GuideShell } from "@/components/guides/guide-shell";

export const metadata: Metadata = {
  title: "How Much Is a Company Making? 7 Ways to Estimate Revenue",
  description:
    "Estimate any company's revenue without internal numbers - from public filings, pricing, headcount, traffic and unit economics. A practical walkthrough for founders and analysts.",
  alternates: { canonical: "/guides/how-to-estimate-a-companys-revenue" },
};

export default function EstimateRevenueGuide() {
  return (
    <GuideShell
      path="/guides/how-to-estimate-a-companys-revenue"
      title="How much is a company making? 7 ways to estimate revenue"
      desc="You can often get a surprisingly good estimate of a company's revenue without internal numbers. This guide walks through seven practical methods - from public filings to pricing times volume - and when each one works."
      sections={[
        {
          id: "why-it-matters",
          title: "Why estimate revenue at all",
          body: (
            <>
              <p>
                Knowing roughly what a company earns drives real decisions:
                whether to acquire it, partner with it, compete with it,
                or invest in it. Private companies do not publish revenue, and
                even public ones only report in quarterly chunks - so the
                numbers in between are estimates.
              </p>
              <p>
                No estimate is exact. The goal is a defensible range wide
                enough to be honest and narrow enough to be useful.
              </p>
            </>
          ),
        },
        {
          id: "public-filings",
          title: "1. Public financial statements",
          body: (
            <>
              <p>
                If the company files with a securities regulator, revenue is
                published directly. For listed companies, check the annual
                report and quarterly filings - revenue is a headline line item
                you can read off without any estimation.
              </p>
              <p>
                For private companies, some jurisdictions require simplified
                filings (such as company registers or director reports) that
                mention turnover. It is worth a search before assuming the
                figure is hidden.
              </p>
            </>
          ),
        },
        {
          id: "price-volume",
          title: "2. Price × estimated customers",
          body: (
            <>
              <p>
                For a product business the calculation is straightforward:
              </p>
              <p>
                <strong>Revenue = average price × estimated units sold</strong>
              </p>
              <ul>
                <li>Estimate the average selling price (median price, adjusted for discounting).</li>
                <li>Estimate how many units they move - from reviews, production capacity, distribution footprint, or market share reports.</li>
                <li>Multiply, then sanity-check the direction against any public hints.</li>
              </ul>
              <p>
                For subscription businesses, the version is{" "}
                <strong>revenue = paying customers × average revenue per user
                (ARPU)</strong>. Headcount on LinkedIn, support volume, or job
                listings can hint at customer count.
              </p>
            </>
          ),
        },
        {
          id: "headcount",
          title: "3. Headcount and revenue-per-employee",
          body: (
            <>
              <p>
                Existing public companies publish{" "}
                <strong>revenue per employee</strong>, and the ratio is fairly
                stable within an industry:
              </p>
              <ul>
                <li>Software companies often run Rs. 100-300 lakh per employee per year.</li>
                <li>Agencies and services typically run lower, near Rs. 40-80 lakh.</li>
                <li>Marketplaces and capital-light models can run far higher.</li>
              </ul>
              <p>
                Count employees from LinkedIn or the team page, multiply by the
                industry ratio, and you have a rough but credible band.
              </p>
            </>
          ),
        },
        {
          id: "traffic",
          title: "4. Traffic × conversion × average order value",
          body: (
            <>
              <p>
                For consumer and e-commerce businesses, estimate visits with a
                traffic tool, then chain the funnel:
              </p>
              <p>
                <strong>Revenue = monthly visits × conversion rate × average
                order value × 12</strong>
              </p>
              <p>
                Typical online conversion rates sit between 1% and 3% for
                retail. This method is weakest for offline, enterprise or
                marketplace businesses - use it where visits roughly equal
                purchasers at different stages.
              </p>
            </>
          ),
        },
        {
          id: "saas-arr",
          title: "5. SaaS ARR from public signals",
          body: (
            <>
              <p>
                Subscription products leak signals. Job ads for support staff,
                review counts on product marketplaces, published customer logos,
                and funding rounds combined with typical growth trajectories all
                hint at scale.
              </p>
              <p>
                Multiply your best guess of paying customers by the{" "}
                <strong>average revenue per account</strong> for their product
                tier. Public benchmark data for tools like this makes the ARPU
                guess much more defensible.
              </p>
            </>
          ),
        },
        {
          id: "benchmarks",
          title: "6. Industry benchmarks and rules of thumb",
          body: (
            <>
              <p>
                Funding data gives one of the sharpest tools:{" "}
                <strong>implied valuation ÷ a typical revenue multiple</strong>.
                A company that raised at a Rs. 30 crore valuation and trades in
                an industry doing 5-8× revenue is therefore in the Rs. 4-6 crore
                range.
              </p>
              <p>
                Pair that with published averages for their industry - margins,
                revenue per employee, conversion rates - and cross-check the two
                independent estimates land in the same band.
              </p>
            </>
          ),
        },
        {
          id: "synthesis",
          title: "7. Triangulate and range",
          body: (
            <>
              <p>
                Never trust a single method. Run at least two independent ones
                and keep the output as a range. When price × volume says Rs. 5
                crore and revenue-per-employee says Rs. 4-7 crore, you have a
                credible band - when they disagree by an order of magnitude, one
                of your inputs is wrong.
              </p>
              <p>
                Write down assumptions explicitly. A range you can defend beats
                a precise-looking guess you cannot.
              </p>
            </>
          ),
        },
        {
          id: "use-calculators",
          title: "Turn the estimate into a projection",
          body: (
            <>
              <p>
                Once you have a revenue figure, model where it goes. Our free{" "}
                <strong>revenue projection calculator</strong> compounds it
                forward from a monthly growth rate; the{" "}
                <strong>profitability calculator</strong> shows how much of it
                becomes profit after costs.
              </p>
            </>
          ),
        },
      ]}
      faq={[
        {
          q: "How can I estimate a private company's revenue?",
          a: "Triangulate: check any public filings, multiply estimated units or customers by average price, compare headcount against industry revenue-per-employee, and for funded companies divide implied valuation by a typical revenue multiple. Always keep the answer a range.",
        },
        {
          q: "What is the rule-of-thumb revenue per employee?",
          a: "It varies by industry. Capital-light software often runs Rs. 100-300 lakh per employee per year, services and agencies lower at Rs. 40-80 lakh, and marketplaces higher. Use a ratio from your company's own industry.",
        },
        {
          q: "Can traffic alone tell me revenue?",
          a: "No. Visits must be multiplied by conversion rate and average order value. For retail online businesses the chain is reasonably reliable; for enterprise or marketplace models it understates or misleads.",
        },
        {
          q: "How do funding rounds help estimate revenue?",
          a: "A disclosed valuation combined with the industry's typical revenue multiple back-solves to rough revenue. For example, a Rs. 30 crore valuation divided by a 5-8× multiple suggests Rs. 4-6 crore of revenue.",
        },
      ]}
      related={[
        { href: "/revenue-calculator", label: "Revenue projection calculator" },
        { href: "/business-calculator", label: "Profitability calculator" },
        { href: "/saas-calculator", label: "SaaS metrics calculator" },
      ]}
    />
  );
}