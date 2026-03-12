"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  BookOpen,
  Calendar,
  ChartNoAxesCombined,
  ClipboardList,
  FileText,
  HelpCircle,
  Info,
  LayoutDashboard,
  LogOut,
  Menu,
  RotateCcw,
  Settings,
  UserCircle2,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { signOutAction } from "@/lib/actions/auth";

type MenuItem = {
  name: string;
  icon: LucideIcon;
  section: string | null;
};
type DashboardCategory = "News" | "Announcements" | "Requirements";
type DashboardFilter = "All" | DashboardCategory;
type DashboardCardItem = {
  id: number;
  category: DashboardCategory;
  title: string;
  description: string;
  dateTime: string;
};

const menuItems: MenuItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, section: null },
  { name: "My Subjects", icon: BookOpen, section: "STUDENT" },
  { name: "Lesson Schedule", icon: Calendar, section: null },
  { name: "Assignments", icon: ClipboardList, section: null },
  { name: "Subject Retake", icon: RotateCcw, section: null },
  { name: "Final Exam", icon: HelpCircle, section: null },
  { name: "Individual Plan", icon: ChartNoAxesCombined, section: null },
  { name: "About", icon: Info, section: null },
];
const DASHBOARD_FILTERS: DashboardFilter[] = ["All", "News", "Announcements", "Requirements"];
const DASHBOARD_CARD_ITEMS: DashboardCardItem[] = [
  {
    id: 1,
    category: "News",
    title: "Semester update",
    description: "The academic calendar has been updated for the next study block and key classroom activities...",
    dateTime: "13.03.2026 | 09:15",
  },
  {
    id: 2,
    category: "Announcements",
    title: "This website",
    description: "This website was developed by AJ Development and monitors the users learning over a certain period of time...",
    dateTime: "12.03.2026 | 08:08",
  },
  {
    id: 3,
    category: "Requirements",
    title: "Document check",
    description: "Please review the required documents list before the next submission deadline and upload updates...",
    dateTime: "11.03.2026 | 17:40",
  },
  {
    id: 4,
    category: "News",
    title: "Classroom notice",
    description: "A new classroom allocation has been published for this week and students should review changes...",
    dateTime: "10.03.2026 | 11:25",
  },
  {
    id: 5,
    category: "Announcements",
    title: "System notice",
    description: "Platform improvements were released today to make schedule tracking and subject monitoring easier...",
    dateTime: "09.03.2026 | 14:05",
  },
  {
    id: 6,
    category: "Requirements",
    title: "Attendance rules",
    description: "Attendance records must be checked weekly to avoid missing any important status updates or warnings...",
    dateTime: "08.03.2026 | 10:30",
  },
];

const SOFT_DIVIDER_COLOR = "rgba(203,213,225,0.45)";
const SOFT_BORDER = `0.5px solid ${SOFT_DIVIDER_COLOR}`;
const HAIRLINE_SIZE = "0.5px";
const MOBILE_BREAKPOINT = 1024;
const PRIMARY_TEXT = "rgb(36, 31, 33)";
const PRIMARY_BG = "rgb(255, 255, 255)";
const FILTER_BUTTON_CLASS =
  "min-w-0 cursor-pointer rounded-lg px-2 py-2 text-[10px] font-medium leading-tight md:h-9 md:shrink-0 md:px-4 md:py-0 md:text-sm";
const FILTER_BAR_CLASS = "-mx-4 px-4 py-3 md:-mx-8 md:h-[70px] md:px-0 md:py-0";
const FILTER_BAR_INNER_CLASS =
  "grid w-full grid-cols-4 gap-1.5 md:flex md:h-full md:items-center md:gap-2 md:overflow-x-auto md:px-8";
const DASHBOARD_GRID_CLASS =
  "grid min-h-0 flex-1 grid-cols-1 auto-rows-[172px] gap-4 overflow-y-auto pb-4 sm:grid-cols-2 sm:auto-rows-[184px] sm:pb-0 lg:overflow-hidden lg:pb-0";
const DASHBOARD_CARD_CLASS =
  "relative min-h-0 overflow-hidden rounded-lg bg-[rgb(255,255,255)] shadow-none lg:h-full";
const DASHBOARD_CARD_BORDER_SHADOW = `inset 0 0 0 ${HAIRLINE_SIZE} ${SOFT_DIVIDER_COLOR}`;
const FILTER_BAR_STYLE = { borderBottom: `${HAIRLINE_SIZE} solid transparent` };
const CARD_READ_MORE_LABEL = "Read more";
const LOGIN_PLACEHOLDER_COLOR = "#6b7280";

function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function formatServerTime(date: Date, timeZone: string): string {
  const day = date.toLocaleDateString("en-GB", { timeZone }).replaceAll("/", ".");
  const time = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone });
  return `${day} | ${time}`;
}

type DashboardShellProps = {
  initialServerTimeIso: string;
  serverTimeZone?: string;
};

export function DashboardShell({ initialServerTimeIso, serverTimeZone }: DashboardShellProps) {
  const normalizedServerTimeZone = serverTimeZone || "UTC";
  const initialServerEpoch = Date.parse(initialServerTimeIso);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [activeFilter, setActiveFilter] = useState<DashboardFilter>("All");
  const [currentTime, setCurrentTime] = useState(() =>
    formatServerTime(
      new Date(Number.isFinite(initialServerEpoch) ? initialServerEpoch : 0),
      normalizedServerTimeZone,
    ),
  );
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const baseServerMs = Number.isFinite(initialServerEpoch) ? initialServerEpoch : Date.now();
    const startedAtMs = Date.now();

    const tick = () => {
      const elapsedMs = Date.now() - startedAtMs;
      setCurrentTime(formatServerTime(new Date(baseServerMs + elapsedMs), normalizedServerTimeZone));
    };

    tick();

    const timer = window.setInterval(() => {
      tick();
    }, 30_000);

    return () => window.clearInterval(timer);
  }, [initialServerEpoch, normalizedServerTimeZone]);

  useEffect(() => {
    const handleDocumentPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) {
        return;
      }

      const clickedInsideNotif = notifRef.current?.contains(target) ?? false;
      const clickedInsideProfile = profileRef.current?.contains(target) ?? false;

      if (!clickedInsideNotif) {
        setIsNotifOpen(false);
      }

      if (!clickedInsideProfile) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleDocumentPointerDown);

    return () => {
      document.removeEventListener("pointerdown", handleDocumentPointerDown);
    };
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth < MOBILE_BREAKPOINT) {
      setMobileSidebarOpen((value) => !value);
      return;
    }

    setDesktopSidebarCollapsed((value) => !value);
  };

  const toggleNotifications = () => {
    setIsNotifOpen((value) => !value);
    setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen((value) => !value);
    setIsNotifOpen(false);
  };

  const selectMenu = (name: string) => {
    setActiveMenu(name);
    setMobileSidebarOpen(false);
  };

  const sidebarClassName = cn(
    "custom-scrollbar fixed bottom-0 left-0 top-20 z-40 w-[260px] overflow-x-hidden overflow-y-auto bg-white text-[rgb(36,31,33)] transition-[transform,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
    mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
    "lg:relative lg:bottom-auto lg:left-0 lg:top-auto lg:translate-x-0",
    desktopSidebarCollapsed ? "lg:w-0 lg:min-w-0 lg:overflow-hidden" : "lg:w-[260px]",
  );
  const dashboardCards = useMemo(
    () =>
      activeFilter === "All"
        ? DASHBOARD_CARD_ITEMS
        : DASHBOARD_CARD_ITEMS.filter((item) => item.category === activeFilter),
    [activeFilter],
  );

  return (
    <div className="app-shell-scale flex h-[100dvh] flex-col overflow-hidden bg-[#f4f7fe] font-sans text-slate-700">
      <button
        type="button"
        className={cn(
          "fixed inset-0 z-30 bg-black/30 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden",
          mobileSidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMobileSidebarOpen(false)}
        aria-label="Close menu"
      />

      <header
        className="z-50 flex h-20 items-center justify-between bg-white px-2 md:px-6"
        style={{ borderBottom: SOFT_BORDER }}
      >
        <div className="flex h-full min-w-0 items-center gap-2 md:gap-3">
          <div className="-ml-0.5 shrink-0 p-0 md:-ml-1">
            <Image
              src="/manageme-white.png"
              alt="Logo"
              width={66}
              height={66}
              className="h-[66px] w-[66px] object-contain"
              priority
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveMenu("Dashboard");
              setMobileSidebarOpen(false);
            }}
            className="line-clamp-2 cursor-pointer text-[12px] font-bold uppercase leading-[1.2] tracking-tight text-[rgb(36,31,33)] sm:text-[13px] md:text-[15px]"
          >
            MANAGE ME
          </button>
          <button
            type="button"
            onClick={toggleSidebar}
            className="ml-0 cursor-pointer rounded-md p-2 text-[rgb(36,31,33)] transition-colors hover:bg-slate-50"
            aria-label="Toggle menu"
          >
            <Menu size={22} />
          </button>
        </div>

        <div className="flex h-full items-center gap-4 md:gap-6">
          <div className="hidden text-right sm:block">
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">SERVER TIME</p>
            <p className="text-[14px] font-bold text-[rgb(36,31,33)]">{currentTime}</p>
          </div>

          <div ref={notifRef} className="relative flex h-full items-center">
            <button
              type="button"
              onClick={toggleNotifications}
              className="relative cursor-pointer p-1.5 text-[rgb(36,31,33)] transition-colors"
              aria-label="Notifications"
            >
              <Bell size={23} strokeWidth={1.7} />
              <span className="absolute right-1 top-1 flex h-[17px] w-[17px] items-center justify-center rounded-full border-2 border-white bg-[#f44336] text-[9px] font-bold text-white">
                1
              </span>
            </button>

            {isNotifOpen ? (
              <div
                className="fixed left-1/2 top-20 z-50 w-[min(17.5rem,calc(100vw-1.5rem))] -translate-x-1/2 overflow-hidden rounded-md bg-white md:absolute md:left-auto md:right-[-10px] md:top-full md:w-[320px] md:translate-x-0"
                style={{ border: SOFT_BORDER, boxShadow: "none" }}
              >
                <div className="bg-[rgb(36,31,33)] p-3 text-[13px] font-bold text-white">Notifications</div>
                <div className="flex cursor-pointer gap-4 border-b border-slate-50 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[rgb(250,250,250)] text-[rgb(36,31,33)]">
                    <FileText size={20} />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[13px] font-bold leading-tight text-[rgb(36,31,33)]">main deadline title</p>
                    <p className="mt-1 text-[12px] font-medium text-[#6b7280]">title of day left</p>
                    <p className="mt-1 text-[10px] font-normal text-[#6b7280]">last period of deadline</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <button
            type="button"
            className="cursor-pointer p-1.5 text-[rgb(36,31,33)] transition-colors"
            aria-label="Video"
          >
            <Video size={23} strokeWidth={1.7} />
          </button>

          <div ref={profileRef} className="relative flex h-full items-center">
            <button
              type="button"
              onClick={toggleProfile}
              className="flex h-10 w-10 cursor-pointer items-center justify-center focus:outline-none"
              aria-label="Profile menu"
            >
              <UserCircle2 size={30} strokeWidth={1.6} className="text-[rgb(36,31,33)]" />
            </button>

            {isProfileOpen ? (
              <div
                className="absolute right-0 top-full w-52 overflow-hidden rounded-md bg-white"
                style={{ border: SOFT_BORDER, boxShadow: "none" }}
              >
                <div className="bg-[rgb(36,31,33)] p-3.5 text-white">
                  <p className="text-[13px] font-bold uppercase leading-tight tracking-wide">Abdullox</p>
                  <p className="text-[12px] font-medium text-[#6b7280]">Jurayev</p>
                </div>
                <div className="py-1">
                  <button className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-[13px] text-[rgb(36,31,33)]">
                    <Settings size={15} className="text-[rgb(36,31,33)]" /> Profile Settings
                  </button>
                  <form action={signOutAction}>
                    <button
                      type="submit"
                      className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-[13px] text-[rgb(36,31,33)]"
                    >
                      <LogOut size={15} className="text-[rgb(36,31,33)]" /> Logout
                    </button>
                  </form>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className={sidebarClassName} style={{ borderRight: SOFT_BORDER }}>
          <div className="w-[260px]">
            <nav className="pb-4 pt-3 text-sm">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.name;

                return (
                  <div key={item.name}>
                    {item.section ? (
                      <div className="mb-2 mt-6 px-6 text-[10px] font-bold uppercase tracking-widest text-[rgb(36,31,33)]">
                        {item.section}
                      </div>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => selectMenu(item.name)}
                      className={cn(
                        "relative flex w-full cursor-pointer items-center gap-3 px-6 py-3 text-left transition-all",
                        isActive ? "border-l-[3px] border-[rgb(36,31,33)] pl-[21px]" : "border-l-[3px] border-transparent",
                      )}
                    >
                      <Icon size={20} className="text-[rgb(36,31,33)]" />
                      <span className="text-[15px] font-medium tracking-wide text-[rgb(36,31,33)]">{item.name}</span>
                    </button>
                    {item.name === "Dashboard" ? (
                      <div className="mt-3 h-[0.5px] w-full" style={{ backgroundColor: SOFT_DIVIDER_COLOR }} />
                    ) : null}
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="min-w-0 flex flex-1 flex-col overflow-hidden bg-[rgb(250,250,250)] px-4 pb-4 md:px-8 md:pb-8">
          <div className={FILTER_BAR_CLASS} style={FILTER_BAR_STYLE}>
            <div className={FILTER_BAR_INNER_CLASS}>
              {DASHBOARD_FILTERS.map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={FILTER_BUTTON_CLASS}
                    style={{
                      border: SOFT_BORDER,
                      backgroundColor: isActive ? PRIMARY_TEXT : PRIMARY_BG,
                      color: isActive ? PRIMARY_BG : PRIMARY_TEXT,
                    }}
                    aria-pressed={isActive}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>
          <section
            className={cn(
              DASHBOARD_GRID_CLASS,
              desktopSidebarCollapsed
                ? "lg:grid-cols-3 lg:grid-rows-2 lg:auto-rows-auto"
                : "lg:grid-cols-2 lg:grid-rows-3 lg:auto-rows-auto",
            )}
          >
            {dashboardCards.map((card) => (
              <article
                key={`${activeFilter}-${card.id}`}
                className={DASHBOARD_CARD_CLASS}
                style={{ boxShadow: DASHBOARD_CARD_BORDER_SHADOW }}
                aria-label={`${card.category} card ${card.id}`}
              >
                <div className="grid h-full grid-rows-[auto,1fr,auto] gap-2 p-3.5 sm:p-4">
                  <p className="text-[16px] font-semibold leading-none tracking-[0.01em] text-[rgb(36,31,33)] sm:text-[18px]">
                    {card.title}
                  </p>
                  <div className="min-h-0 overflow-hidden">
                    <p
                      className="max-w-full text-[10px] leading-[1.45] text-[rgb(36,31,33)] sm:max-w-[29ch] sm:text-[11px]"
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        overflow: "hidden",
                      }}
                    >
                      {card.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-2 sm:gap-3">
                    <p className="text-[10px] font-medium leading-none sm:text-[11px]" style={{ color: LOGIN_PLACEHOLDER_COLOR }}>
                      {card.dateTime}
                    </p>
                    <button
                      type="button"
                      className="shrink-0 cursor-pointer rounded-lg bg-[#fafafa] px-3 py-2 text-[11px] font-medium leading-none text-[rgb(36,31,33)] outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 active:bg-[#fafafa] hover:bg-[#fafafa] sm:px-4 sm:text-[12px]"
                      style={{ boxShadow: DASHBOARD_CARD_BORDER_SHADOW }}
                    >
                      {CARD_READ_MORE_LABEL}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </main>
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
