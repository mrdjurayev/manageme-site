"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { SEASON_OPTIONS, SOFT_BORDER, cn } from "./shared";

const DROPDOWN_TRIGGER_CLASS =
  "ui-text-body-sm flex h-10 w-full items-center justify-between gap-2 overflow-hidden rounded-xl bg-[var(--ui-surface)] px-2.5 font-medium text-[var(--ui-text-primary)] outline-none transition-transform focus:outline-none focus-visible:outline-none focus-visible:ring-0 sm:gap-3 sm:px-3";
const DROPDOWN_PANEL_CLASS =
  "absolute right-0 top-[calc(100%+8px)] z-20 min-w-full overflow-hidden rounded-xl bg-[var(--ui-surface)] py-2";
const DROPDOWN_OPTION_CLASS =
  "ui-text-body-sm flex w-full items-center gap-3 px-4 py-2.5 text-left font-medium text-[var(--ui-text-primary)] outline-none transition-colors hover:bg-[#fafafa] focus:bg-[#fafafa] active:bg-[#fafafa] focus:outline-none";
const DROPDOWN_OPTION_DISABLED_CLASS =
  "ui-text-body-sm flex w-full items-center gap-3 px-4 py-2.5 text-left font-medium text-[var(--ui-text-secondary)] opacity-50";

type SeasonOptionButtonProps = {
  isDisabled: boolean;
  isSelected: boolean;
  onSelect: () => void;
  season: string;
};

function SeasonOptionButton({ isDisabled, isSelected, onSelect, season }: SeasonOptionButtonProps) {
  return (
    <button
      type="button"
      role="option"
      aria-disabled={isDisabled}
      aria-selected={isSelected}
      onClick={isDisabled ? undefined : onSelect}
      className={isDisabled ? DROPDOWN_OPTION_DISABLED_CLASS : DROPDOWN_OPTION_CLASS}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center">
        {isSelected ? <Check size={18} strokeWidth={2.5} /> : null}
      </span>
      <span className="truncate">{season}</span>
    </button>
  );
}

type SeasonDropdownProps = {
  options?: readonly string[];
  defaultValue?: string;
  value?: string;
  ariaLabel?: string;
  disabledOptions?: readonly string[];
  minWidthClassName?: string;
  onChange?: (value: string) => void;
};

export function SeasonDropdown({
  options = SEASON_OPTIONS,
  defaultValue = SEASON_OPTIONS[0],
  value,
  ariaLabel = "Select semester",
  disabledOptions = [],
  minWidthClassName = "min-w-[132px] sm:min-w-[152px]",
  onChange,
}: SeasonDropdownProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<string>(value ?? defaultValue);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const resolvedSelectedSeason = value ?? selectedSeason;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target || dropdownRef.current?.contains(target)) {
        return;
      }

      setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={cn("relative my-auto flex items-center", minWidthClassName)}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={DROPDOWN_TRIGGER_CLASS}
        style={{ border: SOFT_BORDER }}
      >
        <span className="truncate">{resolvedSelectedSeason}</span>
        <ChevronDown
          size={16}
          strokeWidth={2}
          className={cn("shrink-0 text-[var(--ui-text-secondary)] transition-transform duration-200", isOpen && "rotate-180")}
        />
      </button>

      {isOpen ? (
        <div className={DROPDOWN_PANEL_CLASS} style={{ border: SOFT_BORDER }}>
          <div role="listbox" aria-label={ariaLabel}>
            {options.map((season) => (
              <SeasonOptionButton
                key={season}
                season={season}
                isDisabled={disabledOptions.includes(season)}
                isSelected={resolvedSelectedSeason === season}
                onSelect={() => {
                  if (value === undefined) {
                    setSelectedSeason(season);
                  }
                  onChange?.(season);
                  setIsOpen(false);
                }}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
