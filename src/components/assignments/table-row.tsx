import {
  ASSIGNMENTS_BADGE_DANGER_CLASS,
  ASSIGNMENTS_MUTED_TEXT_CLASS,
  ASSIGNMENTS_SCORE_BOX_CLASS,
  ASSIGNMENTS_SCORE_GROUP_CLASS,
  ASSIGNMENTS_SOFT_BORDER,
  ASSIGNMENTS_TABLE_BODY_CELL_CLASS,
  ASSIGNMENTS_TITLE_TEXT_CLASS,
} from "./constants";
import type { AssignmentRecord } from "./model";
import { AssignmentActionButton } from "./action-button";

type AssignmentScoreGroupProps = Pick<AssignmentRecord, "score" | "maxScore">;

function AssignmentScoreGroup({ score, maxScore }: AssignmentScoreGroupProps) {
  return (
    <div className={`${ASSIGNMENTS_SCORE_GROUP_CLASS} justify-start`}>
      <span className={ASSIGNMENTS_SCORE_BOX_CLASS} style={{ border: ASSIGNMENTS_SOFT_BORDER }}>
        {score ?? 0}
      </span>
      <span className={ASSIGNMENTS_SCORE_BOX_CLASS} style={{ border: ASSIGNMENTS_SOFT_BORDER }}>
        {maxScore}
      </span>
    </div>
  );
}

function AssignmentSubmissionCell({ assignment }: { assignment: AssignmentRecord }) {
  if (assignment.submission.type === "status") {
    return (
      <span className={ASSIGNMENTS_BADGE_DANGER_CLASS} style={{ backgroundColor: "rgba(239, 68, 68, 0.08)" }}>
        {assignment.submission.label}
      </span>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      {assignment.submission.actions.map((action) => (
        <AssignmentActionButton key={action.id} action={action} />
      ))}
    </div>
  );
}

type AssignmentsTableRowProps = {
  assignment: AssignmentRecord;
};

export function AssignmentsTableRow({ assignment }: AssignmentsTableRowProps) {
  return (
    <tr style={{ borderBottom: ASSIGNMENTS_SOFT_BORDER }}>
      <td className={ASSIGNMENTS_TABLE_BODY_CELL_CLASS}>
        <div className="flex flex-col items-start gap-2.5">
          <p className={ASSIGNMENTS_TITLE_TEXT_CLASS}>{assignment.title}</p>
          <AssignmentActionButton action={assignment.resourceAction} />
        </div>
      </td>
      <td className={ASSIGNMENTS_TABLE_BODY_CELL_CLASS}>
        <p className={ASSIGNMENTS_MUTED_TEXT_CLASS}>{assignment.dueAt}</p>
      </td>
      <td className={ASSIGNMENTS_TABLE_BODY_CELL_CLASS}>
        <AssignmentScoreGroup score={assignment.score} maxScore={assignment.maxScore} />
      </td>
      <td className={ASSIGNMENTS_TABLE_BODY_CELL_CLASS}>
        <AssignmentSubmissionCell assignment={assignment} />
      </td>
    </tr>
  );
}
