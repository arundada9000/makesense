"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { usePreferences } from "@/stores/preferences";
import {
  CONTEXT_MENU_SIMPLE,
  CONTEXT_MENU_GROUPS,
  type ContextMenuItemDef,
  type ContextMenuGroupDef,
} from "@/components/context-menu-items";
import { Check, ChevronRight } from "lucide-react";

interface MenuState {
  x: number;
  y: number;
}

interface SubMenuState {
  group: ContextMenuGroupDef;
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
 * Branded right-click menu, customizable from Settings. Falls back to the
 * native menu over text fields and iframes, and honours the user's choices of
 * which items and groups to show. Grouped items expand into submenus. Supports
 * hover, keyboard and touch.
 */
export function ContextMenu() {
  const router = useRouter();
  const itemPrefs = usePreferences((s) => s.contextMenu.disabledItems);
  const menuEnabled = usePreferences((s) => s.contextMenu.enabled);
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [submenu, setSubmenu] = useState<SubMenuState | null>(null);
  const [copied, setCopied] = useState(false);
  const [hoveredSimple, setHoveredSimple] = useState<string | null>(null);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const touchTimer = useRef<number | undefined>(undefined);
  const firstTouchItem = useRef<HTMLButtonElement | null>(null);

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
      setOpenGroup(null);
      setHoveredSimple(null);
      setMenu({
        x: Math.min(e.clientX, window.innerWidth - 236 - 8),
        y: Math.min(e.clientY, window.innerHeight - 120 - 8),
      });
    }
    function close() {
      setMenu(null);
      setSubmenu(null);
      setOpenGroup(null);
      setHoveredSimple(null);
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

  const run = useCallback((action: () => void) => () => {
    action();
    setMenu(null);
    setSubmenu(null);
    setOpenGroup(null);
    setHoveredSimple(null);
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      return true;
    } catch {
      return false;
    }
  }

  if (!menu) return null;

  const helpers = {
    copyLink,
    getCopiedLabel: () => (copied ? "Link copied" : "Copy page link"),
  };

  const visibleSimple = CONTEXT_MENU_SIMPLE.filter((i) => disabledItems(i.id));
  const visibleGroups = CONTEXT_MENU_GROUPS.filter((g) =>
    g.items.some((item) => disabledItems(`${g.id}:${item.id}`))
  );

  const itemLabel = (item: ContextMenuItemDef, helpersState: typeof helpers) =>
    item.id === "copyLink" ? helpersState.getCopiedLabel() : item.label;

  function openSubmenu(group: ContextMenuGroupDef, anchor: Element) {
    const count = group.items.filter((it) => disabledItems(`${group.id}:${it.id}`)).length;
    const subW = 220;
    const subH = count * 32 + 12;
    const refPoint = anchor.getBoundingClientRect();
    let x = refPoint.right;
    let y = refPoint.top;
    if (x + subW > window.innerWidth - 8) {
      x = refPoint.left - subW;
    }
    y = Math.min(y, window.innerHeight - subH - 8);
    setSubmenu({ group, x, y });
  }

  function closeWithDelay() {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setSubmenu(null);
      setOpenGroup(null);
    }, 180);
  }
  function cancelClose() {
    window.clearTimeout(closeTimer.current);
  }

  // Touch support: first tap on a group opens the submenu, second tap navigates.
  function handleGroupTouch(group: ContextMenuGroupDef, e: React.TouchEvent) {
    window.clearTimeout(touchTimer.current);
    const target = e.currentTarget as HTMLButtonElement;
    if (openGroup === group.id && firstTouchItem.current === target) {
      // Already open; let the tap fall through to the click handler.
      return;
    }
    firstTouchItem.current = target;
    setOpenGroup(group.id);
    openSubmenu(group, target);
    touchTimer.current = window.setTimeout(() => {
      firstTouchItem.current = null;
    }, 400);
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
        {visibleSimple.map((item) => {
          const Icon = item.icon;
          const label = itemLabel(item, helpers);
          const activeHover = hoveredSimple === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              onClick={run(() => item.action?.(router, helpers))}
              onPointerEnter={() => setHoveredSimple(item.id)}
              className={`flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-xs transition-colors ${
                activeHover ? "bg-accent-subtle text-foreground" : "hover:bg-surface-secondary"
              }`}
            >
              <span className={activeHover ? "text-accent" : "text-muted"}>
                {item.id === "copyLink" && copied ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Icon className="h-3.5 w-3.5" />
                )}
              </span>
              <span className="flex-1">{label}</span>
              {item.hint ? (
                <span className="text-[10px] text-muted">{item.hint}</span>
              ) : null}
            </button>
          );
        })}

        {visibleSimple.length > 0 && visibleGroups.length > 0 ? (
          <div role="separator" className="my-1 h-px bg-border" />
        ) : null}

        {visibleGroups.map((group) => {
          const activeHover = openGroup === group.id;
          return (
            <button
              key={group.id}
              type="button"
              role="menuitem"
              aria-haspopup="menu"
              aria-expanded={activeHover}
              onPointerEnter={(e) => {
                setOpenGroup(group.id);
                openSubmenu(group, e.currentTarget);
              }}
              onTouchStart={(e) => handleGroupTouch(group, e)}
              onClick={(e) => {
                if (!submenu || submenu.group.id !== group.id) {
                  openSubmenu(group, e.currentTarget);
                }
              }}
              className={`flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-xs transition-colors ${
                activeHover ? "bg-accent-subtle text-foreground" : "hover:bg-surface-secondary"
              }`}
            >
              <span className="flex-1">{group.label}</span>
              <ChevronRight
                className={`h-3.5 w-3.5 transition-transform ${
                  activeHover ? "translate-x-0.5 text-accent" : "text-muted"
                }`}
              />
            </button>
          );
        })}

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
          aria-label={submenu.group.label}
          style={{ left: submenu.x, top: submenu.y }}
          onPointerEnter={cancelClose}
          onPointerLeave={closeWithDelay}
          onTouchStart={cancelClose}
          className="animate-pop-in fixed z-[96] w-56 overflow-hidden rounded-[var(--radius-base)] border border-border bg-surface py-1 shadow-pop"
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
        >
          {submenu.group.items
            .filter((item) => disabledItems(`${submenu.group.id}:${item.id}`))
            .map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  onClick={run(() => item.action?.(router, helpers))}
                  className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-xs transition-colors hover:bg-surface-secondary"
                >
                  <span className="text-muted">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="flex-1">{item.label}</span>
                </button>
              );
            })}
        </div>
      ) : null}
    </>
  );
}
