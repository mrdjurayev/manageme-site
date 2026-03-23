import { useMemo, type CSSProperties } from "react";
import { ArrowLeft, CircleCheckBig, ExternalLink } from "lucide-react";

import { ContentToolbar } from "@/components/content-toolbar";
import { getActiveLessonScheduleEvent, getCurrentScheduleMoment } from "@/components/lesson-schedule/shared";

import {
  MY_SUBJECTS_BACK_BUTTON_CLASS,
  MY_CURRENT_CLASS_ACTIONS_CLASS,
  MY_CURRENT_CLASS_CARD_CLASS,
  MY_CURRENT_CLASS_SCORE_BUTTON_CLASS,
  MY_CURRENT_CLASS_TIMER_CLASS,
  MY_CURRENT_CLASS_TIMER_INNER_CLASS,
  MY_CURRENT_CLASS_TIMER_TEXT_CLASS,
  MY_CURRENT_CLASS_TITLE_CLASS,
  MY_SUBJECTS_ICON_BUTTON_CLASS,
  MY_SUBJECTS_ICON_SIZE,
  MY_SUBJECTS_ICON_STROKE_WIDTH,
  MY_SUBJECTS_SCROLL_AREA_CLASS,
  MY_SUBJECTS_SOFT_BORDER,
  MY_SUBJECTS_SURFACE_CLASS,
  MY_SUBJECTS_VIEW_CLASS,
} from "./constants";
import {
  createSubjectPlanCompletionKey,
  formatSubjectPlanDateKey,
  type SubjectPlanAttendancePayload,
} from "./subject-plan-progress";

type CurrentClassViewProps = {
  className?: string;
  onBack: () => void;
  referenceDate: Date;
  referenceTimeZone: string;
  completedPlanEntryKeys: ReadonlySet<string>;
  missedPlanEntryKeys: ReadonlySet<string>;
  onAttendanceMark: (payload: SubjectPlanAttendancePayload) => void;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function createCountdownTimerStyle(progress: number): CSSProperties {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const degrees = clampedProgress * 360;

  return {
    background: `conic-gradient(var(--ui-text-primary) ${degrees}deg, rgba(203, 213, 225, 0.45) ${degrees}deg 360deg)`,
    transition: "background 300ms linear",
  };
}

function CurrentClassBackButton({ onBack }: Pick<CurrentClassViewProps, "onBack">) {
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

export function CurrentClassView({
  className,
  onBack,
  referenceDate,
  referenceTimeZone,
  completedPlanEntryKeys,
  missedPlanEntryKeys,
  onAttendanceMark,
}: CurrentClassViewProps) {
  const currentMoment = useMemo(
    () => getCurrentScheduleMoment(referenceDate, referenceTimeZone),
    [referenceDate, referenceTimeZone],
  );
  const activeLesson = useMemo(
    () => getActiveLessonScheduleEvent(referenceDate, referenceTimeZone),
    [referenceDate, referenceTimeZone],
  );
  const currentSessionDate = useMemo(
    () => formatSubjectPlanDateKey(referenceDate, referenceTimeZone),
    [referenceDate, referenceTimeZone],
  );
  const currentAttendanceCompletionKey = useMemo(() => {
    if (!activeLesson) {
      return null;
    }

    return createSubjectPlanCompletionKey(activeLesson.title, currentSessionDate);
  }, [activeLesson, currentSessionDate]);
  const isAttendanceMarked =
    currentAttendanceCompletionKey !== null && completedPlanEntryKeys.has(currentAttendanceCompletionKey);
  const isAttendanceMissed =
    currentAttendanceCompletionKey !== null && missedPlanEntryKeys.has(currentAttendanceCompletionKey);

  const countdownData = useMemo(() => {
    if (!activeLesson) {
      return {
        label: "00:00",
        progress: 0,
      };
    }

    const startTotalSeconds = activeLesson.startHour * 60 * 60 + activeLesson.startMinute * 60;
    const endTotalSeconds = activeLesson.endHour * 60 * 60 + activeLesson.endMinute * 60;
    const currentTotalSeconds = currentMoment.hour * 60 * 60 + currentMoment.minute * 60 + currentMoment.second;
    const totalDurationMs = Math.max((endTotalSeconds - startTotalSeconds) * 1000, 1);
    const remainingMs = Math.max((endTotalSeconds - currentTotalSeconds) * 1000, 0);
    const totalSeconds = Math.floor(remainingMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return {
      label: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
      progress: remainingMs / totalDurationMs,
    };
  }, [activeLesson, currentMoment.hour, currentMoment.minute, currentMoment.second]);

  const countdownLabel = countdownData.label;
  const countdownProgress = countdownData.progress;
  const countdownTimerStyle = useMemo(() => createCountdownTimerStyle(countdownProgress), [countdownProgress]);

  return (
    <div className={cn(MY_SUBJECTS_VIEW_CLASS, className)}>
      <ContentToolbar title="Current class" trailingContent={<CurrentClassBackButton onBack={onBack} />} />
      <section className={MY_SUBJECTS_SURFACE_CLASS}>
        <div className={cn(MY_SUBJECTS_SCROLL_AREA_CLASS, "min-h-full")}>
          {activeLesson ? (
            <div className={MY_CURRENT_CLASS_CARD_CLASS} style={{ border: MY_SUBJECTS_SOFT_BORDER }}>
              <div className={MY_CURRENT_CLASS_TITLE_CLASS}>
                <div className={MY_CURRENT_CLASS_TIMER_CLASS} style={countdownTimerStyle}>
                  <span className={MY_CURRENT_CLASS_TIMER_INNER_CLASS} style={{ border: MY_SUBJECTS_SOFT_BORDER }} />
                  <span className={MY_CURRENT_CLASS_TIMER_TEXT_CLASS}>{countdownLabel}</span>
                </div>
                <p>{activeLesson.title}</p>
              </div>

              <div className={MY_CURRENT_CLASS_ACTIONS_CLASS}>
                <button
                  type="button"
                  disabled={isAttendanceMarked || isAttendanceMissed}
                  onClick={() => {
                    if (!activeLesson || isAttendanceMarked || isAttendanceMissed) {
                      return;
                    }

                    onAttendanceMark({
                      subjectTitle: activeLesson.title,
                      sessionDate: currentSessionDate,
                    });
                  }}
                  className={MY_SUBJECTS_ICON_BUTTON_CLASS}
                  style={{
                    border: MY_SUBJECTS_SOFT_BORDER,
                    backgroundColor: isAttendanceMarked ? "#241f21" : undefined,
                    color: isAttendanceMarked ? "#ffffff" : undefined,
                    opacity: isAttendanceMissed ? 0.45 : undefined,
                  }}
                >
                  <CircleCheckBig size={MY_SUBJECTS_ICON_SIZE} strokeWidth={MY_SUBJECTS_ICON_STROKE_WIDTH} />
                </button>
                <button type="button" className={MY_SUBJECTS_ICON_BUTTON_CLASS} style={{ border: MY_SUBJECTS_SOFT_BORDER }}>
                  <ExternalLink size={MY_SUBJECTS_ICON_SIZE} strokeWidth={MY_SUBJECTS_ICON_STROKE_WIDTH} />
                </button>
                <button type="button" className={MY_CURRENT_CLASS_SCORE_BUTTON_CLASS} style={{ border: MY_SUBJECTS_SOFT_BORDER }}>
                  Get score
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
