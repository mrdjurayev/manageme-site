import { Download, RefreshCw, Upload } from "lucide-react";

import {
  ASSIGNMENTS_ACTION_BUTTON_CLASS,
  ASSIGNMENTS_SOFT_BORDER,
} from "./constants";
import type { AssignmentAction } from "./model";

function AssignmentActionIcon({ icon }: Pick<AssignmentAction, "icon">) {
  switch (icon) {
    case "download":
      return <Download className="shrink-0" size={18} strokeWidth={2} />;
    case "upload":
      return <Upload className="shrink-0" size={18} strokeWidth={2} />;
    case "refresh":
      return <RefreshCw className="shrink-0" size={18} strokeWidth={2} />;
    default:
      return null;
  }
}

type AssignmentActionButtonProps = {
  action: AssignmentAction;
};

export function AssignmentActionButton({ action }: AssignmentActionButtonProps) {
  if (action.presentation === "hidden") {
    return null;
  }

  return (
    <button
      type="button"
      className={ASSIGNMENTS_ACTION_BUTTON_CLASS}
      style={{ border: ASSIGNMENTS_SOFT_BORDER }}
    >
      <AssignmentActionIcon icon={action.icon} />
      <span>{action.label}</span>
    </button>
  );
}
