import { DAYS, HEADER_HEIGHT, HOURS, ROW_HEIGHT, SOFT_BORDER, createGridSurfaceStyle, createTimeRailStyle, cn, formatHourLabel } from "./shared";

type LessonScheduleCanvasProps = {
  className?: string;
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

function DayColumns({ boardHeight }: { boardHeight: number }) {
  const gridSurfaceStyle = createGridSurfaceStyle(boardHeight);

  return DAYS.map((day, index) => (
    <div
      key={day.key}
      className="bg-[var(--ui-surface)]"
      style={{
        ...gridSurfaceStyle,
        borderLeft: SOFT_BORDER,
        ...(index === DAYS.length - 1 ? { borderRight: SOFT_BORDER } : {}),
      }}
    />
  ));
}

export function LessonScheduleCanvas({ className }: LessonScheduleCanvasProps) {
  const boardHeight = HOURS.length * ROW_HEIGHT;

  return (
    <section className={cn("h-full min-h-0 overflow-hidden rounded-xl bg-[var(--ui-surface)]", className)}>
      <div className="calendar-scrollbar custom-scrollbar touch-scroll h-full overflow-auto">
        <div
          className="grid min-w-[960px] grid-cols-[78px_repeat(7,minmax(122px,1fr))]"
          style={{ gridTemplateRows: `${HEADER_HEIGHT}px auto` }}
        >
          <div />
          <DayHeaders />
          <TimeRail boardHeight={boardHeight} />
          <DayColumns boardHeight={boardHeight} />
        </div>
      </div>
    </section>
  );
}
