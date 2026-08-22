"use client";

import { useRef, useState } from "react";
import { Download, Upload, RotateCcw } from "lucide-react";
import { usePreferences, THEMES, type ThemeId } from "@/stores/preferences";
import { useModelStore } from "@/stores/model-store";
import { CURRENCIES } from "@/domain/primitives/currency";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";

export default function SettingsPage() {
  const prefs = usePreferences();
  const models = useModelStore((s) => s.models);
  const resetAll = useModelStore((s) => s.resetAll);
  const replaceModel = useModelStore((s) => s.replaceModel);
  const fileRef = useRef<HTMLInputElement>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  function exportAll() {
    const payload = {
      app: "makesense",
      version: 1,
      exportedAt: new Date().toISOString(),
      models,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `makesense-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importFile(file: File) {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as { models?: unknown[] };
      if (!Array.isArray(parsed.models)) {
        setImportMessage("That file does not look like a MakeSense backup.");
        return;
      }
      let imported = 0;
      for (const raw of parsed.models) {
        if (
          typeof raw === "object" &&
          raw !== null &&
          "id" in raw &&
          "schemaVersion" in raw
        ) {
          await replaceModel(raw as never);
          imported += 1;
        }
      }
      setImportMessage(
        imported > 0
          ? `Imported ${imported} model${imported === 1 ? "" : "s"}.`
          : "No valid models found in that file."
      );
    } catch {
      setImportMessage("Could not read that file. Is it valid JSON?");
    }
  }

  return (
    <div className="space-y-5 py-2">
      <header>
        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
          Settings
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Preferences are stored on this device only.
        </p>
      </header>

      <Card>
        <CardHeader title="Appearance" subtitle="Theme, density and motion" />
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <Field label="Light theme" htmlFor="set-light">
            <Select
              id="set-light"
              value={prefs.lightTheme}
              onChange={(e) =>
                prefs.setLightTheme(e.target.value as ThemeId)
              }
            >
              {THEMES.filter((t) => t.mode === "light").map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Dark theme" htmlFor="set-dark">
            <Select
              id="set-dark"
              value={prefs.darkTheme}
              onChange={(e) => prefs.setDarkTheme(e.target.value as ThemeId)}
            >
              {THEMES.filter((t) => t.mode === "dark").map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Follow system theme" htmlFor="set-mode">
            <Select
              id="set-mode"
              value={prefs.themeMode}
              onChange={(e) =>
                prefs.setThemeMode(e.target.value as typeof prefs.themeMode)
              }
            >
              <option value="system">System</option>
              <option value="light">Always light</option>
              <option value="dark">Always dark</option>
            </Select>
          </Field>
          <Field label="Density" htmlFor="set-density">
            <Select
              id="set-density"
              value={prefs.density}
              onChange={(e) =>
                prefs.setDensity(e.target.value as typeof prefs.density)
              }
            >
              <option value="compact">Compact</option>
              <option value="comfortable">Comfortable</option>
              <option value="spacious">Spacious</option>
            </Select>
          </Field>
          <Field
            label="Text size"
            htmlFor="set-font"
            help={`${Math.round(prefs.fontScale * 100)} percent`}
          >
            <input
              id="set-font"
              type="range"
              min={85}
              max={140}
              step={5}
              value={Math.round(prefs.fontScale * 100)}
              onChange={(e) => prefs.setFontScale(Number(e.target.value) / 100)}
              className="h-11 w-full accent-[var(--accent)]"
            />
          </Field>
          <Field label="Number display" htmlFor="set-numstyle">
            <Select
              id="set-numstyle"
              value={prefs.numberStyle}
              onChange={(e) =>
                prefs.setNumberStyle(
                  e.target.value as typeof prefs.numberStyle
                )
              }
            >
              <option value="compact">Compact (12.5K)</option>
              <option value="exact">Exact (12,500)</option>
            </Select>
          </Field>
          <label className="flex items-center justify-between gap-3 rounded-[var(--radius-base)] border border-border bg-surface-secondary px-3 py-2.5 sm:col-span-2">
            <span className="text-sm">Reduce motion</span>
            <input
              type="checkbox"
              checked={prefs.reducedMotion}
              onChange={(e) => prefs.setReducedMotion(e.target.checked)}
              className="h-4 w-4 accent-[var(--accent)]"
            />
          </label>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Defaults" subtitle="Applied to new models" />
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <Field label="Default currency" htmlFor="set-currency">
            <Select
              id="set-currency"
              value={prefs.defaultCurrency}
              onChange={(e) => prefs.setDefaultCurrency(e.target.value)}
            >
              {Object.values(CURRENCIES).map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} {c.name}
                </option>
              ))}
            </Select>
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Data"
          subtitle={`${models.length} model${models.length === 1 ? "" : "s"} on this device`}
        />
        <CardBody className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={exportAll}>
              <Download className="h-3.5 w-3.5" /> Export backup
            </Button>
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>
              <Upload className="h-3.5 w-3.5" /> Import backup
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (
                  window.confirm(
                    "Delete every model on this device and restore the starter examples?"
                  )
                ) {
                  void resetAll();
                }
              }}
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset all data
            </Button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void importFile(file);
              e.target.value = "";
            }}
          />
          {importMessage ? (
            <p role="status" className="text-xs text-muted-foreground">
              {importMessage}
            </p>
          ) : null}
          <p className="text-xs leading-relaxed text-muted">
            Models live in your browser storage. Export a backup before clearing
            site data or switching devices.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="About" />
        <CardBody>
          <p className="text-xs leading-relaxed text-muted-foreground">
            MakeSense Business Model Simulator. All calculations run locally in
            your browser; nothing is uploaded. Projections are mathematical
            consequences of your assumptions, not predictions.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
