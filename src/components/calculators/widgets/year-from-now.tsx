"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { CalcCard, CalcResult, Field, NumberInput, MoneyField, useMoney } from "../calc-kit";
import { copyShareUrl, readShareParams } from "@/lib/share";
import { projectBalance, monthlySavingsFrom } from "@/domain/goals/engine";

function dueBalance(
  income: number,
  expenses: number,
  saved: number,
  growthPercent: number,
  months: number
): number {
  if (growthPercent === 0) {
    return projectBalance(saved, monthlySavingsFrom(income, expenses), months);
  }
  let balance = saved;
  for (let m = 0; m < months; m += 1) {
    const growingIncome = income * Math.pow(1 + growthPercent / 100, m);
    balance += Math.max(0, growingIncome - expenses);
  }
  return Math.round(balance * 100) / 100;
}

export function YearFromNowWidget() {
  const initial = readShareParams(["income", "expenses", "saved", "growth"]);
  const [income, setIncome] = useState(initial.income ?? 4000);
  const [expenses, setExpenses] = useState(initial.expenses ?? 2800);
  const [saved, setSaved] = useState(initial.saved ?? 3000);
  const [growth, setGrowth] = useState(initial.growth ?? 0);
  const money = useMoney("Rs.");
  const [copied, setCopied] = useState(false);

  const surplus = monthlySavingsFrom(income, expenses);

  const in12 = dueBalance(income, expenses, saved, growth, 12);
  const in24 = dueBalance(income, expenses, saved, growth, 24);
  const in36 = dueBalance(income, expenses, saved, growth, 36);

  const share = () => {
    void copyShareUrl(
      new URLSearchParams({
        income: String(income),
        expenses: String(expenses),
        saved: String(saved),
        growth: String(growth),
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
      title="Where your money will be"
      result={
        <CalcResult
          rows={[
            {
              label: "Monthly surplus",
              value: money(surplus),
              tone: surplus >= 0 ? "positive" : "negative",
            },
            { label: "In 12 months", value: money(in12), tone: in12 >= saved ? "positive" : undefined },
            { label: "In 24 months", value: money(in24) },
            { label: "In 36 months", value: money(in36) },
          ]}
        />
      }
    >
      <MoneyField label="Monthly income" htmlFor="yfn-income" value={income} onValueChange={setIncome} />
      <MoneyField
        label="Monthly expenses"
        htmlFor="yfn-expenses"
        value={expenses}
        onValueChange={setExpenses}
      />
      <MoneyField label="Current savings" htmlFor="yfn-saved" value={saved} onValueChange={setSaved} />
      <Field label="Yearly income growth" htmlFor="yfn-growth" suffix="%">
        <NumberInput id="yfn-growth" value={growth} onValueChange={setGrowth} />
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