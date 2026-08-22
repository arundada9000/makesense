"use client";

import { useState } from "react";
import { CalcCard, CalcResult, Field, NumberInput, useMoney } from "../calc-kit";

export function RoiCalculatorWidget() {
  const [investment, setInvestment] = useState(500000);
  const [annualGain, setAnnualGain] = useState(200000);
  const [years, setYears] = useState(3);
  const money = useMoney("Rs.");

  const totalGain = annualGain * years;
  const roi = investment > 0 ? ((totalGain - investment) / investment) * 100 : 0;
  const multiple = investment > 0 ? totalGain / investment : 0;
  const paybackYears = annualGain > 0 ? investment / annualGain : null;

  return (
    <CalcCard
      title="Compare what you put in with what comes back"
      result={
        <CalcResult
          rows={[
            { label: `Total gain over ${years}y`, value: money(totalGain) },
            {
              label: "ROI",
              value: `${roi.toFixed(1)}%`,
              tone: roi >= 0 ? "positive" : "negative",
            },
            {
              label: "Return multiple",
              value: `${multiple.toFixed(2)}x`,
              tone: multiple >= 1 ? "positive" : "negative",
            },
            {
              label: "Payback period",
              value: paybackYears !== null ? `${paybackYears.toFixed(1)} years` : "Never",
            },
          ]}
        />
      }
    >
      <Field label="Initial investment" htmlFor="roi-inv">
        <NumberInput id="roi-inv" value={investment} onValueChange={setInvestment} />
      </Field>
      <Field label="Net gain per year" htmlFor="roi-gain" help="Profit attributable to the investment">
        <NumberInput id="roi-gain" value={annualGain} allowNegative onValueChange={setAnnualGain} />
      </Field>
      <Field label="Horizon years" htmlFor="roi-years">
        <NumberInput id="roi-years" value={years} onValueChange={(v) => setYears(Math.max(1, Math.round(v)))} />
      </Field>
    </CalcCard>
  );
}

