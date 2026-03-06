"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type MenuKey = "dashboard" | "subjects" | "schedule" | "attendance" | "progress" | "about";

type MenuItem = {
  key: MenuKey;
  label: string;
};

const MENU_ITEMS: MenuItem[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "subjects", label: "Subjects" },
  { key: "schedule", label: "Schedule" },
  { key: "attendance", label: "Attendance" },
  { key: "progress", label: "Progress" },
  { key: "about", label: "About" },
];

function formatNow(value: Date): string {
  return value.toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DashboardShell() {
  const [activeMenu, setActiveMenu] = useState<MenuKey>("dashboard");
  const [now, setNow] = useState(() => new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000 * 30);
    return () => window.clearInterval(timer);
  }, []);

  const title = useMemo(
    () => MENU_ITEMS.find((item) => item.key === activeMenu)?.label ?? "Dashboard",
    [activeMenu],
  );

  return (
    <main className="min-h-screen bg-[#f3f4f6] p-4 md:p-6">
      <div className="mx-auto w-full max-w-[1500px]">
        <header className="flex h-[92px] items-center gap-3 rounded-[30px] border border-[#cfd4dd] bg-[#f7f8fa] px-4 shadow-[0_3px_12px_rgba(31,31,31,0.07)] md:h-[98px] md:gap-5 md:px-8">
          <div className="flex h-[66px] w-[130px] shrink-0 items-center justify-center rounded-full border border-[#d1d5db] bg-[#f1f3f6] shadow-[0_2px_8px_rgba(31,31,31,0.08)] md:h-[70px] md:w-[160px]">
            <Image
              src="/mm-monogram-logo-hexagon-style-vector-27349645.avif"
              alt="Manage Me logo"
              width={44}
              height={44}
              className="h-11 w-11 rounded-md object-cover"
              priority
            />
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((value) => !value)}
            className="grid h-12 w-12 place-items-center rounded-xl border border-[#d1d5db] bg-[#eff2f6] text-[#7b8494] lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3.2" y="4.2" width="7.5" height="15.6" rx="2" />
              <rect x="13.3" y="4.2" width="7.5" height="15.6" rx="2" />
            </svg>
          </button>

          <div className="ml-auto flex items-center gap-3 text-[#7f8796] md:gap-7">
            <p className="hidden text-xl font-medium md:block">{formatNow(now)}</p>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full border border-[#d1d5db] bg-[#eff2f6]"
              aria-label="Notifications"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M7 9a5 5 0 0 1 10 0v4l1.3 2.4A1 1 0 0 1 17.4 17H6.6a1 1 0 0 1-.9-1.6L7 13V9Z" />
                <path d="M10 18a2 2 0 0 0 4 0" />
              </svg>
            </button>
            <button
              type="button"
              className="grid h-14 w-14 place-items-center rounded-full border border-[#cfd4dd] bg-[#eff2f6] text-[#7d8592]"
              aria-label="Profile"
            >
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
                <circle cx="12" cy="8" r="4.2" />
                <path d="M4.6 19.6a7.4 7.4 0 0 1 14.8 0" />
              </svg>
            </button>
          </div>
        </header>

        <div className="mt-5 grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside
            className={`rounded-[34px] border border-[#cfd4dd] bg-[#f7f8fa] p-5 shadow-[0_3px_12px_rgba(31,31,31,0.07)] ${
              isMenuOpen ? "block" : "hidden lg:block"
            }`}
          >
            <nav className="space-y-4">
              {MENU_ITEMS.map((item) => {
                const isActive = item.key === activeMenu;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setActiveMenu(item.key);
                      setIsMenuOpen(false);
                    }}
                    className={`h-[86px] w-full rounded-3xl border text-[42px] tracking-tight shadow-[0_3px_8px_rgba(31,31,31,0.06)] transition-colors ${
                      isActive
                        ? "border-[#bcc4d0] bg-[#edf1f6] text-[#5f6878]"
                        : "border-[#d3d8e0] bg-[#f4f6f9] text-[#768093] hover:bg-[#edf1f6]"
                    }`}
                  >
                    <span className="text-[clamp(1.8rem,2.6vw,3.05rem)] leading-none">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <section className="min-h-[600px] rounded-[34px] border border-[#d6dbe4] bg-[#f8f9fb] p-7 shadow-[0_3px_12px_rgba(31,31,31,0.04)]">
            <h2 className="text-[clamp(2rem,3vw,3rem)] font-medium tracking-tight text-[#6f7888]">{title}</h2>
            <p className="mt-3 text-lg text-[#8a93a2]">
              Empty workspace. We will build this module from zero in the next step.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
