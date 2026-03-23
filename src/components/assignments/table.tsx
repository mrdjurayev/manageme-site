import {
  ASSIGNMENTS_HEADER_BORDER,
  ASSIGNMENTS_TABLE_CLASS,
  ASSIGNMENTS_TABLE_HEADER_CELL_CLASS,
  ASSIGNMENTS_TABLE_WRAPPER_CLASS,
} from "./constants";
import type { AssignmentRecord } from "./model";
import { ASSIGNMENTS_TABLE_COLUMNS } from "./table-columns";
import { AssignmentsTableRow } from "./table-row";

type AssignmentsTableProps = {
  assignments: AssignmentRecord[];
};

export function AssignmentsTable({ assignments }: AssignmentsTableProps) {
  return (
    <div className={ASSIGNMENTS_TABLE_WRAPPER_CLASS}>
      <table className={ASSIGNMENTS_TABLE_CLASS}>
        <colgroup>
          {ASSIGNMENTS_TABLE_COLUMNS.map((column) => (
            <col key={column.key} style={{ width: column.width }} />
          ))}
        </colgroup>
        <thead>
          <tr style={{ borderBottom: ASSIGNMENTS_HEADER_BORDER }}>
            {ASSIGNMENTS_TABLE_COLUMNS.map((column) => (
              <th
                key={column.key}
                className={`${ASSIGNMENTS_TABLE_HEADER_CELL_CLASS} ${column.headerClassName ?? ""}`}
                scope="col"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <AssignmentsTableRow key={assignment.id} assignment={assignment} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
