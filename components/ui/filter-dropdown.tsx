"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type FilterDropdownOption = {
  href: string;
  label: string;
  value: string;
};

type FilterDropdownProps = {
  className?: string;
  label: string;
  options: FilterDropdownOption[];
  selectedValue: string;
};

export function FilterDropdown({
  className,
  label,
  options,
  selectedValue,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption =
    options.find((option) => option.value === selectedValue) ?? options[0];

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={cn("relative min-w-0", className)} ref={containerRef}>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={cn(
          "group flex h-12 w-full items-center justify-between gap-3 rounded-[1.35rem] border border-border/70 bg-card/92 px-4 text-left text-foreground shadow-[0_18px_50px_-34px_rgba(15,23,42,0.18)] transition-all hover:border-primary/30 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
          isOpen ? "border-primary/35 shadow-[0_22px_60px_-34px_rgba(47,111,177,0.22)]" : "",
        )}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {selectedOption?.label ?? "Select option"}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen ? "rotate-180 text-foreground" : "",
          )}
        />
      </button>

      {isOpen ? (
        <div
          className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-[1.4rem] border border-border/70 bg-popover/98 p-2 text-popover-foreground shadow-[0_24px_70px_-38px_rgba(15,23,42,0.2)] backdrop-blur"
          role="listbox"
        >
          <div className="max-h-80 overflow-y-auto">
            {options.map((option) => {
              const isSelected = option.value === selectedValue;

              return (
                <Link
                  aria-selected={isSelected}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-[1.1rem] px-3 py-2.5 text-sm text-foreground transition-colors",
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-accent/60",
                  )}
                  href={option.href}
                  key={`${label}-${option.value}`}
                  onClick={() => setIsOpen(false)}
                  role="option"
                >
                  <span className="truncate">{option.label}</span>
                  <Check
                    className={cn(
                      "size-4 shrink-0",
                      isSelected ? "text-primary" : "text-transparent",
                    )}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
