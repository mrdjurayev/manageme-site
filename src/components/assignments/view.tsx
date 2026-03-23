import { useEffect, useMemo, useState } from "react";

import { ContentToolbar } from "@/components/content-toolbar";

import {
  ASSIGNMENTS_SCROLL_AREA_CLASS,
  ASSIGNMENTS_STACK_CLASS,
  ASSIGNMENTS_SURFACE_CLASS,
  ASSIGNMENTS_VIEW_CLASS,
} from "./constants";
import {
  ASSIGNMENT_RECORDS,
  ASSIGNMENTS_SUBJECT_OPTIONS,
  ASSIGNMENTS_SUMMARY_STATS,
  type AssignmentSubjectOption,
} from "./model";
import { AssignmentsSummary } from "./summary";
import { AssignmentsTable } from "./table";
import { AssignmentsToolbarActions } from "./toolbar-actions";

type AssignmentsViewProps = {
  className?: string;
  initialSelectedSubject?: AssignmentSubjectOption;
  onSelectedSubjectChange?: (subject: AssignmentSubjectOption) => void;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function AssignmentsView({
  className,
  initialSelectedSubject = ASSIGNMENTS_SUBJECT_OPTIONS[0],
  onSelectedSubjectChange,
}: AssignmentsViewProps) {
  const [selectedSubject, setSelectedSubject] = useState<AssignmentSubjectOption>(initialSelectedSubject);

  useEffect(() => {
    setSelectedSubject(initialSelectedSubject);
  }, [initialSelectedSubject]);

  const filteredAssignments = useMemo(
    () => ASSIGNMENT_RECORDS.filter((assignment) => assignment.subject === selectedSubject),
    [selectedSubject],
  );

  return (
    <div className={cn(ASSIGNMENTS_VIEW_CLASS, className)}>
      <ContentToolbar
        title="Assignments"
        trailingContent={
          <AssignmentsToolbarActions
            selectedSubject={selectedSubject}
            onSelectedSubjectChange={(subject) => {
              setSelectedSubject(subject);
              onSelectedSubjectChange?.(subject);
            }}
          />
        }
      />
      <section className={ASSIGNMENTS_SURFACE_CLASS}>
        <div className={ASSIGNMENTS_SCROLL_AREA_CLASS}>
          <div className={ASSIGNMENTS_STACK_CLASS}>
            <AssignmentsSummary stats={ASSIGNMENTS_SUMMARY_STATS} />
            <AssignmentsTable assignments={filteredAssignments} />
          </div>
        </div>
      </section>
    </div>
  );
}
