"use client";

import { useState } from "react";
import { CalcCard, CalcResult, Field, NumberInput, useMoney } from "../calc-kit";

export function SavingsGoalWidget() {
  const [goal, setGoal] = useState(100000);
  const [current, setCurrent] = useState(10000);
  const [monthly, setMonthly] = useState(5000);
  const money = useMoney("Rs.");

  const remaining = Math.max(goal - current, 0);
  const months = monthly > 0 ? Math.ceil(remaining / monthly) : Infinity;
  const reachable = monthly > 0;

  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + (reachable ? months : 0));

  return (
    <CalcCard
      title="Your savings goal"
      result={
        <CalcResult
          rows={[
            { label: "Amount left to save", value: money(remaining), tone: remaining === 0 ? "positive" : undefined },
            {
              label: "Time to reach your goal",
              value: reachable ? `${months} months` : "Increase savings",
              tone: reachable && months <= 12 ? "positive" : reachable ? undefined : "negative",
            },
            {
              label: "Estimated goal date",
              value: reachable
                ? targetDate.toLocaleDateString(undefined, { month: "short", year: "numeric" })
                : "-",
            },
          ]}
        />
      }
    >
      <Field label="Goal amount" htmlFor="sg-goal">
        <NumberInput id="sg-goal" value={goal} onValueChange={setGoal} />
      </Field>
      <Field label="Current savings" htmlFor="sg-current">
        <NumberInput id="sg-current" value={current} onValueChange={setCurrent} />
      </Field>
      <Field label="Monthly savings" htmlFor="sg-monthly">
        <NumberInput id="sg-monthly" value={monthly} onValueChange={setMonthly} />
      </Field>
    </CalcCard>
  );
}