"use client";

import { useState } from "react";
import { CalcCard, CalcResult, Field, NumberInput, useMoney } from "../calc-kit";

export function PricingCalculatorWidget() {
  const [unitCost, setUnitCost] = useState(900);
  const [targetMargin, setTargetMargin] = useState(60);
  const [competitorPrice, setCompetitorPrice] = useState(2500);
  const money = useMoney("Rs.");

  const marginPrice =
    targetMargin < 100 ? unitCost / (1 - targetMargin / 100) : Infinity;
  const markup = ((marginPrice - unitCost) / unitCost) * 100;
  const vsCompetitor =
    competitorPrice > 0 ? ((marginPrice - competitorPrice) / competitorPrice) * 100 : 0;

  return (
    <CalcCard
      title="Set a price from cost and target margin"
      result={
        <CalcResult
          rows={[
            { label: `Price for ${targetMargin}% margin`, value: Number.isFinite(marginPrice) ? money(marginPrice) : "-", tone: "accent" },
            { label: "Markup on cost", value: `${markup.toFixed(0)}%` },
            {
              label: "Versus competitor price",
              value: `${vsCompetitor >= 0 ? "+" : ""}${vsCompetitor.toFixed(1)}%`,
              tone: vsCompetitor <= 0 ? "positive" : "negative",
            },
          ]}
        />
      }
    >
      <Field label="Unit cost" htmlFor="pc-cost" help="Everything that scales with one sale">
        <NumberInput id="pc-cost" value={unitCost} onValueChange={setUnitCost} />
      </Field>
      <Field label="Target gross margin" htmlFor="pc-margin" suffix="%">
        <NumberInput id="pc-margin" value={targetMargin} onValueChange={(v) => setTargetMargin(Math.min(99, v))} />
      </Field>
      <Field label="Competitor price" htmlFor="pc-comp" help="Optional reference point">
        <NumberInput id="pc-comp" value={competitorPrice} onValueChange={setCompetitorPrice} />
      </Field>
    </CalcCard>
  );
}

