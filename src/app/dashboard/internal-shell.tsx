"use client";

import Image from "next/image";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  fullDescription?: string;
  dateTime: string;
  details?: string;
};

type DashboardCardInput = Omit<DashboardCardItem, "details" | "fullDescription"> & {
  details?: string;
  fullDescription?: string;
};

function createDashboardCard(card: DashboardCardInput): DashboardCardItem {
  return {
    ...card,
    fullDescription: card.fullDescription ?? card.description,
    details: card.details ?? "",
  };
}

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
  createDashboardCard({
    id: 2,
    category: "Announcements",
    title: "Website overview",
    description: "This website was developed by AJ Development and tracks learning progress over time...",
    fullDescription: "This website was developed by AJ Development and tracks learning progress over time.",
    dateTime: "13.03.2026 | 21:30",
  }),
  createDashboardCard({
    id: 3,
    category: "Announcements",
    title: "Assignment review",
    description:
      "Assignments uploaded to the system are reviewed automatically or with AI support, and the results are highly accurate.",
    dateTime: "13.03.2026 | 21:10",
  }),
  createDashboardCard({
    id: 5,
    category: "Announcements",
    title: "Semester structure",
    description:
      "The system has four semesters each year. During these semesters, students study, complete practical training, and take final exams.",
    dateTime: "13.03.2026 | 20:50",
  }),
  createDashboardCard({
    id: 6,
    category: "Requirements",
    title: "Attendance rules",
    description:
      "Students must familiarize themselves with the system's attendance rules and the terms of the contract.",
    dateTime: "13.03.2026 | 21:05",
  }),
  createDashboardCard({
    id: 7,
    category: "Requirements",
    title: "Assignments",
    description: "Students must complete assignments on time and upload them to the system.",
    dateTime: "13.03.2026 | 21:20",
  }),
  createDashboardCard({
    id: 8,
    category: "Requirements",
    title: "Assessment criteria",
    description:
      "Students are evaluated based on their activity during the season and the results of their assigned tasks.",
    dateTime: "13.03.2026 | 21:35",
  }),
  createDashboardCard({
    id: 9,
    category: "Requirements",
    title: "Contract terms",
    description:
      "The terms of the contract are established between the system and the student, and compliance with them is mandatory.",
    dateTime: "13.03.2026 | 21:40",
  }),
];

const SOFT_DIVIDER_COLOR = "rgba(203,213,225,0.45)";
const SOFT_BORDER = `0.5px solid ${SOFT_DIVIDER_COLOR}`;
const HAIRLINE_SIZE = "0.5px";
const MOBILE_BREAKPOINT = 1024;
const PRIMARY_TEXT = "rgb(36, 31, 33)";
const PRIMARY_BG = "rgb(255, 255, 255)";
const APP_SHELL_CLASS = "flex h-[100dvh] flex-col overflow-hidden bg-[#f4f7fe] font-sans text-slate-700";
const HEADER_CLASS = "z-50 flex h-20 items-center justify-between bg-white px-2 md:px-6 lg:h-[88px] lg:px-7";
const HEADER_LOGO_SIZE_CLASS = "h-[66px] w-[66px] object-contain lg:h-[74px] lg:w-[74px]";
const HEADER_BRAND_CLASS =
  "line-clamp-2 cursor-pointer text-[12px] font-bold uppercase leading-[1.2] tracking-tight text-[rgb(36,31,33)] sm:text-[13px] md:text-[15px] lg:text-[16px]";
const HEADER_MENU_BUTTON_CLASS =
  "ml-0 inline-flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center cursor-pointer text-[rgb(36,31,33)] outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 active:bg-transparent hover:bg-transparent lg:h-11 lg:w-11";
const HEADER_ACTION_BUTTON_CLASS =
  "relative inline-flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center cursor-pointer text-[rgb(36,31,33)] outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 active:bg-transparent hover:bg-transparent lg:h-11 lg:w-11";
const HEADER_SERVER_LABEL_CLASS = "mb-0.5 text-[10px] font-bold uppercase tracking-wider text-[#6b7280] lg:text-[11px]";
const HEADER_SERVER_TIME_CLASS = "text-[14px] font-bold text-[rgb(36,31,33)] lg:text-[15px]";
const SIDEBAR_CLASS =
  "custom-scrollbar touch-scroll fixed bottom-0 left-0 top-20 z-40 w-[260px] overflow-x-hidden overflow-y-auto overscroll-y-contain bg-white text-[rgb(36,31,33)] transition-[transform,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform lg:top-[88px]";
const SIDEBAR_CONTENT_CLASS = "w-[260px] lg:w-[286px]";
const SIDEBAR_NAV_CLASS = "pb-4 pt-3 text-sm lg:pt-4";
const SIDEBAR_MENU_BUTTON_CLASS =
  "relative flex w-full touch-manipulation cursor-pointer items-center gap-3 px-6 py-3 text-left transition-all lg:h-[52px] lg:gap-3.5 lg:px-7 lg:py-0";
const SIDEBAR_MENU_LABEL_CLASS = "text-[15px] font-medium tracking-wide text-[rgb(36,31,33)] lg:text-[16px] lg:leading-6";
const FILTER_BUTTON_CLASS =
  "inline-flex h-8 shrink-0 touch-manipulation items-center justify-center cursor-pointer rounded-lg px-3 text-[13px] font-medium leading-none lg:h-9 lg:px-4 lg:text-[14px]";
const FILTER_BAR_CLASS = "-mx-4 md:-mx-8 lg:pt-4";
const FILTER_BAR_INNER_CLASS =
  "mobile-scrollbar-hidden touch-scroll flex h-[70px] w-full items-center gap-2 overflow-x-auto overscroll-x-contain px-4 touch-pan-x md:px-8 lg:h-[52px] lg:gap-2.5 lg:px-9";
const DASHBOARD_GRID_CLASS =
  "custom-scrollbar touch-scroll grid min-h-0 flex-1 grid-cols-1 auto-rows-[168px] gap-4 overflow-y-auto overscroll-y-contain pb-4 pr-1 touch-pan-y sm:grid-cols-2 sm:auto-rows-[180px] sm:pb-0 lg:auto-rows-[198px] lg:gap-5";
const DASHBOARD_CARD_CLASS =
  "relative min-h-0 overflow-hidden rounded-lg bg-[rgb(255,255,255)] shadow-none lg:h-full";
const DASHBOARD_CARD_CONTENT_CLASS = "grid h-full grid-rows-[auto,1fr,auto] gap-1.5 p-3 sm:p-3.5 lg:gap-2 lg:p-[18px]";
const DASHBOARD_CARD_TITLE_CLASS =
  "text-[14px] font-bold text-[rgb(36,31,33)] lg:text-[15px]";
const DASHBOARD_CARD_DESCRIPTION_CLASS =
  "max-w-full text-[10px] leading-[1.4] text-[rgb(36,31,33)] sm:max-w-[29ch] sm:text-[11px] lg:max-w-[31ch] lg:text-[12px] lg:leading-[1.45]";
const DASHBOARD_CARD_FOOTER_CLASS = "flex items-center justify-between gap-2 lg:gap-3";
const DASHBOARD_CARD_DATE_CLASS = "text-[10px] font-medium leading-none sm:text-[11px] lg:text-[12px]";
const DASHBOARD_CARD_BUTTON_CLASS =
  "inline-flex h-8 shrink-0 touch-manipulation items-center justify-center cursor-pointer rounded-lg bg-[#fafafa] px-3 text-[11px] font-medium leading-none text-[rgb(36,31,33)] outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 active:bg-[#fafafa] hover:bg-[#fafafa] sm:px-3.5 sm:text-[12px] lg:h-9 lg:px-4 lg:text-[13px]";
const DASHBOARD_CARD_BORDER_SHADOW = `inset 0 0 0 ${HAIRLINE_SIZE} ${SOFT_DIVIDER_COLOR}`;
const DASHBOARD_CARD_PANEL_STYLE = { boxShadow: DASHBOARD_CARD_BORDER_SHADOW };
const DASHBOARD_CARD_DESCRIPTION_STYLE = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical" as const,
  WebkitLineClamp: 2,
  overflow: "hidden",
};
const CARD_READ_MORE_LABEL = "Read more";
const MODAL_CLOSE_LABEL = "Close";
const LOGIN_PLACEHOLDER_COLOR = "#6b7280";
const EMPTY_FILTER_TITLE = "No updates yet";
const EMPTY_FILTER_DESCRIPTION = "There are no cards in this section yet.";
const EMPTY_DIVIDER_STYLE = { backgroundColor: "transparent" };
const DROPDOWN_PANEL_STYLE = { border: SOFT_BORDER, boxShadow: "none" };
const MODAL_CLOSE_BUTTON_STYLE = {
  border: SOFT_BORDER,
  backgroundColor: PRIMARY_TEXT,
  color: PRIMARY_BG,
};
const DASHBOARD_MODAL_TITLE_CLASS =
  "text-[16px] font-semibold tracking-wide text-[rgb(36,31,33)] lg:text-[17px] lg:leading-6";
const DASHBOARD_MODAL_DESCRIPTION_CLASS =
  "text-[13px] font-medium leading-6 text-[rgb(36,31,33)] lg:text-[14px] lg:leading-7";
const DASHBOARD_MODAL_PANEL_CLASS =
  "custom-scrollbar touch-scroll w-[min(36rem,calc(100vw-1rem))] max-h-[min(36rem,calc(100dvh-1.5rem))] overflow-y-auto overscroll-y-contain rounded-xl bg-white p-5 touch-pan-y sm:p-6 lg:w-[min(40rem,calc(100vw-3rem))] lg:max-h-[min(40rem,calc(100dvh-3rem))] lg:p-7";
const DASHBOARD_MODAL_CLOSE_BUTTON_CLASS =
  "h-9 shrink-0 touch-manipulation cursor-pointer rounded-lg px-4 text-sm font-medium outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 active:bg-[rgb(36,31,33)] hover:bg-[rgb(36,31,33)] lg:h-10 lg:px-5 lg:text-[15px]";
const PROFILE_DROPDOWN_CLASS =
  "absolute right-0 top-full w-[min(13rem,calc(100vw-1rem))] overflow-hidden rounded-md bg-white";
const NOTIFICATION_DROPDOWN_CLASS =
  "custom-scrollbar touch-scroll fixed left-1/2 top-20 z-50 max-h-[min(22rem,calc(100dvh-6rem))] w-[min(17.5rem,calc(100vw-1.5rem))] -translate-x-1/2 overflow-y-auto overscroll-y-contain rounded-md bg-white touch-pan-y md:absolute md:left-auto md:right-[-10px] md:top-full md:max-h-[26rem] md:w-[320px] md:translate-x-0";
const TOPBAR_DROPDOWN_ITEM_CLASS =
  "flex w-full touch-manipulation cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-[13px] text-[rgb(36,31,33)]";

function getFilterButtonStyle(isActive: boolean) {
  return {
    border: SOFT_BORDER,
    backgroundColor: isActive ? PRIMARY_TEXT : PRIMARY_BG,
    color: isActive ? PRIMARY_BG : PRIMARY_TEXT,
  };
}

function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function formatServerTime(date: Date, timeZone: string): string {
  const day = date.toLocaleDateString("en-GB", { timeZone }).replaceAll("/", ".");
  const time = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone });
  return `${day} | ${time}`;
}

type DashboardCardViewProps = {
  card: DashboardCardItem;
  isModalOpen: boolean;
  onOpen: (card: DashboardCardItem) => void;
};

const DashboardCardView = memo(function DashboardCardView({
  card,
  isModalOpen,
  onOpen,
}: DashboardCardViewProps) {
  return (
    <article className={DASHBOARD_CARD_CLASS} style={DASHBOARD_CARD_PANEL_STYLE} aria-label={`${card.category} card ${card.id}`}>
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
            onClick={() => onOpen(card)}
            className={DASHBOARD_CARD_BUTTON_CLASS}
            style={DASHBOARD_CARD_PANEL_STYLE}
            aria-haspopup="dialog"
            aria-expanded={isModalOpen}
          >
            {CARD_READ_MORE_LABEL}
          </button>
        </div>
      </div>
    </article>
  );
});

const EmptyFilterCard = memo(function EmptyFilterCard() {
  return (
    <article className={cn(DASHBOARD_CARD_CLASS, "lg:col-span-3")} style={DASHBOARD_CARD_PANEL_STYLE}>
      <div className="flex h-full flex-col justify-center gap-2 p-4 text-center lg:p-6">
        <p className="text-[16px] font-semibold text-[rgb(36,31,33)] lg:text-[18px]">{EMPTY_FILTER_TITLE}</p>
        <p className="text-[12px] text-[#6b7280] lg:text-[13px]">{EMPTY_FILTER_DESCRIPTION}</p>
      </div>
    </article>
  );
});

type ReadMoreModalProps = {
  card: DashboardCardItem | null;
  onClose: () => void;
};

const ReadMoreModal = memo(function ReadMoreModal({ card, onClose }: ReadMoreModalProps) {
  if (!card) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 px-3 py-4 sm:px-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`dashboard-card-title-${card.id}`}
        aria-describedby={`dashboard-card-description-${card.id}`}
        className={DASHBOARD_MODAL_PANEL_CLASS}
        style={DASHBOARD_CARD_PANEL_STYLE}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="space-y-4 lg:space-y-5">
          <div className="space-y-2">
            <h2 id={`dashboard-card-title-${card.id}`} className={DASHBOARD_MODAL_TITLE_CLASS}>
              {card.title}
            </h2>
            <p id={`dashboard-card-description-${card.id}`} className={DASHBOARD_MODAL_DESCRIPTION_CLASS}>
              {card.fullDescription}
            </p>
          </div>
          <div className="min-h-[136px] rounded-lg bg-[#fafafa] p-4 lg:min-h-[148px] lg:p-5" style={DASHBOARD_CARD_PANEL_STYLE}>
            {card.details ? <p className="text-[15px] leading-6 text-[rgb(36,31,33)] lg:text-[16px] lg:leading-7">{card.details}</p> : null}
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-[#6b7280] lg:text-[15px]">{card.dateTime}</p>
            <button type="button" onClick={onClose} className={DASHBOARD_MODAL_CLOSE_BUTTON_CLASS} style={MODAL_CLOSE_BUTTON_STYLE}>
              {MODAL_CLOSE_LABEL}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

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
  const closeReadMoreModal = useCallback(() => setSelectedCard(null), []);
  const closeMobileSidebar = useCallback(() => setMobileSidebarOpen(false), []);
  const closeTopbarMenus = useCallback(() => {
    setIsNotifOpen(false);
    setIsProfileOpen(false);
  }, []);
  const openReadMoreModal = useCallback((card: DashboardCardItem) => {
    closeMobileSidebar();
    closeTopbarMenus();
    setSelectedCard(card);
  }, [closeMobileSidebar, closeTopbarMenus]);
  const shouldLockBodyScroll = mobileSidebarOpen || selectedCard !== null;

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

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (shouldLockBodyScroll) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [shouldLockBodyScroll]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= MOBILE_BREAKPOINT) {
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = useCallback(() => {
    closeTopbarMenus();

    if (window.innerWidth < MOBILE_BREAKPOINT) {
      setMobileSidebarOpen((value) => !value);
      return;
    }

    setDesktopSidebarCollapsed((value) => !value);
  }, [closeTopbarMenus]);

  const toggleNotifications = useCallback(() => {
    setIsNotifOpen((value) => !value);
    setIsProfileOpen(false);
  }, []);

  const toggleProfile = useCallback(() => {
    setIsProfileOpen((value) => !value);
    setIsNotifOpen(false);
  }, []);

  const selectMenu = useCallback((name: string) => {
    setActiveMenu(name);
    closeMobileSidebar();
    closeTopbarMenus();
  }, [closeMobileSidebar, closeTopbarMenus]);

  const handleBrandClick = useCallback(() => {
    setActiveMenu("Dashboard");
    closeMobileSidebar();
    closeTopbarMenus();
  }, [closeMobileSidebar, closeTopbarMenus]);

  const handleMenuButtonClick = useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

  const sidebarClassName = cn(
    SIDEBAR_CLASS,
    mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
    "lg:relative lg:bottom-auto lg:left-0 lg:top-auto lg:translate-x-0",
    desktopSidebarCollapsed ? "lg:w-0 lg:min-w-0 lg:overflow-hidden" : "lg:w-[286px]",
  );
  const sidebarBorderStyle = desktopSidebarCollapsed ? undefined : SOFT_BORDER;
  const dashboardCards = useMemo(
    () =>
      activeFilter === "All"
        ? DASHBOARD_CARD_ITEMS
        : DASHBOARD_CARD_ITEMS.filter((item) => item.category === activeFilter),
    [activeFilter],
  );
  const isEmptyFilterState = dashboardCards.length === 0;

  return (
    <div className={APP_SHELL_CLASS}>
      <button
        type="button"
        className={cn(
          "fixed inset-0 z-30 bg-black/30 touch-manipulation transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden",
          mobileSidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={closeMobileSidebar}
        aria-label="Close menu"
      />

      <header className={HEADER_CLASS} style={{ borderBottom: SOFT_BORDER }}>
        <div className="flex h-full min-w-0 items-center gap-2 md:gap-3">
          <div className="-ml-0.5 shrink-0 p-0 md:-ml-1">
            <Image
              src="/manageme-white.png"
              alt="Logo"
              width={66}
              height={66}
              className={HEADER_LOGO_SIZE_CLASS}
              priority
            />
          </div>
          <button
            type="button"
            onClick={handleBrandClick}
            className={HEADER_BRAND_CLASS}
          >
            MANAGE ME
          </button>
          <button
            type="button"
            onClick={handleMenuButtonClick}
            className={HEADER_MENU_BUTTON_CLASS}
            aria-label="Toggle menu"
          >
            <Menu size={25} />
          </button>
        </div>

        <div className="flex h-full items-center gap-4 md:gap-6">
          <div className="hidden text-right sm:block">
            <p className={HEADER_SERVER_LABEL_CLASS}>SERVER TIME</p>
            <p className={HEADER_SERVER_TIME_CLASS}>{currentTime}</p>
          </div>

          <div ref={notifRef} className="relative flex h-full items-center">
            <button
              type="button"
              onClick={toggleNotifications}
              className={HEADER_ACTION_BUTTON_CLASS}
              aria-label="Notifications"
            >
              <Bell size={25} strokeWidth={1.7} />
              <span className="absolute right-[5px] top-[5px] flex h-[17px] w-[17px] items-center justify-center rounded-full border-2 border-white bg-[#f44336] text-[9px] font-bold text-white">
                1
              </span>
            </button>

            {isNotifOpen ? (
              <div className={NOTIFICATION_DROPDOWN_CLASS} style={DROPDOWN_PANEL_STYLE}>
                <div className="bg-[rgb(36,31,33)] p-3 text-[13px] font-bold text-white">Notifications</div>
                <div className="flex gap-4 border-b border-slate-50 p-4">
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
            className={HEADER_ACTION_BUTTON_CLASS}
            aria-label="Video"
          >
            <Video size={25} strokeWidth={1.7} />
          </button>

          <div ref={profileRef} className="relative flex h-full items-center">
            <button
              type="button"
              onClick={toggleProfile}
              className={HEADER_ACTION_BUTTON_CLASS}
              aria-label="Profile menu"
            >
              <UserCircle2 size={30} strokeWidth={1.6} className="text-[rgb(36,31,33)]" />
            </button>

            {isProfileOpen ? (
              <div className={PROFILE_DROPDOWN_CLASS} style={DROPDOWN_PANEL_STYLE}>
                <div className="bg-[rgb(36,31,33)] p-3.5 text-white">
                  <p className="text-[13px] font-bold uppercase leading-tight tracking-wide">Abdullox</p>
                  <p className="text-[12px] font-medium text-[#6b7280]">Jurayev</p>
                </div>
                <div className="py-1">
                  <button className={TOPBAR_DROPDOWN_ITEM_CLASS}>
                    <Settings size={15} className="text-[rgb(36,31,33)]" /> Profile Settings
                  </button>
                  <form action={signOutAction}>
                    <button type="submit" className={TOPBAR_DROPDOWN_ITEM_CLASS}>
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
        <aside className={sidebarClassName} style={{ borderRight: sidebarBorderStyle }}>
          <div className={SIDEBAR_CONTENT_CLASS}>
            <nav className={SIDEBAR_NAV_CLASS}>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.name;

                return (
                  <div key={item.name}>
                    {item.section ? (
                      <div className="mb-2 mt-6 px-6 text-[10px] font-bold uppercase tracking-widest text-[rgb(36,31,33)] lg:px-7 lg:text-[11px]">
                        {item.section}
                      </div>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => selectMenu(item.name)}
                      className={cn(
                        SIDEBAR_MENU_BUTTON_CLASS,
                        isActive
                          ? "border-l-[3px] border-[rgb(36,31,33)] pl-[21px] lg:pl-[25px]"
                          : "border-l-[3px] border-transparent",
                      )}
                    >
                      <Icon size={22} className="text-[rgb(36,31,33)] lg:h-[23px] lg:w-[23px]" />
                      <span className={SIDEBAR_MENU_LABEL_CLASS}>{item.name}</span>
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

        <main className="min-w-0 flex flex-1 flex-col overflow-hidden bg-[rgb(250,250,250)] px-4 pb-4 md:px-8 md:pb-8 lg:px-9 lg:pb-9">
          <div className={FILTER_BAR_CLASS}>
            <div className={FILTER_BAR_INNER_CLASS}>
              {DASHBOARD_FILTERS.map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={FILTER_BUTTON_CLASS}
                    style={getFilterButtonStyle(isActive)}
                    aria-pressed={isActive}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
            <div className="h-[0.5px] w-full lg:mt-3" style={EMPTY_DIVIDER_STYLE} />
          </div>
          <section className={cn(DASHBOARD_GRID_CLASS, "lg:grid-cols-3")}>
            {isEmptyFilterState ? <EmptyFilterCard /> : null}
            {dashboardCards.map((card) => (
              <DashboardCardView
                key={card.id}
                card={card}
                isModalOpen={selectedCard?.id === card.id}
                onOpen={openReadMoreModal}
              />
            ))}
          </section>
        </main>
      </div>

      <ReadMoreModal card={selectedCard} onClose={closeReadMoreModal} />

      <style jsx global>{`
        .mobile-scrollbar-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .mobile-scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
        .touch-scroll {
          -webkit-overflow-scrolling: touch;
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
