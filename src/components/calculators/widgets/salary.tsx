"use client";

import { useState } from "react";
import { CalcCard, CalcResult, Field, MoneyField, useMoney } from "../calc-kit";
import { Select } from "@/components/ui/select";

type PayPeriod = "hourly" | "daily" | "weekly" | "monthly" | "yearly";

const PERIOD_HOURS: Record<PayPeriod, number> = {
  hourly: 1,
  daily: 8,
  weekly: 40,
  monthly: 173.333,
  yearly: 2080,
};

const PERIOD_LABEL: Record<PayPeriod, string> = {
  hourly: "hourly",
  daily: "daily",
  weekly: "weekly",
  monthly: "monthly",
  yearly: "yearly",
};

export function SalaryCalculatorWidget() {
  const [amount, setAmount] = useState(50000);
  const [period, setPeriod] = useState<PayPeriod>("monthly");
  const money = useMoney("Rs.");

  const hourlyRate =
    period === "hourly" ? amount : amount / (PERIOD_HOURS[period] / PERIOD_HOURS.hourly);
  const hourly = hourlyRate;
  const daily = hourly * 8;
  const weekly = hourly * 40;
  const monthly = hourly * 173.333;
  const yearly = hourly * 2080;

  return (
    <CalcCard
      title="Income by pay period"
      result={
        <CalcResult
          rows={[
            { label: "Hourly rate", value: money(hourly) },
            { label: "Daily", value: money(daily) },
            { label: "Weekly", value: money(weekly) },
            { label: "Monthly", value: money(monthly) },
            { label: "Yearly", value: money(yearly) },
          ]}
        />
      }
    >
      <MoneyField
        label={`Amount per ${PERIOD_LABEL[period]}`}
        htmlFor="sal-amount"
        value={amount}
        onValueChange={setAmount}
      />
      <Field label="Pay period" htmlFor="sal-period">
        <Select
          id="sal-period"
          value={period}
          onChange={(e) => setPeriod(e.target.value as PayPeriod)}
        >
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </Select>
      </Field>
    </CalcCard>
  );
}