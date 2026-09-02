"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Bottom floating scroll-to-top button. A conic ring around the edge fills
 * with the page's scroll progress. Renders nothing until mounted to stay safe
 * during SSR. */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    function update() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setProgress(p);
      setVisible(p > 0.04);
    }
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
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

  const degrees = progress * 360;

  return (
    <button
      type="button"
      onClick={scrollTop}
      aria-label="Scroll back to top"
      className="group fixed bottom-5 right-5 z-[85] p-[3px]"
    >
      <span
        className="block rounded-full transition-transform duration-200 group-hover:-translate-y-0.5"
        style={{
          backgroundImage: `conic-gradient(var(--accent) ${degrees}deg, var(--border) ${degrees}deg)`,
        }}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-pop transition-colors group-hover:text-accent">
          <ArrowUp className="h-4 w-4" />
        </span>
      </span>
    </button>
  );
}
