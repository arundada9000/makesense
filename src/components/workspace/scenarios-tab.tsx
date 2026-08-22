"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { BusinessModel, OverrideField, Scenario } from "@/domain/model/types";
import { OVERRIDE_FIELDS } from "@/domain/model/types";
import { applyScenario } from "@/domain/scenarios/apply-scenario";
import { analyzeModel, compareAnalyses } from "@/domain/scenarios/compare-scenarios";
import { useModelStore } from "@/stores/model-store";
import { formatMoney, formatNumber, formatPercent } from "@/lib/format";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, NumberInput, TextInput } from "@/components/ui/field";
import { Select } from "@/components/ui/select";

export function WorkspaceScenariosTab({ model }: { model: BusinessModel }) {
  const updateModel = useModelStore((s) => s.updateModel);
  const [editingId, setEditingId] = useState<string | null>(null);

  const patch = (fn: (m: BusinessModel) => void) =>
    void updateModel(model.id, fn);

  const comparison = useMemo(() => {
    const entries = [
      { name: "Base", analysis: analyzeModel(model) },
      ...model.scenarios.map((s) => ({
        name: s.name,
        analysis: analyzeModel(applyScenario(model, s)),
      })),
    ];
    return compareAnalyses(entries);
  }, [model]);

  const editing = model.scenarios.find((s) => s.id === editingId) ?? null;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title="Scenarios"
          subtitle="Each scenario overrides selected assumptions; the base model is never changed"
          actions={
            <Button
              variant="secondary"
              onClick={() => {
                const id = `scn-${Date.now().toString(36)}`;
                patch((m) =>
                  void m.scenarios.push({
                    id,
                    name: `Scenario ${m.scenarios.length + 1}`,
                    overrides: [],
                  })
                );
                setEditingId(id);
              }}
            >
              <Plus className="h-3.5 w-3.5" /> New scenario
            </Button>
          }
        />
        <CardBody className="space-y-2">
          {model.scenarios.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No custom scenarios yet. The three built-in cases below always run.
            </p>
          ) : null}
          {model.scenarios.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between gap-3 rounded-[var(--radius-base)] border border-border bg-surface-secondary px-3 py-2.5"
            >
              <button
                type="button"
                className="min-w-0 flex-1 text-left"
                onClick={() => setEditingId(s.id === editingId ? null : s.id)}
              >
                <p className="truncate text-sm font-medium">{s.name}</p>
                <p className="text-xs text-muted">
                  {s.overrides.length} override{s.overrides.length === 1 ? "" : "s"}
                </p>
              </button>
              <Button
                variant="ghost"
                aria-label={`Delete ${s.name}`}
                onClick={() => {
                  patch(
                    (m) => void (m.scenarios = m.scenarios.filter((x) => x.id !== s.id))
                  );
                  if (editingId === s.id) setEditingId(null);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </CardBody>
      </Card>

      {editing ? (
        <ScenarioEditor
          key={editing.id}
          scenario={editing}
          onChange={(fn) =>
            patch((m) => {
              const target = m.scenarios.find((x) => x.id === editing.id);
              if (target) fn(target);
            })
          }
        />
      ) : null}

      <Card>
        <CardHeader
          title="Comparison"
          subtitle="Base versus every scenario across the full horizon"
        />
        <CardBody className="px-0 py-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm tabular-nums">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-4 py-2.5 font-medium">Metric</th>
                  {["Base", ...model.scenarios.map((s) => s.name)].map((name) => (
                    <th key={name} className="px-4 py-2.5 text-right font-medium">
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.metric} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.label}</td>
                    {row.values.map((v, i) => (
                      <td key={i} className="px-4 py-2.5 text-right font-medium">
                        {formatCell(row.metric, v, model.baseCurrency)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function ScenarioEditor({
  scenario,
  onChange,
}: {
  scenario: Scenario;
  onChange: (fn: (s: Scenario) => void) => void;
}) {
  return (
    <Card>
      <CardHeader title={`Edit: ${scenario.name}`} subtitle="Overrides apply in order" />
      <CardBody className="space-y-4">
        <Field label="Scenario name" htmlFor={`scn-name-${scenario.id}`}>
          <TextInput
            id={`scn-name-${scenario.id}`}
            value={scenario.name}
            onChange={(e) => onChange((s) => void (s.name = e.target.value))}
          />
        </Field>

        {scenario.overrides.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            This scenario currently matches the base model exactly.
          </p>
        ) : null}

        {scenario.overrides.map((ov, index) => (
          <div
            key={`${ov.field}-${index}`}
            className="grid gap-3 rounded-[var(--radius-base)] border border-border bg-surface-secondary p-3 sm:grid-cols-[1fr_auto_auto_auto]"
          >
            <Field label="Assumption" htmlFor={`ov-field-${index}`}>
              <Select
                id={`ov-field-${index}`}
                value={ov.field}
                onChange={(e) =>
                  onChange((s) => {
                    s.overrides[index].field = e.target.value as OverrideField;
                  })
                }
              >
                {OVERRIDE_FIELDS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Operation" htmlFor={`ov-op-${index}`}>
              <Select
                id={`ov-op-${index}`}
                value={ov.op}
                onChange={(e) =>
                  onChange((s) => {
                    s.overrides[index].op = e.target.value as typeof ov.op;
                  })
                }
              >
                <option value="set">Set to</option>
                <option value="percent-change">Change by %</option>
              </Select>
            </Field>
            <Field label="Value" htmlFor={`ov-val-${index}`}>
              <NumberInput
                id={`ov-val-${index}`}
                value={ov.value}
                allowNegative
                onValueChange={(v) =>
                  onChange((s) => {
                    s.overrides[index].value = v;
                  })
                }
              />
            </Field>
            <div className="flex items-end pb-0.5">
              <Button
                variant="ghost"
                aria-label="Remove override"
                onClick={() =>
                  onChange((s) => {
                    s.overrides.splice(index, 1);
                  })
                }
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}

        <Button
          variant="secondary"
          onClick={() =>
            onChange((s) =>
              void s.overrides.push({ field: "price", op: "percent-change", value: 10 })
            )
          }
        >
          <Plus className="h-3.5 w-3.5" /> Add override
        </Button>
      </CardBody>
    </Card>
  );
}

function formatCell(
  metric: string,
  value: import("@/domain/primitives/money").Decimal | null,
  currency: string
): string {
  if (value === null) return "-";
  switch (metric) {
    case "netMargin":
    case "roi":
      return formatPercent(value, { decimals: 1 });
    case "endingCustomers":
    case "breakEvenCustomers":
    case "paybackMonths":
    case "runwayMonths":
      return formatNumber(value, { decimals: 1 });
    default:
      return formatMoney(value, currency, { style: "compact", signed: true });
  }
}
