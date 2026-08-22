"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  MoreHorizontal,
  Copy,
  Archive,
  Trash2,
  Plus,
  ArchiveRestore,
} from "lucide-react";
import { MODEL_TEMPLATES } from "@/domain/model/templates";
import type { BusinessModel } from "@/domain/model/types";
import { useModelStore } from "@/stores/model-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { analyzeModel } from "@/domain/scenarios/compare-scenarios";
import { formatMoney, formatPercent } from "@/lib/format";

export default function ModelsPage() {
  return (
    <Suspense fallback={null}>
      <ModelsPageContent />
    </Suspense>
  );
}

function ModelsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const models = useModelStore((s) => s.models);
  const hydrated = useModelStore((s) => s.hydrated);
  const createFromTemplate = useModelStore((s) => s.createFromTemplate);
  const createBlank = useModelStore((s) => s.createBlank);
  const duplicateModel = useModelStore((s) => s.duplicateModel);
  const archiveModel = useModelStore((s) => s.archiveModel);
  const removeModel = useModelStore((s) => s.removeModel);

  const [showArchived, setShowArchived] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  // Deep link /models?new=1 opens the template picker without extra state.
  const newDialogOpen = templateDialogOpen || searchParams.get("new") === "1";

  function closeNewDialog() {
    setTemplateDialogOpen(false);
    if (searchParams.get("new") === "1") {
      router.replace("/models");
    }
  }

  const visible = useMemo(
    () =>
      models.filter((m) => (showArchived ? m.metadata.archived : !m.metadata.archived)),
    [models, showArchived]
  );

  async function handleCreate(templateId: string) {
    setTemplateDialogOpen(false);
    if (templateId === "blank") {
      const created = await createBlank("Untitled model", "custom");
      router.push(`/models/${created.id}`);
      return;
    }
    const template = MODEL_TEMPLATES.find((t) => t.id === templateId);
    const created = await createFromTemplate(
      templateId,
      template ? `${template.label} model` : undefined
    );
    router.push(`/models/${created.id}`);
  }

  if (!hydrated) {
    return (
      <div className="grid gap-3 pt-4 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-[var(--radius-base)] bg-surface-secondary"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5 py-2">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
            Models
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Each model is a complete set of assumptions with its own projections.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={showArchived ? "primary" : "secondary"}
            onClick={() => setShowArchived((v) => !v)}
          >
            {showArchived ? (
              <>
                <ArchiveRestore className="h-3.5 w-3.5" /> Viewing archive
              </>
            ) : (
              <>
                <Archive className="h-3.5 w-3.5" /> Archive
              </>
            )}
          </Button>
          <Button variant="primary" onClick={() => setTemplateDialogOpen(true)}>
            <Plus className="h-4 w-4" /> New
          </Button>
        </div>
      </header>

      {visible.length === 0 ? (
        <EmptyState
          title={showArchived ? "Nothing archived" : "No models yet"}
          description={
            showArchived
              ? "Archived models appear here and can be restored at any time."
              : "Start from a template or a blank canvas. Everything stays on your device."
          }
          action={
            !showArchived && (
              <Button variant="primary" size="md" onClick={() => setTemplateDialogOpen(true)}>
                <Plus className="h-4 w-4" /> Create a model
              </Button>
            )
          }
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((m) => (
            <li key={m.id}>
              <ModelCard
                model={m}
                onDuplicate={() => void duplicateModel(m.id)}
                onArchive={() => void archiveModel(m.id, true)}
                onRestore={() => void archiveModel(m.id, false)}
                onDelete={() => void removeModel(m.id)}
              />
            </li>
          ))}
        </ul>
      )}

      <NewModelDialog
        open={newDialogOpen}
        onOpenChange={(open) => (open ? setTemplateDialogOpen(true) : closeNewDialog())}
        onCreate={(id) => void handleCreate(id)}
      />
    </div>
  );
}

function ModelCard({
  model,
  onDuplicate,
  onArchive,
  onRestore,
  onDelete,
}: {
  model: BusinessModel;
  onDuplicate: () => void;
  onArchive: () => void;
  onRestore: () => void;
  onDelete: () => void;
}) {
  const analysis = useMemo(() => analyzeModel(model), [model]);
  const netProfit = analysis.profit.totals.netProfit;
  const margin = analysis.profit.margins.net;

  return (
    <Card className="group relative p-4 transition-shadow hover:shadow-pop">
      <Link href={`/models/${model.id}`} className="block">
        <p className="truncate pr-8 text-sm font-semibold">{model.name}</p>
        <p className="mt-0.5 text-xs capitalize text-muted-foreground">
          {model.businessType.replace(/-/g, " ")} |{" "}
          {model.projectionSettings.horizonMonths} mo | {model.baseCurrency}
        </p>
        <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3">
          <div>
            <dt className="text-[10px] uppercase tracking-wide text-muted">
              Revenue
            </dt>
            <dd className="mt-0.5 text-xs font-semibold tabular-nums">
              {formatMoney(analysis.profit.totals.revenue, model.baseCurrency, {
                style: "compact",
              })}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wide text-muted">
              Net profit
            </dt>
            <dd
              className={`mt-0.5 text-xs font-semibold tabular-nums ${
                netProfit.isNegative() ? "text-danger" : ""
              }`}
            >
              {formatMoney(netProfit, model.baseCurrency, {
                style: "compact",
                signed: true,
              })}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wide text-muted">
              Margin
            </dt>
            <dd className="mt-0.5 text-xs font-semibold tabular-nums">
              {margin !== null ? formatPercent(margin, { decimals: 1 }) : "-"}
            </dd>
          </div>
        </dl>
      </Link>
      <div className="absolute right-2 top-2">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button variant="ghost" aria-label={`Actions for ${model.name}`}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={4}
              className="z-50 min-w-40 rounded-[var(--radius-base)] border border-border bg-surface-raised p-1 shadow-pop"
            >
              {model.metadata.archived ? (
                <MenuAction onSelect={onRestore} icon={<ArchiveRestore className="h-3.5 w-3.5" />}>
                  Restore
                </MenuAction>
              ) : (
                <>
                  <MenuAction onSelect={onDuplicate} icon={<Copy className="h-3.5 w-3.5" />}>
                    Duplicate
                  </MenuAction>
                  <MenuAction onSelect={onArchive} icon={<Archive className="h-3.5 w-3.5" />}>
                    Archive
                  </MenuAction>
                </>
              )}
              <MenuAction
                onSelect={() => {
                  if (
                    window.confirm(
                      `Delete "${model.name}" permanently? This cannot be undone.`
                    )
                  ) {
                    onDelete();
                  }
                }}
                icon={<Trash2 className="h-3.5 w-3.5" />}
                danger
              >
                Delete
              </MenuAction>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </Card>
  );
}

function MenuAction({
  children,
  onSelect,
  icon,
  danger,
}: {
  children: React.ReactNode;
  onSelect: () => void;
  icon: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <DropdownMenu.Item
      onSelect={onSelect}
      className={`flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-xs outline-none transition-colors ${
        danger
          ? "text-danger data-highlighted:bg-danger-subtle"
          : "data-highlighted:bg-surface-secondary"
      }`}
    >
      {icon}
      {children}
    </DropdownMenu.Item>
  );
}

function NewModelDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (templateId: string) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-state-open:animate-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[85dvh] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-pop focus:outline-none">
          <Dialog.Title className="text-sm font-semibold">
            Start a new model
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-xs text-muted-foreground">
            Templates come pre-filled with realistic assumptions you can adjust.
          </Dialog.Description>
          <div className="mt-4 grid gap-2">
            {MODEL_TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onCreate(t.id)}
                className="rounded-[var(--radius-base)] border border-border bg-surface-secondary px-4 py-3 text-left transition-colors hover:border-accent"
              >
                <p className="text-sm font-medium">{t.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t.description}
                </p>
              </button>
            ))}
            <button
              type="button"
              onClick={() => onCreate("blank")}
              className="rounded-[var(--radius-base)] border border-dashed border-border-strong px-4 py-3 text-left transition-colors hover:border-accent"
            >
              <p className="text-sm font-medium">Blank canvas</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Empty model with every field at zero.
              </p>
            </button>
          </div>
          <Dialog.Close asChild>
            <Button variant="ghost" className="absolute right-3 top-3">
              Close
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}


