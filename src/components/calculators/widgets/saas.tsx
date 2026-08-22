"use client";

import { useState } from "react";
import { CalcCard, CalcResult, Field, NumberInput, useMoney } from "../calc-kit";

export function SaasCalculatorWidget() {
  const [mrr, setMrr] = useState(500000);
  const [customers, setCustomers] = useState(200);
  const [churn, setChurn] = useState(3);
  const [newPerMonth, setNewPerMonth] = useState(25);
  const money = useMoney("Rs.");

  const arpu = customers > 0 ? mrr / customers : 0;
  const arr = mrr * 12;
  const churned = (customers * churn) / 100;
  const netNew = newPerMonth - churned;
  const growthRate = customers > 0 ? (netNew / customers) * 100 : 0;
  const ltv = churn > 0 ? (arpu / churn) * 100 : null;

  return (
    <CalcCard
      title="Core subscription metrics from four numbers"
      result={
        <CalcResult
          rows={[
            { label: "ARR", value: money(arr), tone: "accent" },
            { label: "ARPU / month", value: money(arpu) },
            { label: "Net new customers / mo", value: netNew.toFixed(1), tone: netNew >= 0 ? "positive" : "negative" },
            { label: "Monthly customer growth", value: `${growthRate.toFixed(1)}%`, tone: growthRate >= 0 ? "positive" : "negative" },
            { label: "Churned customers / mo", value: churned.toFixed(1), tone: "negative" },
            { label: "LTV at this churn", value: ltv !== null ? money(ltv) : "-" },
          ]}
        />
      }
    >
      <Field label="MRR" htmlFor="saas-mrr" help="Monthly recurring revenue">
        <NumberInput id="saas-mrr" value={mrr} onValueChange={setMrr} />
      </Field>
      <Field label="Active subscribers" htmlFor="saas-cust">
        <NumberInput id="saas-cust" value={customers} onValueChange={setCustomers} />
      </Field>
      <Field label="Monthly churn" htmlFor="saas-churn" suffix="%">
        <NumberInput id="saas-churn" value={churn} onValueChange={setChurn} />
      </Field>
      <Field label="New subscribers / month" htmlFor="saas-new">
        <NumberInput id="saas-new" value={newPerMonth} onValueChange={setNewPerMonth} />
      </Field>
    </CalcCard>
  );
}

