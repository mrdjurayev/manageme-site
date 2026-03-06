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
    <main className="min-h-screen bg-[#f3f4f6] px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-[0_4px_12px_rgba(31,31,31,0.06)] md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#6b7280]">Manage Me Internal</p>
              <h1 className="mt-2 text-[clamp(1.4rem,3vw,2rem)] font-semibold text-[#1f1f1f]">
                Schedule Module
              </h1>
              <p className="mt-2 text-sm text-[#4b5563]">Signed in as: {user.email}</p>
            </div>
            <form action={signOutAction}>
              <button
                type="submit"
                className="h-11 rounded-lg border border-[rgb(36,31,33)] bg-[rgb(36,31,33)] px-5 text-sm font-medium text-[#f2f2f2] transition-opacity hover:opacity-90"
              >
                Logout
              </button>
            </form>
          </div>
        </header>

        <section className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-[0_3px_10px_rgba(31,31,31,0.04)] md:p-6">
          <h2 className="text-lg font-semibold text-[#1f1f1f]">Fresh Start Structure</h2>
          <p className="mt-2 text-sm text-[#6b7280]">
            Bu sahifa ham reset qilindi. Keyingi bosqichda jadval va davomat funksiyalarini yangi UI bilan qayta
            quramiz.
          </p>
          <ul className="mt-4 space-y-2">
            {UPCOMING_BLOCKS.map((item) => (
              <li key={item} className="rounded-lg border border-[#eceff3] bg-[#fafafa] px-3 py-2 text-sm text-[#374151]">
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-lg border border-[rgb(36,31,33)] bg-[rgb(36,31,33)] px-5 text-sm font-medium text-[#f2f2f2] transition-opacity hover:opacity-90"
          >
            Back to Dashboard
          </Link>
        </section>
      </div>
    </main>
  );
}
