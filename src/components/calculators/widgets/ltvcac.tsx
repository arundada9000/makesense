"use client";

import { useState } from "react";
import { CalcCard, CalcResult, Field, NumberInput, useMoney } from "../calc-kit";

export function LtvCacCalculatorWidget() {
  const [arpu, setArpu] = useState(1500);
  const [grossMargin, setGrossMargin] = useState(70);
  const [churn, setChurn] = useState(4);
  const [cac, setCac] = useState(6000);
  const money = useMoney("Rs.");

  const ltv = churn > 0 ? (arpu * (grossMargin / 100)) / (churn / 100) : null;
  const ratio = ltv !== null && cac > 0 ? ltv / cac : null;
  const payback = arpu * (grossMargin / 100) > 0 ? cac / (arpu * (grossMargin / 100)) : null;

  return (
    <CalcCard
      title="Is a customer worth more than they cost"
      result={
        <CalcResult
          rows={[
            { label: "LTV", value: ltv !== null ? money(ltv) : "-" },
            { label: "CAC", value: money(cac) },
            {
              label: "LTV : CAC",
              value: ratio !== null ? `${ratio.toFixed(2)}:1` : "-",
              tone:
                ratio === null
                  ? undefined
                  : ratio >= 3
                    ? "positive"
                    : ratio >= 1
                      ? undefined
                      : "negative",
            },
            {
              label: "CAC payback",
              value: payback !== null ? `${payback.toFixed(1)} months` : "-",
            },
          ]}
        />
      }
    >
      <Field label="Revenue per customer / month" htmlFor="lc-arpu">
        <NumberInput id="lc-arpu" value={arpu} onValueChange={setArpu} />
      </Field>
      <Field label="Gross margin" htmlFor="lc-margin" suffix="%">
        <NumberInput id="lc-margin" value={grossMargin} onValueChange={setGrossMargin} />
      </Field>
      <Field label="Monthly churn" htmlFor="lc-churn" suffix="%">
        <NumberInput id="lc-churn" value={churn} onValueChange={setChurn} />
      </Field>
      <Field label="CAC" htmlFor="lc-cac" help="Sales plus marketing divided by new customers">
        <NumberInput id="lc-cac" value={cac} onValueChange={setCac} />
      </Field>
    </CalcCard>
  );
}

