import Link from "next/link";

import { signOutAction } from "@/lib/actions/auth";
import {
  createLessonAction,
  deleteAttendanceAction,
  deleteLessonAction,
  recordAttendanceAction,
} from "@/lib/actions/schedule";
import { getRequiredUser } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";

type SchedulePageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

type Season = {
  id: string;
  name: string;
  code: string;
};

type Subject = {
  id: string;
  season_id: string;
  name: string;
  code: string;
};

type Lesson = {
  id: string;
  season_id: string;
  subject_id: string;
  title: string;
  weekday: number;
  start_time: string;
  end_time: string;
  location: string | null;
};

type Attendance = {
  id: string;
  lesson_id: string;
  lesson_date: string;
  status: "present" | "absent" | "late";
  note: string | null;
};

const WEEKDAYS: Record<number, string> = {
  1: "Dushanba",
  2: "Seshanba",
  3: "Chorshanba",
  4: "Payshanba",
  5: "Juma",
  6: "Shanba",
  7: "Yakshanba",
};

function toInputTime(value: string): string {
  return value.slice(0, 5);
}

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export default async function SchedulePage({ searchParams }: SchedulePageProps) {
  const params = await searchParams;
  const user = await getRequiredUser();
  const supabase = await createClient();

  const [{ data: seasons }, { data: subjects }, { data: lessons }, { data: attendance }] = await Promise.all([
    supabase.from("seasons").select("id, name, code").order("created_at", { ascending: false }),
    supabase.from("subjects").select("id, season_id, name, code").order("created_at", { ascending: false }),
    supabase
      .from("schedule_lessons")
      .select("id, season_id, subject_id, title, weekday, start_time, end_time, location")
      .order("weekday", { ascending: true })
      .order("start_time", { ascending: true }),
    supabase
      .from("attendance_records")
      .select("id, lesson_id, lesson_date, status, note")
      .order("lesson_date", { ascending: false })
      .limit(30),
  ]);

  const seasonRows: Season[] = seasons ?? [];
  const subjectRows: Subject[] = subjects ?? [];
  const lessonRows: Lesson[] = lessons ?? [];
  const attendanceRows: Attendance[] = attendance ?? [];

  const seasonMap = new Map(seasonRows.map((s) => [s.id, s]));
  const subjectMap = new Map(subjectRows.map((s) => [s.id, s]));

  const lessonsByDay = new Map<number, Lesson[]>();
  for (const lesson of lessonRows) {
    const list = lessonsByDay.get(lesson.weekday) ?? [];
    list.push(lesson);
    lessonsByDay.set(lesson.weekday, list);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 md:px-10">
        <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">ManageMe Schedule</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Dars jadvali va davomat</h1>
          <p className="mt-2 text-slate-300">Kirish email: {user.email}</p>
          <div className="mt-4 flex gap-3 text-sm">
            <Link className="text-emerald-300 underline-offset-4 hover:underline" href="/dashboard">
              Dashboardga qaytish
            </Link>
          </div>
        </header>

        {params.error ? (
          <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {params.error}
          </p>
        ) : null}

        {params.message ? (
          <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {params.message}
          </p>
        ) : null}

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-xl font-semibold">Yangi dars qo&apos;shish</h2>
          <form action={createLessonAction} className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm text-slate-300">Season</span>
              <select
                name="seasonId"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                required
              >
                <option value="">Season tanlang</option>
                {seasonRows.map((season) => (
                  <option key={season.id} value={season.id}>
                    {season.name} ({season.code})
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm text-slate-300">Subject</span>
              <select
                name="subjectId"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                required
              >
                <option value="">Subject tanlang</option>
                {subjectRows.map((subject) => {
                  const season = seasonMap.get(subject.season_id);
                  return (
                    <option key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code}) - {season?.name ?? "Season"}
                    </option>
                  );
                })}
              </select>
            </label>

            <label className="block md:col-span-2">
              <span className="mb-1 block text-sm text-slate-300">Dars nomi</span>
              <input
                name="title"
                minLength={2}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                placeholder="Algorithms Lecture"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm text-slate-300">Hafta kuni</span>
              <select
                name="weekday"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                required
              >
                <option value="">Kun tanlang</option>
                {Object.entries(WEEKDAYS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm text-slate-300">Joylashuv</span>
              <input
                name="location"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                placeholder="Room 204"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm text-slate-300">Boshlanish vaqti</span>
              <input
                name="startTime"
                type="time"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-400"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm text-slate-300">Tugash vaqti</span>
              <input
                name="endTime"
                type="time"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-400"
              />
            </label>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="btn-dark rounded-lg px-4 py-2 text-sm font-semibold"
              >
                Jadvalga qo&apos;shish
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-xl font-semibold">Haftalik jadval</h2>
          {lessonRows.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">Hozircha dars qo&apos;shilmagan.</p>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4, 5, 6, 7].map((weekday) => {
                const dayLessons = lessonsByDay.get(weekday) ?? [];
                return (
                  <article key={weekday} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <h3 className="font-semibold">{WEEKDAYS[weekday]}</h3>
                    {dayLessons.length === 0 ? (
                      <p className="mt-2 text-sm text-slate-500">Dars yo&apos;q.</p>
                    ) : (
                      <ul className="mt-3 space-y-3">
                        {dayLessons.map((lesson) => {
                          const subject = subjectMap.get(lesson.subject_id);
                          return (
                            <li key={lesson.id} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                              <p className="font-medium">{lesson.title}</p>
                              <p className="text-sm text-slate-400">
                                {subject?.name ?? "Subject"} ({subject?.code ?? "N/A"})
                              </p>
                              <p className="text-sm text-slate-400">
                                {toInputTime(lesson.start_time)} - {toInputTime(lesson.end_time)}
                                {lesson.location ? ` | ${lesson.location}` : ""}
                              </p>

                              <form action={recordAttendanceAction} className="mt-3 grid gap-2 sm:grid-cols-3">
                                <input type="hidden" name="lessonId" value={lesson.id} />
                                <input
                                  type="date"
                                  name="lessonDate"
                                  defaultValue={getTodayDate()}
                                  required
                                  className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs"
                                />
                                <select
                                  name="status"
                                  className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs"
                                >
                                  <option value="present">Present</option>
                                  <option value="absent">Absent</option>
                                  <option value="late">Late</option>
                                </select>
                                <button
                                  type="submit"
                                  className="btn-dark rounded-md px-2 py-1 text-xs"
                                >
                                  Davomat saqlash
                                </button>
                                <input
                                  type="text"
                                  name="note"
                                  placeholder="Qisqa izoh (ixtiyoriy)"
                                  className="sm:col-span-3 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs"
                                />
                              </form>

                              <form action={deleteLessonAction} className="mt-2">
                                <input type="hidden" name="lessonId" value={lesson.id} />
                                <button
                                  type="submit"
                                  className="btn-dark rounded-md px-2 py-1 text-xs"
                                >
                                  Darsni o&apos;chirish
                                </button>
                              </form>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-xl font-semibold">So&apos;nggi davomat yozuvlari</h2>
          {attendanceRows.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">Davomat yozuvlari hali yo&apos;q.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {attendanceRows.map((row) => {
                const lesson = lessonRows.find((l) => l.id === row.lesson_id);
                return (
                  <li
                    key={row.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium">{lesson?.title ?? "Dars"}</p>
                      <p className="text-xs text-slate-400">
                        {row.lesson_date} | {row.status.toUpperCase()}
                        {row.note ? ` | ${row.note}` : ""}
                      </p>
                    </div>
                    <form action={deleteAttendanceAction}>
                      <input type="hidden" name="attendanceId" value={row.id} />
                      <button
                        type="submit"
                        className="btn-dark rounded-md px-2 py-1 text-xs"
                      >
                        O&apos;chirish
                      </button>
                    </form>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <form action={signOutAction}>
          <button
            type="submit"
            className="btn-dark inline-flex w-fit rounded-lg px-4 py-2 text-sm font-medium"
          >
            Logout
          </button>
        </form>
      </div>
    </main>
  );
}
