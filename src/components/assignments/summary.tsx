import type { AssignmentSummaryStat } from "./model";
import {
  ASSIGNMENTS_SOFT_BORDER,
  ASSIGNMENTS_SUMMARY_CARD_CLASS,
  ASSIGNMENTS_SUMMARY_GRID_CLASS,
  ASSIGNMENTS_SUMMARY_LABEL_CLASS,
  ASSIGNMENTS_SUMMARY_VALUE_CLASS,
} from "./constants";

type AssignmentsSummaryProps = {
  stats: AssignmentSummaryStat[];
};

export function AssignmentsSummary({ stats }: AssignmentsSummaryProps) {
  return (
    <section className={ASSIGNMENTS_SUMMARY_GRID_CLASS}>
      {stats.map((stat) => (
        <article key={stat.id} className={ASSIGNMENTS_SUMMARY_CARD_CLASS} style={{ border: ASSIGNMENTS_SOFT_BORDER }}>
          <p className={ASSIGNMENTS_SUMMARY_LABEL_CLASS}>{stat.label}</p>
          <p className={ASSIGNMENTS_SUMMARY_VALUE_CLASS}>{stat.value}</p>
        </article>
      ))}
    </section>
  );
}
