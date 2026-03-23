export type AssignmentTableColumnKey = "assignment" | "dueAt" | "score" | "file";

export type AssignmentTableColumn = {
  key: AssignmentTableColumnKey;
  label: string;
  width: string;
  headerClassName: string;
};

export const ASSIGNMENTS_TABLE_COLUMNS: AssignmentTableColumn[] = [
  { key: "assignment", label: "Assignment", width: "25%", headerClassName: "text-left" },
  { key: "dueAt", label: "Due date", width: "25%", headerClassName: "text-left" },
  { key: "score", label: "Score | Max", width: "25%", headerClassName: "text-left" },
  { key: "file", label: "Status", width: "25%", headerClassName: "text-left" },
];
