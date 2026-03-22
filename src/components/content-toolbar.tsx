import type { ReactNode } from "react";

type ContentToolbarProps = {
  title: string;
  className?: string;
  titleClassName?: string;
  trailingContent?: ReactNode;
};

const CONTENT_TOOLBAR_CLASS = "flex w-full shrink-0 items-center justify-between gap-4 bg-[#fafafa] h-[65px] lg:h-[75px]";
const CONTENT_TOOLBAR_TITLE_CLASS = "ui-text-card-title self-center font-semibold text-[var(--ui-text-primary)]";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ContentToolbar({ title, className, titleClassName, trailingContent }: ContentToolbarProps) {
  return (
    <div className={cn(CONTENT_TOOLBAR_CLASS, className)}>
      <h2 className={cn(CONTENT_TOOLBAR_TITLE_CLASS, titleClassName)}>{title}</h2>
      {trailingContent ? <div className="flex items-center">{trailingContent}</div> : null}
    </div>
  );
}
