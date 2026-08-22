import {
  BusinessModel,
  BusinessType,
  CostItem,
  CustomerAssumptions,
  Financing,
  InvestmentItem,
  ProjectionSettings,
  RevenueStream,
  Scenario,
  TaxProfile,
} from "./types";
import { DEFAULT_CURRENCY } from "../primitives/currency";

export const SCHEMA_VERSION = 1;

let idCounter = 0;
/** Deterministic-enough ids for client side models. */
export function createId(prefix: string): string {
  idCounter += 1;
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}${idCounter
    .toString(36)
    .padStart(2, "0")}${random}`;
}

export function emptyCustomerAssumptions(
  startingCustomers = 0
): CustomerAssumptions {
  return {
    startingCustomers,
    growthMode: "fixed",
    fixedGrowthPerMonth: 0,
    percentageGrowthPerMonth: 0,
    customMonthlyGrowth: [],
    monthlyChurnRatePercent: 0,
  };
}

export function defaultTaxProfile(): TaxProfile {
  return {
    enabled: false,
    country: "NP",
    countryLabel: "Nepal",
    businessStructure: "sole-proprietorship",
    corporateTaxRatePercent: 25,
    vatEnabled: true,
    vatRatePercent: 13,
    vatPriceIncludesTax: false,
    lossCarryforward: true,
  };
}

export function emptyRevenueStream(
  partial?: Partial<RevenueStream>
): RevenueStream {
  return {
    id: createId("rev"),
    name: "New revenue stream",
    type: "monthly",
    price: 0,
    customerCount: 100,
    discountPercent: 0,
    refundRate: 0,
    ...partial,
  };
}

export function emptyCostItem(
  kind: "fixed-recurring" | "variable-per-customer" | "variable-per-order",
  partial?: Partial<CostItem>
): CostItem {
  return {
    id: createId("cost"),
    name: "New cost",
    category: "other",
    kind,
    amount: 0,
    frequency: "monthly",
    ordersPerCustomerPerMonth:
      kind === "variable-per-order" ? 1 : undefined,
    ...partial,
  };
}

export function emptyInvestmentItem(
  partial?: Partial<InvestmentItem>
): InvestmentItem {
  return {
    id: createId("inv"),
    name: "New investment item",
    category: "development",
    amount: 0,
    ...partial,
  };
}

function defaultFinancing(): Financing {
  return {
    founderCapital: 0,
    founderMonthlySalary: 0,
    debtLoans: [],
    investorEquity: null,
  };
}

function defaultProjection(): ProjectionSettings {
  return {
    horizonMonths: 12,
    startingCash: 0,
  };
}

export function defaultScenarios(): Scenario[] {
  return [
    { id: createId("scn"), name: "Conservative", builtIn: "conservative", overrides: [] },
    { id: createId("scn"), name: "Expected", builtIn: "expected", overrides: [] },
    { id: createId("scn"), name: "Aggressive", builtIn: "aggressive", overrides: [] },
  ];
}

export interface ModelTemplateInput {
  name: string;
  description?: string;
  businessType: BusinessType;
  baseCurrency?: string;
}

export function createEmptyModel(
  input: ModelTemplateInput
): BusinessModel {
  const now = new Date().toISOString();
  return {
    schemaVersion: SCHEMA_VERSION,
    id: createId("model"),
    name: input.name,
    description: input.description ?? "",
    businessType: input.businessType,
    baseCurrency: input.baseCurrency ?? DEFAULT_CURRENCY,
    revenueStreams: [emptyRevenueStream()],
    investments: [],
    fixedCosts: [],
    variableCosts: [],
    customers: emptyCustomerAssumptions(100),
    marketing: { monthlyBudget: 0 },
    taxProfile: defaultTaxProfile(),
    financing: defaultFinancing(),
    projectionSettings: defaultProjection(),
    scenarios: defaultScenarios(),
    metadata: { createdAt: now, updatedAt: now, archived: false },
  };
}
