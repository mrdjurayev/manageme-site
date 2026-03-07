"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  ClipboardList,
  FileText,
  GraduationCap,
  HelpCircle,
  Info,
  LayoutDashboard,
  LogOut,
  Menu,
  RotateCcw,
  ScrollText,
  Send,
  Settings,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Announcement = {
  title: string;
  date: string;
};

type MenuItem = {
  name: string;
  icon: LucideIcon;
  section: string | null;
};

const announcements: Announcement[] = [
  { title: "Grant taqsimoti", date: "08:08:2025" },
  { title: "Hurmatli 4-bosqich talabalari!", date: "26:04:2025" },
  { title: "Hurmatli 1-bosqich talabalari!", date: "03:01:2025" },
  { title: "Hurmatli qayta o'qishda o'qiyotgan talabalar diqqatiga!", date: "19:07:2024" },
  { title: "\"Qayta o'qish\"", date: "11:07:2024" },
  { title: "Qayta o'qishda qatnashish sharti!", date: "01:07:2024" },
  { title: "\"Qayta o'qish\"", date: "21:06:2024" },
  { title: "\"Qayta o'qish\"", date: "21:06:2024" },
  { title: "Yakuniy nazorat", date: "31:05:2024" },
];

const menuItems: MenuItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, section: null },
  { name: "Fan tanlov", icon: BookOpen, section: "TALABA" },
  { name: "Mening fanlarim", icon: GraduationCap, section: null },
  { name: "Dars jadvali", icon: Calendar, section: null },
  { name: "Vazifalar", icon: ClipboardList, section: null },
  { name: "Qayta o'qish", icon: RotateCcw, section: null },
  { name: "Yakuniy", icon: HelpCircle, section: null },
  { name: "Individual shaxsiy reja", icon: FileText, section: null },
  { name: "Ma'lumot", icon: Info, section: null },
  { name: "So'rovnoma", icon: BarChart3, section: null },
  { name: "Talaba xizmatlari", icon: Settings, section: null },
  { name: "Diplom ishi", icon: ScrollText, section: null },
];

function formatServerTime(date: Date): string {
  const day = date.toLocaleDateString("en-GB").replaceAll("/", ".");
  const time = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${day} | ${time}`;
}

export function DashboardShell() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [currentTime, setCurrentTime] = useState(() => formatServerTime(new Date()));
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(formatServerTime(new Date())), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f4f7fe] font-sans text-slate-700">
      {mobileSidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-label="Close menu"
        />
      ) : null}

      <header className="z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-2 shadow-sm md:px-6">
        <div className="flex min-w-0 items-center gap-2 md:gap-3">
          <div className="-ml-0.5 shrink-0 p-0 md:-ml-1">
            <Image
              src="/manageme-white.png"
              alt="Logo"
              width={58}
              height={58}
              className="h-[58px] w-[58px] object-contain"
              priority
            />
          </div>
          <h1 className="line-clamp-2 text-[10px] font-bold uppercase leading-[1.2] tracking-tight text-[#243a6b] sm:text-[11px] md:text-[13px]">
            MANAGE ME
          </h1>
          <button
            type="button"
            onClick={() => {
              if (window.innerWidth < 1024) {
                setMobileSidebarOpen((value) => !value);
                return;
              }
              setDesktopSidebarCollapsed((value) => !value);
            }}
            className="ml-0 rounded-md p-2 text-[#243a6b] transition-colors hover:bg-slate-50"
            aria-label="Toggle menu"
          >
            <Menu size={22} />
          </button>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden text-right sm:block">
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Server vaqti</p>
            <p className="text-[14px] font-bold text-slate-700">{currentTime}</p>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsNotifOpen((value) => !value);
                setIsProfileOpen(false);
              }}
              className={`relative p-1.5 transition-colors ${
                isNotifOpen ? "text-blue-600" : "text-slate-400 hover:text-blue-500"
              }`}
              aria-label="Notifications"
            >
              <Bell size={22} />
              <span className="absolute right-1 top-1 flex h-[17px] w-[17px] items-center justify-center rounded-full border-2 border-white bg-[#f44336] text-[9px] font-bold text-white">
                1
              </span>
            </button>

            {isNotifOpen ? (
              <div className="absolute right-[-10px] mt-4 w-[320px] overflow-hidden rounded-md border border-slate-100 bg-white shadow-2xl">
                <div className="bg-[#242e4c] p-3 text-[13px] font-bold text-white">Xabarnomalar</div>
                <div className="flex cursor-pointer gap-4 border-b border-slate-50 p-4 hover:bg-slate-50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#f0f2f5] text-slate-500">
                    <FileText size={20} />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[13px] font-bold leading-tight text-blue-500">amaliy ish (Tahdid razvedkasi)</p>
                    <p className="mt-1 text-[12px] font-medium text-slate-600">Muddatgacha 4 kun qoldi</p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-tighter text-slate-300">
                      11-03-26 23:59:59
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <button type="button" className="p-1.5 text-slate-400 transition-colors hover:text-blue-500" aria-label="Video">
            <Video size={22} />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsProfileOpen((value) => !value);
                setIsNotifOpen(false);
              }}
              className="flex items-center focus:outline-none"
              aria-label="Profile menu"
            >
              <Image
                src="/mm-monogram-logo-hexagon-style-vector-27349645.avif"
                alt="User"
                width={40}
                height={40}
                className="h-10 w-10 rounded-lg border border-slate-200 object-cover shadow-sm"
              />
            </button>

            {isProfileOpen ? (
              <div className="absolute right-0 mt-4 w-52 overflow-hidden rounded-md border border-slate-100 bg-white shadow-2xl">
                <div className="bg-[#242e4c] p-3.5 text-white">
                  <p className="text-[13px] font-bold uppercase leading-tight tracking-wide">Oktyabrov</p>
                  <p className="text-[12px] font-medium opacity-80">Shaxobiddin</p>
                </div>
                <div className="py-1">
                  <button className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] text-slate-600 transition-colors hover:bg-slate-50">
                    <Settings size={15} className="text-slate-400" /> Profil sozlamalari
                  </button>
                  <button className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] text-slate-600 transition-colors hover:bg-slate-50">
                    <LogOut size={15} className="text-slate-400" /> Chiqish
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside
          className={`custom-scrollbar z-40 overflow-y-auto bg-[#1e293b] text-slate-300 transition-all duration-200
            ${desktopSidebarCollapsed ? "lg:w-0 lg:min-w-0 lg:overflow-hidden" : "lg:w-[260px]"}
            ${mobileSidebarOpen ? "fixed inset-y-16 left-0 w-[260px]" : "fixed inset-y-16 -left-72 w-[260px] lg:relative lg:inset-auto lg:left-0"}
            border-r border-slate-700/50`}
        >
          <nav className="py-4 text-sm">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name}>
                  {item.section ? (
                    <div className="mb-2 mt-6 px-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {item.section}
                    </div>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenu(item.name);
                      setMobileSidebarOpen(false);
                    }}
                    className={`relative flex w-full items-center gap-3 px-6 py-[11px] text-left transition-all ${
                      activeMenu === item.name
                        ? "border-l-[3px] border-white bg-[#2d3a4f] pl-[21px] text-white"
                        : "border-l-[3px] border-transparent hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon size={18} className={activeMenu === item.name ? "opacity-100" : "opacity-60"} />
                    <span className="text-[13px] font-medium tracking-wide">{item.name}</span>
                  </button>
                  {item.name === "Dashboard" ? <div className="mt-4 h-[0.5px] w-full bg-[rgb(143,162,186)]" /> : null}
                </div>
              );
            })}
          </nav>
        </aside>

        <main className="custom-scrollbar min-w-0 flex-1 overflow-y-auto bg-[#f4f7fe] p-4 md:p-8">
          {activeMenu === "Dashboard" ? (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {announcements.map((item) => (
                  <article
                    key={`${item.title}-${item.date}`}
                    className="flex h-[185px] flex-col justify-between rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
                  >
                    <div>
                      <h3 className="text-[14px] font-bold uppercase leading-snug tracking-tight text-[#242e4c]">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-[13px] text-slate-500">{item.title}</p>
                    </div>
                    <div className="flex items-end justify-between pt-4">
                      <span className="text-[12px] font-bold uppercase tracking-[1.5px] text-slate-200">{item.date}</span>
                      <button
                        type="button"
                        className="rounded-sm bg-[#242e4c] px-5 py-2 text-[11px] font-bold uppercase tracking-tight text-white shadow-sm transition-all hover:bg-slate-800 active:scale-95"
                      >
                        Batafsil
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-8 flex justify-end gap-3 text-[13px] font-bold text-slate-400">
                <button type="button" className="transition-colors hover:text-slate-700">
                  « Oldingi
                </button>
                <button type="button" className="transition-colors hover:text-slate-700">
                  Keyingi »
                </button>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col">
              <h2 className="mb-6 text-2xl font-light uppercase tracking-wide text-slate-500">Video Qo&apos;llanma</h2>
              <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/50 italic text-slate-400">
                Bu bo&apos;lim bo&apos;sh
              </div>
            </div>
          )}
        </main>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#242e4c] text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          aria-label="Send"
        >
          <Send size={20} fill="currentColor" className="-ml-[2px] mt-[1px]" />
        </button>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
