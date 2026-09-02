"use client";

import { useState } from "react";
import { CalcCard, CalcResult, MoneyField, useMoney } from "../calc-kit";

export function IncomeExpenseWidget() {
  const [income, setIncome] = useState(60000);
  const [expenses, setExpenses] = useState(42000);
  const money = useMoney("Rs.");

  const surplus = income - expenses;
  const savingsRate = income > 0 ? (surplus / income) * 100 : 0;

  return (
    <CalcCard
      title="Income minus expenses"
      result={
        <CalcResult
          rows={[
            {
              label: "Left over each month",
              value: money(surplus),
              tone: surplus >= 0 ? "positive" : "negative",
            },
            { label: "Savings rate", value: `${savingsRate.toFixed(1)}%`, tone: savingsRate >= 20 ? "positive" : "accent" },
            {
              label: "Left over per year",
              value: money(surplus * 12),
              tone: surplus >= 0 ? "positive" : "negative",
            },
          ]}
        />
      }
    >
      <MoneyField label="Monthly income" htmlFor="ie-income" value={income} onValueChange={setIncome} />
      <MoneyField
        label="Monthly expenses"
        htmlFor="ie-expenses"
        value={expenses}
        onValueChange={setExpenses}
      />
    </CalcCard>
  );
}