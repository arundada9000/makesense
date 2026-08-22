"use client";

import { forwardRef } from "react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className = "", children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={`h-11 w-full appearance-none rounded-[var(--radius-base)] border bg-surface-secondary pl-3 pr-8 text-sm text-foreground transition-colors focus:border-accent focus:bg-surface focus:outline-none disabled:opacity-50 ${className}`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.65rem center",
        }}
        {...props}
      >
        {children}
      </select>
    );
  }
);
