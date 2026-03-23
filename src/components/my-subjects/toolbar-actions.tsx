import { Radio } from "lucide-react";

import { SeasonDropdown } from "@/components/lesson-schedule/season-dropdown";
import { INACTIVE_SEMESTER_OPTIONS, SOFT_BORDER } from "@/components/lesson-schedule/shared";

const CURRENT_CLASS_BUTTON_CLASS =
  "ui-text-body-sm inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--ui-surface)] px-2.5 font-medium text-[var(--ui-text-primary)] outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 sm:px-3";

type MySubjectsToolbarActionsProps = {
  onCurrentClassOpen: () => void;
};

export function MySubjectsToolbarActions({ onCurrentClassOpen }: MySubjectsToolbarActionsProps) {
  return (
    <div className="flex shrink-0 items-center gap-1.5 md:gap-3">
      <button
        type="button"
        aria-label="Current class"
        onClick={onCurrentClassOpen}
        className={CURRENT_CLASS_BUTTON_CLASS}
        style={{ border: SOFT_BORDER }}
      >
        <Radio size={18} strokeWidth={2} />
        <span>Current class</span>
      </button>
      <div className="-ml-0.5 md:ml-0">
        <SeasonDropdown
          disabledOptions={INACTIVE_SEMESTER_OPTIONS}
          minWidthClassName="min-w-[132px] sm:min-w-[152px]"
        />
      </div>
    </div>
  );
}
