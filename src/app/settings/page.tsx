"use client";

import { useRef, useState } from "react";
import { Download, Upload, RotateCcw } from "lucide-react";
import { usePreferences, THEMES, CURSOR_VARIANTS, type ThemeId, type CursorVariant } from "@/stores/preferences";
import { useModelStore } from "@/stores/model-store";
import { CURRENCIES } from "@/domain/primitives/currency";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import {
  CONTEXT_MENU_SIMPLE,
  CONTEXT_MENU_GROUPS,
} from "@/components/context-menu-items";

function ContextToggle({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-[var(--radius-base)] px-1 py-1">
      <label htmlFor={`ctx-${id}`} className="text-xs text-foreground">
        {label}
      </label>
      <input
        id={`ctx-${id}`}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-[var(--accent)]"
      />
    </li>
  );
}

function CursorPreview({ variant }: { variant: CursorVariant }) {
  const c = "var(--accent)";
  const size = 18;
  return (
    <span className="relative grid h-6 w-6 place-items-center" aria-hidden="true">
      <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
        {variant === "dot-ring" || variant === "ring" || variant === "ring-dot" ? (
          <circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5" opacity="0.6" />
        ) : variant === "halo" ? (
          <circle cx="10" cy="10" r="8" fill={c} opacity="0.25" />
        ) : variant === "diamond" || variant === "square" ? (
          <rect
            x="4"
            y="4"
            width="12"
            height="12"
            stroke={c}
            strokeWidth="1.5"
            opacity="0.6"
            transform={variant === "diamond" ? "rotate(45 10 10)" : undefined}
          />
        ) : variant === "crosshair" ? (
          <>
            <line x1="2" y1="10" x2="8" y2="10" stroke={c} strokeWidth="1.3" />
            <line x1="12" y1="10" x2="18" y2="10" stroke={c} strokeWidth="1.3" />
            <line x1="10" y1="2" x2="10" y2="8" stroke={c} strokeWidth="1.3" />
            <line x1="10" y1="12" x2="10" y2="18" stroke={c} strokeWidth="1.3" />
          </>
        ) : variant === "chevron" ? (
          <path
            d="M6 6L13 10L6 14"
            stroke={c}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : variant === "triangle" ? (
          <path d="M10 4L17 15H3Z" fill={c} opacity="0.85" />
        ) : variant === "pulse" ? (
          <>
            <circle cx="10" cy="10" r="2.5" fill={c} />
            <circle cx="10" cy="10" r="7" stroke={c} strokeWidth="1" opacity="0.5" />
          </>
        ) : variant === "asterisk" ? (
          <>
            <line x1="10" y1="3" x2="10" y2="17" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
            <line x1="3" y1="10" x2="17" y2="10" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
            <line x1="5" y1="5" x2="15" y2="15" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
            <line x1="15" y1="5" x2="5" y2="15" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
          </>
        ) : variant === "cat-eye" ? (
          <>
            <ellipse cx="10" cy="10" rx="8" ry="3.5" stroke={c} strokeWidth="1.3" />
            <ellipse cx="10" cy="10" rx="2.4" ry="3" fill={c} />
          </>
        ) : variant === "swirl" ? (
          <path
            d="M10 4C12.8 4 15 6.2 15 9C15 11.8 12.8 14 10 14C8.2 14 6.8 12.6 6.8 10.8C6.8 9 8.2 7.6 10 7.6C11 7.6 11.6 8.2 11.6 9.2C11.6 9.8 11.1 10.4 10.4 10.4"
            stroke={c}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ) : null}
      </svg>
      {variant === "dot" || variant === "dot-ring" || variant === "ring-dot" || variant === "diamond" || variant === "square" || variant === "halo" ? (
        <span
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: variant === "ring-dot" ? 3 : 5,
            height: variant === "ring-dot" ? 3 : 5,
            backgroundColor: c,
            transform: "translate(-50%, -50%)",
          }}
        />
      ) : null}
    </span>
  );
}

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
        <CardHeader title="Cursor and menu" subtitle="Pointer style and right-click menu" />
        <CardBody className="grid gap-4">
          <Field label="Cursor style" htmlFor="set-cursor">
            <Select
              id="set-cursor"
              value={prefs.cursorStyle}
              onChange={(e) =>
                prefs.setCursorStyle(e.target.value as typeof prefs.cursorStyle)
              }
            >
              <option value="custom">Custom cursor</option>
              <option value="default">Browser default</option>
            </Select>
          </Field>
          {prefs.cursorStyle === "custom" ? (
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
                Cursor variant
              </p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {CURSOR_VARIANTS.map(({ id, label }) => {
                  const active = prefs.cursorVariant === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => prefs.setCursorVariant(id as CursorVariant)}
                      className={`flex flex-col items-center gap-1.5 rounded-[var(--radius-base)] border px-2 py-2.5 text-[11px] font-medium transition-all ${
                        active
                          ? "border-accent bg-accent-subtle text-foreground shadow-sm"
                          : "border-border bg-surface-secondary text-muted-foreground hover:border-border-strong hover:text-foreground"
                      }`}
                    >
                      <CursorPreview variant={id} />
                      <span className="truncate w-full text-center">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
          <label className="flex items-center justify-between gap-3 rounded-[var(--radius-base)] border border-border bg-surface-secondary px-3 py-2.5">
            <span className="text-sm">Show custom right-click menu</span>
            <input
              type="checkbox"
              checked={prefs.contextMenu.enabled}
              onChange={(e) => prefs.setContextMenu({ enabled: e.target.checked })}
              className="h-4 w-4 accent-[var(--accent)]"
            />
          </label>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Context menu items"
          subtitle="Choose which entries appear in the right-click menu"
        />
        <CardBody>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
            Top level
          </p>
          <ul className="space-y-1">
            {CONTEXT_MENU_SIMPLE.map((item) => (
              <ContextToggle
                key={item.id}
                id={item.id}
                label={item.label}
                checked={!prefs.contextMenu.disabledItems.includes(item.id)}
                onChange={() => prefs.toggleContextMenuItem(item.id)}
              />
            ))}
          </ul>
          {CONTEXT_MENU_GROUPS.length > 0 ? (
            <>
              <p className="mb-2 mt-5 text-[11px] font-semibold uppercase tracking-wider text-muted">
                Submenus
              </p>
              <ul className="space-y-1">
                {CONTEXT_MENU_GROUPS.map((group) => (
                  <li
                    key={group.id}
                    className="rounded-[var(--radius-base)] border border-border bg-surface-secondary px-3 py-2"
                  >
                    <p className="pb-1 text-xs font-medium">{group.label}</p>
                    <ul className="space-y-1">
                      {group.items.map((item) => {
                        const id = `${group.id}:${item.id}`;
                        return (
                          <ContextToggle
                            key={id}
                            id={id}
                            label={item.label}
                            checked={!prefs.contextMenu.disabledItems.includes(id)}
                            onChange={() => prefs.toggleContextMenuItem(id)}
                          />
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
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
