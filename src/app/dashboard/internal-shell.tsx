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
  details: string;
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
    id: 2,
    category: "Announcements",
    title: "Website overview",
    description: "This website was developed by AJ Development and tracks learning progress over time...",
    dateTime: "13.03.2026 | 21:30",
    details: "",
  },
  {
    id: 3,
    category: "Announcements",
    title: "Assignment review",
    description:
      "Assignments uploaded to the system are reviewed automatically or with AI support, and the results are highly accurate.",
    dateTime: "13.03.2026 | 21:10",
    details: "",
  },
  {
    id: 5,
    category: "Announcements",
    title: "Semester structure",
    description:
      "The system has four semesters each year. During these semesters, students study, complete practical training, and take final exams.",
    dateTime: "13.03.2026 | 20:50",
    details: "",
  },
  {
    id: 6,
    category: "Requirements",
    title: "Attendance rules",
    description:
      "Students must familiarize themselves with the system's attendance rules and the terms of the contract.",
    dateTime: "13.03.2026 | 21:05",
    details: "",
  },
  {
    id: 7,
    category: "Requirements",
    title: "Assignments",
    description: "Students must complete assignments on time and upload them to the system.",
    dateTime: "13.03.2026 | 21:20",
    details: "",
  },
  {
    id: 8,
    category: "Requirements",
    title: "Assessment criteria",
    description:
      "Students are evaluated based on their activity during the season and the results of their assigned tasks.",
    dateTime: "13.03.2026 | 21:35",
    details: "",
  },
  {
    id: 9,
    category: "Requirements",
    title: "Contract terms",
    description:
      "The terms of the contract are established between the system and the student, and compliance with them is mandatory.",
    dateTime: "13.03.2026 | 21:40",
    details: "",
  },
];

const SOFT_DIVIDER_COLOR = "rgba(203,213,225,0.45)";
const SOFT_BORDER = `0.5px solid ${SOFT_DIVIDER_COLOR}`;
const HAIRLINE_SIZE = "0.5px";
const MOBILE_BREAKPOINT = 1024;
const PRIMARY_TEXT = "rgb(36, 31, 33)";
const PRIMARY_BG = "rgb(255, 255, 255)";
const FILTER_BUTTON_CLASS = "h-9 shrink-0 cursor-pointer rounded-lg px-4 text-sm font-medium";
const FILTER_BAR_CLASS = "-mx-4 h-[70px] md:-mx-8";
const FILTER_BAR_INNER_CLASS = "mobile-scrollbar-hidden flex h-full w-full items-center gap-2 overflow-x-auto px-4 md:px-8";
const DASHBOARD_GRID_CLASS =
  "custom-scrollbar grid min-h-0 flex-1 grid-cols-1 auto-rows-[168px] gap-4 overflow-y-auto pb-4 pr-1 sm:grid-cols-2 sm:auto-rows-[180px] sm:pb-0 lg:auto-rows-[180px]";
const DASHBOARD_CARD_CLASS =
  "relative min-h-0 overflow-hidden rounded-lg bg-[rgb(255,255,255)] shadow-none lg:h-full";
const DASHBOARD_CARD_CONTENT_CLASS = "grid h-full grid-rows-[auto,1fr,auto] gap-1.5 p-3 sm:p-3.5";
const DASHBOARD_CARD_TITLE_CLASS =
  "text-[15px] font-semibold leading-none tracking-[0.01em] text-[rgb(36,31,33)] sm:text-[17px]";
const DASHBOARD_CARD_DESCRIPTION_CLASS =
  "max-w-full text-[10px] leading-[1.4] text-[rgb(36,31,33)] sm:max-w-[29ch] sm:text-[11px]";
const DASHBOARD_CARD_FOOTER_CLASS = "flex items-center justify-between gap-2";
const DASHBOARD_CARD_DATE_CLASS = "text-[10px] font-medium leading-none sm:text-[11px]";
const DASHBOARD_CARD_BUTTON_CLASS =
  "shrink-0 cursor-pointer rounded-lg bg-[#fafafa] px-3 py-2 text-[11px] font-medium leading-none text-[rgb(36,31,33)] outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 active:bg-[#fafafa] hover:bg-[#fafafa] sm:px-4 sm:text-[12px]";
const DASHBOARD_CARD_BORDER_SHADOW = `inset 0 0 0 ${HAIRLINE_SIZE} ${SOFT_DIVIDER_COLOR}`;
const DASHBOARD_CARD_DESCRIPTION_STYLE = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical" as const,
  WebkitLineClamp: 2,
  overflow: "hidden",
};
const FILTER_BAR_STYLE = { borderBottom: `${HAIRLINE_SIZE} solid transparent` };
const CARD_READ_MORE_LABEL = "Read more";
const MODAL_CLOSE_LABEL = "Close";
const LOGIN_PLACEHOLDER_COLOR = "#6b7280";
const DASHBOARD_MODAL_PANEL_CLASS =
  "custom-scrollbar w-[min(34rem,calc(100vw-1.5rem))] max-h-[min(34rem,calc(100dvh-2rem))] overflow-y-auto rounded-xl bg-white p-5 sm:p-6";
const DASHBOARD_MODAL_CLOSE_BUTTON_CLASS =
  "h-9 shrink-0 cursor-pointer rounded-lg px-4 text-sm font-medium outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 active:bg-[rgb(36,31,33)] hover:bg-[rgb(36,31,33)]";

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
  const [selectedCard, setSelectedCard] = useState<DashboardCardItem | null>(null);
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

  useEffect(() => {
    if (!selectedCard) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedCard(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCard]);

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
              desktopSidebarCollapsed ? "lg:grid-cols-3" : "lg:grid-cols-2",
            )}
          >
            {dashboardCards.map((card) => (
              <article
                key={`${activeFilter}-${card.id}`}
                className={DASHBOARD_CARD_CLASS}
                style={{ boxShadow: DASHBOARD_CARD_BORDER_SHADOW }}
                aria-label={`${card.category} card ${card.id}`}
              >
                <div className={DASHBOARD_CARD_CONTENT_CLASS}>
                  <p className={DASHBOARD_CARD_TITLE_CLASS}>{card.title}</p>
                  <div className="min-h-0 overflow-hidden">
                    <p className={DASHBOARD_CARD_DESCRIPTION_CLASS} style={DASHBOARD_CARD_DESCRIPTION_STYLE}>
                      {card.description}
                    </p>
                  </div>
                  <div className={DASHBOARD_CARD_FOOTER_CLASS}>
                    <p className={DASHBOARD_CARD_DATE_CLASS} style={{ color: LOGIN_PLACEHOLDER_COLOR }}>
                      {card.dateTime}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedCard(card)}
                      className={DASHBOARD_CARD_BUTTON_CLASS}
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

      {selectedCard ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 px-3 py-4"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className={DASHBOARD_MODAL_PANEL_CLASS}
            style={{ boxShadow: DASHBOARD_CARD_BORDER_SHADOW }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-[22px] font-semibold leading-tight text-[rgb(36,31,33)]">{selectedCard.title}</h2>
                <p className="text-sm leading-6 text-[rgb(36,31,33)]">{selectedCard.description}</p>
              </div>
              <div className="min-h-[120px] rounded-lg bg-[#fafafa] p-4" style={{ boxShadow: DASHBOARD_CARD_BORDER_SHADOW }}>
                {selectedCard.details ? (
                  <p className="text-sm leading-6 text-[rgb(36,31,33)]">{selectedCard.details}</p>
                ) : null}
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-[#6b7280]">{selectedCard.dateTime}</p>
                <button
                  type="button"
                  onClick={() => setSelectedCard(null)}
                  className={DASHBOARD_MODAL_CLOSE_BUTTON_CLASS}
                  style={{
                    border: SOFT_BORDER,
                    backgroundColor: PRIMARY_TEXT,
                    color: PRIMARY_BG,
                  }}
                >
                  {MODAL_CLOSE_LABEL}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <style jsx global>{`
        .mobile-scrollbar-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .mobile-scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
        @media (min-width: 768px) {
          .mobile-scrollbar-hidden {
            -ms-overflow-style: auto;
            scrollbar-width: auto;
          }
          .mobile-scrollbar-hidden::-webkit-scrollbar {
            display: initial;
          }
        }
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
