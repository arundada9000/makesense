"use client";

import { useMemo, useState } from "react";
import Decimal from "decimal.js";
import Link from "next/link";
import { ArrowRight, Calculator, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";

export function LiveSimulator() {
  const [price, setPrice] = useState(1500);
  const [customers, setCustomers] = useState(250);
  const [fixedCosts, setFixedCosts] = useState(120000);
  const [variableCostPercent, setVariableCostPercent] = useState(15);

  const results = useMemo(() => {
    try {
      const p = new Decimal(price);
      const c = new Decimal(customers);
      const fc = new Decimal(fixedCosts);
      const vcp = new Decimal(variableCostPercent).dividedBy(100);

      // Revenue
      const mrr = p.times(c);
      const arr = mrr.times(12);

      // Variable Costs
      const variableCosts = mrr.times(vcp);
      const grossProfit = mrr.minus(variableCosts);
      const grossMargin = mrr.isZero()
        ? new Decimal(0)
        : grossProfit.dividedBy(mrr).times(100);

      // Operating Profit
      const monthlyProfit = grossProfit.minus(fc);

      // Unit Economics & Break-even
      const unitVariable = p.times(vcp);
      const unitContribution = p.minus(unitVariable);
      const breakEvenUnits = unitContribution.isPositive() && !unitContribution.isZero()
        ? fc.dividedBy(unitContribution).ceil().toNumber()
        : 0;

      const breakEvenProgress = breakEvenUnits > 0
        ? Math.min(Math.round((customers / breakEvenUnits) * 100), 200)
        : 0;

      return {
        mrr: mrr.toNumber(),
        arr: arr.toNumber(),
        monthlyProfit: monthlyProfit.toNumber(),
        grossMargin: grossMargin.toNumber(),
        breakEvenUnits,
        breakEvenProgress,
      };
    } catch {
      return {
        mrr: 0,
        arr: 0,
        monthlyProfit: 0,
        grossMargin: 0,
        breakEvenUnits: 0,
        breakEvenProgress: 0,
      };
    }
  }, [price, customers, fixedCosts, variableCostPercent]);

  function formatCurrency(val: number) {
    if (Math.abs(val) >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (Math.abs(val) >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakh`;
    }
    if (Math.abs(val) >= 1000) {
      return `₹${(val / 1000).toFixed(1)}k`;
    }
    return `₹${val.toLocaleString()}`;
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border-strong bg-surface shadow-pop">
      <div className="flex items-center justify-between border-b border-border bg-surface-secondary/90 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-accent/10 text-accent">
            <Calculator className="h-3.5 w-3.5" />
          </span>
          <span className="text-xs font-semibold tracking-tight">
            Live Math Sandbox
          </span>
        </div>
        <span className="font-mono text-[11px] text-muted">
          Instant Decimal.js Engine
        </span>
      </div>

      <div className="grid gap-8 p-6 lg:grid-cols-12 md:p-8">
        {/* Controls Column */}
        <div className="space-y-5 lg:col-span-6">
          <div>
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="sim-price" className="font-medium text-foreground">
                Subscription / Unit Price
              </label>
              <span className="font-mono font-semibold text-accent">
                ₹{price.toLocaleString()}/mo
              </span>
            </div>
            <input
              id="sim-price"
              type="range"
              min={200}
              max={15000}
              step={100}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="mt-2.5 h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-secondary accent-accent focus:outline-none"
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-muted">
              <span>₹200</span>
              <span>₹5,000</span>
              <span>₹15,000</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="sim-customers" className="font-medium text-foreground">
                Active Paying Customers
              </label>
              <span className="font-mono font-semibold text-accent">
                {customers.toLocaleString()} customers
              </span>
            </div>
            <input
              id="sim-customers"
              type="range"
              min={10}
              max={2000}
              step={10}
              value={customers}
              onChange={(e) => setCustomers(Number(e.target.value))}
              className="mt-2.5 h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-secondary accent-accent focus:outline-none"
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-muted">
              <span>10</span>
              <span>500</span>
              <span>2,000</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="sim-costs" className="font-medium text-foreground">
                Monthly Fixed Overhead (Rent, Salaries, Servers)
              </label>
              <span className="font-mono font-semibold text-accent">
                ₹{fixedCosts.toLocaleString()}/mo
              </span>
            </div>
            <input
              id="sim-costs"
              type="range"
              min={10000}
              max={800000}
              step={10000}
              value={fixedCosts}
              onChange={(e) => setFixedCosts(Number(e.target.value))}
              className="mt-2.5 h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-secondary accent-accent focus:outline-none"
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-muted">
              <span>₹10k</span>
              <span>₹250k</span>
              <span>₹800k</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="sim-variable" className="font-medium text-foreground">
                Variable Cost Share (Payment gateways, direct delivery)
              </label>
              <span className="font-mono font-semibold text-accent">
                {variableCostPercent}%
              </span>
            </div>
            <input
              id="sim-variable"
              type="range"
              min={0}
              max={50}
              step={1}
              value={variableCostPercent}
              onChange={(e) => setVariableCostPercent(Number(e.target.value))}
              className="mt-2.5 h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-secondary accent-accent focus:outline-none"
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-muted">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
            </div>
          </div>
        </div>

        {/* Results Output Column */}
        <div className="flex flex-col justify-between rounded-[var(--radius-base)] border border-border bg-surface-secondary/60 p-5 lg:col-span-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Calculated Outcome
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-[var(--radius-base)] border border-border bg-surface p-3.5 shadow-xs">
                <p className="text-[11px] text-muted">Monthly Revenue (MRR)</p>
                <p className="mt-1 font-mono text-xl font-semibold tracking-tight text-foreground">
                  {formatCurrency(results.mrr)}
                </p>
                <p className="mt-0.5 font-mono text-[10px] text-muted">
                  ARR: {formatCurrency(results.arr)}
                </p>
              </div>

              <div className="rounded-[var(--radius-base)] border border-border bg-surface p-3.5 shadow-xs">
                <p className="text-[11px] text-muted">Net Monthly Profit</p>
                <p
                  className={`mt-1 font-mono text-xl font-semibold tracking-tight ${
                    results.monthlyProfit >= 0 ? "text-success" : "text-danger"
                  }`}
                >
                  {results.monthlyProfit >= 0 ? "+" : ""}
                  {formatCurrency(results.monthlyProfit)}
                </p>
                <p className="mt-0.5 text-[10px] text-muted">
                  Margin: {results.grossMargin.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Break-even Progress Bar */}
            <div className="mt-5 rounded-[var(--radius-base)] border border-border bg-surface p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">
                  Break-even Coverage
                </span>
                <span className="font-mono text-xs font-semibold text-accent">
                  {customers} / {results.breakEvenUnits} units ({results.breakEvenProgress}%)
                </span>
              </div>
              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-surface-secondary">
                <div
                  style={{ width: `${Math.min(results.breakEvenProgress, 100)}%` }}
                  className={`h-full transition-all duration-300 rounded-full ${
                    results.breakEvenProgress >= 100 ? "bg-success" : "bg-warning"
                  }`}
                />
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {results.monthlyProfit >= 0
                  ? `Over break-even by ${(customers - results.breakEvenUnits).toLocaleString()} customers. Business is generating cash.`
                  : `Need ${(results.breakEvenUnits - customers).toLocaleString()} more customers at this price to cover monthly overhead.`}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
            <div className="flex items-center gap-1.5 text-[11px] text-muted">
              <ShieldCheck className="h-3.5 w-3.5 text-success" />
              <span>Zero server latency. 100% private.</span>
            </div>
            <Link
              href="/models?new=1"
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-base)] bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground shadow-card transition-all hover:-translate-y-0.5 hover:bg-accent-hover active:translate-y-0"
            >
              <span>Build Full Model</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
