import type { MySubjectPlanEntry } from "./model";
import { formatSubjectPlanDateKey } from "./subject-plan-progress";

export function canOpenSubjectPlanLink(entry: MySubjectPlanEntry, referenceDate: Date, timeZone: string) {
  return entry.sessionDate === formatSubjectPlanDateKey(referenceDate, timeZone);
}
