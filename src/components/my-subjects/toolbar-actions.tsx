import { Radio } from "lucide-react";

import { SeasonDropdown } from "@/components/lesson-schedule/season-dropdown";
import { SOFT_BORDER } from "@/components/lesson-schedule/shared";

const CURRENT_CLASS_BUTTON_CLASS =
  "ui-text-body-sm inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--ui-surface)] px-3 font-medium text-[var(--ui-text-primary)] outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0";

export function MySubjectsToolbarActions() {
  return (
    <div className="flex items-center gap-2 md:gap-3">
      <button
        type="button"
        aria-label="Current class"
        className={CURRENT_CLASS_BUTTON_CLASS}
        style={{ border: SOFT_BORDER }}
      >
        <Radio size={18} strokeWidth={2} />
        <span>Current class</span>
      </button>
      <div className="-ml-1 md:ml-0">
        <SeasonDropdown />
      </div>
    </div>
  );
}
