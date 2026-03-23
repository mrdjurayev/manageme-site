import type { ReactNode } from "react";
import { CalendarDays, ClipboardList, Download } from "lucide-react";

import type { MySubjectItem, MySubjectTeacher } from "./model";
import {
  MY_SUBJECTS_ATTENDANCE_BUTTON_CLASS,
  MY_SUBJECTS_COLUMNS_BY_KEY,
  MY_SUBJECTS_ICON_BUTTON_CLASS,
  MY_SUBJECTS_ICON_SIZE,
  MY_SUBJECTS_ICON_STROKE_WIDTH,
  MY_SUBJECTS_PLAN_ACTIONS_CLASS,
  MY_SUBJECTS_SOFT_BORDER,
  MY_SUBJECTS_SUBJECT_CELL_CLASS,
  MY_SUBJECTS_TASK_BUTTON_CLASS,
  MY_SUBJECTS_TEACHER_CODE_CLASS,
  MY_SUBJECTS_TEACHER_LINE_CLASS,
  MY_SUBJECTS_TEACHER_LIST_CLASS,
  MY_SUBJECTS_TEACHER_SUPERSCRIPT_CLASS,
} from "./constants";

function TeacherLine({ teacher }: { teacher: MySubjectTeacher }) {
  return (
    <p className={MY_SUBJECTS_TEACHER_LINE_CLASS}>
      {teacher.code ? (
        <>
          <span className={MY_SUBJECTS_TEACHER_CODE_CLASS}>{teacher.code}</span>
          {" - "}
        </>
      ) : null}
      <span>{teacher.name}</span>
      {teacher.subLabel ? <sup className={MY_SUBJECTS_TEACHER_SUPERSCRIPT_CLASS}>{teacher.subLabel}</sup> : null}
    </p>
  );
}

function ActionButton({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className: string;
  onClick?: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className={className} style={{ border: MY_SUBJECTS_SOFT_BORDER }}>
      {children}
    </button>
  );
}

const SUBJECT_BODY_CELL_CLASS = MY_SUBJECTS_COLUMNS_BY_KEY.subject.bodyClassName;
const TEACHER_BODY_CELL_CLASS = MY_SUBJECTS_COLUMNS_BY_KEY.teacher.bodyClassName;
const ATTENDANCE_BODY_CELL_CLASS = MY_SUBJECTS_COLUMNS_BY_KEY.attendance.bodyClassName;
const ACTION_BODY_CELL_CLASS = MY_SUBJECTS_COLUMNS_BY_KEY.action.bodyClassName;
const PLAN_BODY_CELL_CLASS = MY_SUBJECTS_COLUMNS_BY_KEY.plan.bodyClassName;

export function MySubjectsTableRow({
  subject,
  onPlanOpen,
  onAssignmentsOpen,
}: {
  subject: MySubjectItem;
  onPlanOpen: () => void;
  onAssignmentsOpen: () => void;
}) {
  return (
    <tr style={{ borderBottom: MY_SUBJECTS_SOFT_BORDER }}>
      <td className={SUBJECT_BODY_CELL_CLASS}>
        <p className={MY_SUBJECTS_SUBJECT_CELL_CLASS}>{subject.title}</p>
      </td>
      <td className={TEACHER_BODY_CELL_CLASS}>
        <div className={MY_SUBJECTS_TEACHER_LIST_CLASS}>
          {subject.teachers.map((teacher) => (
            <TeacherLine key={`${subject.id}-${teacher.code ?? teacher.name}`} teacher={teacher} />
          ))}
        </div>
      </td>
      <td className={ATTENDANCE_BODY_CELL_CLASS}>
        <div className="flex justify-start">
          <ActionButton className={MY_SUBJECTS_ATTENDANCE_BUTTON_CLASS}>{subject.attendance}</ActionButton>
        </div>
      </td>
      <td className={ACTION_BODY_CELL_CLASS}>
        <div className="flex justify-start">
          <ActionButton className={MY_SUBJECTS_TASK_BUTTON_CLASS} onClick={onAssignmentsOpen}>
            <ClipboardList className="shrink-0" size={MY_SUBJECTS_ICON_SIZE} strokeWidth={MY_SUBJECTS_ICON_STROKE_WIDTH} />
            <span>Assignments</span>
          </ActionButton>
        </div>
      </td>
      <td className={PLAN_BODY_CELL_CLASS}>
        <div className={MY_SUBJECTS_PLAN_ACTIONS_CLASS}>
          <ActionButton className={MY_SUBJECTS_ICON_BUTTON_CLASS} onClick={onPlanOpen}>
            <CalendarDays size={MY_SUBJECTS_ICON_SIZE} strokeWidth={MY_SUBJECTS_ICON_STROKE_WIDTH} />
          </ActionButton>
          {subject.hasDownload ? (
            <ActionButton className={MY_SUBJECTS_ICON_BUTTON_CLASS} onClick={onPlanOpen}>
              <Download size={MY_SUBJECTS_ICON_SIZE} strokeWidth={MY_SUBJECTS_ICON_STROKE_WIDTH} />
            </ActionButton>
          ) : null}
        </div>
      </td>
    </tr>
  );
}
