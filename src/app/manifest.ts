import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MakeSense - Money & Business Calculators",
    short_name: "MakeSense",
    description:
      "Free business and personal finance calculators that run entirely on your device: revenue, runway, salary, savings and more.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#f5f5f7",
    theme_color: "#0a84ff",
    lang: "en",
    dir: "ltr",
    categories: ["business", "finance", "productivity"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
    shortcuts: [
      {
        name: "New model",
        short_name: "New model",
        description: "Create a business model from a template or blank slate.",
        url: "/models?new=1",
        icons: [{ src: "/icons/shortcut-new.png", sizes: "96x96" }],
      },
      {
        name: "Dashboard",
        short_name: "Dashboard",
        description: "See the health of every business model at a glance.",
        url: "/dashboard",
        icons: [{ src: "/icons/shortcut-dashboard.png", sizes: "96x96" }],
      },
      {
        name: "Compare models",
        short_name: "Compare",
        description: "Put alternative business models side by side.",
        url: "/compare",
        icons: [{ src: "/icons/shortcut-compare.png", sizes: "96x96" }],
      },
      {
        name: "Break-even calculator",
        short_name: "Break-even",
        description: "Units and revenue needed to cover all costs.",
        url: "/break-even-calculator",
        icons: [{ src: "/icons/shortcut-calculator.png", sizes: "96x96" }],
      },
      {
        name: "Savings goal calculator",
        short_name: "Savings goal",
        description: "How long until you can afford what you want.",
        url: "/personal-finance/savings-goal-calculator",
        icons: [{ src: "/icons/shortcut-calculator.png", sizes: "96x96" }],
      },
    ],
  };
}
