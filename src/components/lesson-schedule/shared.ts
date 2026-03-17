import type { CSSProperties } from "react";

export const DAYS = [
  { key: "MON", label: "MON" },
  { key: "TUE", label: "TUE" },
  { key: "WED", label: "WED" },
  { key: "THU", label: "THU" },
  { key: "FRI", label: "FRI" },
  { key: "SAT", label: "SAT" },
  { key: "SUN", label: "SUN" },
] as const;

export const SEASON_OPTIONS = ["Season 1", "Season 2", "Season 3", "Season 4"] as const;
export type SeasonOption = (typeof SEASON_OPTIONS)[number];

export const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
export const HEADER_HEIGHT = 60;
export const ROW_HEIGHT = 48;
export const TIME_COLUMN_WIDTH = 78;
export const SOFT_DIVIDER_COLOR = "var(--ui-divider-soft)";
export const SOFT_BORDER = `0.5px solid ${SOFT_DIVIDER_COLOR}`;
export const TOOLBAR_HEIGHT_CLASS = "h-[65px] lg:h-[75px]";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatHourLabel(hour: number) {
  const period = hour < 12 ? "AM" : "PM";
  const normalizedHour = hour % 12 || 12;

  return `${normalizedHour} ${period}`;
}

export function createGridSurfaceStyle(boardHeight: number): CSSProperties {
  return {
    height: `${boardHeight}px`,
    backgroundColor: "var(--ui-surface)",
    backgroundImage: `repeating-linear-gradient(to bottom, ${SOFT_DIVIDER_COLOR} 0px, ${SOFT_DIVIDER_COLOR} 0.5px, transparent 0.5px, transparent ${ROW_HEIGHT}px)`,
  };
}

export function createTimeRailStyle(boardHeight: number): CSSProperties {
  return {
    ...createGridSurfaceStyle(boardHeight),
    width: `${TIME_COLUMN_WIDTH}px`,
  };
}
