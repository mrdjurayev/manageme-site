import { SeasonDropdown } from "./season-dropdown";
import { TOOLBAR_HEIGHT_CLASS, cn } from "./shared";

type LessonScheduleToolbarProps = {
  className?: string;
};

const TOOLBAR_CLASS = `flex w-full shrink-0 items-center justify-between gap-4 bg-[#fafafa] ${TOOLBAR_HEIGHT_CLASS}`;

export function LessonScheduleToolbar({ className }: LessonScheduleToolbarProps) {
  return (
    <div className={cn(TOOLBAR_CLASS, className)}>
      <h2 className="ui-text-card-title self-center font-semibold text-[var(--ui-text-primary)]">Lesson Schedule</h2>
      <SeasonDropdown />
    </div>
  );
}
