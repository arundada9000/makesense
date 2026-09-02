"use client";

import { useState } from "react";
import { CalcCard, CalcResult, MoneyField, useMoney } from "../calc-kit";
import { readShareParams } from "@/lib/share";

export function SavingsGoalWidget() {
  const initial = readShareParams(["goal", "saved", "monthly"]);
  const [goal, setGoal] = useState(initial.goal ?? 100000);
  const [current, setCurrent] = useState(initial.saved ?? 10000);
  const [monthly, setMonthly] = useState(initial.monthly ?? 5000);
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
      <MoneyField label="Goal amount" htmlFor="sg-goal" value={goal} onValueChange={setGoal} />
      <MoneyField
        label="Current savings"
        htmlFor="sg-current"
        value={current}
        onValueChange={setCurrent}
      />
      <MoneyField
        label="Monthly savings"
        htmlFor="sg-monthly"
        value={monthly}
        onValueChange={setMonthly}
      />
    </CalcCard>
  );
}