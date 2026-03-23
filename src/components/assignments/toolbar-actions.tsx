import { SeasonDropdown } from "@/components/lesson-schedule/season-dropdown";
import { INACTIVE_SEMESTER_OPTIONS } from "@/components/lesson-schedule/shared";

import { ASSIGNMENTS_SUBJECT_OPTIONS, type AssignmentSubjectOption } from "./model";

type AssignmentsToolbarActionsProps = {
  selectedSubject: AssignmentSubjectOption;
  onSelectedSubjectChange: (subject: AssignmentSubjectOption) => void;
};

export function AssignmentsToolbarActions({
  selectedSubject,
  onSelectedSubjectChange,
}: AssignmentsToolbarActionsProps) {
  return (
    <div className="flex shrink-0 items-center gap-1.5 md:gap-3">
      <SeasonDropdown
        options={ASSIGNMENTS_SUBJECT_OPTIONS}
        value={selectedSubject}
        ariaLabel="Select subject"
        minWidthClassName="min-w-[148px] sm:min-w-[170px]"
        onChange={(subject) => onSelectedSubjectChange(subject as AssignmentSubjectOption)}
      />
      <SeasonDropdown
        disabledOptions={INACTIVE_SEMESTER_OPTIONS}
        minWidthClassName="min-w-[132px] sm:min-w-[152px]"
      />
    </div>
  );
}
