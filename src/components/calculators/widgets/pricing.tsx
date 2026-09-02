"use client";

import { useState } from "react";
import { CalcCard, CalcResult, Field, NumberInput, MoneyField, useMoney } from "../calc-kit";

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
<MoneyField
        label="Unit cost"
        htmlFor="pc-cost"
        value={unitCost}
        onValueChange={setUnitCost}
        help="Everything that scales with one sale"
      />
      <Field label="Target gross margin" htmlFor="pc-margin" suffix="%">
        <NumberInput id="pc-margin" value={targetMargin} onValueChange={(v) => setTargetMargin(Math.min(99, v))} />
      </Field>
      <MoneyField
        label="Competitor price"
        htmlFor="pc-comp"
        value={competitorPrice}
        onValueChange={setCompetitorPrice}
        help="Optional reference point"
      />
    </CalcCard>
  );
}

