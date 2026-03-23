import type { CSSProperties } from "react";

export type ContractTermsRetakeColumn = {
  key: "subject" | "price" | "duration";
  label: string;
};

export type ContractTermsRetakeRow = {
  subject: string;
  price: string;
  duration: string;
};

export const CONTRACT_TERMS_TITLE = "Contract terms";
export const CONTRACT_TERMS_SEMESTER_TITLE = "Semester 1";
export const CONTRACT_TERMS_VIEW_CLASS = "min-h-0 flex flex-1 flex-col gap-0 pb-4 pt-0 lg:pb-0";
export const CONTRACT_TERMS_SURFACE_CLASS = "min-h-0 flex-1 overflow-hidden rounded-xl bg-[var(--ui-surface)]";
export const CONTRACT_TERMS_SCROLL_AREA_CLASS = "custom-scrollbar touch-scroll h-full overflow-y-auto p-5 sm:p-6 lg:p-7";
export const CONTRACT_TERMS_BACK_BUTTON_CLASS =
  "ui-text-button inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#ffffff] px-3.5 font-medium text-[var(--ui-text-primary)] outline-none transition-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 hover:bg-[#ffffff] active:bg-[#ffffff] lg:px-4";
export const CONTRACT_TERMS_TABLE_SECTION_CLASS = "space-y-3 pt-6";
export const CONTRACT_TERMS_TABLE_WRAPPER_CLASS = "overflow-x-auto";
export const CONTRACT_TERMS_TABLE_CLASS = "min-w-full border-collapse bg-[var(--ui-surface)]";
export const CONTRACT_TERMS_TABLE_SECTION_TITLE_CLASS = "ui-text-body font-semibold text-[var(--ui-text-primary)]";
export const CONTRACT_TERMS_TABLE_HEADER_CELL_CLASS =
  "ui-text-form-label px-4 py-3 text-center align-middle font-semibold text-[var(--ui-text-primary)]";
export const CONTRACT_TERMS_TABLE_BODY_CELL_CLASS =
  "ui-text-body-sm px-4 py-3 text-center align-middle text-[var(--ui-text-primary)]";
export const CONTRACT_TERMS_SOFT_BORDER = "0.5px solid var(--ui-divider-soft)";
export const CONTRACT_TERMS_TABLE_BORDER_STYLE: CSSProperties = { border: CONTRACT_TERMS_SOFT_BORDER };

export const CONTRACT_TERMS_RETAKE_COLUMNS: ContractTermsRetakeColumn[] = [
  { key: "subject", label: "#" },
  { key: "price", label: "Price" },
  { key: "duration", label: "Duration (Retake a subject)" },
];

export const CONTRACT_TERMS_RETAKE_ROWS: ContractTermsRetakeRow[] = [
  {
    subject: "1st grade math",
    price: "45$",
    duration: "2 weeks",
  },
  {
    subject: "4th grade reading and vocab",
    price: "45$",
    duration: "2 weeks",
  },
  {
    subject: "Computers and the Internet",
    price: "45$",
    duration: "2 weeks",
  },
  {
    subject: "World history",
    price: "30$",
    duration: "2 weeks",
  },
];
