import type { ReactNode } from "react";

type ContentToolbarProps = {
  title: string;
  className?: string;
  titleClassName?: string;
  trailingContent?: ReactNode;
};

const CONTENT_TOOLBAR_CLASS =
  "flex w-full min-w-0 shrink-0 items-center justify-between gap-2 bg-[#fafafa] h-[65px] md:gap-4 lg:h-[75px]";
const CONTENT_TOOLBAR_TITLE_CLASS =
  "ui-text-card-title min-w-0 flex-1 truncate self-center font-semibold text-[var(--ui-text-primary)]";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ContentToolbar({ title, className, titleClassName, trailingContent }: ContentToolbarProps) {
  return (
    <div className={cn(CONTENT_TOOLBAR_CLASS, className)}>
      <h2 className={cn(CONTENT_TOOLBAR_TITLE_CLASS, titleClassName)}>{title}</h2>
      {trailingContent ? <div className="flex shrink-0 items-center">{trailingContent}</div> : null}
    </div>
  );
}
