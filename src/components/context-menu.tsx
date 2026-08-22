"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  LayoutDashboard,
  BookOpen,
  Link2,
  Printer,
  Calculator,
  Check,
} from "lucide-react";

interface MenuState {
  x: number;
  y: number;
}

function isTextTarget(t: EventTarget | null): boolean {
  if (!(t instanceof Element)) return false;
  return Boolean(
    t.closest("input, textarea, select, [contenteditable], iframe")
  );
}

/**
 * Branded right-click menu. Falls back to the native menu over text fields
 * and inside iframes; adds quick navigation plus copy-link elsewhere.
 */
export function ContextMenu() {
  const router = useRouter();
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onContext(e: MouseEvent) {
      if (isTextTarget(e.target)) return;
      e.preventDefault();
      setCopied(false);
      const pad = 8;
      const w = 224;
      const h = 232;
      setMenu({
        x: Math.min(e.clientX, window.innerWidth - w - pad),
        y: Math.min(e.clientY, window.innerHeight - h - pad),
      });
    }
    function close() {
      setMenu(null);
    }
    window.addEventListener("contextmenu", onContext);
    window.addEventListener("click", close);
    window.addEventListener("blur", close);
    window.addEventListener("scroll", close, true);
    return () => {
      window.removeEventListener("contextmenu", onContext);
      window.removeEventListener("click", close);
      window.removeEventListener("blur", close);
      window.removeEventListener("scroll", close, true);
    };
  }, []);

  useEffect(() => {
    if (!menu) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenu(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const run = useCallback(
    (action: () => void) => () => {
      action();
      setMenu(null);
    },
    []
  );

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      // Clipboard may be unavailable without permission.
    }
  }

  if (!menu) return null;

  const items: Array<{
    label: string;
    icon: React.ReactNode;
    action: () => void;
    hint?: string;
  }> = [
    { label: "Back", icon: <ArrowLeft className="h-3.5 w-3.5" />, action: () => router.back(), hint: "Alt+←" },
    { label: "Forward", icon: <ArrowRight className="h-3.5 w-3.5" />, action: () => router.forward(), hint: "Alt+→" },
    { label: "separator" as const, icon: null, action: () => {} },
    { label: "Open dashboard", icon: <LayoutDashboard className="h-3.5 w-3.5" />, action: () => router.push("/dashboard") },
    { label: "New model", icon: <Calculator className="h-3.5 w-3.5" />, action: () => router.push("/models?new=1") },
    { label: "User manual", icon: <BookOpen className="h-3.5 w-3.5" />, action: () => router.push("/manual") },
    { label: "separator" as const, icon: null, action: () => {} },
    { label: copied ? "Link copied" : "Copy page link", icon: copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />, action: () => void copyLink() },
    { label: "Print page", icon: <Printer className="h-3.5 w-3.5" />, action: () => window.print(), hint: "Ctrl+P" },
  ];

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="Page actions"
      style={{ left: menu.x, top: menu.y }}
      className="animate-pop-in fixed z-[95] w-56 overflow-hidden rounded-[var(--radius-base)] border border-border bg-surface py-1 shadow-pop"
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((item, i) =>
        item.label === "separator" ? (
          <div key={`sep-${i}`} role="separator" className="my-1 h-px bg-border" />
        ) : (
          <button
            key={item.label}
            type="button"
            role="menuitem"
            onClick={run(item.action)}
            className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-xs transition-colors hover:bg-surface-secondary"
          >
            <span className="text-muted">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            {item.hint ? (
              <span className="text-[10px] text-muted">{item.hint}</span>
            ) : null}
          </button>
        )
      )}
      <div role="separator" className="my-1 h-px bg-border" />
      <p className="px-3 pb-1 pt-0.5 text-[10px] leading-relaxed text-muted">
        MakeSense — numbers that make sense
      </p>
    </div>
  );
}
