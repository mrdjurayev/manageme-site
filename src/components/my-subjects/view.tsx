import { ContentToolbar } from "@/components/content-toolbar";

import { MY_SUBJECTS_ITEMS } from "./model";
import { MY_SUBJECTS_SCROLL_AREA_CLASS, MY_SUBJECTS_SURFACE_CLASS, MY_SUBJECTS_VIEW_CLASS } from "./constants";
import { MySubjectsTable } from "./table";
import { MySubjectsToolbarActions } from "./toolbar-actions";

type MySubjectsViewProps = {
  className?: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function MySubjectsView({ className }: MySubjectsViewProps) {
  return (
    <div className={cn(MY_SUBJECTS_VIEW_CLASS, className)}>
      <ContentToolbar title="My Subjects" trailingContent={<MySubjectsToolbarActions />} />
      <section className={MY_SUBJECTS_SURFACE_CLASS}>
        <div className={MY_SUBJECTS_SCROLL_AREA_CLASS}>
          <MySubjectsTable subjects={MY_SUBJECTS_ITEMS} />
        </div>
      </section>
    </div>
  );
}
