import Link from "next/link";

import { signOutAction } from "@/lib/actions/auth";
import { getRequiredUser } from "@/lib/auth/get-user";

const MODULES = [
  {
    title: "Dashboard",
    description: "Overview, daily focus and quick status blocks.",
    href: "/dashboard",
  },
  {
    title: "Subjects",
    description: "Fanlar va semestrlar bo'yicha boshqaruv oynasi.",
    href: "/dashboard",
  },
  {
    title: "Schedule",
    description: "Dars jadvali va vaqt bo'yicha tartib.",
    href: "/schedule",
  },
  {
    title: "Attendance",
    description: "Davomat statistikasi va izohlar.",
    href: "/dashboard",
  },
  {
    title: "Deadlines",
    description: "Topshiriqlar, muddatlar va AI tekshiruv oqimi.",
    href: "/dashboard",
  },
];

export default async function DashboardPage() {
  const user = await getRequiredUser();

  return (
    <main className="min-h-screen bg-[#f3f4f6] px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-[0_4px_12px_rgba(31,31,31,0.06)] md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#6b7280]">Manage Me Internal</p>
              <h1 className="mt-2 text-[clamp(1.5rem,3vw,2.2rem)] font-semibold text-[#1f1f1f]">
                Workspace Dashboard
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

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {MODULES.map((module) => (
            <Link
              key={module.title}
              href={module.href}
              className="group rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-[0_3px_10px_rgba(31,31,31,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(31,31,31,0.08)]"
            >
              <h2 className="text-lg font-semibold text-[#1f1f1f]">{module.title}</h2>
              <p className="mt-2 text-sm text-[#6b7280]">{module.description}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#1f1f1f] group-hover:underline">
                Open module
              </p>
            </Link>
          ))}
        </section>

        <section className="rounded-2xl border border-dashed border-[#d1d5db] bg-[#ffffff8a] p-5 md:p-6">
          <h3 className="text-base font-semibold text-[#1f1f1f]">Reset Completed</h3>
          <p className="mt-2 text-sm text-[#6b7280]">
            Ichki UI nol&apos;dan qayta boshlandi. Endi modullarni bittalab yangi design va flow bilan quramiz.
          </p>
        </section>
      </div>
    </main>
  );
}
