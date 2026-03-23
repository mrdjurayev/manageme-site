export type MySubjectsColumnKey = "subject" | "teacher" | "attendance" | "action" | "plan";

export type MySubjectsColumn = {
  key: MySubjectsColumnKey;
  label: string;
  width: string;
  headerClassName: string;
  bodyClassName: string;
};

export type MySubjectPlanColumnKey = "number" | "topic" | "sessionDate" | "link";

export type MySubjectPlanColumn = {
  key: MySubjectPlanColumnKey;
  label: string;
  width: string;
  headerClassName: string;
  bodyClassName: string;
};

export const MY_SUBJECTS_SOFT_BORDER = "0.5px solid var(--ui-divider-soft)";
export const MY_SUBJECTS_HEADER_BORDER = "1.5px solid var(--ui-divider-soft)";

export const MY_SUBJECTS_TABLE_WRAPPER_CLASS = "custom-scrollbar touch-scroll w-full overflow-x-auto overscroll-x-contain pb-1";
export const MY_SUBJECTS_TABLE_CLASS = "min-w-[720px] w-full table-fixed border-collapse bg-[var(--ui-surface)] md:min-w-full";
const MY_SUBJECTS_HEADER_CELL_CLASS =
  "ui-text-form-label px-3 py-4 text-left font-semibold text-[var(--ui-text-primary)] md:px-4";
const MY_SUBJECTS_BODY_CELL_CLASS = "px-3 py-5 align-middle text-left md:px-4";

export const MY_SUBJECTS_SUBJECT_CELL_CLASS = "ui-text-dialog-body text-left text-[var(--ui-text-primary)]";
export const MY_SUBJECTS_TEACHER_LIST_CLASS = "flex flex-col items-start gap-4 text-left";
export const MY_SUBJECTS_TEACHER_LINE_CLASS = "ui-text-dialog-body text-left text-[var(--ui-text-primary)]";
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
export const MY_SUBJECTS_BACK_BUTTON_CLASS =
  "ui-text-button inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#ffffff] px-3.5 font-medium text-[var(--ui-text-primary)] outline-none transition-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 hover:bg-[#ffffff] active:bg-[#ffffff] lg:px-4";
export const MY_SUBJECTS_PLAN_ACTIONS_CLASS = "flex justify-start gap-2.5";
export const MY_SUBJECTS_ICON_STROKE_WIDTH = 2;
export const MY_SUBJECTS_ICON_SIZE = 18;

function createColumn(key: MySubjectsColumnKey, label: string, width: string): MySubjectsColumn {
  return {
    key,
    label,
    width,
    headerClassName: MY_SUBJECTS_HEADER_CELL_CLASS,
    bodyClassName: MY_SUBJECTS_BODY_CELL_CLASS,
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
export const MY_CURRENT_CLASS_CARD_CLASS =
  "grid min-h-[88px] grid-cols-1 items-center gap-4 rounded-xl bg-[var(--ui-surface)] px-4 py-3 md:grid-cols-[minmax(0,1fr)_auto] md:px-5";
export const MY_CURRENT_CLASS_TITLE_CLASS = "ui-text-dialog-body flex items-center gap-3 self-center font-medium text-[var(--ui-text-primary)]";
export const MY_CURRENT_CLASS_TIMER_SLOT_CLASS = "flex self-center justify-center";
export const MY_CURRENT_CLASS_ACTIONS_CLASS = "flex flex-wrap items-center self-center gap-2 md:justify-end";
export const MY_CURRENT_CLASS_TIMER_CLASS =
  "relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full";
export const MY_CURRENT_CLASS_TIMER_INNER_CLASS =
  "absolute inset-[3px] rounded-full bg-[var(--ui-surface)]";
export const MY_CURRENT_CLASS_TIMER_TEXT_CLASS =
  "ui-text-badge absolute inset-0 z-[1] flex items-center justify-center font-medium leading-none tabular-nums text-[var(--ui-text-primary)]";
export const MY_CURRENT_CLASS_SCORE_BUTTON_CLASS =
  `ui-text-button inline-flex h-10 min-w-[128px] items-center justify-center rounded-lg bg-[var(--ui-surface-muted)] px-4 font-medium whitespace-nowrap ${MY_SUBJECTS_BUTTON_SHELL_CLASS}`;

export const MY_SUBJECT_PLAN_TABLE_WRAPPER_CLASS = "custom-scrollbar touch-scroll w-full overflow-x-auto overscroll-x-contain pb-1";
export const MY_SUBJECT_PLAN_TABLE_CLASS = "min-w-[760px] w-full table-fixed border-collapse bg-[var(--ui-surface)] md:min-w-full";
export const MY_SUBJECT_PLAN_HEADER_BORDER = "1px solid var(--ui-divider-soft)";
export const MY_SUBJECT_PLAN_SUBJECT_CLASS = "ui-text-body font-medium text-[var(--ui-text-secondary)]";
export const MY_SUBJECT_PLAN_TOPIC_CLASS = "ui-text-body text-[var(--ui-text-primary)]";
export const MY_SUBJECT_PLAN_COMPLETED_ROW_CLASS = "bg-[#dcfce7]";
export const MY_SUBJECT_PLAN_MISSED_ROW_CLASS = "bg-[#fee2e2]";
export const MY_SUBJECT_PLAN_LINK_CLASS =
  "inline-flex cursor-pointer items-center justify-center text-[var(--ui-primary)]";
export const MY_SUBJECT_PLAN_LINK_DISABLED_CLASS =
  "inline-flex cursor-default items-center justify-center text-[var(--ui-text-secondary)] opacity-40";
const MY_SUBJECT_PLAN_BASE_HEADER_CLASS =
  "ui-text-form-label px-3 py-4 text-[var(--ui-text-primary)] md:px-4";
const MY_SUBJECT_PLAN_BASE_BODY_CLASS =
  "ui-text-body px-3 py-4 align-middle text-[var(--ui-text-primary)] md:px-4";

function createPlanColumn(
  key: MySubjectPlanColumnKey,
  label: string,
  width: string,
  headerClassName: string,
  bodyClassName: string,
): MySubjectPlanColumn {
  return {
    key,
    label,
    width,
    headerClassName,
    bodyClassName,
  };
}

export const MY_SUBJECT_PLAN_COLUMNS: MySubjectPlanColumn[] = [
  createPlanColumn("number", "#", "10%", `${MY_SUBJECT_PLAN_BASE_HEADER_CLASS} text-center`, `${MY_SUBJECT_PLAN_BASE_BODY_CLASS} text-center`),
  createPlanColumn("topic", "Topic", "52%", `${MY_SUBJECT_PLAN_BASE_HEADER_CLASS} text-left`, `${MY_SUBJECT_PLAN_BASE_BODY_CLASS} text-left`),
  createPlanColumn("sessionDate", "Session date", "22%", `${MY_SUBJECT_PLAN_BASE_HEADER_CLASS} text-center`, `${MY_SUBJECT_PLAN_BASE_BODY_CLASS} text-center whitespace-nowrap`),
  createPlanColumn("link", "Link", "16%", `${MY_SUBJECT_PLAN_BASE_HEADER_CLASS} text-center`, `${MY_SUBJECT_PLAN_BASE_BODY_CLASS} text-center`),
];
