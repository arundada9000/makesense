"use client";

import { useState } from "react";
import { CalcCard, CalcResult, Field, NumberInput, useMoney } from "../calc-kit";

export function CashFlowCalculatorWidget() {
  const [opening, setOpening] = useState(300000);
  const [inflow, setInflow] = useState(400000);
  const [outflow, setOutflow] = useState(350000);
  const money = useMoney("Rs.");

  const net = inflow - outflow;
  const rows = Array.from({ length: 6 }, (_, i) => opening + net * (i + 1));
  const monthsToDeplete =
    net < 0 && opening > 0 ? Math.floor(opening / Math.abs(net)) : null;

  return (
    <CalcCard
      title="Track cash in and cash out each month"
      result={
        <CalcResult
          rows={[
            {
              label: "Net cash per month",
              value: money(net),
              tone: net >= 0 ? "positive" : "negative",
            },
            { label: "Cash after 6 months", value: money(rows[5]), tone: rows[5] >= 0 ? "positive" : "negative" },
            {
              label: "Months until zero",
              value: monthsToDeplete !== null ? `${monthsToDeplete}` : "Not depleting",
              tone: monthsToDeplete !== null && monthsToDeplete < 6 ? "negative" : undefined,
            },
          ]}
        />
      }
    >
      <Field label="Cash on hand today" htmlFor="cf-opening">
        <NumberInput id="cf-opening" value={opening} onValueChange={setOpening} />
      </Field>
      <Field label="Cash in per month" htmlFor="cf-in" help="Customer payments received">
        <NumberInput id="cf-in" value={inflow} onValueChange={setInflow} />
      </Field>
      <Field label="Cash out per month" htmlFor="cf-out" help="Suppliers, salaries, rent, loan payments">
        <NumberInput id="cf-out" value={outflow} onValueChange={setOutflow} />
      </Field>
    </CalcCard>
  );
}

