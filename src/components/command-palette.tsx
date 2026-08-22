"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import {
  LayoutDashboard,
  Boxes,
  GitCompareArrows,
  Settings,
  Plus,
  Search,
  CornerDownLeft,
} from "lucide-react";
import { useModelStore } from "@/stores/model-store";
import { useFeedback } from "@/components/feedback";

interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  group: "Navigate" | "Models";
  icon: React.ReactNode;
  run: () => void;
}

export function CommandPalette() {
  const router = useRouter();
  const models = useModelStore((s) => s.models);
  const feedback = useFeedback();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        feedback.tap("light");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [feedback]);

  const items = useMemo<CommandItem[]>(() => {
    const nav: CommandItem[] = [
      {
        id: "nav-dashboard",
        label: "Dashboard",
        group: "Navigate",
        icon: <LayoutDashboard className="h-4 w-4" />,
        run: () => router.push("/dashboard"),
      },
      {
        id: "nav-models",
        label: "Models",
        group: "Navigate",
        icon: <Boxes className="h-4 w-4" />,
        run: () => router.push("/models"),
      },
      {
        id: "nav-new",
        label: "New model",
        hint: "Template picker",
        group: "Navigate",
        icon: <Plus className="h-4 w-4" />,
        run: () => router.push("/models?new=1"),
      },
      {
        id: "nav-compare",
        label: "Compare",
        group: "Navigate",
        icon: <GitCompareArrows className="h-4 w-4" />,
        run: () => router.push("/compare"),
      },
      {
        id: "nav-settings",
        label: "Settings",
        group: "Navigate",
        icon: <Settings className="h-4 w-4" />,
        run: () => router.push("/settings"),
      },
    ];
    const modelItems: CommandItem[] = models
      .filter((m) => !m.metadata.archived)
      .map((m) => ({
        id: `model-${m.id}`,
        label: m.name,
        hint: `${m.projectionSettings.horizonMonths} mo | ${m.baseCurrency}`,
        group: "Models" as const,
        icon: <Boxes className="h-4 w-4" />,
        run: () => router.push(`/models/${m.id}`),
      }));
    return [...nav, ...modelItems];
  }, [models, router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        i.group.toLowerCase().includes(q)
    );
  }, [items, query]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-[15vh] z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 rounded-[var(--radius-lg)] border border-border bg-surface shadow-pop focus:outline-none">
          <Dialog.Title className="sr-only">Command palette</Dialog.Title>
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search className="h-4 w-4 text-muted" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages and models..."
              className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted"
              aria-label="Search commands"
            />
          </div>
          <ul role="listbox" aria-label="Commands" className="max-h-80 overflow-y-auto p-1.5">
            {filtered.length === 0 ? (
              <li className="px-3 py-6 text-center text-xs text-muted">
                No matches.
              </li>
            ) : null}
            {(["Navigate", "Models"] as const).map((group) => {
              const groupItems = filtered.filter((i) => i.group === group);
              if (groupItems.length === 0) return null;
              return (
                <li key={group}>
                  <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
                    {group}
                  </p>
                  <ul>
                    {groupItems.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => {
                            feedback.tap("success");
                            setOpen(false);
                            setQuery("");
                            item.run();
                          }}
                          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-surface-secondary"
                        >
                          <span className="text-muted">{item.icon}</span>
                          <span className="min-w-0 flex-1 truncate">{item.label}</span>
                          {item.hint ? (
                            <span className="text-xs text-muted">{item.hint}</span>
                          ) : null}
                          <CornerDownLeft className="h-3 w-3 text-muted opacity-0" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
          <p className="border-t border-border px-3 py-2 text-[11px] text-muted">
            Press Ctrl or Cmd plus K anywhere to toggle this palette.
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
