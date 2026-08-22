import type { MetadataRoute } from "next";

const BASE_URL = "https://makesensebusiness.vercel.app";

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

const STATIC_DOCS = [
  { path: "/calculators", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/manual", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...STATIC_DOCS.map((doc) => ({
      url: `${BASE_URL}${doc.path}`,
      lastModified: now,
      changeFrequency: doc.changeFrequency,
      priority: doc.priority,
    })),
    ...CALCULATORS.map((slug) => ({
      url: `${BASE_URL}/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
