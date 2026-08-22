"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import * as Tabs from "@radix-ui/react-tabs";
import { ArrowLeft } from "lucide-react";
import { useModelStore } from "@/stores/model-store";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { WorkspaceOverviewTab } from "@/components/workspace/overview-tab";
import { WorkspaceAssumptionsTab } from "@/components/workspace/assumptions-tab";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "assumptions", label: "Assumptions" },
];

export default function ModelWorkspacePage() {
  const params = useParams<{ id: string }>();
  const models = useModelStore((s) => s.models);
  const hydrated = useModelStore((s) => s.hydrated);

  const model = useMemo(
    () => models.find((m) => m.id === params?.id),
    [models, params?.id]
  );

  if (!hydrated) {
    return (
      <div className="space-y-4 pt-4">
        <div className="h-8 w-64 animate-pulse rounded-md bg-surface-secondary" />
        <div className="h-96 animate-pulse rounded-[var(--radius-base)] bg-surface-secondary" />
      </div>
    );
  }

  if (!model) {
    return (
      <div className="pt-6">
        <EmptyState
          title="Model not found"
          description="It may have been deleted on this device."
          action={
            <Link href="/models">
              <Button variant="primary">Back to models</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="py-2">
      <header className="flex items-center gap-3">
        <Link
          href="/models"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground md:hidden"
          aria-label="Back to models"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-tight md:text-xl">
            {model.name}
          </h1>
          <p className="text-xs capitalize text-muted-foreground">
            {model.businessType.replace(/-/g, " ")} | {model.baseCurrency} |{" "}
            {model.projectionSettings.horizonMonths} month horizon
          </p>
        </div>
      </header>

      <Tabs.Root defaultValue="overview" className="mt-4">
        <Tabs.List
          aria-label="Workspace sections"
          className="mb-4 flex gap-1 overflow-x-auto rounded-[var(--radius-base)] border border-border bg-surface p-1"
        >
          {TABS.map((t) => (
            <Tabs.Trigger
              key={t.id}
              value={t.id}
              className="h-9 flex-1 whitespace-nowrap rounded-md px-3 text-sm text-muted-foreground transition-colors hover:text-foreground data-state-active:bg-accent-subtle data-state-active:font-medium data-state-active:text-accent"
            >
              {t.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <Tabs.Content value="overview" className="focus:outline-none">
          <WorkspaceOverviewTab model={model} />
        </Tabs.Content>
        <Tabs.Content value="assumptions" className="focus:outline-none">
          <WorkspaceAssumptionsTab model={model} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
