"use client";

import { useEffect, useMemo, useRef } from "react";

import {
  DAYS,
  HEADER_HEIGHT,
  HOURS,
  LESSON_SCHEDULE_EVENTS,
  ROW_HEIGHT,
  SOFT_BORDER,
  TIME_COLUMN_WIDTH,
  createGridSurfaceStyle,
  createScheduleEventStyle,
  createTimeRailStyle,
  cn,
  formatHourLabel,
  getCurrentScheduleMoment,
  type LessonScheduleDayKey,
  type LessonScheduleMoment,
} from "./shared";

type LessonScheduleCanvasProps = {
  className?: string;
  referenceDate?: Date;
  referenceTimeZone?: string;
};

function TimeRail({ boardHeight }: { boardHeight: number }) {
  const timeRailStyle = createTimeRailStyle(boardHeight);

  return (
    <div className="bg-[var(--ui-surface)]" style={timeRailStyle}>
      {HOURS.map((hour) => (
        <div
          key={hour}
          className="ui-text-caption flex items-start justify-end pr-2 pt-0.5 font-medium tracking-[0.01em] text-[var(--ui-text-primary)] md:pr-3"
          style={{ height: `${ROW_HEIGHT}px` }}
        >
          {formatHourLabel(hour)}
        </div>
      ))}
    </div>
  );
}

function DayHeaders() {
  return DAYS.map((day) => (
    <div key={day.key} className="flex items-end justify-center pb-3 md:pb-4">
      <div className="ui-text-body-sm text-center font-semibold tracking-[0.11em] text-[var(--ui-text-primary)]">
        {day.label}
      </div>
    </div>
  ));
}

function DayEvents({ dayKey }: { dayKey: LessonScheduleDayKey }) {
  const dayEvents = LESSON_SCHEDULE_EVENTS.filter((event) => event.dayKey === dayKey);

  return dayEvents.map((event) => (
    <article
      key={event.id}
      className="absolute inset-x-0 z-[1] overflow-hidden rounded-xl px-3 py-2"
      style={createScheduleEventStyle(event)}
    >
      <p className="ui-text-body-sm font-semibold text-[#ffffff]">{event.title}</p>
    </article>
  ));
}

function CurrentTimeline({
  boardHeight,
  hour,
  minute,
}: {
  boardHeight: number;
  hour: number;
  minute: number;
}) {
  const timelineOffset = (hour + minute / 60) * ROW_HEIGHT;

  if (timelineOffset < 0 || timelineOffset > boardHeight) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute inset-x-0 z-[2] h-px bg-[var(--ui-danger)]"
      style={{ top: `${timelineOffset}px` }}
      aria-hidden="true"
    />
  );
}

function ScheduleBoard({ boardHeight, currentMoment }: { boardHeight: number; currentMoment: LessonScheduleMoment }) {
  const gridSurfaceStyle = createGridSurfaceStyle(boardHeight);

  return (
    <div className="col-span-7 grid grid-cols-7">
      {DAYS.map((day, index) => (
        <div
          key={day.key}
          data-day-column={day.key}
          className="relative bg-[var(--ui-surface)]"
          style={{
            ...gridSurfaceStyle,
            borderLeft: SOFT_BORDER,
            ...(index === DAYS.length - 1 ? { borderRight: SOFT_BORDER } : {}),
          }}
        >
          <DayEvents dayKey={day.key} />
          {day.key === currentMoment.dayKey ? (
            <CurrentTimeline boardHeight={boardHeight} hour={currentMoment.hour} minute={currentMoment.minute} />
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function LessonScheduleCanvas({
  className,
  referenceDate = new Date(),
  referenceTimeZone,
}: LessonScheduleCanvasProps) {
  const boardHeight = HOURS.length * ROW_HEIGHT;
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const hasAutoScrolledRef = useRef(false);
  const currentMoment = useMemo(
    () => getCurrentScheduleMoment(referenceDate, referenceTimeZone),
    [referenceDate, referenceTimeZone],
  );

  useEffect(() => {
    if (hasAutoScrolledRef.current) {
      return;
    }

    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return;
    }

    const timelineOffset = (currentMoment.hour + currentMoment.minute / 60) * ROW_HEIGHT;
    const animationFrame = window.requestAnimationFrame(() => {
      const maxScrollTop = Math.max(scrollContainer.scrollHeight - scrollContainer.clientHeight, 0);
      const centeredScrollTop = timelineOffset - scrollContainer.clientHeight / 2;
      scrollContainer.scrollTop = Math.min(Math.max(centeredScrollTop, 0), maxScrollTop);

      const currentDayColumn = scrollContainer.querySelector<HTMLElement>(`[data-day-column="${currentMoment.dayKey}"]`);

      if (currentDayColumn) {
        const maxScrollLeft = Math.max(scrollContainer.scrollWidth - scrollContainer.clientWidth, 0);
        const centeredScrollLeft =
          currentDayColumn.offsetLeft - TIME_COLUMN_WIDTH - (scrollContainer.clientWidth - currentDayColumn.clientWidth) / 2;

        scrollContainer.scrollLeft = Math.min(Math.max(centeredScrollLeft, 0), maxScrollLeft);
      }

      hasAutoScrolledRef.current = true;
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [currentMoment.dayKey, currentMoment.hour, currentMoment.minute]);

  return (
    <section className={cn("h-full min-h-0 overflow-hidden rounded-xl bg-[var(--ui-surface)]", className)}>
      <div ref={scrollContainerRef} className="calendar-scrollbar custom-scrollbar touch-scroll h-full overflow-auto">
        <div
          className="grid min-w-[960px] grid-cols-[78px_repeat(7,minmax(122px,1fr))]"
          style={{ gridTemplateRows: `${HEADER_HEIGHT}px auto` }}
        >
          <div />
          <DayHeaders />
          <TimeRail boardHeight={boardHeight} />
          <ScheduleBoard boardHeight={boardHeight} currentMoment={currentMoment} />
        </div>
      </div>
    </section>
  );
}
