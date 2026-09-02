"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { usePreferences } from "@/stores/preferences";
import { usePathname } from "next/navigation";

/** Lightweight custom cursor. Hidden on touch or fine pointers to let the OS
 *  handle interaction. Only rendered on non-app routes.
 *  The pointer is drawn using `translate3d` so it never triggers layout. */
export function CustomCursor() {
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();
  const [hoverWidget, setHoverWidget] = useState(false);
  const [hoverInteractive, setHoverInteractive] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [radialPulse, setRadialPulse] = useState(0);
  const cursorVariant = usePreferences((s) => s.cursorVariant);
  const cursorStyle = usePreferences((s) => s.cursorStyle);
  const pos = useRef({ x: -100, y: -100 });
  const tip = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  const APP_ROUTES = ["/dashboard", "/models", "/compare", "/settings", "/goals"];
  const isAppRoute = APP_ROUTES.some((r) => pathname.startsWith(r));
  const finePointer =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(hover: none)").matches;
  const enabled = !prefersReduced && finePointer && !isAppRoute && cursorStyle === "custom";

  useEffect(() => {
    if (enabled) document.documentElement.dataset.cursor = "custom";
    else delete document.documentElement.dataset.cursor;
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    function onMove(e: PointerEvent) {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        if (!tip.current) return;
        tip.current.style.translate = `${pos.current.x}px ${pos.current.y}px`;
        if (glow.current) {
          glow.current.style.translate = `${pos.current.x}px ${pos.current.y}px`;
        }
      });
    }
    function onDown(e: PointerEvent) {
      if (e.button !== 0) return;
      setClicking(true);
      setRadialPulse((p) => p + 1);
    }
    function onUp() {
      setClicking(false);
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const w = window;
    function checkHover(e: PointerEvent) {
      const el = (e.target as Element | null)?.closest?.(
        "a, button, [role=button], input, textarea, select, [data-cursor]"
      );
      const wEl = (e.target as Element | null)?.closest?.(
        "[data-cursor=widget], .widget"
      );
      setHoverInteractive(!!el);
      setHoverWidget(!!wEl);
    }
    w.addEventListener("pointermove", checkHover, { passive: true });
    return () => {
      w.removeEventListener("pointermove", checkHover);
    };
  }, [enabled]);

  useEffect(() => {
    let t: number | undefined;
    if (clicking) t = window.setTimeout(() => setClicking(false), 400);
    return () => clearTimeout(t);
  }, [clicking]);

  if (!enabled) return null;

  const v = cursorVariant;
  const c = "var(--accent)";

  return (
    <>
      {v === "dot-ring" ? (
        <>
          <div
            ref={tip}
            className="pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2 transition-[width,height,opacity] duration-150"
            style={{
              width: hoverInteractive ? 6 : 8,
              height: hoverInteractive ? 6 : 8,
              borderRadius: "9999px",
              backgroundColor: c,
              opacity: clicking ? 0.7 : 1,
              willChange: "translate",
            }}
          />
          <div
            ref={glow}
            className="pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height,opacity,border-color] duration-200 ease-out"
            style={{
              width: clicking ? 24 : hoverWidget ? 44 : hoverInteractive ? 32 : 36,
              height: clicking ? 24 : hoverWidget ? 44 : hoverInteractive ? 32 : 36,
              border: `1.5px solid ${c}`,
              opacity: clicking ? 0.55 : hoverWidget ? 0.7 : 0.45,
              willChange: "translate",
            }}
          />
          {hoverWidget ? (
            <div
              className="pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed transition-[width,height,opacity] duration-300"
              style={{
                width: 52,
                height: 52,
                borderColor: "var(--accent-muted)",
                opacity: 0.35,
                willChange: "translate",
              }}
            />
          ) : null}
        </>
      ) : v === "dot" ? (
        <div
          ref={tip}
          className="pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height,opacity] duration-100"
          style={{
            width: clicking ? 5 : hoverInteractive ? 4 : 7,
            height: clicking ? 5 : hoverInteractive ? 4 : 7,
            backgroundColor: c,
            opacity: clicking ? 0.7 : 1,
            willChange: "translate",
          }}
        />
      ) : v === "crosshair" ? (
        <>
          <div
            ref={tip}
            className="pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2 transition-[width,height,opacity] duration-150"
            style={{
              width: clicking ? 18 : 24,
              height: clicking ? 18 : 24,
              opacity: clicking ? 0.9 : 0.65,
              willChange: "translate",
            }}
          >
            <div className="absolute inset-0 m-auto h-px w-full bg-current opacity-60" style={{ color: c }} />
            <div className="absolute inset-0 m-auto h-full w-px bg-current opacity-60" style={{ color: c }} />
            <div className="absolute inset-0 m-auto h-1 w-1 -translate-x-px -translate-y-px rounded-full bg-current opacity-90" style={{ backgroundColor: c }} />
          </div>
          {hoverWidget ? (
            <div
              ref={glow}
              className="pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2 rounded-full border transition-[width,height,opacity] duration-200"
              style={{
                width: 48,
                height: 48,
                border: `1px solid ${c}`,
                opacity: 0.35,
                willChange: "translate",
              }}
            />
          ) : null}
        </>
      ) : v === "halo" ? (
        <>
          <div
            ref={tip}
            className="pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2 transition-[width,height,opacity] duration-150"
            style={{
              width: 8,
              height: 8,
              borderRadius: "9999px",
              backgroundColor: c,
              opacity: clicking ? 0.7 : 1,
              willChange: "translate",
            }}
          />
          <div
            ref={glow}
            className="pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height,opacity] duration-300"
            style={{
              width: clicking ? 28 : hoverWidget ? 52 : hoverInteractive ? 36 : 44,
              height: clicking ? 28 : hoverWidget ? 52 : hoverInteractive ? 36 : 44,
              background: `radial-gradient(circle, ${c}33, transparent 70%)`,
              opacity: clicking ? 0.9 : hoverWidget ? 0.85 : 0.65,
              willChange: "translate",
            }}
          />
          {hoverWidget ? (
            <div
              className="pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed transition-[width,height,opacity] duration-300"
              style={{
                width: 60,
                height: 60,
                borderColor: "var(--accent-muted)",
                opacity: 0.3,
                willChange: "translate",
              }}
            />
          ) : null}
        </>
      ) : v === "diamond" ? (
        <>
          <div
            ref={tip}
            className="pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2 transition-[width,height,opacity,rotate] duration-150"
            style={{
              width: clicking ? 8 : 11,
              height: clicking ? 8 : 11,
              backgroundColor: c,
              borderRadius: 2,
              rotate: "45deg",
              opacity: clicking ? 0.7 : 1,
              willChange: "translate",
            }}
          />
          <div
            ref={glow}
            className="pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2 rounded-sm border transition-[width,height,opacity,rotate] duration-200"
            style={{
              width: clicking ? 22 : hoverWidget ? 44 : hoverInteractive ? 32 : 38,
              height: clicking ? 22 : hoverWidget ? 44 : hoverInteractive ? 32 : 38,
              border: `1.5px solid ${c}`,
              rotate: "45deg",
              opacity: clicking ? 0.55 : hoverWidget ? 0.7 : 0.4,
              willChange: "translate",
            }}
          />
          {hoverWidget ? (
            <div
              className="pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2 rounded-sm border border-dashed transition-[width,height,opacity,rotate] duration-300"
              style={{
                width: 52,
                height: 52,
                borderColor: "var(--accent-muted)",
                rotate: "45deg",
                opacity: 0.3,
                willChange: "translate",
              }}
            />
          ) : null}
        </>
      ) : v === "ring" ? (
        <>
          <div
            ref={tip}
            className="pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height,opacity] duration-150"
            style={{
              width: 8,
              height: 8,
              border: `2px solid ${c}`,
              opacity: clicking ? 0.8 : 1,
              willChange: "translate",
            }}
          />
          <div
            ref={glow}
            className="pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2 rounded-full border transition-[width,height,opacity] duration-200"
            style={{
              width: clicking ? 26 : hoverWidget ? 46 : hoverInteractive ? 34 : 38,
              height: clicking ? 26 : hoverWidget ? 46 : hoverInteractive ? 34 : 38,
              border: `1px solid ${c}`,
              opacity: clicking ? 0.6 : hoverWidget ? 0.7 : 0.35,
              willChange: "translate",
            }}
          />
        </>
      ) : v === "ring-dot" ? (
        <>
          <div
            ref={tip}
            className="pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height,opacity] duration-150"
            style={{
              width: 6,
              height: 6,
              backgroundColor: c,
              opacity: clicking ? 0.7 : 1,
              willChange: "translate",
            }}
          />
          <div
            ref={glow}
            className="pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height,opacity] duration-200"
            style={{
              width: clicking ? 26 : hoverWidget ? 46 : hoverInteractive ? 34 : 40,
              height: clicking ? 26 : hoverWidget ? 46 : hoverInteractive ? 34 : 40,
              border: `2px solid ${c}`,
              opacity: clicking ? 0.5 : hoverWidget ? 0.65 : 0.35,
              willChange: "translate",
            }}
          />
        </>
      ) : v === "chevron" ? (
        <div
          ref={tip}
          className="pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2 transition-[opacity] duration-150"
          style={{ willChange: "translate" }}
        >
          <svg
            width={clicking ? 10 : 13}
            height={clicking ? 10 : 13}
            viewBox="0 0 12 12"
            fill="none"
            style={{ opacity: clicking ? 0.85 : 1, transition: "width 0.12s, height 0.12s, opacity 0.12s" }}
          >
            <path
              d="M1 1L6 11L11 1"
              stroke={c}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ) : v === "triangle" ? (
        <>
          <div
            ref={tip}
            className="pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2 transition-[opacity] duration-150"
            style={{ willChange: "translate" }}
          >
            <svg
              width={clicking ? 8 : 12}
              height={clicking ? 8 : 12}
              viewBox="0 0 10 10"
              fill="none"
              style={{ opacity: clicking ? 0.8 : 1, transition: "width 0.12s, height 0.12s, opacity 0.12s" }}
            >
              <path d="M5 0L10 10H0Z" fill={c} />
            </svg>
          </div>
          {hoverWidget ? (
            <div
              ref={glow}
              className="pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed transition-[width,height,opacity] duration-300"
              style={{
                width: 48,
                height: 48,
                borderColor: "var(--accent-muted)",
                opacity: 0.3,
                willChange: "translate",
              }}
            />
          ) : null}
        </>
      ) : v === "pulse" ? (
        <>
          <div
            ref={tip}
            className="pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height,opacity] duration-150"
            style={{
              width: 8,
              height: 8,
              backgroundColor: c,
              opacity: clicking ? 0.7 : 1,
              willChange: "translate",
            }}
          />
          <div
            key={radialPulse}
            className="pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2 cursor-ping"
            style={{
              width: 28,
              height: 28,
              border: `1.5px solid ${c}`,
              opacity: 0,
              willChange: "translate",
            }}
          />
          {hoverWidget ? (
            <div
              ref={glow}
              className="pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed transition-[width,height,opacity] duration-300"
              style={{
                width: 56,
                height: 56,
                borderColor: "var(--accent-muted)",
                opacity: 0.3,
                willChange: "translate",
              }}
            />
          ) : null}
        </>
      ) : v === "asterisk" ? (
        <div
          ref={tip}
          className="pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2 transition-[opacity] duration-150"
          style={{ willChange: "translate" }}
        >
          <svg
            width={clicking ? 10 : 13}
            height={clicking ? 10 : 13}
            viewBox="0 0 12 12"
            fill="none"
            style={{ opacity: clicking ? 0.85 : 1, transition: "width 0.12s, height 0.12s, opacity 0.12s" }}
          >
            <line x1="6" y1="0" x2="6" y2="12" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="0" y1="6" x2="12" y2="6" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="1.8" y1="1.8" x2="10.2" y2="10.2" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="10.2" y1="1.8" x2="1.8" y2="10.2" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      ) : v === "cat-eye" ? (
        <>
          <div
            ref={tip}
            className="pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2 transition-[opacity] duration-150"
            style={{ willChange: "translate" }}
          >
            <svg
              width={clicking ? 14 : 18}
              height={clicking ? 6 : 8}
              viewBox="0 0 18 8"
              fill="none"
              style={{ opacity: clicking ? 0.8 : 1, transition: "width 0.12s, height 0.12s, opacity 0.12s" }}
            >
              <ellipse cx="9" cy="4" rx="8.5" ry="3.5" stroke={c} strokeWidth="1.3" />
              <ellipse cx="9" cy="4" rx="2.2" ry="3.2" fill={c} />
            </svg>
          </div>
          {hoverWidget ? (
            <div
              ref={glow}
              className="pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed transition-[width,height,opacity] duration-300"
              style={{
                width: 48,
                height: 48,
                borderColor: "var(--accent-muted)",
                opacity: 0.3,
                willChange: "translate",
              }}
            />
          ) : null}
        </>
      ) : v === "swirl" ? (
        <div
          ref={tip}
          className="pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2 transition-[opacity] duration-150"
          style={{ willChange: "translate" }}
        >
          <svg
            width={clicking ? 12 : 16}
            height={clicking ? 12 : 16}
            viewBox="0 0 16 16"
            fill="none"
            style={{ opacity: clicking ? 0.85 : 1, transition: "width 0.12s, height 0.12s, opacity 0.12s" }}
          >
            <path
              d="M8 2C11.5 2 14 4.5 14 8C14 11.5 11.5 14 8 14C6 14 4.5 12.5 4.5 10.5C4.5 8.5 6 7 8 7C9.5 7 10.5 8 10.5 9.5C10.5 10.5 9.8 11.5 8.5 11.5"
              stroke={c}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ) : v === "square" ? (
        <>
          <div
            ref={tip}
            className="pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2 rounded-sm transition-[width,height,opacity] duration-150"
            style={{
              width: clicking ? 7 : 10,
              height: clicking ? 7 : 10,
              backgroundColor: c,
              opacity: clicking ? 0.7 : 1,
              willChange: "translate",
            }}
          />
          <div
            ref={glow}
            className="pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2 rounded-sm border transition-[width,height,opacity] duration-200"
            style={{
              width: clicking ? 22 : hoverWidget ? 44 : hoverInteractive ? 32 : 38,
              height: clicking ? 22 : hoverWidget ? 44 : hoverInteractive ? 32 : 38,
              border: `1.5px solid ${c}`,
              opacity: clicking ? 0.55 : hoverWidget ? 0.7 : 0.4,
              willChange: "translate",
            }}
          />
        </>
      ) : null}
    </>
  );
}

function useReducedMotion() {
  const query = "(prefers-reduced-motion: reduce)";
  const subscribe = (cb: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  };
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}
