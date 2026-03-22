import { ContentToolbar } from "@/components/content-toolbar";

import { SeasonDropdown } from "./season-dropdown";
import { cn } from "./shared";

type LessonScheduleToolbarProps = {
  className?: string;
};

export function LessonScheduleToolbar({ className }: LessonScheduleToolbarProps) {
  return <ContentToolbar title="Lesson Schedule" className={cn(className)} trailingContent={<SeasonDropdown />} />;
}
