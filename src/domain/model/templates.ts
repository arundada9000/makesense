import { BusinessModel } from "./types";
import {
  createEmptyModel,
  emptyCostItem,
  emptyInvestmentItem,
  emptyRevenueStream,
} from "./defaults";

/**
 * Seed examples from the product spec. Each demonstrates a different
 * economic shape so new users immediately see what modeling looks like.
 */

export interface ModelTemplate {
  id: string;
  label: string;
  description: string;
  build: () => BusinessModel;
}

export function saasExample(): BusinessModel {
  const model = createEmptyModel({
    name: "SaaS Product",
    description:
      "Rs. 1,000 per month subscription with steady growth and churn.",
    businessType: "subscription-saas",
  });
  model.revenueStreams = [
    emptyRevenueStream({
      name: "Core subscription",
      type: "monthly",
      price: 1000,
      customerCount: 100,
    }),
  ];
  model.customers = {
    startingCustomers: 100,
    growthMode: "fixed",
    fixedGrowthPerMonth: 50,
    percentageGrowthPerMonth: 0,
    customMonthlyGrowth: [],
    monthlyChurnRatePercent: 3,
  };
  model.marketing = { monthlyBudget: 100000 };
  model.fixedCosts = [
    emptyCostItem("fixed-recurring", {
      name: "Team payroll",
      category: "employees",
      amount: 70000,
      frequency: "monthly",
    }),
    emptyCostItem("fixed-recurring", {
      name: "Hosting and tooling",
      category: "hosting",
      amount: 30000,
      frequency: "monthly",
    }),
  ];
  model.variableCosts = [
    emptyCostItem("variable-per-customer", {
      name: "Infrastructure per customer",
      category: "infrastructure",
      amount: 100,
      frequency: "monthly",
    }),
    emptyCostItem("variable-per-customer", {
      name: "Payment fees",
      category: "payment-fees",
      amount: 20,
      frequency: "monthly",
    }),
  ];
  model.investments = [
    emptyInvestmentItem({
      name: "Initial development",
      category: "development",
      amount: 800000,
    }),
    emptyInvestmentItem({
      name: "Branding and launch",
      category: "branding",
      amount: 200000,
    }),
  ];
  model.projectionSettings.startingCash = 1200000;
  return model;
}

export function microPaymentExample(): BusinessModel {
  const model = createEmptyModel({
    name: "Digital Product",
    description:
      "Rs. 500 one-time digital product sold to a large audience.",
    businessType: "one-time-product",
  });
  model.revenueStreams = [
    emptyRevenueStream({
      name: "Product sales",
      type: "one-time",
      price: 500,
      customerCount: 10000,
    }),
  ];
  model.customers = {
    ...model.customers,
    startingCustomers: 10000,
    growthMode: "fixed",
    fixedGrowthPerMonth: 0,
  };
  model.variableCosts = [
    emptyCostItem("variable-per-customer", {
      name: "Payment processing",
      category: "payment-fees",
      amount: 15,
      frequency: "one-time",
    }),
    emptyCostItem("variable-per-customer", {
      name: "Delivery and hosting",
      category: "delivery",
      amount: 10,
      frequency: "one-time",
    }),
  ];
  model.fixedCosts = [
    emptyCostItem("fixed-recurring", {
      name: "Marketing retainers",
      category: "marketing",
      amount: 40000,
      frequency: "monthly",
    }),
  ];
  model.investments = [
    emptyInvestmentItem({
      name: "Product build",
      category: "development",
      amount: 500000,
    }),
  ];
  return model;
}

export function enterpriseExample(): BusinessModel {
  const model = createEmptyModel({
    name: "Enterprise Product",
    description:
      "Rs. 500,000 annual contracts sold to a small number of businesses.",
    businessType: "b2b-enterprise",
  });
  model.revenueStreams = [
    emptyRevenueStream({
      name: "Annual license",
      type: "yearly",
      price: 500000,
      customerCount: 20,
    }),
  ];
  model.customers = {
    ...model.customers,
    startingCustomers: 20,
    growthMode: "percentage",
    percentageGrowthPerMonth: 2,
  };
  model.marketing = { monthlyBudget: 150000 };
  model.fixedCosts = [
    emptyCostItem("fixed-recurring", {
      name: "Account executives",
      category: "employees",
      amount: 250000,
      frequency: "monthly",
    }),
    emptyCostItem("fixed-recurring", {
      name: "Compliance and legal",
      category: "legal",
      amount: 80000,
      frequency: "monthly",
    }),
  ];
  model.variableCosts = [
    emptyCostItem("variable-per-customer", {
      name: "Dedicated infrastructure",
      category: "infrastructure",
      amount: 3000,
      frequency: "monthly",
    }),
  ];
  model.investments = [
    emptyInvestmentItem({
      name: "Platform engineering",
      category: "development",
      amount: 1500000,
    }),
  ];
  model.projectionSettings.horizonMonths = 24;
  return model;
}

export const MODEL_TEMPLATES: ReadonlyArray<ModelTemplate> = [
  {
    id: "saas-product",
    label: "SaaS Product",
    description: "Subscription business with growth and churn.",
    build: saasExample,
  },
  {
    id: "digital-product",
    label: "Micro-Payment Product",
    description: "One-time low-price product at volume.",
    build: microPaymentExample,
  },
  {
    id: "enterprise-product",
    label: "Enterprise Product",
    description: "High-ticket B2B contracts.",
    build: enterpriseExample,
  },
];

export function templateById(id: string): ModelTemplate | null {
  return MODEL_TEMPLATES.find((t) => t.id === id) ?? null;
}

export function blankModelOptions(): Array<{
  businessType: BusinessModel["businessType"];
  label: string;
}> {
  return [
    { businessType: "one-time-product", label: "One-time Product" },
    { businessType: "subscription-saas", label: "Subscription / SaaS" },
    { businessType: "service", label: "Service" },
    { businessType: "b2b-enterprise", label: "B2B / Enterprise" },
    { businessType: "ecommerce", label: "E-commerce" },
    { businessType: "marketplace", label: "Marketplace" },
    { businessType: "hybrid", label: "Hybrid" },
    { businessType: "custom", label: "Custom" },
  ];
}
