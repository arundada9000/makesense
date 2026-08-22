"use client";

import { useState } from "react";
import { CalcCard, CalcResult, Field, NumberInput, useMoney } from "../calc-kit";

export function RunwayCalculatorWidget() {
  const [cash, setCash] = useState(1200000);
  const [revenue, setRevenue] = useState(150000);
  const [costs, setCosts] = useState(400000);
  const [growth, setGrowth] = useState(8);
  const money = useMoney("Rs.");

  let balance = cash;
  let months = 0;
  let monthlyRevenue = revenue;
  const trajectory: number[] = [];
  while (months < 60) {
    balance += monthlyRevenue - costs;
    if (balance <= 0) break;
    months += 1;
    trajectory.push(balance);
    monthlyRevenue *= 1 + growth / 100;
  }
  const survived = months >= 60 || balance > 0;

  return (
    <CalcCard
      title="How long until the money runs out"
      result={
        <CalcResult
          rows={[
            { label: "Net burn today", value: money(revenue - costs), tone: revenue - costs >= 0 ? "positive" : "negative" },
            {
              label: "Runway",
              value: survived ? "Beyond 5 years" : `${months} months`,
              tone: !survived && months < 12 ? "negative" : "positive",
            },
            { label: "Cash in 12 months", value: money(cash + (revenue - costs) * 12) },
          ]}
        />
      }
    >
      <Field label="Cash on hand" htmlFor="rw-cash">
        <NumberInput id="rw-cash" value={cash} onValueChange={setCash} />
      </Field>
      <Field label="Monthly revenue" htmlFor="rw-rev">
        <NumberInput id="rw-rev" value={revenue} onValueChange={setRevenue} />
      </Field>
      <Field label="Monthly costs" htmlFor="rw-costs">
        <NumberInput id="rw-costs" value={costs} onValueChange={setCosts} />
      </Field>
      <Field label="Monthly revenue growth" htmlFor="rw-growth" suffix="%">
        <NumberInput id="rw-growth" value={growth} allowNegative onValueChange={setGrowth} />
      </Field>
    </CalcCard>
  );
}

