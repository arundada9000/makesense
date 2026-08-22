import type { MetadataRoute } from "next";

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

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: "/", lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...CALCULATORS.map((slug) => ({
      url: `/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
