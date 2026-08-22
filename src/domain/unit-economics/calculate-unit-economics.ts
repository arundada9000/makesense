import { BusinessModel } from "../model/types";
import { Decimal } from "../primitives/money";
import { Maybe, none, some } from "../primitives/safe-math";
import { ProfitCalculation } from "../profit/calculate-profit";

export interface UnitEconomicsCalculation {
  currency: string;
  /** Net recurring revenue per customer per month. */
  arpuMonthly: Maybe<Decimal>;
  variableCostPerCustomerMonthly: Decimal;
  contributionPerCustomerMonthly: Maybe<Decimal>;
  contributionMarginPercent: Maybe<Decimal>;
  /** Marketing spend divided by new customers across the horizon. */
  cac: Maybe<Decimal>;
  ltv: Maybe<{ value: Decimal; source: "formula" | "manual" | "alternative" }>;
  ltvToCac: Maybe<Decimal>;
  cacPaybackMonths: Maybe<Decimal>;
}

/**
 * Unit economics from steady-state monthly figures.
 * LTV = ARPU x gross margin percent / monthly churn. When churn is zero the
 * formula is undefined and the caller receives a reason instead of a number.
 */
export function calculateUnitEconomics(
  model: BusinessModel,
  profit: ProfitCalculation,
  manualLtv?: number | null
): UnitEconomicsCalculation {
  const startingCustomers = Math.max(0, model.customers.startingCustomers);
  const churnPercent = new Decimal(model.customers.monthlyChurnRatePercent);

  const arpu: Maybe<Decimal> =
    profit.revenue.recurringPerCustomerMonthly.greaterThan(0) &&
    startingCustomers > 0
      ? some(profit.revenue.recurringPerCustomerMonthly)
      : startingCustomers === 0
        ? none("Add starting customers to compute revenue per customer.")
        : none(
            "No recurring revenue stream found, so there is no monthly ARPU."
          );

  const vcPerCustomer = profit.costs.variablePerCustomerMonthly;
  const grossMarginPercent = profit.margins.gross;

  const contribution: Maybe<Decimal> = arpu.ok
    ? some(arpu.value.minus(vcPerCustomer))
    : none(arpu.reason);

  const contributionMargin: Maybe<Decimal> =
    contribution.ok && arpu.ok && !arpu.value.isZero()
      ? some(contribution.value.times(100).dividedBy(arpu.value))
      : !arpu.ok
        ? none(arpu.reason)
        : none("Revenue per customer is zero.");

  const totalNewCustomers = profit.projection.totalNew;
  const marketingTotal = new Decimal(model.marketing.monthlyBudget).times(
    model.projectionSettings.horizonMonths
  );
  const cac: Maybe<Decimal> =
    totalNewCustomers <= 0
      ? none(
          "No new customers are projected, so CAC cannot be derived. Set growth or enter customers manually."
        )
      : marketingTotal.isZero()
        ? some(new Decimal(0))
        : some(marketingTotal.dividedBy(totalNewCustomers));

  // LTV prefers a manual override, then the churn formula, then an
  // alternative for non-recurring businesses based on one-time economics.
  let ltv: UnitEconomicsCalculation["ltv"];
  if (manualLtv != null && manualLtv > 0) {
    ltv = some({ value: new Decimal(manualLtv), source: "manual" });
  } else if (churnPercent.greaterThan(0)) {
    const marginShare =
      grossMarginPercent !== null ? grossMarginPercent.dividedBy(100) : null;
    if (marginShare !== null && arpu.ok) {
      const ltvValue = arpu.value
        .times(marginShare)
        .dividedBy(churnPercent.dividedBy(100));
      ltv = some({ value: ltvValue, source: "formula" });
    } else {
      const oneTime = profit.revenue.oneTimePerNewCustomer;
      const vc = vcPerCustomer;
      if (oneTime.greaterThan(0)) {
        ltv = some({
          value: oneTime.minus(vc).greaterThan(0)
            ? oneTime.minus(vc)
            : new Decimal(0),
          source: "alternative",
        });
      } else {
        ltv = none(arpu.ok ? "Gross margin unavailable." : arpu.reason);
      }
    }
  } else {
    ltv = none(
      "Churn is zero, so lifetime value cannot be computed with this formula. Enter LTV manually."
    );
  }

  const ltvToCac: Maybe<Decimal> =
    ltv.ok && cac.ok
      ? cac.value.isZero()
        ? none("CAC is zero, so the LTV:CAC ratio cannot be computed.")
        : some(ltv.value.value.dividedBy(cac.value))
      : !ltv.ok
        ? none(ltv.reason)
        : !cac.ok
          ? none(cac.reason)
          : none("LTV:CAC is unavailable.");

  const payback: Maybe<Decimal> =
    contribution.ok && cac.ok
      ? contribution.value.lessThanOrEqualTo(0)
        ? none(
            "Contribution per customer is not positive, so CAC payback cannot be reached."
          )
        : cac.value.isZero()
          ? some(new Decimal(0))
          : some(cac.value.dividedBy(contribution.value))
      : !contribution.ok
        ? none(contribution.reason)
        : !cac.ok
          ? none(cac.reason)
          : none("CAC payback is unavailable.");

  return {
    currency: model.baseCurrency,
    arpuMonthly: arpu,
    variableCostPerCustomerMonthly: vcPerCustomer,
    contributionPerCustomerMonthly: contribution,
    contributionMarginPercent: contributionMargin,
    cac,
    ltv,
    ltvToCac,
    cacPaybackMonths: payback,
  };
}
