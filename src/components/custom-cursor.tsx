"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

const APP_ROUTES = ["/dashboard", "/models", "/compare", "/settings"];

function subscribe(query: string, callback: () => void) {
  const mq = window.matchMedia(query);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

/** Coin-and-ring cursor for marketing surfaces. A small accent dot tracks the
 * pointer exactly; a lagging ring expands into a currency badge over
 * interactive targets. Fine pointers only; never on app routes or in text
 * fields, where the native caret is needed. */
export function CustomCursor() {
  const pathname = usePathname();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  const finePointer = useSyncExternalStore(
    (cb) => subscribe("(pointer: fine)", cb),
    () => window.matchMedia("(pointer: fine)").matches,
    () => false
  );
  const motionAllowed = useSyncExternalStore(
    (cb) => subscribe("(prefers-reduced-motion: reduce)", cb),
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true
  );

  const isAppRoute = APP_ROUTES.some((r) => pathname.startsWith(r));
  const isEnabled = finePointer && motionAllowed && !isAppRoute;

  useEffect(() => {
    if (!isEnabled) {
      delete document.documentElement.dataset.cursor;
      return;
    }
    document.documentElement.dataset.cursor = "custom";

    let raf = 0;
    let x = -100;
    let y = -100;
    let rx = x;
    let ry = y;

    function onMove(e: PointerEvent) {
      x = e.clientX;
      y = e.clientY;
      const t = e.target;
      const interactive =
        t instanceof Element &&
        Boolean(
          t.closest(
            'a[href], button:not(:disabled), [role="button"], select, summary, input[type="range"], label'
          )
        );
      setActive(interactive);
    }
    window.addEventListener("pointermove", onMove, { passive: true });

    function tick() {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      delete document.documentElement.dataset.cursor;
    };
  }, [isEnabled]);

  if (!isEnabled) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] hidden lg:block"
    >
      <div
        ref={ringRef}
        className={`absolute flex items-center justify-center rounded-full transition-[width,height,background-color,border-color] duration-200 ${
          active
            ? "h-11 w-11 border border-transparent bg-accent/90 text-accent-foreground"
            : "h-8 w-8 border border-accent/50"
        }`}
      >
        {active ? <span className="text-xs font-bold">₹</span> : null}
      </div>
      <div
        ref={dotRef}
        className={`absolute h-1.5 w-1.5 rounded-full transition-opacity duration-150 ${
          active ? "bg-transparent" : "bg-accent"
        }`}
      />
    </div>
  );
}
