import type { AssignmentRecord } from "./model";

export type AssignmentsNotificationPreview = {
  badgeCount: string;
  title: string;
  subtitle: string;
  meta: string;
};

const DUE_AT_PATTERN = /^(\d{2})\.(\d{2})\.(\d{4}) \| (\d{2}):(\d{2}):(\d{2})$/;
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const NOTIFICATION_WINDOW_IN_MS = 3 * DAY_IN_MS;

const EMPTY_NOTIFICATION_PREVIEW: AssignmentsNotificationPreview = {
  badgeCount: "0",
  title: "No assignments",
  subtitle: "No upcoming deadlines",
  meta: "Assignments will appear here",
};

function parseAssignmentDueAt(dueAt: string) {
  const match = DUE_AT_PATTERN.exec(dueAt);

  if (!match) {
    return null;
  }

  const [, day, month, year, hours, minutes, seconds] = match;

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
    Number(seconds),
  );
}

function getCalendarDayDifference(referenceDate: Date, dueDate: Date) {
  const referenceStart = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );
  const dueStart = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

  return Math.round((dueStart.getTime() - referenceStart.getTime()) / DAY_IN_MS);
}

function formatDaysLeft(referenceDate: Date, dueDate: Date) {
  const dayDifference = getCalendarDayDifference(referenceDate, dueDate);

  if (dayDifference < 0) {
    return "Deadline passed";
  }

  if (dayDifference === 0) {
    return "Due today";
  }

  if (dayDifference === 1) {
    return "1 day left";
  }

  return `${dayDifference} days left`;
}

export function getAssignmentsNotificationPreview(
  assignments: AssignmentRecord[],
  referenceDate: Date,
): AssignmentsNotificationPreview {
  const parsedAssignments = assignments
    .map((assignment) => {
      const dueDate = parseAssignmentDueAt(assignment.dueAt);

      if (!dueDate) {
        return null;
      }

      return {
        assignment,
        dueDate,
      };
    })
    .filter((item): item is { assignment: AssignmentRecord; dueDate: Date } => item !== null);

  if (parsedAssignments.length === 0) {
    return EMPTY_NOTIFICATION_PREVIEW;
  }

  const upcomingAssignments = parsedAssignments
    .filter(({ dueDate }) => {
      const timeUntilDue = dueDate.getTime() - referenceDate.getTime();
      return timeUntilDue >= 0 && timeUntilDue <= NOTIFICATION_WINDOW_IN_MS;
    })
    .sort((left, right) => left.dueDate.getTime() - right.dueDate.getTime());

  if (upcomingAssignments.length === 0) {
    return EMPTY_NOTIFICATION_PREVIEW;
  }

  const nextAssignment = upcomingAssignments[0];

  return {
    badgeCount: String(upcomingAssignments.length),
    title: nextAssignment.assignment.title,
    subtitle: formatDaysLeft(referenceDate, nextAssignment.dueDate),
    meta: nextAssignment.assignment.dueAt,
  };
}
