import { useEffect, useMemo, useState } from "react";

import { getActiveLessonScheduleEvent, getCurrentScheduleMoment } from "@/components/lesson-schedule/shared";

import type { MySubjectItem, MySubjectPlanEntry } from "./model";
import {
  createSubjectPlanCompletionKey,
  formatSubjectPlanDateKey,
  type SubjectPlanAttendancePayload,
} from "./subject-plan-progress";

type UseSubjectProgressParams = {
  referenceDate: Date;
  referenceTimeZone: string;
  subjects: MySubjectItem[];
};

type MatchingPlanEntry = {
  subject: MySubjectItem;
  entry: MySubjectPlanEntry;
};

function findMatchingPlanEntry(
  subjects: MySubjectItem[],
  subjectTitle: string,
  sessionDate: string,
): MatchingPlanEntry | null {
  const subject = subjects.find((item) => item.title === subjectTitle);
  const entry = subject?.planEntries.find((item) => item.sessionDate === sessionDate);

  if (!subject || !entry) {
    return null;
  }

  return { subject, entry };
}

export function useSubjectProgress({ referenceDate, referenceTimeZone, subjects }: UseSubjectProgressParams) {
  const [completedPlanEntryKeys, setCompletedPlanEntryKeys] = useState<ReadonlySet<string>>(() => new Set());
  const [missedPlanEntryKeys, setMissedPlanEntryKeys] = useState<ReadonlySet<string>>(() => new Set());

  const activeLesson = useMemo(
    () => getActiveLessonScheduleEvent(referenceDate, referenceTimeZone),
    [referenceDate, referenceTimeZone],
  );
  const currentMoment = useMemo(
    () => getCurrentScheduleMoment(referenceDate, referenceTimeZone),
    [referenceDate, referenceTimeZone],
  );

  const handleAttendanceMark = ({ subjectTitle, sessionDate }: SubjectPlanAttendancePayload) => {
    const matchingPlanEntry = findMatchingPlanEntry(subjects, subjectTitle, sessionDate);

    if (!matchingPlanEntry) {
      return;
    }

    const completionKey = createSubjectPlanCompletionKey(
      matchingPlanEntry.subject.title,
      matchingPlanEntry.entry.sessionDate,
    );

    setCompletedPlanEntryKeys((currentKeys) => {
      if (currentKeys.has(completionKey)) {
        return currentKeys;
      }

      const nextKeys = new Set(currentKeys);
      nextKeys.add(completionKey);
      return nextKeys;
    });

    setMissedPlanEntryKeys((currentKeys) => {
      if (!currentKeys.has(completionKey)) {
        return currentKeys;
      }

      const nextKeys = new Set(currentKeys);
      nextKeys.delete(completionKey);
      return nextKeys;
    });
  };

  useEffect(() => {
    if (!activeLesson) {
      return;
    }

    const currentSessionDate = formatSubjectPlanDateKey(referenceDate, referenceTimeZone);
    const matchingPlanEntry = findMatchingPlanEntry(subjects, activeLesson.title, currentSessionDate);

    if (!matchingPlanEntry) {
      return;
    }

    const entryProgressKey = createSubjectPlanCompletionKey(
      matchingPlanEntry.subject.title,
      matchingPlanEntry.entry.sessionDate,
    );

    if (completedPlanEntryKeys.has(entryProgressKey) || missedPlanEntryKeys.has(entryProgressKey)) {
      return;
    }

    const lessonStartSeconds = activeLesson.startHour * 60 * 60 + activeLesson.startMinute * 60;
    const currentSeconds = currentMoment.hour * 60 * 60 + currentMoment.minute * 60 + currentMoment.second;
    const markMissedDelayMs = Math.max((lessonStartSeconds + 10 * 60 - currentSeconds) * 1000, 0);

    const timer = window.setTimeout(() => {
      setMissedPlanEntryKeys((currentKeys) => {
        if (currentKeys.has(entryProgressKey)) {
          return currentKeys;
        }

        const nextKeys = new Set(currentKeys);
        nextKeys.add(entryProgressKey);
        return nextKeys;
      });
    }, markMissedDelayMs);

    return () => window.clearTimeout(timer);
  }, [
    activeLesson,
    completedPlanEntryKeys,
    currentMoment.hour,
    currentMoment.minute,
    currentMoment.second,
    missedPlanEntryKeys,
    referenceDate,
    referenceTimeZone,
    subjects,
  ]);

  const displaySubjects = useMemo(
    () =>
      subjects.map((subject) => {
        const missedCount = subject.planEntries.reduce((count, entry) => {
          const entryProgressKey = createSubjectPlanCompletionKey(subject.title, entry.sessionDate);
          return count + (missedPlanEntryKeys.has(entryProgressKey) ? 1 : 0);
        }, 0);

        return {
          ...subject,
          attendance: subject.attendance + missedCount,
        };
      }),
    [missedPlanEntryKeys, subjects],
  );

  return {
    completedPlanEntryKeys,
    displaySubjects,
    handleAttendanceMark,
    missedPlanEntryKeys,
  };
}
