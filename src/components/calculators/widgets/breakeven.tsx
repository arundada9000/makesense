"use client";

import { useState } from "react";
import { CalcCard, CalcResult, Field, NumberInput, MoneyField, useMoney } from "../calc-kit";

export function BreakEvenCalculatorWidget() {
  const [fixed, setFixed] = useState(150000);
  const [price, setPrice] = useState(2500);
  const [variable, setVariable] = useState(900);
  const [currentUnits, setCurrentUnits] = useState(90);
  const money = useMoney("Rs.");

  const contribution = price - variable;
  const beUnits = contribution > 0 ? fixed / contribution : null;
  const beRevenue = beUnits !== null ? beUnits * price : null;
  const progress =
    beUnits !== null && beUnits > 0
      ? Math.min(100, (currentUnits / beUnits) * 100)
      : null;

  return (
    <CalcCard
      title="Cover your fixed costs first"
      result={
        <CalcResult
          rows={[
            {
              label: "Contribution per unit",
              value: money(contribution),
              tone: contribution > 0 ? "positive" : "negative",
            },
            {
              label: "Break-even units / month",
              value: beUnits !== null ? Math.ceil(beUnits).toLocaleString() : "Unreachable",
              tone: "accent",
            },
            {
              label: "Break-even revenue / month",
              value: beRevenue !== null ? money(beRevenue) : "-",
            },
            {
              label: "Current volume vs break-even",
              value: progress !== null ? `${progress.toFixed(0)}%` : "-",
              tone:
                progress === null
                  ? undefined
                  : progress >= 100
                    ? "positive"
                    : "negative",
            },
          ]}
        />
      }
    >
<MoneyField
        label="Fixed costs per month"
        htmlFor="be-fixed"
        value={fixed}
        onValueChange={setFixed}
      />
      <MoneyField label="Price per unit" htmlFor="be-price" value={price} onValueChange={setPrice} />
      <MoneyField
        label="Variable cost per unit"
        htmlFor="be-variable"
        value={variable}
        onValueChange={setVariable}
      />
      <Field label="Units you sell now" htmlFor="be-current">
        <NumberInput id="be-current" value={currentUnits} onValueChange={setCurrentUnits} />
      </Field>
    </CalcCard>
  );
}

