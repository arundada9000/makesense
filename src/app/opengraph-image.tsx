import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "MakeSense Business Model Simulator";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0d0d10 0%, #1c1c22 100%)",
          padding: 72,
          color: "#f5f5f7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#0a84ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            M
          </div>
          <span style={{ fontSize: 30, fontWeight: 600 }}>MakeSense</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: 900,
            }}
          >
            Know what your business numbers actually say
          </span>
          <span style={{ fontSize: 28, color: "#a1a1aa" }}>
            Revenue, costs, cash flow, tax and financing modeled on your device.
          </span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {["Profit", "Cash flow", "Break-even", "Scenarios", "Tax"].map((tag) => (
            <span
              key={tag}
              style={{
                display: "flex",
                fontSize: 22,
                padding: "8px 20px",
                borderRadius: 999,
                border: "1px solid #3f3f46",
                color: "#d4d4d8",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    ),
    size
  );
}
