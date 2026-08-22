"use client";

import { useState } from "react";
import { CalcCard, CalcResult, Field, NumberInput, useMoney } from "../calc-kit";

export function BusinessCalculatorWidget() {
  const [price, setPrice] = useState(1500);
  const [units, setUnits] = useState(120);
  const [variable, setVariable] = useState(400);
  const [fixed, setFixed] = useState(60000);
  const money = useMoney("Rs.");

  const revenue = price * units;
  const variableTotal = variable * units;
  const profit = revenue - variableTotal - fixed;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

  return (
    <CalcCard
      title="Describe one typical month"
      result={
        <CalcResult
          rows={[
            { label: "Monthly revenue", value: money(revenue) },
            { label: "Monthly costs", value: money(variableTotal + fixed) },
            {
              label: "Monthly profit",
              value: money(profit),
              tone: profit >= 0 ? "positive" : "negative",
            },
            {
              label: "Profit margin",
              value: `${margin.toFixed(1)}%`,
              tone: margin >= 0 ? "positive" : "negative",
            },
            { label: "Year 1 revenue", value: money(revenue * 12) },
            {
              label: "Year 1 profit",
              value: money(profit * 12),
              tone: profit >= 0 ? "positive" : "negative",
            },
          ]}
        />
      }
    >
      <Field label="Price per unit" htmlFor="biz-price">
        <NumberInput id="biz-price" value={price} onValueChange={setPrice} />
      </Field>
      <Field label="Units sold per month" htmlFor="biz-units">
        <NumberInput id="biz-units" value={units} onValueChange={setUnits} />
      </Field>
      <Field label="Variable cost per unit" htmlFor="biz-variable" help="Materials, fees, delivery">
        <NumberInput id="biz-variable" value={variable} onValueChange={setVariable} />
      </Field>
      <Field label="Fixed costs per month" htmlFor="biz-fixed" help="Rent, salaries, software">
        <NumberInput id="biz-fixed" value={fixed} onValueChange={setFixed} />
      </Field>
    </CalcCard>
  );
}

