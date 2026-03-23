import { ContentToolbar } from "@/components/content-toolbar";

import { SeasonDropdown } from "./season-dropdown";
import { cn, INACTIVE_SEMESTER_OPTIONS } from "./shared";

type LessonScheduleToolbarProps = {
  className?: string;
};

export function LessonScheduleToolbar({ className }: LessonScheduleToolbarProps) {
  return (
    <ContentToolbar
      title="Lesson Schedule"
      className={cn(className)}
      trailingContent={<SeasonDropdown disabledOptions={INACTIVE_SEMESTER_OPTIONS} />}
    />
  );
}
