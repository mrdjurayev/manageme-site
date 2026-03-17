"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { SEASON_OPTIONS, SOFT_BORDER, cn, type SeasonOption } from "./shared";

const DROPDOWN_TRIGGER_CLASS =
  "ui-text-body-sm flex h-10 w-full items-center justify-between gap-3 overflow-hidden rounded-xl bg-[var(--ui-surface)] px-3 font-medium text-[var(--ui-text-primary)] outline-none transition-transform focus:outline-none focus-visible:outline-none focus-visible:ring-0";
const DROPDOWN_PANEL_CLASS =
  "absolute right-0 top-[calc(100%+8px)] z-20 min-w-full overflow-hidden rounded-xl bg-[var(--ui-surface)] py-2";
const DROPDOWN_OPTION_CLASS =
  "ui-text-body-sm flex w-full items-center gap-3 px-4 py-2.5 text-left font-medium text-[var(--ui-text-primary)] outline-none transition-colors hover:bg-[#fafafa] focus:bg-[#fafafa] active:bg-[#fafafa] focus:outline-none";

type SeasonOptionButtonProps = {
  isSelected: boolean;
  onSelect: () => void;
  season: SeasonOption;
};

function SeasonOptionButton({ isSelected, onSelect, season }: SeasonOptionButtonProps) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      onClick={onSelect}
      className={DROPDOWN_OPTION_CLASS}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center">
        {isSelected ? <Check size={18} strokeWidth={2.5} /> : null}
      </span>
      <span className="truncate">{season}</span>
    </button>
  );
}

export function SeasonDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<SeasonOption>(SEASON_OPTIONS[0]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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
    <div ref={dropdownRef} className="relative my-auto flex min-w-[152px] items-center">
      <button
        type="button"
        aria-label="Select season"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={DROPDOWN_TRIGGER_CLASS}
        style={{ border: SOFT_BORDER }}
      >
        <span className="truncate">{selectedSeason}</span>
        <ChevronDown
          size={16}
          strokeWidth={2}
          className={cn("shrink-0 text-[var(--ui-text-secondary)] transition-transform duration-200", isOpen && "rotate-180")}
        />
      </button>

      {isOpen ? (
        <div className={DROPDOWN_PANEL_CLASS} style={{ border: SOFT_BORDER }}>
          <div role="listbox" aria-label="Season options">
            {SEASON_OPTIONS.map((season) => (
              <SeasonOptionButton
                key={season}
                season={season}
                isSelected={selectedSeason === season}
                onSelect={() => {
                  setSelectedSeason(season);
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
