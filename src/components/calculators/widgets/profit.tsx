"use client";

import { useState } from "react";
import { CalcCard, CalcResult, Field, NumberInput, useMoney } from "../calc-kit";

export function ProfitCalculatorWidget() {
  const [revenue, setRevenue] = useState(500000);
  const [cogs, setCogs] = useState(180000);
  const [opex, setOpex] = useState(150000);
  const [taxRate, setTaxRate] = useState(25);
  const money = useMoney("Rs.");

  const gross = revenue - cogs;
  const operating = gross - opex;
  const tax = Math.max(0, (operating * taxRate) / 100);
  const net = operating - tax;
  const pct = (n: number) => (revenue > 0 ? `${((n / revenue) * 100).toFixed(1)}%` : "-");

  return (
    <CalcCard
      title="Enter a period, usually one month or one year"
      result={
        <CalcResult
          rows={[
            { label: "Gross profit", value: money(gross), tone: "accent" },
            { label: "Gross margin", value: pct(gross) },
            { label: "Operating profit", value: money(operating), tone: operating >= 0 ? "positive" : "negative" },
            { label: "Operating margin", value: pct(operating) },
            { label: `Tax at ${taxRate}%`, value: money(tax) },
            { label: "Net profit", value: money(net), tone: net >= 0 ? "positive" : "negative" },
          ]}
        />
      }
    >
      <Field label="Total revenue" htmlFor="pr-rev">
        <NumberInput id="pr-rev" value={revenue} onValueChange={setRevenue} />
      </Field>
      <Field label="Cost of goods sold" htmlFor="pr-cogs" help="Direct costs of what you sold">
        <NumberInput id="pr-cogs" value={cogs} onValueChange={setCogs} />
      </Field>
      <Field label="Operating expenses" htmlFor="pr-opex" help="Rent, salaries, marketing">
        <NumberInput id="pr-opex" value={opex} onValueChange={setOpex} />
      </Field>
      <Field label="Tax rate" htmlFor="pr-tax" suffix="%">
        <NumberInput id="pr-tax" value={taxRate} onValueChange={setTaxRate} />
      </Field>
    </CalcCard>
  );
}

