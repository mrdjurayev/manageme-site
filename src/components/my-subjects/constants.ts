export type MySubjectsColumnKey = "subject" | "teacher" | "attendance" | "action" | "plan";

export type MySubjectsColumn = {
  key: MySubjectsColumnKey;
  label: string;
  width: string;
  headerClassName: string;
  bodyClassName: string;
};

export const MY_SUBJECTS_SOFT_BORDER = "0.5px solid var(--ui-divider-soft)";
export const MY_SUBJECTS_HEADER_BORDER = "1.5px solid var(--ui-divider-soft)";

export const MY_SUBJECTS_TABLE_WRAPPER_CLASS = "custom-scrollbar touch-scroll w-full overflow-x-auto overscroll-x-contain pb-1";
export const MY_SUBJECTS_TABLE_CLASS = "min-w-[720px] w-full table-fixed border-collapse bg-[var(--ui-surface)] md:min-w-full";
const MY_SUBJECTS_CENTERED_HEADER_CELL_CLASS =
  "ui-text-form-label px-3 py-4 text-center font-semibold text-[var(--ui-text-primary)] md:px-4";
const MY_SUBJECTS_CENTERED_BODY_CELL_CLASS = "px-3 py-5 align-middle md:px-4";

export const MY_SUBJECTS_SUBJECT_CELL_CLASS = "ui-text-dialog-body text-center text-[var(--ui-text-primary)]";
export const MY_SUBJECTS_TEACHER_LIST_CLASS = "flex flex-col items-center gap-4 text-center";
export const MY_SUBJECTS_TEACHER_LINE_CLASS = "ui-text-dialog-body text-center text-[var(--ui-text-primary)]";
export const MY_SUBJECTS_TEACHER_CODE_CLASS = "font-medium text-[var(--ui-primary)]";
export const MY_SUBJECTS_TEACHER_SUPERSCRIPT_CLASS =
  "ui-text-badge ml-0.5 align-super font-semibold text-[var(--ui-text-secondary)]";
export const MY_SUBJECTS_BUTTON_SHELL_CLASS =
  "inline-flex cursor-pointer items-center justify-center rounded-lg bg-[var(--ui-surface-muted)] text-[var(--ui-text-primary)] outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0";
export const MY_SUBJECTS_ATTENDANCE_BUTTON_CLASS =
  `ui-text-body h-10 w-10 font-medium ${MY_SUBJECTS_BUTTON_SHELL_CLASS}`;
export const MY_SUBJECTS_TASK_BUTTON_CLASS =
  `ui-text-button h-10 w-[144px] max-w-[144px] gap-2 px-4 font-medium whitespace-nowrap ${MY_SUBJECTS_BUTTON_SHELL_CLASS}`;
export const MY_SUBJECTS_ICON_BUTTON_CLASS = `h-10 w-10 ${MY_SUBJECTS_BUTTON_SHELL_CLASS}`;
export const MY_SUBJECTS_PLAN_ACTIONS_CLASS = "flex justify-center gap-2.5";
export const MY_SUBJECTS_ICON_STROKE_WIDTH = 2;
export const MY_SUBJECTS_ICON_SIZE = 18;

function createColumn(key: MySubjectsColumnKey, label: string, width: string): MySubjectsColumn {
  return {
    key,
    label,
    width,
    headerClassName: MY_SUBJECTS_CENTERED_HEADER_CELL_CLASS,
    bodyClassName: MY_SUBJECTS_CENTERED_BODY_CELL_CLASS,
  };
}

export const MY_SUBJECTS_COLUMNS: MySubjectsColumn[] = [
  createColumn("subject", "Subject", "20%"),
  createColumn("teacher", "Teacher", "20%"),
  createColumn("attendance", "Attendance", "20%"),
  createColumn("action", "Actions", "20%"),
  createColumn("plan", "Plan", "20%"),
];

export const MY_SUBJECTS_COLUMNS_BY_KEY = Object.fromEntries(
  MY_SUBJECTS_COLUMNS.map((column) => [column.key, column]),
) as Record<MySubjectsColumnKey, MySubjectsColumn>;

export const MY_SUBJECTS_VIEW_CLASS = "min-h-0 flex flex-1 flex-col gap-0 pb-4 pt-0 lg:pb-0";
export const MY_SUBJECTS_SURFACE_CLASS = "min-h-0 flex-1 overflow-hidden rounded-xl bg-[var(--ui-surface)]";
export const MY_SUBJECTS_SCROLL_AREA_CLASS = "custom-scrollbar touch-scroll h-full overflow-y-auto p-4 md:p-6 lg:p-7";
