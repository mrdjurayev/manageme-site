import { useState } from "react";

import { ContentToolbar } from "@/components/content-toolbar";

import { MY_SUBJECTS_ITEMS, type MySubjectItem } from "./model";
import { MY_SUBJECTS_SCROLL_AREA_CLASS, MY_SUBJECTS_SURFACE_CLASS, MY_SUBJECTS_VIEW_CLASS } from "./constants";
import { CurrentClassView } from "./current-class-view";
import { SubjectPlanView } from "./subject-plan-view";
import { MySubjectsTable } from "./table";
import { MySubjectsToolbarActions } from "./toolbar-actions";
import { useReferenceClock } from "./use-reference-clock";
import { useSubjectProgress } from "./use-subject-progress";

type MySubjectsViewProps = {
  className?: string;
  referenceDate: Date;
  referenceTimeZone: string;
  onAssignmentsOpen?: (subject: MySubjectItem) => void;
};

type MySubjectsContentView = "table" | "subject-plan" | "current-class";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function MySubjectsView({
  className,
  referenceDate,
  referenceTimeZone,
  onAssignmentsOpen = () => {},
}: MySubjectsViewProps) {
  const [contentView, setContentView] = useState<MySubjectsContentView>("table");
  const [selectedPlanSubjectId, setSelectedPlanSubjectId] = useState<MySubjectItem["id"] | null>(null);
  const currentReferenceDate = useReferenceClock(referenceDate);
  const selectedPlanSubject = MY_SUBJECTS_ITEMS.find((subject) => subject.id === selectedPlanSubjectId) ?? null;
  const { completedPlanEntryKeys, displaySubjects, handleAttendanceMark, missedPlanEntryKeys } = useSubjectProgress({
    referenceDate: currentReferenceDate,
    referenceTimeZone,
    subjects: MY_SUBJECTS_ITEMS,
  });

  if (contentView === "current-class") {
    return (
      <CurrentClassView
        className={className}
        completedPlanEntryKeys={completedPlanEntryKeys}
        missedPlanEntryKeys={missedPlanEntryKeys}
        onAttendanceMark={handleAttendanceMark}
        referenceDate={currentReferenceDate}
        referenceTimeZone={referenceTimeZone}
        onBack={() => {
          setContentView("table");
        }}
      />
    );
  }

  if (contentView === "subject-plan" && selectedPlanSubject) {
    return (
      <SubjectPlanView
        key={selectedPlanSubject.id}
        className={className}
        completedPlanEntryKeys={completedPlanEntryKeys}
        missedPlanEntryKeys={missedPlanEntryKeys}
        subject={selectedPlanSubject}
        referenceDate={currentReferenceDate}
        referenceTimeZone={referenceTimeZone}
        onBack={() => {
          setContentView("table");
          setSelectedPlanSubjectId(null);
        }}
      />
    );
  }

  return (
    <div className={cn(MY_SUBJECTS_VIEW_CLASS, className)}>
      <ContentToolbar
        title="My Subjects"
        trailingContent={
          <MySubjectsToolbarActions
            onCurrentClassOpen={() => {
              setSelectedPlanSubjectId(null);
              setContentView("current-class");
            }}
          />
        }
      />
      <section className={MY_SUBJECTS_SURFACE_CLASS}>
        <div className={MY_SUBJECTS_SCROLL_AREA_CLASS}>
          <MySubjectsTable
            subjects={displaySubjects}
            onPlanOpen={(subject) => {
              setSelectedPlanSubjectId(subject.id);
              setContentView("subject-plan");
            }}
            onAssignmentsOpen={onAssignmentsOpen}
          />
        </div>
      </section>
    </div>
  );
}
