"use client";

import { useState } from "react";
import { CalcCard, CalcResult, Field, NumberInput, useMoney } from "../calc-kit";

export function RevenueCalculatorWidget() {
  const [price, setPrice] = useState(2500);
  const [units, setUnits] = useState(80);
  const [growth, setGrowth] = useState(5);
  const [months, setMonths] = useState(12);
  const money = useMoney("Rs.");

  let total = 0;
  let monthUnits = units;
  const series: Array<{ m: number; rev: number }> = [];
  for (let i = 1; i <= months; i += 1) {
    const rev = price * monthUnits;
    series.push({ m: i, rev });
    total += rev;
    monthUnits *= 1 + growth / 100;
  }
  const first = series[0]?.rev ?? 0;
  const last = series[series.length - 1]?.rev ?? 0;

  return (
    <CalcCard
      title="Project revenue with compounding volume growth"
      result={
        <CalcResult
          rows={[
            { label: "Month 1 revenue", value: money(first) },
            { label: `Month ${months} revenue`, value: money(last) },
            { label: `Total over ${months} months`, value: money(total), tone: "accent" },
            {
              label: "Average per month",
              value: money(total / months),
            },
          ]}
        />
      }
    >
      <Field label="Price per unit" htmlFor="rv-price">
        <NumberInput id="rv-price" value={price} onValueChange={setPrice} />
      </Field>
      <Field label="Units in month 1" htmlFor="rv-units">
        <NumberInput id="rv-units" value={units} onValueChange={setUnits} />
      </Field>
      <Field label="Monthly unit growth" htmlFor="rv-growth" suffix="%">
        <NumberInput id="rv-growth" value={growth} allowNegative onValueChange={setGrowth} />
      </Field>
      <Field label="Horizon months" htmlFor="rv-months">
        <NumberInput id="rv-months" value={months} onValueChange={(v) => setMonths(Math.min(60, Math.max(1, Math.round(v))))} />
      </Field>
    </CalcCard>
  );
}

