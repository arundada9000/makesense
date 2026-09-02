"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { CalcCard, CalcResult, Field, MoneyField, useMoney } from "../calc-kit";
import { copyShareUrl, readShareParams } from "@/lib/share";

export function CanIAffordWidget() {
  const initial = readShareParams(["price", "saved", "income", "expenses"]);
  const [price, setPrice] = useState(initial.price ?? 25000);
  const [saved, setSaved] = useState(initial.saved ?? 5000);
  const [income, setIncome] = useState(initial.income ?? 4000);
  const [expenses, setExpenses] = useState(initial.expenses ?? 2500);
  const [putAwayPercent, setPutAwayPercent] = useState(100);
  const money = useMoney("Rs.");
  const [copied, setCopied] = useState(false);

  const surplus = income - expenses;
  const remaining = Math.max(price - saved, 0);
  const savedRate = surplus * (putAwayPercent / 100);
  const months = savedRate > 0 ? Math.ceil(remaining / savedRate) : null;
  const affordableNow = price <= saved;

  const share = () => {
    void copyShareUrl(
      new URLSearchParams({
        price: String(price),
        saved: String(saved),
        income: String(income),
        expenses: String(expenses),
      })
    ).then((ok) => {
      if (ok) {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }
    });
  };

  return (
    <CalcCard
      title="Your numbers"
      result={
        <CalcResult
          rows={[
            {
              label: "Monthly surplus",
              value: money(surplus),
              tone: surplus >= 0 ? "positive" : "negative",
            },
            {
              label: "Still needed",
              value: money(remaining),
              tone: remaining === 0 ? "positive" : undefined,
            },
            {
              label: "Time to afford it",
              value: affordableNow
                ? "Now"
                : months === null
                  ? "Out of reach"
                  : months === 1
                    ? "About 1 month"
                    : `About ${months} months`,
              tone: affordableNow || (months !== null && months <= 12) ? "positive" : undefined,
            },
          ]}
        />
      }
    >
      <MoneyField label="Price of the thing" htmlFor="afi-price" value={price} onValueChange={setPrice} />
      <MoneyField label="Already saved" htmlFor="afi-saved" value={saved} onValueChange={setSaved} />
      <MoneyField label="Monthly income" htmlFor="afi-income" value={income} onValueChange={setIncome} />
      <MoneyField
        label="Monthly expenses"
        htmlFor="afi-expenses"
        value={expenses}
        onValueChange={setExpenses}
      />
      <Field label={`Put aside ${putAwayPercent}% of my surplus`} htmlFor="afi-percent">
        <input
          id="afi-percent"
          type="range"
          min={10}
          max={100}
          step={10}
          value={putAwayPercent}
          onChange={(e) => setPutAwayPercent(Number(e.target.value))}
          className="h-2 w-full cursor-pointer"
          style={{ accentColor: "var(--accent)" }}
        />
      </Field>
      <div className="sm:col-span-2 lg:col-span-3">
        <button
          type="button"
          onClick={share}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-accent transition-colors hover:text-accent-hover"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
          {copied ? "Plan link copied" : "Share this plan"}
        </button>
      </div>
    </CalcCard>
  );
}