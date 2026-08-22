"use client";

import { useState } from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  Wallet,
  Layers,
  Grid3X3,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface TabItem {
  id: "dashboard" | "cashflow" | "models" | "report";
  label: string;
  badge: string;
  icon: typeof LayoutDashboard;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  metrics: Array<{ label: string; value: string; hint?: string }>;
}

const TABS: TabItem[] = [
  {
    id: "dashboard",
    label: "Executive Dashboard",
    badge: "Core View",
    icon: LayoutDashboard,
    title: "Instant financial health across all active models",
    description:
      "Year-one revenue, profit waterfall, runway months, and deterministic mathematical observations computed in real-time.",
    imageSrc: "/screenshots/dashboard.png",
    imageAlt:
      "MakeSense dashboard showing model summary metrics, revenue, margin and runway",
    metrics: [
      { label: "Year 1 Revenue", value: "₹4.8M", hint: "Normalized aggregate" },
      { label: "Gross Margin", value: "84.2%", hint: "After variable costs" },
      { label: "Runway", value: "18 Months", hint: "At planned burn" },
    ],
  },
  {
    id: "cashflow",
    label: "Cash Flow & Runway",
    badge: "Deep Simulation",
    icon: Wallet,
    title: "Month-by-month cash trajectory and loan schedules",
    description:
      "Detailed inflow and outflow waterfalls, minimum cash balance points, and amortized debt servicing schedules.",
    imageSrc: "/screenshots/workspace-cashflow-dark.png",
    imageAlt:
      "Cash flow tab showing monthly inflows, outflows, running balance and debt schedule",
    metrics: [
      { label: "Break-even Month", value: "Month 7", hint: "Cumulative cash positive" },
      { label: "Lowest Cash", value: "₹320K", hint: "Month 4 buffer" },
      { label: "Debt Service", value: "₹18.4K/mo", hint: "Level payment" },
    ],
  },
  {
    id: "models",
    label: "Model Templates",
    badge: "8 Business Types",
    icon: Layers,
    title: "Pre-configured economics for SaaS, B2B, and E-commerce",
    description:
      "Start with battle-tested templates or a blank slate. Every single assumption, frequency, and tax profile is completely customizable.",
    imageSrc: "/screenshots/models.png",
    imageAlt: "Models gallery showing SaaS, enterprise, and marketplace templates",
    metrics: [
      { label: "Business Archetypes", value: "8 Built-in", hint: "SaaS to Enterprise" },
      { label: "Local Persistence", value: "IndexedDB", hint: "Zero cloud lag" },
      { label: "Precision", value: "Decimal.js", hint: "Zero float drift" },
    ],
  },
  {
    id: "report",
    label: "Shareable Reports",
    badge: "Bank & Investor Ready",
    icon: Grid3X3,
    title: "Clean printable documentation with full provenance",
    description:
      "Export structured summaries for stakeholders, bank applications, or investor due diligence with visible math and JSON backups.",
    imageSrc: "/screenshots/report.png",
    imageAlt: "Printable business model report view with full statement breakdowns",
    metrics: [
      { label: "Export Formats", value: "PDF & JSON", hint: "Versioned schemas" },
      { label: "Assumption Log", value: "100% Traceable", hint: "No hidden cells" },
      { label: "Privacy", value: "On-Device", hint: "Air-gapped safe" },
    ],
  },
];

export function ShowcasePreview() {
  const [activeTab, setActiveTab] = useState<TabItem["id"]>("dashboard");
  const activeItem = TABS.find((t) => t.id === activeTab) ?? TABS[0];

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Tab Switcher Controls */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-[var(--radius-lg)] border border-border bg-surface-secondary/80 backdrop-blur-md shadow-xs">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isSelected = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`group flex items-center gap-2 rounded-[var(--radius-base)] px-3.5 py-2 text-xs font-medium transition-all duration-200 ${
                isSelected
                  ? "bg-surface text-foreground shadow-card border border-border font-semibold"
                  : "text-muted-foreground hover:bg-surface/50 hover:text-foreground border border-transparent"
              }`}
            >
              <Icon
                className={`h-4 w-4 transition-transform duration-200 ${
                  isSelected
                    ? "text-accent scale-105"
                    : "text-muted group-hover:text-foreground"
                }`}
              />
              <span>{tab.label}</span>
              <span
                className={`hidden sm:inline-block rounded px-1.5 py-0.5 text-[10px] uppercase font-mono tracking-wider ${
                  isSelected
                    ? "bg-accent-subtle text-accent"
                    : "bg-surface-secondary text-muted"
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Window Frame */}
      <div className="relative mt-6 overflow-hidden rounded-[var(--radius-lg)] border border-border-strong bg-surface shadow-pop transition-all duration-300">
        {/* Window Topbar */}
        <div className="flex h-10 items-center justify-between border-b border-border bg-surface-secondary px-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-danger/70 shadow-xs" />
            <span className="h-3 w-3 rounded-full bg-warning/70 shadow-xs" />
            <span className="h-3 w-3 rounded-full bg-success/70 shadow-xs" />
            <span className="ml-3 font-mono text-[11px] text-muted tracking-tight">
              MakeSense: {activeItem.label}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono text-[10px] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              Engine Ready
            </span>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 rounded bg-accent-subtle px-2 py-0.5 font-mono text-[10px] font-medium text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Interactive App <ArrowRight className="h-2.5 w-2.5" />
            </Link>
          </div>
        </div>

        {/* Screenshot Viewport */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-background">
          <Image
            key={activeItem.id}
            src={activeItem.imageSrc}
            alt={activeItem.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority={activeItem.id === "dashboard"}
            className="object-cover object-top transition-opacity duration-300"
          />
        </div>

        {/* Metric Bar Footer */}
        <div className="grid grid-cols-1 divide-y border-t border-border bg-surface-secondary/70 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {activeItem.metrics.map((m, i) => (
            <div key={i} className="p-3.5 sm:px-5">
              <p className="text-[11px] font-medium text-muted uppercase tracking-wider">
                {m.label}
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-base font-semibold text-foreground">
                  {m.value}
                </span>
                {m.hint ? (
                  <span className="text-[11px] text-muted-foreground font-sans">
                    {m.hint}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Caption & Overview */}
      <div className="mt-4 flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {activeItem.title}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {activeItem.description}
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-accent transition-colors hover:underline"
        >
          Explore this view live <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
