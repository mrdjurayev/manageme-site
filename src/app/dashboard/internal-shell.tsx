"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type MenuItem = {
  key: string;
  label: string;
  group?: string;
};

type NoticeItem = {
  id: string;
  title: string;
  date: string;
};

const MENU_ITEMS: MenuItem[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "fan-tanlovi", label: "Fan tanlovi", group: "Talaba" },
  { key: "mening-fanlarim", label: "Mening fanlarim" },
  { key: "dars-jadvali", label: "Dars jadvali" },
  { key: "vazifalar", label: "Vazifalar" },
  { key: "qayta-oqish", label: "Qayta o'qish" },
  { key: "yakuniy", label: "Yakuniy" },
  { key: "individual-reja", label: "Individual shaxsiy reja" },
  { key: "malumot", label: "Ma'lumot" },
  { key: "sorovnoma", label: "So'rovnoma" },
  { key: "talaba-xizmatlari", label: "Talaba xizmatlari" },
];

const NOTICE_ITEMS: NoticeItem[] = [
  { id: "1", title: "Grant taqsimoti", date: "08.08.2025" },
  { id: "2", title: "Hurmatli 4-bosqich talabalari!", date: "26.04.2025" },
  { id: "3", title: "Hurmatli 1-bosqich talabalari!", date: "03.01.2025" },
  { id: "4", title: "Hurmatli qayta o'qishda o'qiyotganlar!", date: "19.07.2024" },
  { id: "5", title: "\"Qayta o'qish\"", date: "11.07.2024" },
  { id: "6", title: "Qayta o'qishda qatnashish sharti!", date: "01.07.2024" },
  { id: "7", title: "\"Qayta o'qish\"", date: "21.06.2024" },
  { id: "8", title: "\"Qayta o'qish\"", date: "21.06.2024" },
  { id: "9", title: "Yakuniy nazorat", date: "31.05.2024" },
];

function formatServerTime(value: Date): string {
  const date = value.toLocaleDateString("en-GB").replaceAll("/", ".");
  const time = value.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${date} | ${time}`;
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/90" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8 9h8M8 15h6" />
    </svg>
  );
}

export function DashboardShell() {
  const [activeKey, setActiveKey] = useState("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const activeLabel = useMemo(
    () => MENU_ITEMS.find((item) => item.key === activeKey)?.label ?? "Dashboard",
    [activeKey],
  );

  const showCards = activeKey === "dashboard";

  return (
    <main className="flex h-screen overflow-hidden bg-[#f4f7fe]">
      {mobileSidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-label="Close menu overlay"
        />
      ) : null}

      <aside
        className={`z-40 flex h-full flex-col bg-[#1e293b] text-gray-300 transition-all duration-200
          ${mobileSidebarOpen ? "fixed inset-y-0 left-0 w-64" : "fixed inset-y-0 -left-72 w-64 md:left-0"}
          ${desktopSidebarCollapsed ? "md:w-0 md:min-w-0 md:overflow-hidden md:border-r-0" : "md:w-64"}
          md:relative md:inset-auto`}
      >
        <div className="flex items-center gap-3 border-b border-gray-700 px-4 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white p-1">
            <Image
              src="/mm-monogram-logo-hexagon-style-vector-27349645.avif"
              alt="Logo"
              width={28}
              height={28}
              className="h-7 w-7 rounded object-cover"
              priority
            />
          </div>
          <span className="text-[10px] font-bold uppercase leading-tight text-slate-100">
            Muhammad al-Xorazmiy nomidagi TATU
          </span>
        </div>

        <nav className="mt-4 flex-1 overflow-y-auto text-sm">
          {MENU_ITEMS.map((item, index) => {
            const prevItem = MENU_ITEMS[index - 1];
            const showGroup = Boolean(item.group && item.group !== prevItem?.group);
            const isActive = item.key === activeKey;

            return (
              <div key={item.key}>
                {showGroup ? (
                  <div className="mb-1 mt-6 px-6 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                    {item.group}
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    setActiveKey(item.key);
                    setMobileSidebarOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-6 py-3 text-left transition hover:bg-white/10
                    ${isActive ? "border-l-4 border-white bg-white/10 pl-5 text-white" : "text-gray-200"}`}
                >
                  <MenuIcon />
                  <span>{item.label}</span>
                </button>
              </div>
            );
          })}
        </nav>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-8">
          <button
            type="button"
            className="text-gray-600"
            onClick={() => {
              if (window.innerWidth < 768) {
                setMobileSidebarOpen((value) => !value);
                return;
              }
              setDesktopSidebarCollapsed((value) => !value);
            }}
            aria-label="Toggle sidebar"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden text-right md:block">
              <p className="text-[10px] uppercase text-gray-400">Server vaqti</p>
              <p className="text-sm font-bold text-slate-700">{formatServerTime(now)}</p>
            </div>
            <div className="relative text-gray-400">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M7 9a5 5 0 0 1 10 0v4l1.2 2.2a1 1 0 0 1-.88 1.48H6.68a1 1 0 0 1-.88-1.48L7 13V9Z" />
                <path d="M10 18a2 2 0 0 0 4 0" />
              </svg>
              <span className="absolute -right-1 -top-1 inline-grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                1
              </span>
            </div>
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="3" y="7" width="12" height="10" rx="2" />
              <path d="M15 10l6-3v10l-6-3" />
            </svg>
            <div className="h-10 w-10 overflow-hidden rounded-lg border bg-white">
              <Image
                src="/mm-monogram-logo-hexagon-style-vector-27349645.avif"
                alt="User"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {showCards ? (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {NOTICE_ITEMS.map((item) => (
                  <article key={item.id} className="flex h-44 flex-col justify-between rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                    <div>
                      <h3 className="leading-tight font-bold text-slate-800">{item.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{item.title}</p>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="text-xs font-semibold tracking-wider text-gray-300">{item.date}</span>
                      <button
                        type="button"
                        className="rounded bg-[#242e4c] px-4 py-2 text-xs text-white shadow transition hover:bg-slate-700"
                      >
                        Batafsil
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-6 flex justify-end gap-2 text-sm font-medium text-gray-500">
                <span className="cursor-pointer">« Oldingi</span>
                <span className="cursor-pointer">Keyingi »</span>
              </div>
            </>
          ) : (
            <section className="rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <h2 className="text-xl font-semibold text-slate-800">{activeLabel}</h2>
              <p className="mt-2 text-sm text-gray-500">Bu bo&apos;lim keyingi bosqichda shu layout ichida quriladi.</p>
            </section>
          )}
        </div>
      </section>

      <button
        type="button"
        aria-label="Telegram"
        className="fixed bottom-6 right-6 inline-grid h-10 w-10 place-items-center rounded-full bg-blue-900 text-white shadow-lg"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M21.5 4.8a1 1 0 0 0-1.06-.16L3.4 11.5a1 1 0 0 0 .08 1.88l4.6 1.54 1.69 4.95a1 1 0 0 0 1.83.19l2.35-3.2 4.38 3.22a1 1 0 0 0 1.56-.55l2.52-13.63a1 1 0 0 0-.4-1.1ZM9.6 14.24l8.63-6.85-6.67 7.97-.68 1.48-1.28-2.6Z" />
        </svg>
      </button>
    </main>
  );
}
