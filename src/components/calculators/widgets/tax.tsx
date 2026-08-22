"use client";

import { useState } from "react";
import { CalcCard, CalcResult, Field, NumberInput, useMoney } from "../calc-kit";

export function TaxCalculatorWidget() {
  const [profit, setProfit] = useState(1200000);
  const [rate, setRate] = useState(25);
  const [carryforward, setCarryforward] = useState(0);
  const money = useMoney("Rs.");

  const carryUsed = Math.min(Math.max(0, carryforward), Math.max(0, profit));
  const taxable = Math.max(0, profit - carryUsed);
  const tax = (taxable * rate) / 100;
  const net = profit - tax;
  const effective = profit > 0 ? (tax / profit) * 100 : 0;

  return (
    <CalcCard
      title="Estimate corporate tax on annual profit"
      result={
        <CalcResult
          rows={[
            { label: "Loss applied", value: money(carryUsed) },
            { label: "Taxable base", value: money(taxable), tone: "accent" },
            { label: `Tax at ${rate}%`, value: money(tax) },
            { label: "Profit after tax", value: money(net), tone: net >= 0 ? "positive" : "negative" },
            { label: "Effective rate", value: `${effective.toFixed(1)}%` },
          ]}
        />
      }
    >
      <Field label="Annual profit before tax" htmlFor="tx-profit">
        <NumberInput id="tx-profit" value={profit} allowNegative onValueChange={setProfit} />
      </Field>
      <Field label="Corporate tax rate" htmlFor="tx-rate" suffix="%">
        <NumberInput id="tx-rate" value={rate} onValueChange={setRate} />
      </Field>
      <Field label="Loss carried forward" htmlFor="tx-carry" help="Prior year losses allowed against this profit">
        <NumberInput id="tx-carry" value={carryforward} onValueChange={setCarryforward} />
      </Field>
    </CalcCard>
  );
}

