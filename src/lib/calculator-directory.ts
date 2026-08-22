export interface CalculatorEntry {
  slug: string;
  name: string;
  tagline: string;
  question: string;
}

/** Single source of truth for the calculator directory used across pages. */
export const CALCULATOR_DIRECTORY: CalculatorEntry[] = [
  {
    slug: "/business-calculator",
    name: "Business profitability",
    tagline: "Full profit and loss snapshot",
    question: "Will this business make money at all?",
  },
  {
    slug: "/profit-calculator",
    name: "Profit margin",
    tagline: "Gross, operating and net margins",
    question: "How much of each sale do I keep?",
  },
  {
    slug: "/revenue-calculator",
    name: "Revenue projection",
    tagline: "Growth-compounded monthly revenue",
    question: "What could monthly revenue become?",
  },
  {
    slug: "/break-even-calculator",
    name: "Break-even point",
    tagline: "Units and revenue to cover costs",
    question: "When do I stop losing money on every month?",
  },
  {
    slug: "/roi-calculator",
    name: "Return on investment",
    tagline: "ROI with annualized payback period",
    question: "What does this investment actually return?",
  },
  {
    slug: "/pricing-calculator",
    name: "Pricing and markup",
    tagline: "Margin-based price with markup view",
    question: "What should I charge for my product?",
  },
  {
    slug: "/cash-flow-calculator",
    name: "Cash flow forecast",
    tagline: "In, out, and ending balance by month",
    question: "Does cash stay positive through the year?",
  },
  {
    slug: "/startup-runway-calculator",
    name: "Startup runway",
    tagline: "Months of cash at current burn",
    question: "How long before the money runs out?",
  },
  {
    slug: "/saas-calculator",
    name: "SaaS metrics",
    tagline: "MRR, ARR, churn impact in one place",
    question: "How healthy is my subscription business?",
  },
  {
    slug: "/ltv-cac-calculator",
    name: "LTV:CAC ratio",
    tagline: "Lifetime value vs acquisition cost",
    question: "Do customers pay back what they cost?",
  },
  {
    slug: "/tax-calculator",
    name: "Corporate tax",
    tagline: "Taxable base with loss carryforward",
    question: "Roughly how much tax will we owe?",
  },
  {
    slug: "/vat-calculator",
    name: "VAT / GST split",
    tagline: "Inclusive and exclusive tax math",
    question: "How much of this price is actually tax?",
  },
];
