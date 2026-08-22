"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Boxes,
  GitCompareArrows,
  Settings,
  Plus,
  LineChart,
  Search,
} from "lucide-react";
import { useModelStore } from "@/stores/model-store";
import { CommandPalette } from "@/components/command-palette";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/models", label: "Models", icon: Boxes },
  { href: "/compare", label: "Compare", icon: GitCompareArrows },
  { href: "/settings", label: "Settings", icon: Settings },
];

const MOBILE_ITEMS = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/models", label: "Models", icon: Boxes },
  { href: "/compare", label: "Compare", icon: GitCompareArrows },
  { href: "/settings", label: "More", icon: Settings },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/models") {
    return pathname.startsWith("/models");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAppRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/models") ||
    pathname.startsWith("/compare") ||
    pathname.startsWith("/settings");

  if (!isAppRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-dvh">
      <CommandPalette />
      <KeyboardShortcuts />
      <Sidebar pathname={pathname} />
      <MobileNav pathname={pathname} />
      <main
        id="main-content"
        className="flex-1 pb-24 md:pb-10 md:pl-60 lg:pr-8"
      >
        <div className="mx-auto w-full max-w-6xl px-4 pt-4 md:px-6 md:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}

function Sidebar({ pathname }: { pathname: string }) {
  const models = useModelStore((s) => s.models);
  const activeModelId = useModelStore((s) => s.activeModelId);
  const setActiveModel = useModelStore((s) => s.setActiveModel);
  const router = useRouter();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-surface md:flex">
      <Link
        href="/dashboard"
        className="flex h-14 items-center gap-2 border-b border-border px-5"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <LineChart className="h-4 w-4" strokeWidth={2.5} />
        </span>
        <span className="text-sm font-semibold tracking-tight">MakeSense</span>
      </Link>

      <nav aria-label="Primary" className="px-3 py-3">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={`flex h-9 items-center gap-2.5 rounded-[var(--radius-base)] px-3 text-sm transition-colors ${
                  isActive(pathname, href)
                    ? "bg-accent-subtle font-medium text-accent"
                    : "text-muted-foreground hover:bg-surface-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-border px-3 py-3">
        <button
          type="button"
          onClick={() => router.push("/models?new=1")}
          className="flex h-9 w-full items-center gap-2 rounded-[var(--radius-base)] bg-accent px-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
        >
          <Plus className="h-4 w-4" />
          New model
        </button>
        <button
          type="button"
          onClick={() =>
            window.dispatchEvent(
              new KeyboardEvent("keydown", { key: "k", ctrlKey: true })
            )
          }
          className="mt-2 flex h-9 w-full items-center gap-2 rounded-[var(--radius-base)] border border-border px-3 text-xs text-muted-foreground transition-colors hover:bg-surface-secondary hover:text-foreground"
        >
          <Search className="h-3.5 w-3.5" />
          Search
          <kbd className="ml-auto rounded border border-border bg-surface-secondary px-1 py-0.5 text-[10px]">
            Ctrl K
          </kbd>
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-3 pb-3">
        <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
          Models
        </p>
        <ul
          className="min-h-0 flex-1 space-y-0.5 overflow-y-auto"
          role="list"
        >
          {models
            .filter((m) => !m.metadata.archived)
            .map((m) => (
              <li key={m.id}>
                <Link
                  href={`/models/${m.id}`}
                  onClick={() => setActiveModel(m.id)}
                  className={`block truncate rounded-[var(--radius-base)] px-2 py-1.5 text-xs transition-colors ${
                    m.id === activeModelId && pathname.startsWith("/models/")
                      ? "bg-surface-secondary font-medium text-foreground"
                      : "text-muted-foreground hover:bg-surface-secondary hover:text-foreground"
                  }`}
                  title={m.name}
                >
                  {m.name}
                </Link>
              </li>
            ))}
          {models.filter((m) => !m.metadata.archived).length === 0 ? (
            <li>
              <p className="px-2 py-1.5 text-xs text-muted">
                No models yet.
              </p>
            </li>
          ) : null}
        </ul>
      </div>

      <p className="border-t border-border px-5 py-3 text-[11px] leading-relaxed text-muted">
        Models are stored locally on this device.
      </p>
    </aside>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  return (
    <nav
      aria-label="Primary mobile"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5">
        {MOBILE_ITEMS.slice(0, 2).map(({ href, label, icon: Icon }) => (
          <MobileNavItem key={href} href={href} label={label} Icon={Icon} active={isActive(pathname, href)} />
        ))}
        <li className="flex items-end justify-center">
          <Link
            href="/models?new=1"
            aria-label="New model"
            className="-mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-pop"
          >
            <Plus className="h-5 w-5" />
          </Link>
        </li>
        {MOBILE_ITEMS.slice(2).map(({ href, label, icon: Icon }) => (
          <MobileNavItem key={href} href={href} label={label} Icon={Icon} active={isActive(pathname, href)} />
        ))}
      </ul>
    </nav>
  );
}

function MobileNavItem({
  href,
  label,
  Icon,
  active,
}: {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className={`flex h-14 flex-col items-center justify-center gap-0.5 text-[10px] ${
          active ? "font-medium text-accent" : "text-muted-foreground"
        }`}
      >
        <Icon className="h-5 w-5" />
        {label}
      </Link>
    </li>
  );
}

/** Triggers IndexedDB hydration once on the client. */
export function StoreHydration({ children }: { children: React.ReactNode }) {
  const hydrate = useModelStore((s) => s.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return <>{children}</>;
}
