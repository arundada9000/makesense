"use client";

import { useState } from "react";
import { CalcCard, CalcResult, Field, NumberInput, MoneyField, useMoney } from "../calc-kit";

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
<MoneyField label="Total revenue" htmlFor="pr-rev" value={revenue} onValueChange={setRevenue} />
      <MoneyField
        label="Cost of goods sold"
        htmlFor="pr-cogs"
        value={cogs}
        onValueChange={setCogs}
        help="Direct costs of what you sold"
      />
      <MoneyField
        label="Operating expenses"
        htmlFor="pr-opex"
        value={opex}
        onValueChange={setOpex}
        help="Rent, salaries, marketing"
      />
      <Field label="Tax rate" htmlFor="pr-tax" suffix="%">
        <NumberInput id="pr-tax" value={taxRate} onValueChange={setTaxRate} />
      </Field>
    </CalcCard>
  );
}

