"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { usePreferences } from "@/stores/preferences";
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
  Check,
  ChevronRight,
} from "lucide-react";

interface MenuState {
  x: number;
  y: number;
}

interface SubMenuState {
  id: string;
  x: number;
  y: number;
}

function isTextTarget(t: EventTarget | null): boolean {
  if (!(t instanceof Element)) return false;
  return Boolean(
    t.closest("input, textarea, select, [contenteditable], iframe")
  );
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  hint?: string;
}

interface MenuGroup {
  id: string;
  label: string;
  items: Omit<MenuItem, "id">[];
}

/**
 * Branded right-click menu, customizable from Settings. Falls back to the
 * native menu over text fields and iframes, and honours the user's choices of
 * which items and groups to show. Grouped items expand into submenus.
 */
export function ContextMenu() {
  const router = useRouter();
  const itemPrefs = usePreferences((s) => s.contextMenu.disabledItems);
  const menuEnabled = usePreferences((s) => s.contextMenu.enabled);
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [submenu, setSubmenu] = useState<SubMenuState | null>(null);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  const disabledItems = useCallback(
    (id: string) => !itemPrefs.includes(id),
    [itemPrefs]
  );

  useEffect(() => {
    function onContext(e: MouseEvent) {
      if (!menuEnabled) return;
      if (isTextTarget(e.target)) return;
      e.preventDefault();
      setCopied(false);
      setSubmenu(null);
      const pad = 8;
      const w = 232;
      const h = 260;
      setMenu({
        x: Math.min(e.clientX, window.innerWidth - w - pad),
        y: Math.min(e.clientY, window.innerHeight - h - pad),
      });
    }
    function close() {
      setMenu(null);
      setSubmenu(null);
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
  }, [menuEnabled]);

  useEffect(() => {
    if (!menu) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (submenu) setSubmenu(null);
        else setMenu(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu, submenu]);

  const run = useCallback(
    (action: () => void) => () => {
      action();
      setMenu(null);
      setSubmenu(null);
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

  const simple: MenuItem[] = [
    {
      id: "back",
      label: "Back",
      icon: <ArrowLeft className="h-3.5 w-3.5" />,
      action: () => router.back(),
      hint: "Alt+←",
    },
    {
      id: "forward",
      label: "Forward",
      icon: <ArrowRight className="h-3.5 w-3.5" />,
      action: () => router.forward(),
      hint: "Alt+→",
    },
    {
      id: "top",
      label: "Scroll to top",
      icon: <ArrowUp className="h-3.5 w-3.5" />,
      action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    },
    {
      id: "copyLink",
      label: copied ? "Link copied" : "Copy page link",
      icon: copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />,
      action: () => void copyLink(),
    },
    {
      id: "print",
      label: "Print page",
      icon: <Printer className="h-3.5 w-3.5" />,
      action: () => window.print(),
      hint: "Ctrl+P",
    },
  ];

  const groups: MenuGroup[] = [
    {
      id: "open",
      label: "Open",
      items: [
        { label: "Dashboard", icon: <LayoutDashboard className="h-3.5 w-3.5" />, action: () => router.push("/dashboard") },
        { label: "Goals", icon: <Target className="h-3.5 w-3.5" />, action: () => router.push("/goals") },
        { label: "New model", icon: <Calculator className="h-3.5 w-3.5" />, action: () => router.push("/models?new=1") },
        { label: "User manual", icon: <BookOpen className="h-3.5 w-3.5" />, action: () => router.push("/manual") },
        { label: "Settings", icon: <SettingsDots className="h-3.5 w-3.5" />, action: () => router.push("/settings") },
      ],
    },
  ];

  const visibleSimple = simple.filter((i) => disabledItems(i.id));
  const visibleGroups = groups.filter((g) =>
    g.items.some((item) => disabledItems(`${g.id}:${item.label}`))
  );

  function openSubmenu(id: string, e: React.MouseEvent) {
    const group = groups.find((g) => g.id === id);
    if (!group) return;
    const count = group.items.filter((it) => disabledItems(`${id}:${it.label}`)).length;
    const subW = 208;
    const subH = count * 32 + 12;
    const rect = e.currentTarget.getBoundingClientRect();
    let x = rect.right;
    let y = rect.top;
    if (x + subW > window.innerWidth - 8) {
      x = rect.left - subW;
    }
    y = Math.min(y, window.innerHeight - subH - 8);
    setSubmenu({ id, x, y });
  }

  function closeWithDelay() {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setSubmenu(null);
    }, 160);
  }
  function cancelClose() {
    window.clearTimeout(closeTimer.current);
  }

  return (
    <>
      <div
        ref={ref}
        role="menu"
        aria-label="Page actions"
        style={{ left: menu.x, top: menu.y }}
        className="animate-pop-in fixed z-[95] w-56 overflow-hidden rounded-[var(--radius-base)] border border-border bg-surface py-1 shadow-pop"
        onClick={(e) => e.stopPropagation()}
        onMouseLeave={closeWithDelay}
      >
        {visibleSimple.map((item) => (
          <button
            key={item.id}
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
        ))}

        {visibleSimple.length > 0 && visibleGroups.length > 0 ? (
          <div role="separator" className="my-1 h-px bg-border" />
        ) : null}

        {visibleGroups.map((group) => (
          <button
            key={group.id}
            type="button"
            role="menuitem"
            onClick={() => {}}
            onMouseEnter={(e) => openSubmenu(group.id, e)}
            className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-xs transition-colors hover:bg-surface-secondary"
          >
            <span className="flex-1">{group.label}</span>
            <ChevronRight className="h-3.5 w-3.5 text-muted" />
          </button>
        ))}

        {visibleGroups.length > 0 ? (
          <div role="separator" className="my-1 h-px bg-border" />
        ) : null}

        <p className="px-3 pb-1 pt-0.5 text-[10px] leading-relaxed text-muted">
          MakeSense: numbers that make sense
        </p>
      </div>

      {submenu ? (
        <div
          role="menu"
          aria-label={submenu.id}
          style={{ left: submenu.x, top: submenu.y }}
          onMouseEnter={cancelClose}
          onMouseLeave={closeWithDelay}
          className="animate-pop-in fixed z-[96] w-52 overflow-hidden rounded-[var(--radius-base)] border border-border bg-surface py-1 shadow-pop"
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
        >
          {(() => {
            const group = groups.find((g) => g.id === submenu.id);
            if (!group) return null;
            return group.items
              .filter((item) => disabledItems(`${submenu.id}:${item.label}`))
              .map((item) => (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  onClick={run(item.action)}
                  className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-xs transition-colors hover:bg-surface-secondary"
                >
                  <span className="text-muted">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                </button>
              ));
          })()}
        </div>
      ) : null}
    </>
  );
}

function SettingsDots({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
