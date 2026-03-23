export type AssignmentSummaryStat = {
  id: string;
  label: string;
  value: string;
};

export type AssignmentAction = {
  id: string;
  label: string;
  kind: "secondary" | "primary";
  icon: "download" | "upload" | "refresh";
  fullWidth?: boolean;
  presentation?: "button" | "hidden";
};

export type AssignmentSubmission =
  | {
      type: "status";
      label: string;
    }
  | {
      type: "actions";
      actions: AssignmentAction[];
    };

export type AssignmentRecord = {
  id: number;
  subject: AssignmentSubjectOption;
  title: string;
  resourceAction: AssignmentAction;
  dueAt: string;
  score: number | null;
  maxScore: number;
  submission: AssignmentSubmission;
};

export const ASSIGNMENTS_SUBJECT_OPTIONS = [
  "1st grade math",
  "4th grade reading and vocab",
  "Computers and the Internet",
  "World history",
] as const;

export type AssignmentSubjectOption = (typeof ASSIGNMENTS_SUBJECT_OPTIONS)[number];

export const ASSIGNMENTS_SUMMARY_STATS: AssignmentSummaryStat[] = [
  { id: "earned", label: "Earned score", value: "0" },
  { id: "max", label: "Max score", value: "50" },
  { id: "progress", label: "Progress", value: "0%" },
  { id: "grade", label: "Current grade", value: "2" },
];

function createAssignmentRecord(
  id: number,
  subject: AssignmentSubjectOption,
  dueAt: string,
): AssignmentRecord {
  return {
    id,
    subject,
    title: "Assignment name",
    resourceAction: {
      id: `resource-${id}`,
      label: "practice-report.doc",
      kind: "secondary",
      icon: "download",
      presentation: "hidden",
    },
    dueAt,
    score: null,
    maxScore: 50,
    submission: {
      type: "actions",
      actions: [
        {
          id: `upload-${id}`,
          label: "Submit work",
          kind: "secondary",
          icon: "upload",
        },
      ],
    },
  };
}

export const ASSIGNMENT_RECORDS: AssignmentRecord[] = [
  createAssignmentRecord(1, "1st grade math", "15.04.2026 | 23:59:59"),
  createAssignmentRecord(2, "4th grade reading and vocab", "18.04.2026 | 23:59:59"),
  createAssignmentRecord(3, "Computers and the Internet", "20.04.2026 | 23:59:59"),
  createAssignmentRecord(4, "World history", "22.04.2026 | 23:59:59"),
];
