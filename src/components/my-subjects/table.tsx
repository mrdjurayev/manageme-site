import type { MySubjectItem } from "./model";
import { MySubjectsTableRow } from "./subject-row";
import {
  MY_SUBJECTS_COLUMNS,
  MY_SUBJECTS_HEADER_BORDER,
  MY_SUBJECTS_TABLE_CLASS,
  MY_SUBJECTS_TABLE_WRAPPER_CLASS,
} from "./constants";

type MySubjectsTableProps = {
  subjects: MySubjectItem[];
  onPlanOpen: (subject: MySubjectItem) => void;
  onAssignmentsOpen?: (subject: MySubjectItem) => void;
};

export function MySubjectsTable({
  subjects,
  onPlanOpen,
  onAssignmentsOpen = () => {},
}: MySubjectsTableProps) {
  return (
    <div className={MY_SUBJECTS_TABLE_WRAPPER_CLASS}>
      <table className={MY_SUBJECTS_TABLE_CLASS}>
        <colgroup>
          {MY_SUBJECTS_COLUMNS.map((column) => (
            <col key={column.key} style={{ width: column.width }} />
          ))}
        </colgroup>
        <thead>
          <tr style={{ borderBottom: MY_SUBJECTS_HEADER_BORDER }}>
            {MY_SUBJECTS_COLUMNS.map((column) => (
              <th key={column.key} className={column.headerClassName} scope="col">
                {column.label ? <span>{column.label}</span> : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <MySubjectsTableRow
              key={subject.id}
              subject={subject}
              onPlanOpen={() => onPlanOpen(subject)}
              onAssignmentsOpen={() => onAssignmentsOpen(subject)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
