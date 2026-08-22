/**
 * Canonical business model types. Plain JSON-friendly shapes for persistence;
 * the calculation layer wraps values in Decimal/Money at the boundary.
 */

export type BusinessType =
  | "one-time-product"
  | "subscription-saas"
  | "service"
  | "b2b-enterprise"
  | "ecommerce"
  | "marketplace"
  | "hybrid"
  | "custom";

export const BUSINESS_TYPES: ReadonlyArray<{
  id: BusinessType;
  label: string;
}> = [
  { id: "one-time-product", label: "One-time Product" },
  { id: "subscription-saas", label: "Subscription / SaaS" },
  { id: "service", label: "Service" },
  { id: "b2b-enterprise", label: "B2B / Enterprise" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "marketplace", label: "Marketplace" },
  { id: "hybrid", label: "Hybrid" },
  { id: "custom", label: "Custom" },
];

export type StreamType =
  | "one-time"
  | "monthly"
  | "quarterly"
  | "yearly"
  | "usage-based"
  | "commission"
  | "setup-fee"
  | "maintenance"
  | "other";

export const STREAM_TYPES: ReadonlyArray<{ id: StreamType; label: string }> = [
  { id: "one-time", label: "One-time sale" },
  { id: "monthly", label: "Monthly recurring" },
  { id: "quarterly", label: "Quarterly recurring" },
  { id: "yearly", label: "Yearly recurring" },
  { id: "usage-based", label: "Usage-based" },
  { id: "commission", label: "Commission" },
  { id: "setup-fee", label: "Setup fee" },
  { id: "maintenance", label: "Maintenance" },
  { id: "other", label: "Other" },
];

export interface RevenueStream {
  id: string;
  name: string;
  type: StreamType;
  /** Price in base currency units. For usage-based this is the unit price. */
  price: number;
  /** Units consumed per customer per month. Usage-based only. */
  usageUnitsPerMonth?: number;
  /** Average order value used by commission streams. */
  averageOrderValue?: number;
  /** Commission percentage of the average order value. */
  commissionPercent?: number;
  /** Initial customers served by this stream. */
  customerCount: number;
  discountPercent: number;
  refundRate: number;
}

export type CostCategory =
  | "development"
  | "design"
  | "branding"
  | "legal"
  | "equipment"
  | "marketing"
  | "hosting"
  | "software"
  | "employees"
  | "office"
  | "payment-fees"
  | "delivery"
  | "infrastructure"
  | "support"
  | "manufacturing"
  | "api-usage"
  | "commission"
  | "other";

export const COST_CATEGORIES: ReadonlyArray<{
  id: CostCategory;
  label: string;
}> = [
  { id: "development", label: "Development" },
  { id: "design", label: "Design" },
  { id: "branding", label: "Branding" },
  { id: "legal", label: "Legal" },
  { id: "equipment", label: "Equipment" },
  { id: "marketing", label: "Marketing" },
  { id: "hosting", label: "Hosting" },
  { id: "software", label: "Software" },
  { id: "employees", label: "Employees" },
  { id: "office", label: "Office" },
  { id: "payment-fees", label: "Payment fees" },
  { id: "delivery", label: "Delivery" },
  { id: "infrastructure", label: "Infrastructure" },
  { id: "support", label: "Support" },
  { id: "manufacturing", label: "Manufacturing" },
  { id: "api-usage", label: "API usage" },
  { id: "commission", label: "Commission" },
  { id: "other", label: "Other" },
];

export type CostKind =
  | "fixed-recurring"
  | "variable-per-customer"
  | "variable-per-order";

export type CostFrequency = "monthly" | "quarterly" | "yearly" | "one-time";

export interface CostItem {
  id: string;
  name: string;
  category: CostCategory;
  kind: CostKind;
  amount: number;
  frequency: CostFrequency;
  /** Orders each customer places monthly. Variable-per-order only. */
  ordersPerCustomerPerMonth?: number;
}

export type InvestmentCategory =
  | "development"
  | "equipment"
  | "branding"
  | "marketing"
  | "legal"
  | "office"
  | "other";

export interface InvestmentItem {
  id: string;
  name: string;
  category: InvestmentCategory;
  amount: number;
}

export type GrowthMode = "none" | "fixed" | "percentage" | "custom-monthly";

export interface CustomerAssumptions {
  startingCustomers: number;
  growthMode: GrowthMode;
  fixedGrowthPerMonth: number;
  percentageGrowthPerMonth: number;
  customMonthlyGrowth: number[];
  monthlyChurnRatePercent: number;
  maxMarketSize?: number;
}

export interface MarketingAssumptions {
  /** Steady monthly acquisition spend. */
  monthlyBudget: number;
}

export interface TaxProfile {
  enabled: boolean;
  country: string;
  countryLabel: string;
  businessStructure: string;
  corporateTaxRatePercent: number;
  vatEnabled: boolean;
  vatRatePercent: number;
  vatPriceIncludesTax: boolean;
  lossCarryforward: boolean;
  notes?: string;
}

export interface DebtLoan {
  id: string;
  name: string;
  principal: number;
  annualInterestRatePercent: number;
  termMonths: number;
  /** Month index when repayments start. 0 means immediately. */
  startMonth: number;
}

export interface InvestorEquity {
  investmentAmount: number;
  ownershipPercent: number;
}

export interface Financing {
  founderCapital: number;
  founderMonthlySalary: number;
  debtLoans: DebtLoan[];
  investorEquity: InvestorEquity | null;
}

export interface ProjectionSettings {
  horizonMonths: number;
  startingCash: number;
}

export type OverrideField =
  | "price"
  | "startingCustomers"
  | "growthValue"
  | "churnPercent"
  | "monthlyMarketing"
  | "variableCosts"
  | "fixedCosts"
  | "investment";

export type OverrideOp = "set" | "percent-change";

export const OVERRIDE_FIELDS: ReadonlyArray<{
  id: OverrideField;
  label: string;
}> = [
  { id: "price", label: "Price (all streams)" },
  { id: "startingCustomers", label: "Starting customers" },
  { id: "growthValue", label: "Monthly growth value" },
  { id: "churnPercent", label: "Monthly churn rate" },
  { id: "monthlyMarketing", label: "Marketing budget" },
  { id: "variableCosts", label: "Variable costs total" },
  { id: "fixedCosts", label: "Fixed costs total" },
  { id: "investment", label: "Initial investment total" },
];

export interface ScenarioOverride {
  field: OverrideField;
  op: OverrideOp;
  /** Set value, or percent change such as 20 meaning +20 percent. */
  value: number;
}

export interface Scenario {
  id: string;
  name: string;
  builtIn?: "conservative" | "expected" | "aggressive" | null;
  description?: string;
  overrides: ScenarioOverride[];
}

export interface ModelMetadata {
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  templateId?: string;
}

export interface BusinessModel {
  schemaVersion: number;
  id: string;
  name: string;
  description: string;
  businessType: BusinessType;
  baseCurrency: string;
  revenueStreams: RevenueStream[];
  investments: InvestmentItem[];
  fixedCosts: CostItem[];
  variableCosts: CostItem[];
  customers: CustomerAssumptions;
  marketing: MarketingAssumptions;
  taxProfile: TaxProfile;
  financing: Financing;
  projectionSettings: ProjectionSettings;
  scenarios: Scenario[];
  metadata: ModelMetadata;
}
