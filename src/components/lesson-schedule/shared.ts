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
export type LessonScheduleDayKey = (typeof DAYS)[number]["key"];

export type LessonScheduleEvent = {
  id: string;
  dayKey: LessonScheduleDayKey;
  title: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  backgroundColor: string;
  borderColor: string;
};

export type LessonScheduleMoment = {
  dayKey: LessonScheduleDayKey;
  hour: number;
  minute: number;
  second: number;
};

export const SEASON_OPTIONS = ["Semester 1", "Semester 2", "Semester 3", "Semester 4"] as const;
export type SeasonOption = (typeof SEASON_OPTIONS)[number];
export const INACTIVE_SEMESTER_OPTIONS = SEASON_OPTIONS.slice(1);

export const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
export const HEADER_HEIGHT = 60;
export const ROW_HEIGHT = 48;
export const TIME_COLUMN_WIDTH = 78;
export const SOFT_DIVIDER_COLOR = "var(--ui-divider-soft)";
export const SOFT_BORDER = `0.5px solid ${SOFT_DIVIDER_COLOR}`;
export const TOOLBAR_HEIGHT_CLASS = "h-[65px] lg:h-[75px]";

export const LESSON_SCHEDULE_EVENTS: LessonScheduleEvent[] = [
  {
    id: "mon-1st-grade-math-0900",
    dayKey: "MON",
    title: "1st grade math",
    startHour: 9,
    startMinute: 39,
    endHour: 11,
    endMinute: 9,
    backgroundColor: "#241f21",
    borderColor: "#241f21",
  },
] as const;

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

function getDayKeyFromWeekday(weekday: string): LessonScheduleDayKey {
  const normalizedWeekday = weekday.slice(0, 3).toUpperCase();

  switch (normalizedWeekday) {
    case "MON":
      return "MON";
    case "TUE":
      return "TUE";
    case "WED":
      return "WED";
    case "THU":
      return "THU";
    case "FRI":
      return "FRI";
    case "SAT":
      return "SAT";
    default:
      return "SUN";
  }
}

export function getCurrentScheduleMoment(referenceDate: Date, timeZone?: string): LessonScheduleMoment {
  if (!timeZone) {
    return {
      dayKey: DAYS[(referenceDate.getDay() + 6) % 7].key,
      hour: referenceDate.getHours(),
      minute: referenceDate.getMinutes(),
      second: referenceDate.getSeconds(),
    };
  }

  const dateParts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(referenceDate);

  const weekday = dateParts.find((part) => part.type === "weekday")?.value ?? "Sun";
  const hour = Number(dateParts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(dateParts.find((part) => part.type === "minute")?.value ?? "0");
  const second = Number(dateParts.find((part) => part.type === "second")?.value ?? "0");

  return {
    dayKey: getDayKeyFromWeekday(weekday),
    hour,
    minute,
    second,
  };
}

export function getActiveLessonScheduleEvent(referenceDate: Date, timeZone?: string) {
  const currentMoment = getCurrentScheduleMoment(referenceDate, timeZone);
  const currentTotalSeconds = currentMoment.hour * 60 * 60 + currentMoment.minute * 60 + currentMoment.second;

  return (
    LESSON_SCHEDULE_EVENTS.find((event) => {
      if (event.dayKey !== currentMoment.dayKey) {
        return false;
      }

      const startTotalSeconds = event.startHour * 60 * 60 + event.startMinute * 60;
      const endTotalSeconds = event.endHour * 60 * 60 + event.endMinute * 60;

      return currentTotalSeconds >= startTotalSeconds && currentTotalSeconds < endTotalSeconds;
    }) ?? null
  );
}

export function createScheduleEventStyle(event: LessonScheduleEvent): CSSProperties {
  const startOffset = (event.startHour + event.startMinute / 60) * ROW_HEIGHT;
  const endOffset = (event.endHour + event.endMinute / 60) * ROW_HEIGHT;

  return {
    top: `${startOffset}px`,
    height: `${Math.max(endOffset - startOffset, 40)}px`,
    backgroundColor: event.backgroundColor,
    border: `0.5px solid ${event.borderColor}`,
  };
}
