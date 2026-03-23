import { ExternalLink } from "lucide-react";

import type { MySubjectPlanEntry } from "./model";
import {
  MY_SUBJECT_PLAN_COLUMNS,
  MY_SUBJECT_PLAN_COMPLETED_ROW_CLASS,
  MY_SUBJECT_PLAN_HEADER_BORDER,
  MY_SUBJECT_PLAN_LINK_DISABLED_CLASS,
  MY_SUBJECT_PLAN_LINK_CLASS,
  MY_SUBJECT_PLAN_MISSED_ROW_CLASS,
  MY_SUBJECT_PLAN_TABLE_CLASS,
  MY_SUBJECT_PLAN_TABLE_WRAPPER_CLASS,
  MY_SUBJECT_PLAN_TOPIC_CLASS,
  MY_SUBJECTS_SOFT_BORDER,
} from "./constants";
import { canOpenSubjectPlanLink } from "./subject-plan-link-access";
import { createSubjectPlanCompletionKey } from "./subject-plan-progress";

type SubjectPlanTableProps = {
  entries?: MySubjectPlanEntry[];
  subjectTitle: string;
  referenceDate: Date;
  referenceTimeZone: string;
  completedPlanEntryKeys: ReadonlySet<string>;
  missedPlanEntryKeys: ReadonlySet<string>;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function SubjectPlanTable({
  entries,
  subjectTitle,
  referenceDate,
  referenceTimeZone,
  completedPlanEntryKeys,
  missedPlanEntryKeys,
}: SubjectPlanTableProps) {
  const safeEntries = entries ?? [];

  return (
    <div className={MY_SUBJECT_PLAN_TABLE_WRAPPER_CLASS}>
      <table className={MY_SUBJECT_PLAN_TABLE_CLASS}>
        <colgroup>
          {MY_SUBJECT_PLAN_COLUMNS.map((column) => (
            <col key={column.key} style={{ width: column.width }} />
          ))}
        </colgroup>
        <thead>
          <tr style={{ borderBottom: MY_SUBJECT_PLAN_HEADER_BORDER }}>
            {MY_SUBJECT_PLAN_COLUMNS.map((column) => (
              <th key={column.key} className={column.headerClassName} scope="col">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {safeEntries.map((entry) => {
            const entryProgressKey = createSubjectPlanCompletionKey(subjectTitle, entry.sessionDate);
            const isCompleted = completedPlanEntryKeys.has(entryProgressKey);
            const isMissed = missedPlanEntryKeys.has(entryProgressKey);

            return (
              <tr
                key={entry.id}
                className={cn(isCompleted && MY_SUBJECT_PLAN_COMPLETED_ROW_CLASS, isMissed && MY_SUBJECT_PLAN_MISSED_ROW_CLASS)}
                style={{ borderBottom: MY_SUBJECTS_SOFT_BORDER }}
              >
                <td className={MY_SUBJECT_PLAN_COLUMNS[0].bodyClassName}>{entry.id}</td>
                <td className={MY_SUBJECT_PLAN_COLUMNS[1].bodyClassName}>
                  <p className={MY_SUBJECT_PLAN_TOPIC_CLASS}>{entry.topic}</p>
                </td>
                <td className={MY_SUBJECT_PLAN_COLUMNS[2].bodyClassName}>{entry.sessionDate}</td>
                <td className={MY_SUBJECT_PLAN_COLUMNS[3].bodyClassName}>
                  {canOpenSubjectPlanLink(entry, referenceDate, referenceTimeZone) ? (
                    <a href={entry.linkHref} target="_blank" rel="noreferrer" className={MY_SUBJECT_PLAN_LINK_CLASS}>
                      <ExternalLink size={18} strokeWidth={2} />
                    </a>
                  ) : (
                    <span aria-disabled="true" className={MY_SUBJECT_PLAN_LINK_DISABLED_CLASS}>
                      <ExternalLink size={18} strokeWidth={2} />
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
