import type { MetadataRoute } from "next";

/**
 * App internals stay out of indexes; public marketing, docs and calculators
 * are open to search engines AND answer/generative engines (AEO/GEO), which
 * are listed explicitly so their crawlers need not guess.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/models", "/compare", "/settings"],
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: [
          "/",
          "/calculators",
          "/personal-finance",
          "/guides",
          "/manual",
          "/privacy",
          "/terms",
        ],
        disallow: ["/dashboard", "/models", "/compare", "/settings"],
      })),
    ],
    sitemap: "/sitemap.xml",
    host: "/",
  };
}
