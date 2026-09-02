import type { MetadataRoute } from "next";

const BASE_URL = "https://makesensebusiness.vercel.app";

/**
 * Last-modified dates are stable content milestones rather than the build
 * time, so search engines see meaningful freshness signals on each crawl.
 */
const LAST_MODIFIED = new Date("2026-09-01");

const CALCULATORS = [
  "business-calculator",
  "profit-calculator",
  "revenue-calculator",
  "break-even-calculator",
  "roi-calculator",
  "pricing-calculator",
  "cash-flow-calculator",
  "startup-runway-calculator",
  "saas-calculator",
  "ltv-cac-calculator",
  "tax-calculator",
  "vat-calculator",
];

const GUIDES = [
  "how-to-calculate-startup-runway",
  "how-to-estimate-a-companys-revenue",
  "how-to-calculate-ltv-cac",
];

const PERSONAL_FINANCE = [
  "salary-calculator",
  "savings-goal-calculator",
  "income-expense-calculator",
  "emergency-fund-calculator",
];

const STATIC_DOCS = [
  { path: "/calculators", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/personal-finance", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/guides", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/manual", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...STATIC_DOCS.map((doc) => ({
      url: `${BASE_URL}${doc.path}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: doc.changeFrequency,
      priority: doc.priority,
    })),
    ...CALCULATORS.map((slug) => ({
      url: `${BASE_URL}/${slug}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...GUIDES.map((slug) => ({
      url: `${BASE_URL}/guides/${slug}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...PERSONAL_FINANCE.map((slug) => ({
      url: `${BASE_URL}/personal-finance/${slug}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}