import {
  BusinessModel,
  OverrideField,
  OverrideOp,
  Scenario,
} from "../model/types";

function applyOp(
  current: number,
  op: OverrideOp,
  value: number
): number {
  if (op === "set") return value;
  return current * (1 + value / 100);
}

/**
 * Produces a modified copy of the model with the scenario's assumption
 * overrides applied. The base model is never mutated.
 */
export function applyScenario(
  model: BusinessModel,
  scenario: Scenario | null | undefined
): BusinessModel {
  if (!scenario || scenario.overrides.length === 0) return model;

  const m: BusinessModel = structuredClone(model);

  for (const override of scenario.overrides) {
    switch (override.field as OverrideField) {
      case "price":
        for (const s of m.revenueStreams) {
          s.price = applyOp(s.price, override.op, override.value);
        }
        break;
      case "startingCustomers":
        m.customers.startingCustomers = Math.max(
          0,
          applyOp(m.customers.startingCustomers, override.op, override.value)
        );
        break;
      case "growthValue": {
        const field =
          m.customers.growthMode === "percentage"
            ? "percentageGrowthPerMonth"
            : "fixedGrowthPerMonth";
        m.customers[field] = applyOp(
          m.customers[field],
          override.op,
          override.value
        );
        if (
          override.op === "set" &&
          m.customers.growthMode === "none" &&
          override.value !== 0
        ) {
          m.customers.growthMode = "fixed";
          m.customers.fixedGrowthPerMonth = override.value;
        }
        break;
      }
      case "churnPercent":
        m.customers.monthlyChurnRatePercent = Math.max(
          0,
          Math.min(
            100,
            applyOp(
              m.customers.monthlyChurnRatePercent,
              override.op,
              override.value
            )
          )
        );
        break;
      case "monthlyMarketing":
        m.marketing.monthlyBudget = Math.max(
          0,
          applyOp(m.marketing.monthlyBudget, override.op, override.value)
        );
        break;
      case "variableCosts":
        if (override.op === "percent-change") {
          const factor = 1 + override.value / 100;
          for (const c of m.variableCosts) {
            c.amount *= factor;
          }
        } else {
          // Distribute a set total across existing items proportionally.
          const total = m.variableCosts.reduce(
            (acc, c) => acc + Math.max(0, c.amount),
            0
          );
          if (total > 0) {
            for (const c of m.variableCosts) {
              c.amount = (Math.max(0, c.amount) / total) * override.value;
            }
          }
        }
        break;
      case "fixedCosts":
        if (override.op === "percent-change") {
          const factor = 1 + override.value / 100;
          for (const c of m.fixedCosts) {
            c.amount *= factor;
          }
        } else {
          const total = m.fixedCosts.reduce(
            (acc, c) => acc + Math.max(0, c.amount),
            0
          );
          if (total > 0) {
            for (const c of m.fixedCosts) {
              c.amount = (Math.max(0, c.amount) / total) * override.value;
            }
          }
        }
        break;
      case "investment":
        if (override.op === "percent-change") {
          const factor = 1 + override.value / 100;
          for (const i of m.investments) {
            i.amount *= factor;
          }
        } else {
          const total = m.investments.reduce(
            (acc, i) => acc + Math.max(0, i.amount),
            0
          );
          if (total > 0) {
            for (const i of m.investments) {
              i.amount = (Math.max(0, i.amount) / total) * override.value;
            }
          }
        }
        break;
    }
  }

  return m;
}
