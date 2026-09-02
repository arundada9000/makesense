"use client";

import { useState } from "react";
import type { GoalInput } from "@/domain/goals/types";
import { monthsToGoal, monthlySavingsFrom } from "@/domain/goals/engine";
import { Button } from "@/components/ui/button";
import { Field, NumberInput, TextInput } from "@/components/ui/field";

export function GoalEditor({
  initial,
  submitLabel = "Save goal",
  busy = false,
  onSubmit,
  onCancel,
}: {
  initial?: GoalInput;
  submitLabel?: string;
  busy?: boolean;
  onSubmit: (input: GoalInput) => void;
  onCancel?: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [targetAmount, setTargetAmount] = useState(initial?.targetAmount ?? 0);
  const [currentSavings, setCurrentSavings] = useState(initial?.currentSavings ?? 0);
  const [monthlyIncome, setMonthlyIncome] = useState(initial?.monthlyIncome ?? 0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(initial?.monthlyExpenses ?? 0);

  const surplus = monthlySavingsFrom(monthlyIncome, monthlyExpenses);
  const months = monthsToGoal(targetAmount, currentSavings, surplus);
  const valid = targetAmount > 0;

  function handleSubmit() {
    if (!valid) return;
    onSubmit({ name, targetAmount, currentSavings, monthlyIncome, monthlyExpenses });
  }

  const nameInputId = "goal-name";

  return (
    <div className="space-y-4">
      <Field label="What are you saving for?" htmlFor={nameInputId}>
        <TextInput
          id={nameInputId}
          value={name}
          placeholder="MacBook, car, house, trip"
          onChange={(e) => setName(e.target.value)}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Target amount" htmlFor="goal-target">
          <NumberInput id="goal-target" value={targetAmount} onValueChange={setTargetAmount} />
        </Field>
        <Field label="Already saved" htmlFor="goal-current">
          <NumberInput id="goal-current" value={currentSavings} onValueChange={setCurrentSavings} />
        </Field>
        <Field label="Monthly income" htmlFor="goal-income">
          <NumberInput id="goal-income" value={monthlyIncome} onValueChange={setMonthlyIncome} />
        </Field>
        <Field label="Monthly expenses" htmlFor="goal-expenses">
          <NumberInput id="goal-expenses" value={monthlyExpenses} onValueChange={setMonthlyExpenses} />
        </Field>
      </div>

      <p className="rounded-md bg-surface-secondary px-3 py-2 text-xs text-muted-foreground">
        You set aside{" "}
        <span className={surplus > 0 ? "font-medium text-foreground" : "font-medium text-danger"}>
          {surplus.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </span>{" "}
        a month.
        {valid && surplus > 0
          ? ` The goal lands in about ${months} months.`
          : !valid
            ? " Set a target amount to see a plan."
            : " With nothing left over each month this goal stays out of reach."}
      </p>

      <div className="flex items-center justify-end gap-2">
        {onCancel ? (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button variant="primary" disabled={!valid || busy} onClick={handleSubmit}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}