"use client";

import { useState } from "react";
import { CalcCard, CalcResult, Field, NumberInput, MoneyField, useMoney } from "../calc-kit";

export function VatCalculatorWidget() {
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(13);
  const [inclusive, setInclusive] = useState(true);
  const money = useMoney("Rs.");

  const rateF = rate / 100;
  let net: number;
  let tax: number;
  let gross: number;
  if (inclusive) {
    net = amount / (1 + rateF);
    tax = amount - net;
    gross = amount;
  } else {
    net = amount;
    tax = amount * rateF;
    gross = amount + tax;
  }

  return (
    <CalcCard
      title="Split or add VAT and GST"
      result={
        <CalcResult
          rows={[
            { label: "Net of tax", value: money(net), tone: "accent" },
            { label: `Tax at ${rate}%`, value: money(tax) },
            { label: "Gross with tax", value: money(gross) },
          ]}
        />
      }
    >
<MoneyField
        label={inclusive ? "Price including tax" : "Price excluding tax"}
        htmlFor="vat-amount"
        value={amount}
        onValueChange={setAmount}
      />
      <Field label="Tax rate" htmlFor="vat-rate" suffix="%">
        <NumberInput id="vat-rate" value={rate} onValueChange={setRate} />
      </Field>
      <Field label="The entered price is" htmlFor="vat-mode">
        <select
          id="vat-mode"
          value={inclusive ? "in" : "ex"}
          onChange={(e) => setInclusive(e.target.value === "in")}
          className="h-11 w-full rounded-[var(--radius-base)] border bg-surface-secondary px-3 text-sm focus:border-accent focus:outline-none"
        >
          <option value="in">Including tax</option>
          <option value="ex">Excluding tax</option>
        </select>
      </Field>
    </CalcCard>
  );
}

