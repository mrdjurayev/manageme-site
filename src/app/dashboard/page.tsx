import Link from "next/link";

import { signOutAction } from "@/lib/actions/auth";
import {
  createSeasonAction,
  createSubjectAction,
  deleteSeasonAction,
  deleteSubjectAction,
  setActiveSeasonAction,
} from "@/lib/actions/lms";
import { getRequiredUser } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";

type DashboardPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

type Season = {
  id: string;
  name: string;
  code: string;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
};

type Subject = {
  id: string;
  season_id: string;
  name: string;
  code: string;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const user = await getRequiredUser();
  const supabase = await createClient();

  const [{ data: seasons }, { data: subjects }] = await Promise.all([
    supabase
      .from("seasons")
      .select("id, name, code, start_date, end_date, is_active")
      .order("created_at", { ascending: false }),
    supabase
      .from("subjects")
      .select("id, season_id, name, code")
      .order("created_at", { ascending: false }),
  ]);

  const seasonRows: Season[] = seasons ?? [];
  const subjectRows: Subject[] = subjects ?? [];

  const subjectsBySeason = new Map<string, Subject[]>();
  for (const subject of subjectRows) {
    const list = subjectsBySeason.get(subject.season_id) ?? [];
    list.push(subject);
    subjectsBySeason.set(subject.season_id, list);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 md:px-10">
        <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">ManageMe Dashboard</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Seasons + Subjects</h1>
          <p className="mt-2 text-slate-300">Kirish email: {user.email}</p>
          <div className="mt-4 text-sm">
            <Link className="text-emerald-300 underline-offset-4 hover:underline" href="/schedule">
              Schedule + Attendance moduliga o&apos;tish
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

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <h2 className="text-xl font-semibold">Yangi season</h2>
            <form action={createSeasonAction} className="mt-4 space-y-3">
              <label className="block">
                <span className="mb-1 block text-sm text-slate-300">Nomi</span>
                <input
                  name="name"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                  placeholder="Fall 2026"
                  minLength={2}
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-slate-300">Kod</span>
                <input
                  name="code"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                  placeholder="FALL-2026"
                  minLength={2}
                  required
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-sm text-slate-300">Boshlanish</span>
                  <input
                    name="startDate"
                    type="date"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm text-slate-300">Tugash</span>
                  <input
                    name="endDate"
                    type="date"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="btn-dark rounded-lg px-4 py-2 text-sm font-semibold"
              >
                Season qo&apos;shish
              </button>
            </form>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <h2 className="text-xl font-semibold">Yangi subject</h2>
            <form action={createSubjectAction} className="mt-4 space-y-3">
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
                <span className="mb-1 block text-sm text-slate-300">Nomi</span>
                <input
                  name="name"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                  placeholder="Database Systems"
                  minLength={2}
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-slate-300">Kod</span>
                <input
                  name="code"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                  placeholder="CS-301"
                  minLength={2}
                  required
                />
              </label>
              <button
                type="submit"
                className="btn-dark rounded-lg px-4 py-2 text-sm font-semibold"
              >
                Subject qo&apos;shish
              </button>
            </form>
          </article>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-xl font-semibold">Seasons ro&apos;yxati</h2>
          {seasonRows.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">Hozircha season yaratilmagan.</p>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {seasonRows.map((season) => {
                const seasonSubjects = subjectsBySeason.get(season.id) ?? [];
                return (
                  <article key={season.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold">{season.name}</h3>
                        <p className="text-sm text-slate-400">{season.code}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {season.start_date ?? "No start"} - {season.end_date ?? "No end"}
                        </p>
                      </div>
                      {season.is_active ? (
                        <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">
                          Active
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {!season.is_active ? (
                        <form action={setActiveSeasonAction}>
                          <input type="hidden" name="seasonId" value={season.id} />
                          <button
                            type="submit"
                            className="btn-dark rounded-lg px-3 py-1.5 text-xs font-medium"
                          >
                            Active qilish
                          </button>
                        </form>
                      ) : null}
                      <form action={deleteSeasonAction}>
                        <input type="hidden" name="seasonId" value={season.id} />
                        <button
                          type="submit"
                          className="btn-dark rounded-lg px-3 py-1.5 text-xs font-medium"
                        >
                          O&apos;chirish
                        </button>
                      </form>
                    </div>

                    <div className="mt-4 border-t border-slate-800 pt-3">
                      <p className="text-xs uppercase tracking-wide text-slate-500">Subjects</p>
                      {seasonSubjects.length === 0 ? (
                        <p className="mt-2 text-sm text-slate-500">Subject yo&apos;q.</p>
                      ) : (
                        <ul className="mt-2 space-y-2">
                          {seasonSubjects.map((subject) => (
                            <li
                              key={subject.id}
                              className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm"
                            >
                              <span>
                                {subject.name} <span className="text-slate-400">({subject.code})</span>
                              </span>
                              <form action={deleteSubjectAction}>
                                <input type="hidden" name="subjectId" value={subject.id} />
                                <button
                                  type="submit"
                                  className="btn-dark rounded-md px-2 py-1 text-xs font-medium"
                                >
                                  O&apos;chirish
                                </button>
                              </form>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
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
