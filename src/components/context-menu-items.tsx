"use client";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  LayoutDashboard,
  Target,
  BookOpen,
  Link2,
  Printer,
  Calculator,
  Settings,
  Home,
  Compass,
  LineChart,
  RefreshCcw,
  FileText,
  BarChart3,
  Boxes,
  GitCompareArrows,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export interface ContextMenuItemDef {
  id: string;
  label: string;
  icon: LucideIcon;
  hint?: string;
  action?: (router: ReturnType<typeof useRouter>, helpers: MenuHelpers) => void;
}

export interface ContextMenuGroupDef {
  id: string;
  label: string;
  items: ContextMenuItemDef[];
}

export interface MenuHelpers {
  copyLink: () => Promise<boolean>;
  getCopiedLabel: () => string;
}

/**
 * Single source of truth for the right-click menu. Both the ContextMenu
 * component and the Settings page read from here so the customization UI never
 * drifts from what actually renders.
 */
export const CONTEXT_MENU_SIMPLE: ContextMenuItemDef[] = [
  {
    id: "back",
    label: "Back",
    icon: ArrowLeft,
    hint: "Alt+←",
    action: (r) => r.back(),
  },
  {
    id: "forward",
    label: "Forward",
    icon: ArrowRight,
    hint: "Alt+→",
    action: (r) => r.forward(),
  },
  {
    id: "top",
    label: "Scroll to top",
    icon: ArrowUp,
    action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
  },
  {
    id: "reload",
    label: "Reload page",
    icon: RefreshCcw,
    hint: "Ctrl+R",
    action: () => window.location.reload(),
  },
  {
    id: "copyLink",
    label: "Copy page link",
    icon: Link2,
    action: (_r, h) => void h.copyLink(),
  },
  {
    id: "copyTitle",
    label: "Copy page title",
    icon: FileText,
    action: () =>
      void navigator.clipboard.writeText(document.title).catch(() => {}),
  },
  {
    id: "print",
    label: "Print page",
    icon: Printer,
    hint: "Ctrl+P",
    action: () => window.print(),
  },
];

export const CONTEXT_MENU_GROUPS: ContextMenuGroupDef[] = [
  {
    id: "open",
    label: "Open",
    items: [
      {
        id: "open-dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        action: (r) => r.push("/dashboard"),
      },
      {
        id: "open-goals",
        label: "Goals",
        icon: Target,
        action: (r) => r.push("/goals"),
      },
      {
        id: "open-models",
        label: "Models",
        icon: Boxes,
        action: (r) => r.push("/models"),
      },
      {
        id: "open-new-model",
        label: "New model",
        icon: Calculator,
        action: (r) => r.push("/models?new=1"),
      },
      {
        id: "open-compare",
        label: "Compare",
        icon: GitCompareArrows,
        action: (r) => r.push("/compare"),
      },
      {
        id: "open-calculators",
        label: "All calculators",
        icon: BarChart3,
        action: (r) => r.push("/calculators"),
      },
      {
        id: "open-personal-finance",
        label: "Personal finance",
        icon: LineChart,
        action: (r) => r.push("/personal-finance"),
      },
    ],
  },
  {
    id: "goto",
    label: "Go to",
    items: [
      {
        id: "goto-home",
        label: "Home",
        icon: Home,
        action: (r) => r.push("/"),
      },
      {
        id: "goto-manual",
        label: "User manual",
        icon: BookOpen,
        action: (r) => r.push("/manual"),
      },
      {
        id: "goto-guides",
        label: "Guides",
        icon: Compass,
        action: (r) => r.push("/guides"),
      },
      {
        id: "goto-settings",
        label: "Settings",
        icon: Settings,
        action: (r) => r.push("/settings"),
      },
    ],
  },
];
