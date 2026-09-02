"use client";

import { useEffect, useState } from "react";
import { Target, Plus, Rocket, Check } from "lucide-react";
import { useGoalStore } from "@/stores/goal-store";
import { usePreferences } from "@/stores/preferences";
import { personalRunway, type TradeoffLever } from "@/domain/goals/engine";
import type { GoalInput, SavingsGoal } from "@/domain/goals/types";
import { formatNumber } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { GoalEditor } from "./goal-editor";
import { GoalCard, goalShareUrl } from "./goal-card";
import Link from "next/link";

type EditorState = { mode: "create" } | { mode: "edit"; goal: SavingsGoal } | null;

export function GoalsView() {
  const goals = useGoalStore((s) => s.goals);
  const hydrated = useGoalStore((s) => s.hydrated);
  const hydrate = useGoalStore((s) => s.hydrate);
  const createGoal = useGoalStore((s) => s.createGoal);
  const updateGoal = useGoalStore((s) => s.updateGoal);
  const removeGoal = useGoalStore((s) => s.removeGoal);
  const defaultCurrency = usePreferences((s) => s.defaultCurrency);

  const [editor, setEditor] = useState<EditorState>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  function handleSubmit(input: GoalInput) {
    setBusy(true);
    const task =
      editor?.mode === "edit" ? updateGoal(editor.goal.id, input) : createGoal(input);
    void task.then(() => {
      setBusy(false);
      setEditor(null);
    });
  }

  function handleDelete(goal: SavingsGoal) {
    if (window.confirm(`Delete "${goal.name}"?`)) {
      void removeGoal(goal.id);
    }
  }

  async function handleShare(goal: SavingsGoal) {
    const url = `${window.location.origin}${goalShareUrl(goal)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      return;
    }
  }

  function handleApplyLever(goal: SavingsGoal, lever: TradeoffLever) {
    if (lever.key === "spend-less") {
      void updateGoal(goal.id, { monthlyExpenses: lever.newExpenses });
    } else {
      void updateGoal(goal.id, { monthlyIncome: lever.newIncome });
    }
  }

  const referenceGoal = goals[0];
  const runway =
    referenceGoal !== undefined
      ? personalRunway(referenceGoal.currentSavings, referenceGoal.monthlyExpenses)
      : null;

  return (
    <div className="space-y-5 py-2">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">Goals</h1>
          <p className="mt-0.5 max-w-xl text-xs text-muted-foreground">
            Put a number on what you want, then see how long it takes and what
            changes it fastest. Everything stays in this browser.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => setEditor({ mode: "create" })}>
          <Plus className="h-4 w-4" />
          New goal
        </Button>
      </header>

      <div className="grid items-center gap-4 rounded-2xl border border-border bg-surface p-4 sm:flex sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent">
            <Rocket className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-medium">Thinking of starting a business?</p>
            {runway !== null ? (
              <p className="mt-0.5 text-xs text-muted-foreground">
                Based on your goal in &ldquo;{referenceGoal!.name}&rdquo;, your personal
                runway is{" "}
                <span className="font-medium text-foreground tabular-nums">
                  {formatNumber(runway, { decimals: 1 })} months
                </span>
                . Plan what you would build before you quit.
              </p>
            ) : (
              <p className="mt-0.5 text-xs text-muted-foreground">
                Add a goal with your savings and monthly expenses to see your runway,
                or jump straight into modeling your business.
              </p>
            )}
          </div>
        </div>
        <Link href="/business-calculator" className="shrink-0">
          <Button variant="secondary">
            Model your business
            <span aria-hidden>{"->"}</span>
          </Button>
        </Link>
      </div>

      {!hydrated ? (
        <EmptyState title="Loading your goals..." />
      ) : goals.length === 0 ? (
        <EmptyState
          title="No goals yet"
          description="Goals stay in this browser. Nothing is uploaded. Start with an example to see how the plan and levers work, or create your own."
          action={
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                variant="primary"
                onClick={() =>
                  void createGoal({
                    name: "Example: first big purchase",
                    targetAmount: 100000,
                    currentSavings: 10000,
                    monthlyIncome: 30000,
                    monthlyExpenses: 21000,
                  })
                }
              >
                <Target className="h-3.5 w-3.5" />
                Try an example
              </Button>
              <Button variant="secondary" onClick={() => setEditor({ mode: "create" })}>
                <Plus className="h-3.5 w-3.5" />
                Create a goal
              </Button>
            </div>
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              currency={defaultCurrency}
              onEdit={(g) => setEditor({ mode: "edit", goal: g })}
              onApplyLever={handleApplyLever}
              onDelete={handleDelete}
              onShare={handleShare}
            />
          ))}
        </div>
      )}

      {copied ? (
        <p className="flex items-center gap-1.5 text-xs text-success">
          <Check className="h-3.5 w-3.5" />
          Plan link copied to clipboard.
        </p>
      ) : null}

      {editor ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={() => setEditor(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold tracking-tight">
                {editor.mode === "edit" ? "Edit goal" : "New goal"}
              </p>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-subtle text-accent">
                <Target className="h-3.5 w-3.5" />
              </span>
            </div>
            <GoalEditor
              key={editor.mode === "edit" ? editor.goal.id : "new"}
              initial={editor.mode === "edit" ? editor.goal : undefined}
              busy={busy}
              submitLabel={editor.mode === "edit" ? "Save changes" : "Create goal"}
              onSubmit={handleSubmit}
              onCancel={() => setEditor(null)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}