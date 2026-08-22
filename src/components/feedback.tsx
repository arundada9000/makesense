"use client";

import { createContext, useContext, useMemo, useRef } from "react";
import { usePreferences } from "@/stores/preferences";

interface FeedbackApi {
  /** Plays a subtle tick if sound is enabled; vibrates if supported and on. */
  tap: (kind?: "light" | "success" | "warning") => void;
}

const FeedbackContext = createContext<FeedbackApi>({ tap: () => {} });

const TONES: Record<string, { freq: number; duration: number }> = {
  light: { freq: 880, duration: 0.03 },
  success: { freq: 660, duration: 0.06 },
  warning: { freq: 320, duration: 0.09 },
};

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const soundEnabled = usePreferences((s) => s.soundEnabled);
  const volume = usePreferences((s) => s.soundVolume);
  const hapticsEnabled = usePreferences((s) => s.hapticsEnabled);
  const audioRef = useRef<AudioContext | null>(null);

  const api = useMemo<FeedbackApi>(
    () => ({
      tap: (kind = "light") => {
        const tone = TONES[kind] ?? TONES.light;
        if (soundEnabled) {
          try {
            audioRef.current ??= new AudioContext();
            const ctx = audioRef.current;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.value = tone.freq;
            gain.gain.value = Math.max(0.01, volume) * 0.08;
            osc.connect(gain).connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + tone.duration);
          } catch {
            // Audio is best effort only.
          }
        }
        if (
          hapticsEnabled &&
          typeof navigator !== "undefined" &&
          "vibrate" in navigator
        ) {
          navigator.vibrate(kind === "warning" ? 20 : 8);
        }
      },
    }),
    [soundEnabled, volume, hapticsEnabled]
  );

  return <FeedbackContext.Provider value={api}>{children}</FeedbackContext.Provider>;
}

export function useFeedback(): FeedbackApi {
  return useContext(FeedbackContext);
}
