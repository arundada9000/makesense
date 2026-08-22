"use client";

import { Trash2, Plus } from "lucide-react";
import type {
  BusinessModel,
  CostCategory,
  CostFrequency,
  CostItem,
  CostKind,
  GrowthMode,
  InvestmentCategory,
  StreamType,
} from "@/domain/model/types";
import {
  BUSINESS_TYPES,
  COST_CATEGORIES,
  STREAM_TYPES,
} from "@/domain/model/types";
import { CURRENCIES } from "@/domain/primitives/currency";
import { emptyCostItem, emptyInvestmentItem, emptyRevenueStream } from "@/domain/model/defaults";
import { useModelStore } from "@/stores/model-store";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, NumberInput, TextInput } from "@/components/ui/field";
import { Select } from "@/components/ui/select";

export function WorkspaceAssumptionsTab({ model }: { model: BusinessModel }) {
  const updateModel = useModelStore((s) => s.updateModel);

  const patch = (fn: (m: BusinessModel) => void) =>
    void updateModel(model.id, fn);

  return (
    <div className="space-y-4">
      <BasicsCard model={model} patch={patch} />
      <CustomersCard model={model} patch={patch} />
      <RevenueStreamsCard model={model} patch={patch} />
      <FixedCostsCard model={model} patch={patch} />
      <VariableCostsCard model={model} patch={patch} />
      <InvestmentCard model={model} patch={patch} />
    </div>
  );
}

type Patch = (fn: (m: BusinessModel) => void) => void;

function BasicsCard({ model, patch }: { model: BusinessModel; patch: Patch }) {
  return (
    <Card>
      <CardHeader
        title="Basics"
        subtitle="Identity and projection window for this model"
      />
      <CardBody className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Model name" htmlFor="basics-name">
          <TextInput
            id="basics-name"
            value={model.name}
            onChange={(e) => patch((m) => void (m.name = e.target.value))}
          />
        </Field>
        <Field label="Business type" htmlFor="basics-type">
          <Select
            id="basics-type"
            value={model.businessType}
            onChange={(e) =>
              patch(
                (m) =>
                  void (m.businessType = e.target.value as BusinessModel["businessType"])
              )
            }
          >
            {BUSINESS_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Base currency" htmlFor="basics-currency">
          <Select
            id="basics-currency"
            value={model.baseCurrency}
            onChange={(e) => patch((m) => void (m.baseCurrency = e.target.value))}
          >
            {Object.values(CURRENCIES).map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          label="Horizon"
          htmlFor="basics-horizon"
          help={`${model.projectionSettings.horizonMonths} months`}
        >
          <NumberInput
            id="basics-horizon"
            value={model.projectionSettings.horizonMonths}
            min={1}
            max={120}
            onValueChange={(v) =>
              patch(
                (m) =>
                  void (m.projectionSettings.horizonMonths = Math.min(
                    120,
                    Math.max(1, Math.round(v))
                  ))
              )
            }
          />
        </Field>
        <Field label="Starting cash" htmlFor="basics-cash">
          <NumberInput
            id="basics-cash"
            value={model.projectionSettings.startingCash}
            onValueChange={(v) =>
              patch((m) => void (m.projectionSettings.startingCash = v))
            }
          />
        </Field>
        <Field label="Description" htmlFor="basics-desc" help="Optional notes">
          <TextInput
            id="basics-desc"
            value={model.description}
            onChange={(e) => patch((m) => void (m.description = e.target.value))}
          />
        </Field>
      </CardBody>
    </Card>
  );
}

function CustomersCard({ model, patch }: { model: BusinessModel; patch: Patch }) {
  const c = model.customers;
  return (
    <Card>
      <CardHeader
        title="Customers"
        subtitle="Where the customer count starts and how it moves"
      />
      <CardBody className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Starting customers" htmlFor="cust-start">
          <NumberInput
            id="cust-start"
            value={c.startingCustomers}
            onValueChange={(v) =>
              patch((m) => void (m.customers.startingCustomers = v))
            }
          />
        </Field>
        <Field label="Growth mode" htmlFor="cust-growth-mode">
          <Select
            id="cust-growth-mode"
            value={c.growthMode}
            onChange={(e) =>
              patch(
                (m) => void (m.customers.growthMode = e.target.value as GrowthMode)
              )
            }
          >
            <option value="none">No growth</option>
            <option value="fixed">Fixed per month</option>
            <option value="percentage">Percentage per month</option>
            <option value="custom-monthly">Custom monthly schedule</option>
          </Select>
        </Field>
        {c.growthMode === "fixed" ? (
          <Field label="New customers / month" htmlFor="cust-growth-fixed">
            <NumberInput
              id="cust-growth-fixed"
              value={c.fixedGrowthPerMonth}
              allowNegative
              onValueChange={(v) =>
                patch((m) => void (m.customers.fixedGrowthPerMonth = v))
              }
            />
          </Field>
        ) : null}
        {c.growthMode === "percentage" ? (
          <Field label="Monthly growth %" htmlFor="cust-growth-pct" suffix="%">
            <NumberInput
              id="cust-growth-pct"
              value={c.percentageGrowthPerMonth}
              allowNegative
              onValueChange={(v) =>
                patch((m) => void (m.customers.percentageGrowthPerMonth = v))
              }
            />
          </Field>
        ) : null}
        <Field
          label="Monthly churn %"
          htmlFor="cust-churn"
          suffix="%"
          help="Share of customers lost each month"
        >
          <NumberInput
            id="cust-churn"
            value={c.monthlyChurnRatePercent}
            onValueChange={(v) =>
              patch(
                (m) =>
                  void (m.customers.monthlyChurnRatePercent = Math.min(100, v))
              )
            }
          />
        </Field>
        <Field
          label="Marketing budget / month"
          htmlFor="cust-marketing"
          help="Used to estimate acquisition cost"
        >
          <NumberInput
            id="cust-marketing"
            value={model.marketing.monthlyBudget}
            onValueChange={(v) => patch((m) => void (m.marketing.monthlyBudget = v))}
          />
        </Field>
      </CardBody>
    </Card>
  );
}

function RevenueStreamsCard({
  model,
  patch,
}: {
  model: BusinessModel;
  patch: Patch;
}) {
  return (
    <Card>
      <CardHeader
        title="Revenue streams"
        subtitle="Each stream describes how money comes in"
        actions={
          <Button
            variant="secondary"
            onClick={() =>
              patch((m) => void m.revenueStreams.push(emptyRevenueStream()))
            }
          >
            <Plus className="h-3.5 w-3.5" /> Add stream
          </Button>
        }
      />
      <CardBody className="space-y-3">
        {model.revenueStreams.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No streams yet. Add at least one so revenue can be projected.
          </p>
        ) : null}
        {model.revenueStreams.map((stream, index) => (
          <StreamEditor
            key={stream.id}
            stream={stream}
            currencySymbol=""
            index={index}
            onChange={(fn) =>
              patch((m) => {
                const target = m.revenueStreams.find((s) => s.id === stream.id);
                if (target) fn(target);
              })
            }
            onRemove={() =>
              patch(
                (m) =>
                  void (m.revenueStreams = m.revenueStreams.filter(
                    (s) => s.id !== stream.id
                  ))
              )
            }
          />
        ))}
      </CardBody>
    </Card>
  );
}

function StreamEditor({
  stream,
  index,
  onChange,
  onRemove,
}: {
  stream: BusinessModel["revenueStreams"][number];
  currencySymbol?: string;
  index: number;
  onChange: (fn: (s: BusinessModel["revenueStreams"][number]) => void) => void;
  onRemove: () => void;
}) {
  const idPrefix = `stream-${stream.id}`;
  return (
    <div className="rounded-[var(--radius-base)] border border-border bg-surface-secondary p-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Stream {index + 1}
        </p>
        <Button variant="ghost" onClick={onRemove} aria-label={`Remove ${stream.name}`}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Name" htmlFor={`${idPrefix}-name`}>
          <TextInput
            id={`${idPrefix}-name`}
            value={stream.name}
            onChange={(e) => onChange((s) => void (s.name = e.target.value))}
          />
        </Field>
        <Field label="Type" htmlFor={`${idPrefix}-type`}>
          <Select
            id={`${idPrefix}-type`}
            value={stream.type}
            onChange={(e) =>
              onChange((s) => void (s.type = e.target.value as StreamType))
            }
          >
            {STREAM_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          label={
            stream.type === "usage-based"
              ? "Unit price"
              : stream.type === "commission"
                ? "Commission basis"
                : "Price"
          }
          htmlFor={`${idPrefix}-price`}
        >
          <NumberInput
            id={`${idPrefix}-price`}
            value={stream.price}
            onValueChange={(v) => onChange((s) => void (s.price = v))}
          />
        </Field>
        <Field
          label="Customers served"
          htmlFor={`${idPrefix}-count`}
          help="Informational; totals follow the Customers card"
        >
          <NumberInput
            id={`${idPrefix}-count`}
            value={stream.customerCount}
            onValueChange={(v) => onChange((s) => void (s.customerCount = v))}
          />
        </Field>
        {stream.type === "usage-based" ? (
          <Field label="Units / customer / month" htmlFor={`${idPrefix}-units`}>
            <NumberInput
              id={`${idPrefix}-units`}
              value={stream.usageUnitsPerMonth ?? 0}
              onValueChange={(v) => onChange((s) => void (s.usageUnitsPerMonth = v))}
            />
          </Field>
        ) : null}
        {stream.type === "commission" ? (
          <>
            <Field label="Avg order value" htmlFor={`${idPrefix}-aov`}>
              <NumberInput
                id={`${idPrefix}-aov`}
                value={stream.averageOrderValue ?? 0}
                onValueChange={(v) =>
                  onChange((s) => void (s.averageOrderValue = v))
                }
              />
            </Field>
            <Field label="Commission %" htmlFor={`${idPrefix}-comm`} suffix="%">
              <NumberInput
                id={`${idPrefix}-comm`}
                value={stream.commissionPercent ?? 0}
                onValueChange={(v) =>
                  onChange((s) => void (s.commissionPercent = v))
                }
              />
            </Field>
          </>
        ) : null}
        <Field label="Discount %" htmlFor={`${idPrefix}-disc`} suffix="%">
          <NumberInput
            id={`${idPrefix}-disc`}
            value={stream.discountPercent}
            onValueChange={(v) => onChange((s) => void (s.discountPercent = v))}
          />
        </Field>
        <Field label="Refund rate %" htmlFor={`${idPrefix}-refund`} suffix="%">
          <NumberInput
            id={`${idPrefix}-refund`}
            value={stream.refundRate}
            onValueChange={(v) => onChange((s) => void (s.refundRate = v))}
          />
        </Field>
      </div>
    </div>
  );
}

function FixedCostsCard({ model, patch }: { model: BusinessModel; patch: Patch }) {
  return (
    <Card>
      <CardHeader
        title="Fixed costs"
        subtitle="Recurring costs that do not scale with customers"
        actions={
          <Button
            variant="secondary"
            onClick={() =>
              patch((m) =>
                void m.fixedCosts.push(emptyCostItem("fixed-recurring"))
              )
            }
          >
            <Plus className="h-3.5 w-3.5" /> Add cost
          </Button>
        }
      />
      <CardBody className="space-y-3">
        {model.fixedCosts.length === 0 ? (
          <p className="text-xs text-muted-foreground">No fixed costs yet.</p>
        ) : null}
        {model.fixedCosts.map((cost) => (
          <CostEditor
            key={cost.id}
            cost={cost}
            showKind={false}
            onChange={(fn) =>
              patch((m) => {
                const target = m.fixedCosts.find((c) => c.id === cost.id);
                if (target) fn(target);
              })
            }
            onRemove={() =>
              patch(
                (m) => void (m.fixedCosts = m.fixedCosts.filter((c) => c.id !== cost.id))
              )
            }
          />
        ))}
      </CardBody>
    </Card>
  );
}

function VariableCostsCard({
  model,
  patch,
}: {
  model: BusinessModel;
  patch: Patch;
}) {
  return (
    <Card>
      <CardHeader
        title="Variable costs"
        subtitle="Costs that scale with customers or orders"
        actions={
          <Button
            variant="secondary"
            onClick={() =>
              patch((m) =>
                void m.variableCosts.push(emptyCostItem("variable-per-customer"))
              )
            }
          >
            <Plus className="h-3.5 w-3.5" /> Add cost
          </Button>
        }
      />
      <CardBody className="space-y-3">
        {model.variableCosts.length === 0 ? (
          <p className="text-xs text-muted-foreground">No variable costs yet.</p>
        ) : null}
        {model.variableCosts.map((cost) => (
          <CostEditor
            key={cost.id}
            cost={cost}
            showKind
            onChange={(fn) =>
              patch((m) => {
                const target = m.variableCosts.find((c) => c.id === cost.id);
                if (target) fn(target);
              })
            }
            onRemove={() =>
              patch(
                (m) =>
                  void (m.variableCosts = m.variableCosts.filter(
                    (c) => c.id !== cost.id
                  ))
              )
            }
          />
        ))}
      </CardBody>
    </Card>
  );
}

function CostEditor({
  cost,
  showKind,
  onChange,
  onRemove,
}: {
  cost: CostItem;
  showKind: boolean;
  onChange: (fn: (c: CostItem) => void) => void;
  onRemove: () => void;
}) {
  const idPrefix = `cost-${cost.id}`;
  return (
    <div className="rounded-[var(--radius-base)] border border-border bg-surface-secondary p-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          {cost.name || "Cost"}
        </p>
        <Button variant="ghost" onClick={onRemove} aria-label={`Remove ${cost.name}`}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Name" htmlFor={`${idPrefix}-name`}>
          <TextInput
            id={`${idPrefix}-name`}
            value={cost.name}
            onChange={(e) => onChange((c) => void (c.name = e.target.value))}
          />
        </Field>
        <Field label="Category" htmlFor={`${idPrefix}-cat`}>
          <Select
            id={`${idPrefix}-cat`}
            value={cost.category}
            onChange={(e) =>
              onChange((c) => void (c.category = e.target.value as CostCategory))
            }
          >
            {COST_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </Select>
        </Field>
        {showKind ? (
          <Field label="Scales with" htmlFor={`${idPrefix}-kind`}>
            <Select
              id={`${idPrefix}-kind`}
              value={cost.kind}
              onChange={(e) =>
                onChange((c) => void (c.kind = e.target.value as CostKind))
              }
            >
              <option value="variable-per-customer">Per customer</option>
              <option value="variable-per-order">Per order</option>
            </Select>
          </Field>
        ) : null}
        <Field label="Amount" htmlFor={`${idPrefix}-amount`}>
          <NumberInput
            id={`${idPrefix}-amount`}
            value={cost.amount}
            onValueChange={(v) => onChange((c) => void (c.amount = v))}
          />
        </Field>
        <Field label="Frequency" htmlFor={`${idPrefix}-freq`}>
          <Select
            id={`${idPrefix}-freq`}
            value={cost.frequency}
            onChange={(e) =>
              onChange(
                (c) => void (c.frequency = e.target.value as CostFrequency)
              )
            }
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
            <option value="one-time">One-time</option>
          </Select>
        </Field>
        {cost.kind === "variable-per-order" ? (
          <Field label="Orders / customer / month" htmlFor={`${idPrefix}-orders`}>
            <NumberInput
              id={`${idPrefix}-orders`}
              value={cost.ordersPerCustomerPerMonth ?? 1}
              onValueChange={(v) =>
                onChange((c) => void (c.ordersPerCustomerPerMonth = v))
              }
            />
          </Field>
        ) : null}
      </div>
    </div>
  );
}

function InvestmentCard({ model, patch }: { model: BusinessModel; patch: Patch }) {
  const total = model.investments.reduce((sum, i) => sum + i.amount, 0);
  return (
    <Card>
      <CardHeader
        title="Initial investment"
        subtitle={`One-off spend before launch | total ${total.toLocaleString()}`}
        actions={
          <Button
            variant="secondary"
            onClick={() => patch((m) => void m.investments.push(emptyInvestmentItem()))}
          >
            <Plus className="h-3.5 w-3.5" /> Add item
          </Button>
        }
      />
      <CardBody className="space-y-3">
        {model.investments.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No investment recorded. ROI and payback need an investment figure.
          </p>
        ) : null}
        {model.investments.map((inv) => {
          const idPrefix = `inv-${inv.id}`;
          return (
            <div
              key={inv.id}
              className="rounded-[var(--radius-base)] border border-border bg-surface-secondary p-3"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {inv.name || "Investment"}
                </p>
                <Button
                  variant="ghost"
                  aria-label={`Remove ${inv.name}`}
                  onClick={() =>
                    patch(
                      (m) =>
                        void (m.investments = m.investments.filter(
                          (i) => i.id !== inv.id
                        ))
                    )
                  }
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Name" htmlFor={`${idPrefix}-name`}>
                  <TextInput
                    id={`${idPrefix}-name`}
                    value={inv.name}
                    onChange={(e) =>
                      patch((m) => {
                        const t = m.investments.find((i) => i.id === inv.id);
                        if (t) t.name = e.target.value;
                      })
                    }
                  />
                </Field>
                <Field label="Category" htmlFor={`${idPrefix}-cat`}>
                  <Select
                    id={`${idPrefix}-cat`}
                    value={inv.category}
                    onChange={(e) =>
                      patch((m) => {
                        const t = m.investments.find((i) => i.id === inv.id);
                        if (t) t.category = e.target.value as InvestmentCategory;
                      })
                    }
                  >
                    {(
                      [
                        "development",
                        "equipment",
                        "branding",
                        "marketing",
                        "legal",
                        "office",
                        "other",
                      ] as InvestmentCategory[]
                    ).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat[0].toUpperCase()}
                        {cat.slice(1)}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Amount" htmlFor={`${idPrefix}-amount`}>
                  <NumberInput
                    id={`${idPrefix}-amount`}
                    value={inv.amount}
                    onValueChange={(v) =>
                      patch((m) => {
                        const t = m.investments.find((i) => i.id === inv.id);
                        if (t) t.amount = v;
                      })
                    }
                  />
                </Field>
              </div>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
