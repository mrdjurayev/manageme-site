import Link from "next/link";

import { signOutAction } from "@/lib/actions/auth";
import { getRequiredUser } from "@/lib/auth/get-user";

const UPCOMING_BLOCKS = [
  "Weekly timetable board",
  "Attendance status tracker",
  "Lesson reminders and deadline sync",
];

export default async function SchedulePage() {
  const user = await getRequiredUser();

  return (
    <main className="min-h-screen bg-[var(--ui-page-bg)] px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header
          className="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-surface)] p-5 md:p-7"
          style={{ boxShadow: "0 4px 12px var(--ui-shadow-strong)" }}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="ui-text-overline uppercase tracking-[0.2em] text-[var(--ui-text-secondary)]">Manage Me Internal</p>
              <h1 className="ui-text-page-title mt-2 font-semibold text-[var(--ui-text-primary)]">
                Schedule Module
              </h1>
              <p className="ui-text-body-sm mt-2 text-[var(--ui-text-secondary)]">Signed in as: {user.email}</p>
            </div>
            <form action={signOutAction}>
              <button
                type="submit"
                className="ui-text-button h-11 rounded-lg border border-[var(--ui-primary)] bg-[var(--ui-primary)] px-5 font-medium text-[var(--ui-text-inverse)] transition-opacity hover:opacity-90"
              >
                Logout
              </button>
            </form>
          </div>
        </header>

        <section
          className="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-surface)] p-5 md:p-6"
          style={{ boxShadow: "0 3px 10px var(--ui-shadow-soft)" }}
        >
          <h2 className="ui-text-card-title font-semibold text-[var(--ui-text-primary)]">Fresh Start Structure</h2>
          <p className="ui-text-body-sm mt-2 text-[var(--ui-text-secondary)]">
            Bu sahifa ham reset qilindi. Keyingi bosqichda jadval va davomat funksiyalarini yangi UI bilan qayta
            quramiz.
          </p>
          <ul className="mt-4 space-y-2">
            {UPCOMING_BLOCKS.map((item) => (
              <li
                key={item}
                className="ui-text-body-sm rounded-lg border border-[var(--ui-border-subtle)] bg-[var(--ui-surface-muted)] px-3 py-2 text-[var(--ui-text-primary)]"
              >
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard"
            className="ui-text-button mt-5 inline-flex h-11 items-center justify-center rounded-lg border border-[var(--ui-primary)] bg-[var(--ui-primary)] px-5 font-medium text-[var(--ui-text-inverse)] transition-opacity hover:opacity-90"
          >
            Back to Dashboard
          </Link>
        </section>
      </div>
    </main>
  );
}
