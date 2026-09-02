"use client";

import { useState } from "react";
import { CalcCard, CalcResult, Field, NumberInput, MoneyField, useMoney } from "../calc-kit";

export function EmergencyFundWidget() {
  const [expenses, setExpenses] = useState(42000);
  const [months, setMonths] = useState(6);
  const [saved, setSaved] = useState(80000);
  const [monthly, setMonthly] = useState(6000);
  const money = useMoney("Rs.");

  const target = expenses * months;
  const gap = Math.max(target - saved, 0);
  const timeMonths = monthly > 0 ? Math.ceil(gap / monthly) : Infinity;

  return (
    <CalcCard
      title="Emergency fund plan"
      result={
        <CalcResult
          rows={[
            { label: "Emergency fund target", value: money(target) },
            { label: "Amount still to save", value: money(gap), tone: gap === 0 ? "positive" : undefined },
            {
              label: "Time to build it",
              value: gap === 0 ? "Done" : `${timeMonths} months`,
              tone: gap === 0 ? "positive" : timeMonths <= 24 ? undefined : "negative",
            },
          ]}
        />
      }
    >
      <MoneyField
        label="Monthly expenses"
        htmlFor="ef-expenses"
        value={expenses}
        onValueChange={setExpenses}
      />
      <Field label="Months of cover" htmlFor="ef-months">
        <NumberInput id="ef-months" value={months} onValueChange={setMonths} />
      </Field>
      <MoneyField label="Already saved" htmlFor="ef-saved" value={saved} onValueChange={setSaved} />
      <MoneyField
        label="Monthly savings"
        htmlFor="ef-monthly"
        value={monthly}
        onValueChange={setMonthly}
      />
    </CalcCard>
  );
}