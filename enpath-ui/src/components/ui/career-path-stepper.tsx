import * as React from "react";

import { cn } from "@/lib/utils";

export interface CareerPathStepProps
  extends Omit<React.HTMLAttributes<HTMLLIElement>, "title"> {
  number: number;
  title: React.ReactNode;
  description?: React.ReactNode;
  leading?: React.ReactNode;
  warning?: React.ReactNode;
  actions?: React.ReactNode;
  dropIndicator?: "before" | "after";
  isLast?: boolean;
}

export function CareerPathStep({
  number,
  title,
  description,
  leading,
  warning,
  actions,
  dropIndicator,
  isLast = false,
  className,
  ...props
}: CareerPathStepProps) {
  return (
    <li
      className={cn(
        "relative flex gap-[var(--career-stepper-step-gap)]",
        className
      )}
      {...props}
    >
      <div className="flex shrink-0 flex-col items-center">
        <div className="relative z-10 inline-flex size-[var(--height-target-touch)] items-center justify-center text-base font-semibold text-[var(--career-stepper-foreground)]">
          <span
            className="absolute inset-0 bg-[var(--career-stepper-border)] [clip-path:polygon(50%_3%,95%_16%,95%_49%,88%_67%,73%_82%,50%_96%,27%_82%,12%_67%,5%_49%,5%_16%)]"
            aria-hidden="true"
          />
          <span
            className="absolute inset-[var(--spacing-component-xxs)] [background:var(--career-stepper-surface)] [clip-path:polygon(50%_3%,95%_16%,95%_49%,88%_67%,73%_82%,50%_96%,27%_82%,12%_67%,5%_49%,5%_16%)]"
            aria-hidden="true"
          />
          <span className="relative -translate-y-[var(--spacing-component-xxs)]">
            {number}
          </span>
        </div>
        {!isLast && (
          <div
            className="w-px flex-1 bg-[var(--career-stepper-connector)]"
            aria-hidden="true"
          />
        )}
      </div>
      <div
        data-slot="career-path-step-row"
        className="relative mb-[var(--career-stepper-item-gap)] flex min-w-0 flex-1 items-center gap-[var(--career-stepper-row-gap)] rounded-[var(--career-stepper-radius)] border border-[var(--career-stepper-row-border)] bg-[var(--career-stepper-row-surface)] p-[var(--career-stepper-row-padding)]"
      >
        {dropIndicator && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 z-20 h-0.5 rounded-full bg-[var(--color-drop-indicator)]"
            style={
              dropIndicator === "before"
                ? { top: "calc(var(--career-stepper-item-gap) / -2)" }
                : { bottom: "calc(var(--career-stepper-item-gap) / -2)" }
            }
          />
        )}
        <div className="flex min-w-0 flex-1 items-center gap-[var(--spacing-component-xs)]">
          {leading && <div className="shrink-0">{leading}</div>}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-[var(--spacing-component-sm)]">
              <p className="font-semibold text-[var(--career-stepper-row-foreground)]">
                {title}
              </p>
              {warning}
            </div>
            {description && (
              <p className="text-sm text-[var(--career-stepper-description)]">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </li>
  );
}

export function CareerPathStepper({
  children,
  className,
  ...props
}: React.OlHTMLAttributes<HTMLOListElement>) {
  return (
    <ol className={cn("flex flex-col", className)} {...props}>
      {children}
    </ol>
  );
}
