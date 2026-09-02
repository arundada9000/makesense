"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ThemeId =
  | "apple-light"
  | "apple-dark"
  | "graphite"
  | "ocean"
  | "forest"
  | "paper"
  | "high-contrast";

export type ThemeMode = "system" | "light" | "dark" | "custom";

export const THEMES: ReadonlyArray<{ id: ThemeId; label: string; mode: "light" | "dark" }> = [
  { id: "apple-light", label: "Apple Light", mode: "light" },
  { id: "apple-dark", label: "Apple Dark", mode: "dark" },
  { id: "graphite", label: "Graphite", mode: "dark" },
  { id: "ocean", label: "Ocean", mode: "light" },
  { id: "forest", label: "Forest", mode: "light" },
  { id: "paper", label: "Paper", mode: "light" },
  { id: "high-contrast", label: "High Contrast", mode: "dark" },
];

export type Density = "compact" | "comfortable" | "spacious";

export type CursorStyle = "custom" | "default";

export type CursorVariant =
  | "dot-ring"
  | "dot"
  | "crosshair"
  | "halo"
  | "diamond"
  | "ring"
  | "ring-dot"
  | "chevron"
  | "triangle"
  | "pulse"
  | "asterisk"
  | "cat-eye"
  | "swirl"
  | "square";

export const CURSOR_VARIANTS: ReadonlyArray<{ id: CursorVariant; label: string }> = [
  { id: "dot-ring", label: "Dot + Ring" },
  { id: "dot", label: "Dot" },
  { id: "ring", label: "Ring" },
  { id: "ring-dot", label: "Ring + Dot" },
  { id: "halo", label: "Halo" },
  { id: "diamond", label: "Diamond" },
  { id: "chevron", label: "Chevron" },
  { id: "triangle", label: "Triangle" },
  { id: "pulse", label: "Pulse" },
  { id: "asterisk", label: "Asterisk" },
  { id: "cat-eye", label: "Cat Eye" },
  { id: "swirl", label: "Swirl" },
  { id: "square", label: "Square" },
  { id: "crosshair", label: "Crosshair" },
];

export interface ContextMenuConfig {
  enabled: boolean;
  disabledItems: string[];
}

const DEFAULT_CONTEXT_MENU_CONFIG: ContextMenuConfig = {
  enabled: true,
  disabledItems: [],
};

interface PreferencesState {
  themeMode: ThemeMode;
  lightTheme: ThemeId;
  darkTheme: ThemeId;
  customTheme: {
    accent: string;
    background: string;
    surface: string;
    border: string;
    radius: number;
  } | null;
  density: Density;
  fontScale: number;
  reducedMotion: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  hapticsEnabled: boolean;
  numberStyle: "exact" | "compact";
  defaultCurrency: string;
  cursorStyle: CursorStyle;
  cursorVariant: CursorVariant;
  contextMenu: ContextMenuConfig;
}

interface PreferencesActions {
  setThemeMode: (mode: ThemeMode) => void;
  setLightTheme: (theme: ThemeId) => void;
  setDarkTheme: (theme: ThemeId) => void;
  setCustomTheme: (theme: PreferencesState["customTheme"]) => void;
  setDensity: (density: Density) => void;
  setFontScale: (scale: number) => void;
  setReducedMotion: (value: boolean) => void;
  setSoundEnabled: (value: boolean) => void;
  setSoundVolume: (value: number) => void;
  setHapticsEnabled: (value: boolean) => void;
  setNumberStyle: (style: "exact" | "compact") => void;
  setDefaultCurrency: (currency: string) => void;
  setCursorStyle: (style: CursorStyle) => void;
  setCursorVariant: (variant: CursorVariant) => void;
  setContextMenu: (config: Partial<ContextMenuConfig>) => void;
  toggleContextMenuItem: (id: string) => void;
  resetPreferences: () => void;
}

const defaults: PreferencesState = {
  themeMode: "system",
  lightTheme: "apple-light",
  darkTheme: "apple-dark",
  customTheme: null,
  density: "comfortable",
  fontScale: 1,
  reducedMotion: false,
  soundEnabled: false,
  soundVolume: 0.5,
  hapticsEnabled: true,
  numberStyle: "compact",
  defaultCurrency: "NPR",
  cursorStyle: "custom",
  cursorVariant: "dot-ring",
  contextMenu: DEFAULT_CONTEXT_MENU_CONFIG,
};

export const usePreferences = create<PreferencesState & PreferencesActions>()(
  persist(
    (set) => ({
      ...defaults,
      setThemeMode: (themeMode) => set({ themeMode }),
      setLightTheme: (lightTheme) => set({ lightTheme }),
      setDarkTheme: (darkTheme) => set({ darkTheme }),
      setCustomTheme: (customTheme) =>
        set({ customTheme, themeMode: customTheme ? "custom" : "system" }),
      setDensity: (density) => set({ density }),
      setFontScale: (fontScale) =>
        set({ fontScale: Math.min(1.4, Math.max(0.85, fontScale)) }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setSoundVolume: (soundVolume) => set({ soundVolume }),
      setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
      setNumberStyle: (numberStyle) => set({ numberStyle }),
      setDefaultCurrency: (defaultCurrency) => set({ defaultCurrency }),
      setCursorStyle: (cursorStyle) => set({ cursorStyle }),
      setCursorVariant: (cursorVariant) => set({ cursorVariant }),
      setContextMenu: (partial) =>
        set((s) => ({
          contextMenu: { ...s.contextMenu, ...partial },
        })),
      toggleContextMenuItem: (id) =>
        set((s) => {
          const disabled = s.contextMenu.disabledItems;
          const next = disabled.includes(id)
            ? disabled.filter((d) => d !== id)
            : [...disabled, id];
          return { contextMenu: { ...s.contextMenu, disabledItems: next } };
        }),
      resetPreferences: () => set({ ...defaults }),
    }),
    {
      name: "makesense-preferences",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/** Resolves which theme palette should currently be active. */
export function resolveActiveTheme(state: PreferencesState): ThemeId | "custom" {
  if (state.themeMode === "custom") return "custom";
  if (state.themeMode === "light") return state.lightTheme;
  if (state.themeMode === "dark") return state.darkTheme;
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return state.darkTheme;
  }
  return state.lightTheme;
}
