import { ArrowLeft } from "lucide-react";

import { ContentToolbar } from "@/components/content-toolbar";

import type { MySubjectItem } from "./model";
import {
  MY_SUBJECTS_BACK_BUTTON_CLASS,
  MY_SUBJECT_PLAN_SUBJECT_CLASS,
  MY_SUBJECTS_SCROLL_AREA_CLASS,
  MY_SUBJECTS_SOFT_BORDER,
  MY_SUBJECTS_SURFACE_CLASS,
  MY_SUBJECTS_VIEW_CLASS,
} from "./constants";
import { SubjectPlanTable } from "./subject-plan-table";

type SubjectPlanViewProps = {
  className?: string;
  onBack: () => void;
  subject: MySubjectItem;
  referenceDate: Date;
  referenceTimeZone: string;
  completedPlanEntryKeys: ReadonlySet<string>;
  missedPlanEntryKeys: ReadonlySet<string>;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function SubjectPlanBackButton({ onBack }: Pick<SubjectPlanViewProps, "onBack">) {
  return (
    <button
      type="button"
      onClick={onBack}
      className={MY_SUBJECTS_BACK_BUTTON_CLASS}
      style={{ border: MY_SUBJECTS_SOFT_BORDER }}
    >
      <ArrowLeft size={18} strokeWidth={2} />
      <span>Back</span>
    </button>
  );
}

export function SubjectPlanView({
  className,
  onBack,
  subject,
  referenceDate,
  referenceTimeZone,
  completedPlanEntryKeys,
  missedPlanEntryKeys,
}: SubjectPlanViewProps) {
  return (
    <div className={cn(MY_SUBJECTS_VIEW_CLASS, className)}>
      <ContentToolbar title="Subject plan" trailingContent={<SubjectPlanBackButton onBack={onBack} />} />
      <section className={MY_SUBJECTS_SURFACE_CLASS}>
        <div className={cn(MY_SUBJECTS_SCROLL_AREA_CLASS, "min-h-full space-y-4")}>
          <p className={MY_SUBJECT_PLAN_SUBJECT_CLASS}>{subject.title}</p>
          <SubjectPlanTable
            entries={subject.planEntries ?? []}
            referenceDate={referenceDate}
            referenceTimeZone={referenceTimeZone}
            subjectTitle={subject.title}
            completedPlanEntryKeys={completedPlanEntryKeys}
            missedPlanEntryKeys={missedPlanEntryKeys}
          />
        </div>
      </section>
    </div>
  );
}
