"use client";

import { useEffect } from "react";
import {
  usePreferences,
  resolveActiveTheme,
} from "@/stores/preferences";

function hexToRgb(hex: string): string | null {
  const clean = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

/**
 * Applies the resolved theme palette plus density, font scale and motion
 * preferences to the document root. Runs client-side only.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const prefs = usePreferences();

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const root = document.documentElement;
      const theme = resolveActiveTheme(usePreferences.getState());

      if (theme === "custom") {
        // Custom builds on the light base and overrides selected tokens.
        root.dataset.theme = "apple-light";
        const custom = usePreferences.getState().customTheme;
        if (custom) {
          if (custom.accent && hexToRgb(custom.accent)) {
            root.style.setProperty("--accent", custom.accent);
          }
          if (custom.background) {
            root.style.setProperty("--background", custom.background);
          }
          if (custom.surface) {
            root.style.setProperty("--surface", custom.surface);
          }
          if (custom.border && hexToRgb(custom.border)) {
            const [r, g, b] = hexToRgb(custom.border)!.split(" ");
            root.style.setProperty(
              "--border",
              `rgba(${r}, ${g}, ${b}, 0.14)`
            );
          }
          if (custom.radius) {
            root.style.setProperty("--radius-base", `${custom.radius}px`);
          }
        }
      } else {
        root.style.removeProperty("--accent");
        root.style.removeProperty("--background");
        root.style.removeProperty("--surface");
        root.style.removeProperty("--border");
        root.style.removeProperty("--radius-base");
        root.dataset.theme = theme;
      }

      root.dataset.density = prefs.density;
      root.dataset.reducedMotion = String(prefs.reducedMotion);
      document.body.style.setProperty(
        "--font-scale",
        String(prefs.fontScale)
      );
    };

    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [prefs]);

  return <>{children}</>;
}
