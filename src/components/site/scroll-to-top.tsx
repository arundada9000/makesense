"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const SIZE = 46;
const STROKE = 3.5;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Bottom floating scroll-to-top button. An SVG arc around the edge fills with
 * the page's scroll progress. Renders nothing until mounted to stay SSR-safe,
 * and scrolls smoothly unless the user prefers reduced motion. */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function update() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setProgress(p);
      setVisible(p > 0.03);
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function scrollTop() {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  }

  if (!visible) return null;

  const dash = CIRCUMFERENCE * progress;
  const rot = -90;

  return (
    <button
      type="button"
      onClick={scrollTop}
      aria-label="Scroll back to top"
      className="group fixed bottom-5 right-5 z-[85] flex h-[46px] w-[46px] items-center justify-center rounded-full shadow-pop transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="absolute inset-0 -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE - dash}
          transform={`rotate(${rot} ${SIZE / 2} ${SIZE / 2})`}
        />
      </svg>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-foreground ring-1 ring-border transition-colors group-hover:text-accent">
        <ArrowUp className="h-4 w-4" />
      </span>
    </button>
  );
}
