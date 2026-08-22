import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MakeSense Business Model Simulator",
    short_name: "MakeSense",
    description:
      "Model revenue, costs, cash flow, tax and financing for your business. Runs entirely on your device.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f5f5f7",
    theme_color: "#0a84ff",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
