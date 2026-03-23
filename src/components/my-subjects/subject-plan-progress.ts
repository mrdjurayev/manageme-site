export type SubjectPlanAttendancePayload = {
  subjectTitle: string;
  sessionDate: string;
};

export function formatSubjectPlanDateKey(referenceDate: Date, timeZone: string) {
  return referenceDate.toLocaleDateString("en-GB", { timeZone }).replaceAll("/", ".");
}

export function createSubjectPlanCompletionKey(subjectTitle: string, sessionDate: string) {
  return `${subjectTitle}::${sessionDate}`;
}
