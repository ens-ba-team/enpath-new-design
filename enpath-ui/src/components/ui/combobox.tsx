"use client";

// ─── Combobox ─────────────────────────────────────────────────────────────────
// 2026-10-15: rebuilt on shadcn's pattern, Radix Popover + cmdk Command (was Base UI). Base UI's list
// rendered outside a Radix Dialog / Sheet, which blocks pointer events and holds focus there, so
// inside a modal you couldn't click or type. Same API as before (ComboboxField: basic · search ·
// multiple · tag-input; options with avatar + hint; hideLabel), plus a Clear (×) button once a value
// is chosen. Search types in the list's search field (opens on click, Enter, ArrowDown or any letter).
// Tokens: unchanged (trigger color/input/*, border/focus ring; list surface/overlay + shadow/overlay
// via Popover; highlighted row background/accent; chosen row brand text + check).

import * as React from "react";
import { CaretDownIcon, CheckIcon, MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ComboboxOption {
  value: string;
  label: string;
  /** Person options: 1–2 initials, shown as an Avatar before the label (list and chosen value) */
  avatar?: string;
  /** Secondary text after the label (e.g. an email); also matched by the search */
  hint?: string;
}

export interface ComboboxFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  description?: string;
  options?: ComboboxOption[];
  type?: "basic" | "search" | "tag-input";
  state?: "default" | "open" | "filled" | "filled-chips" | "invalid" | "disabled";
  multiple?: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[] | null) => void;
  className?: string;
  "aria-invalid"?: boolean | "true" | "false";
  /** Keep the label for screen readers only (a filter in a toolbar, 2026-10-15). */
  hideLabel?: boolean;
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const itemClass = cn(
  "flex h-[var(--height-control-touch-md)] sm:h-[var(--height-control-md)] w-full cursor-default select-none items-center gap-[var(--spacing-component-sm)] px-2 py-0",
  "rounded-[var(--radius-md)]",
  "text-body-sm text-[var(--color-surface-overlay-foreground)]",
  "data-[selected=true]:bg-[var(--color-background-accent)]",
  "data-[selected=true]:text-[var(--color-background-accent-foreground)]",
  "outline-none"
);

const iconClass = (disabled: boolean) =>
  cn("h-4 w-4 shrink-0", disabled ? "text-[var(--color-icon-disabled)]" : "text-[var(--color-icon-default)]");

/** One row in the list: avatar · label · hint, and a check on the chosen one. */
function OptionContent({ option, chosen }: { option: ComboboxOption; chosen: boolean }) {
  return (
    <>
      {option.avatar && <Avatar size="xs" name={option.label} fallback={option.avatar} />}
      <span className={cn("truncate", chosen && "text-[var(--color-brand-primary)]")}>{option.label}</span>
      {option.hint && <span className="truncate text-body-xs text-[var(--color-text-secondary)]">{option.hint}</span>}
      {chosen && <CheckIcon className="ml-auto h-4 w-4 shrink-0 text-[var(--color-icon-brand)]" aria-hidden="true" />}
    </>
  );
}

/** The list inside the Popover. Search filters on label + hint. */
function OptionList({ options, search, placeholder, isChosen, onPick }: {
  options: ComboboxOption[];
  search: boolean;
  placeholder?: string;
  isChosen: (v: string) => boolean;
  onPick: (v: string) => void;
}) {
  return (
    <Command className="rounded-[var(--radius-lg)] bg-transparent outline-none" tabIndex={-1}>
      {search && <CommandInput placeholder={placeholder ?? "Search"} />}
      <CommandList className="max-h-60 p-0.5">
        <CommandEmpty className="flex h-[var(--height-control-touch-md)] sm:h-[var(--height-control-md)] items-center px-2 py-0 text-body-sm text-[var(--color-text-secondary)]">
          No results
        </CommandEmpty>
        <CommandGroup className="p-0">
          {options.map((o) => (
            <CommandItem key={o.value} value={`${o.label} ${o.hint ?? ""} ${o.value}`} onSelect={() => onPick(o.value)} className={itemClass}>
              <OptionContent option={o} chosen={isChosen(o.value)} />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

const isTypingKey = (e: React.KeyboardEvent) => e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey;

// ─── Trigger shared classes ───────────────────────────────────────────────────

function triggerClass(invalid: boolean, disabled: boolean) {
  return cn(
    "flex w-full items-center gap-2 rounded-[var(--radius-lg)]",
    "border text-body-sm outline-none transition-colors",
    "bg-[var(--color-input-bg)] border-[var(--color-input-border)]",
    "hover:border-[var(--color-border-hover)]",
    "data-[popup-open]:border-[var(--color-border-focus)]",
    "data-[popup-open]:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-ring)_20%,transparent)]",
    invalid && [
      "border-[var(--color-border-error)]",
      "hover:border-[var(--color-border-error)]",
      "[&[data-popup-open]]:border-[var(--color-border-error)]",
      "[&[data-popup-open]]:[box-shadow:0_0_0_3px_color-mix(in_srgb,var(--color-border-error)_20%,transparent)]",
      "shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-border-error)_20%,transparent)]",
    ],
    disabled && [
      "cursor-not-allowed",
      "bg-[var(--color-surface-muted)]",
      "border-[var(--color-border-disabled)]",
      "opacity-[calc(var(--opacity-disabled)/100)]",
    ]
  );
}


// ─── Label ────────────────────────────────────────────────────────────────────

function FieldLabel({
  htmlFor,
  invalid,
  disabled,
  hidden = false,
  children,
}: {
  htmlFor: string;
  invalid: boolean;
  disabled: boolean;
  hidden?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        hidden && "sr-only",
        "text-label-md",
        invalid
          ? "text-[var(--color-text-invalid)]"
          : "text-[var(--color-background-default-foreground)]",
        disabled && "text-[var(--color-text-disabled)]"
      )}
    >
      {children}
    </label>
  );
}

// ─── Description ──────────────────────────────────────────────────────────────

function FieldDescription({
  invalid,
  disabled,
  children,
}: {
  invalid: boolean;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "text-body-xs",
        invalid
          ? "text-[var(--color-text-invalid)]"
          : "text-[var(--color-text-secondary)]",
        disabled && "text-[var(--color-text-disabled)]"
      )}
    >
      {children}
    </p>
  );
}

// ─── Tag Input ────────────────────────────────────────────────────────────────
// Free-form chip creation. Enter or comma confirms a tag. Backspace removes
// the last chip when input is empty. Duplicates are silently ignored.
// Optional `options` prop shows a filtered suggestions dropdown.

interface TagInputFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  description?: string;
  options?: ComboboxOption[];
  invalid: boolean;
  disabled: boolean;
  className?: string;
}

function TagInputField({
  id,
  label,
  placeholder,
  description,
  options,
  invalid,
  disabled,
  className,
}: TagInputFieldProps) {
  const [tags, setTags] = React.useState<string[]>([]);
  const [inputVal, setInputVal] = React.useState("");
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const hasSuggestions = options && options.length > 0;

  const suggestions = hasSuggestions
    ? options!.filter(
        (o) =>
          inputVal.trim() &&
          o.label.toLowerCase().includes(inputVal.toLowerCase()) &&
          !tags.includes(o.label)
      )
    : [];

  const addTag = (val: string) => {
    const trimmed = val.trim().replace(/,$/, "");
    if (!trimmed || tags.includes(trimmed)) {
      setInputVal("");
      return;
    }
    setTags((prev) => [...prev, trimmed]);
    setInputVal("");
    setShowSuggestions(false);
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (suggestions.length > 0 && showSuggestions) {
        addTag(suggestions[0].label);
      } else {
        addTag(inputVal);
      }
    }
    if (e.key === "Backspace" && !inputVal) {
      setTags((prev) => prev.slice(0, -1));
    }
    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // Close suggestions on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={cn("flex flex-col gap-[var(--spacing-component-xs)]", className)} ref={containerRef}>
      <FieldLabel htmlFor={id} invalid={invalid} disabled={disabled}>
        {label}
      </FieldLabel>

      <div className="relative">
        {/* Trigger container */}
        <div
          role="group"
          aria-invalid={invalid || undefined}
          onClick={() => !disabled && inputRef.current?.focus()}
          className={cn(
            "flex flex-wrap items-center gap-1 w-full rounded-[var(--radius-lg)]",
            "border min-h-[var(--height-control-touch-md)] sm:min-h-[var(--height-control-md)] px-[var(--spacing-component-xs-plus)] py-[var(--spacing-component-xs-plus)]",
            "bg-[var(--color-input-bg)] border-[var(--color-input-border)]",
            "transition-colors cursor-text",
            // Focus ring — blue when valid, red when invalid
            !invalid && "focus-within:border-[var(--color-border-focus)]",
            !invalid && "focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-ring)_20%,transparent)]",
            invalid && "border-[var(--color-border-error)]",
            invalid && "focus-within:border-[var(--color-border-error)]",
            invalid && "focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-border-error)_20%,transparent)]",
            disabled && [
              "cursor-not-allowed",
              "bg-[var(--color-surface-muted)]",
              "border-[var(--color-border-disabled)]",
              "opacity-[calc(var(--opacity-disabled)/100)]",
            ]
          )}
        >
          {/* Chips */}
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-[var(--radius-md)] bg-[var(--color-background-muted)] px-2 py-0.5 text-body-xs text-[var(--color-background-muted-foreground)]"
            >
              {tag}
              <span
                role="button"
                tabIndex={disabled ? -1 : 0}
                onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); removeTag(tag); }
                }}
                className="cursor-pointer opacity-60 hover:opacity-100 outline-none rounded-sm"
                aria-label={`Remove ${tag}`}
              >
                <XIcon className="h-3 w-3" />
              </span>
            </span>
          ))}

          {/* Inline input */}
          <input
            ref={inputRef}
            id={id}
            type="text"
            value={inputVal}
            placeholder={tags.length === 0 ? placeholder : undefined}
            disabled={disabled}
            aria-invalid={invalid || undefined}
            onChange={(e) => {
              const val = e.target.value;
              // Comma triggers tag creation inline
              if (val.endsWith(",")) {
                addTag(val);
              } else {
                setInputVal(val);
                setShowSuggestions(hasSuggestions ? val.trim().length > 0 : false);
              }
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (hasSuggestions && inputVal.trim()) setShowSuggestions(true);
            }}
            className={cn(
              "flex-1 min-w-[80px] bg-transparent outline-none text-body-sm",
              "placeholder:text-[var(--color-input-placeholder)]",
              "text-[var(--color-background-default-foreground)]",
              "disabled:cursor-not-allowed disabled:text-[var(--color-text-disabled)]"
            )}
          />
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className={cn(
            "absolute top-full left-0 right-0 z-20 mt-1",
            "rounded-[var(--radius-lg)] border border-[var(--color-border-default)]",
            "bg-[var(--color-surface-overlay)]",
            "flex flex-col gap-0.5 p-0.5 shadow-[var(--shadow-overlay)]"
          )}>
            {suggestions.map((opt) => (
              <div
                key={opt.value}
                onMouseDown={(e) => { e.preventDefault(); addTag(opt.label); }}
                className={cn(
                  "flex h-[var(--height-control-touch-md)] sm:h-[var(--height-control-md)] cursor-default select-none items-center px-2",
                  "rounded-[var(--radius-md)]",
                  "text-body-sm text-[var(--color-background-default-foreground)]",
                  "hover:bg-[var(--color-background-accent)]",
                  "hover:text-[var(--color-background-accent-foreground)]",
                  "outline-none"
                )}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {description && (
        <FieldDescription invalid={invalid} disabled={disabled}>
          {description}
        </FieldDescription>
      )}
    </div>
  );
}

// ─── ComboboxField ────────────────────────────────────────────────────────────

// ─── Single select (basic · search) ──────────────────────────────────────────

function SingleCombobox({ id, label, placeholder, description, options = [], type, value, defaultValue, onValueChange,
  className, invalid, disabled, hideLabel, startOpen }: ComboboxFieldProps & { invalid: boolean; disabled: boolean; startOpen: boolean }) {
  const [open, setOpen] = React.useState(startOpen);
  const [inner, setInner] = React.useState<string | undefined>(defaultValue as string | undefined);
  const current = value !== undefined ? (value as string) : inner;
  const chosen = options.find((o) => o.value === current);
  const isSearch = type === "search";
  const set = (v: string | null) => { setInner(v ?? undefined); onValueChange?.(v); };

  return (
    <div className={cn("flex flex-col gap-[var(--spacing-component-xs)]", className)}>
      <FieldLabel htmlFor={id} invalid={invalid} disabled={disabled} hidden={hideLabel}>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <div className="relative">
          <PopoverTrigger asChild>
            <button
              id={id}
              type="button"
              role="combobox"
              aria-expanded={open}
              aria-controls={`${id}-list`}
              aria-invalid={invalid || undefined}
              disabled={disabled}
              data-popup-open={open ? "" : undefined}
              onKeyDown={(e) => { if (isSearch && isTypingKey(e)) setOpen(true); }}
              className={cn(
                triggerClass(invalid, disabled),
                "h-[var(--height-control-touch-md)] sm:h-[var(--height-control-md)] text-left",
                isSearch ? "px-[var(--spacing-component-sm)]" : "px-[var(--spacing-component-md)]",
                chosen && !disabled && "pr-[calc(var(--spacing-component-sm)+var(--height-control-sm))]"
              )}
            >
              {chosen?.avatar ? (
                <Avatar size="xs" name={chosen.label} fallback={chosen.avatar} />
              ) : isSearch ? (
                <MagnifyingGlassIcon className={iconClass(disabled)} aria-hidden="true" />
              ) : null}
              <span className={cn("min-w-0 flex-1 truncate",
                chosen ? "text-[var(--color-background-default-foreground)]" : "text-[var(--color-input-placeholder)]",
                disabled && "text-[var(--color-text-disabled)]")}>
                {chosen?.label ?? placeholder}
              </span>
              {!(chosen && !disabled) && <CaretDownIcon className={iconClass(disabled)} aria-hidden="true" />}
            </button>
          </PopoverTrigger>
          {chosen && !disabled && (
            <button
              type="button"
              aria-label={`Clear ${label}`}
              onClick={() => set(null)}
              className="absolute right-[var(--spacing-component-xs)] top-1/2 flex h-[var(--height-control-touch-sm)] w-[var(--height-control-touch-sm)] sm:h-[var(--height-control-sm)] sm:w-[var(--height-control-sm)] -translate-y-1/2 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-icon-default)] hover:bg-[var(--color-background-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
            >
              <XIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
        <PopoverContent id={`${id}-list`} className="w-[var(--radix-popover-trigger-width)] min-w-[200px] p-0">
          <OptionList options={options} search={isSearch} placeholder={placeholder}
            isChosen={(v) => v === current} onPick={(v) => { set(v); setOpen(false); }} />
        </PopoverContent>
      </Popover>
      {description && <FieldDescription invalid={invalid} disabled={disabled}>{description}</FieldDescription>}
    </div>
  );
}

// ─── Multi-select (chips) ─────────────────────────────────────────────────────

function MultiCombobox({ id, label, placeholder, description, options = [], value, defaultValue, onValueChange,
  className, invalid, disabled, hideLabel, startOpen }: ComboboxFieldProps & { invalid: boolean; disabled: boolean; startOpen: boolean }) {
  const [open, setOpen] = React.useState(startOpen);
  const [inner, setInner] = React.useState<string[]>((defaultValue as string[] | undefined) ?? []);
  const current = value !== undefined ? (value as string[]) : inner;
  const set = (next: string[]) => { setInner(next); onValueChange?.(next); };
  const toggle = (v: string) => set(current.includes(v) ? current.filter((x) => x !== v) : [...current, v]);

  return (
    <div className={cn("flex flex-col gap-[var(--spacing-component-xs)]", className)}>
      <FieldLabel htmlFor={id} invalid={invalid} disabled={disabled} hidden={hideLabel}>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div
            data-popup-open={open ? "" : undefined}
            className={cn(triggerClass(invalid, disabled), "flex-wrap min-h-[var(--height-control-touch-md)] sm:min-h-[var(--height-control-md)] p-[var(--spacing-component-xs-plus)]")}
          >
            {current.map((v) => {
              const o = options.find((x) => x.value === v);
              return (
                <span key={v} className="inline-flex items-center gap-1 rounded-[var(--radius-md)] bg-[var(--color-background-muted)] px-2 py-0.5 text-body-xs text-[var(--color-background-muted-foreground)]">
                  {o?.label ?? v}
                  {!disabled && (
                    <button type="button" aria-label={`Remove ${o?.label ?? v}`} onClick={() => toggle(v)}
                      className="rounded-sm text-[var(--color-icon-default)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]">
                      <XIcon className="h-3 w-3" aria-hidden="true" />
                    </button>
                  )}
                </span>
              );
            })}
            <PopoverTrigger asChild>
              <button id={id} type="button" role="combobox" aria-expanded={open} aria-controls={`${id}-list`} aria-invalid={invalid || undefined} disabled={disabled}
                onKeyDown={(e) => { if (isTypingKey(e)) setOpen(true); }}
                className="flex min-w-[60px] flex-1 items-center gap-2 bg-transparent text-left text-body-xs outline-none">
                <span className="flex-1 truncate text-[var(--color-input-placeholder)]">{current.length === 0 ? placeholder : ""}</span>
                <CaretDownIcon className={iconClass(disabled)} aria-hidden="true" />
              </button>
            </PopoverTrigger>
          </div>
        </PopoverAnchor>
        <PopoverContent id={`${id}-list`} className="w-[var(--radix-popover-trigger-width)] min-w-[240px] p-0">
          <OptionList options={options} search placeholder={placeholder} isChosen={(v) => current.includes(v)} onPick={toggle} />
        </PopoverContent>
      </Popover>
      {description && <FieldDescription invalid={invalid} disabled={disabled}>{description}</FieldDescription>}
    </div>
  );
}

// ─── ComboboxField ────────────────────────────────────────────────────────────

export function ComboboxField(props: ComboboxFieldProps) {
  const { state = "default", type = "basic", multiple = false, "aria-invalid": ariaInvalid } = props;
  const disabled = state === "disabled";
  const invalid = state === "invalid" || ariaInvalid === true || ariaInvalid === "true";
  const startOpen = state === "open";
  if (type === "tag-input") {
    return (
      <TagInputField id={props.id} label={props.label} placeholder={props.placeholder} description={props.description}
        options={props.options} invalid={invalid} disabled={disabled} className={props.className} />
    );
  }
  if (multiple || state === "filled-chips") return <MultiCombobox {...props} invalid={invalid} disabled={disabled} startOpen={startOpen} />;
  return <SingleCombobox {...props} invalid={invalid} disabled={disabled} startOpen={startOpen} />;
}
