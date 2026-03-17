"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import {
  Bell,
  BookOpenText,
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
  User,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { signOutAction } from "@/lib/actions/auth";

type MenuItem = {
  name: string;
  icon: LucideIcon;
  section: string | null;
};

type DashboardCardItem = {
  id: number;
  title: string;
  description: string;
  dateTime: string;
};

type DashboardShellProps = {
  initialServerTimeIso: string;
  serverTimeZone?: string;
};

type AppHeaderProps = {
  currentTime: string;
  isNotificationMenuOpen: boolean;
  isProfileMenuOpen: boolean;
  notificationRef: RefObject<HTMLDivElement | null>;
  profileRef: RefObject<HTMLDivElement | null>;
  onBrandClick: () => void;
  onMenuToggle: () => void;
  onNotificationsToggle: () => void;
  onProfileToggle: () => void;
};

type SidebarProps = {
  activeMenu: string;
  isMobileOpen: boolean;
  isDesktopCollapsed: boolean;
  onSelectMenu: (name: string) => void;
};

type DashboardCardGridProps = {
  cards: DashboardCardItem[];
  isDesktopSidebarCollapsed: boolean;
  onCardOpen: (card: DashboardCardItem) => void;
};

type DashboardCardModalProps = {
  card: DashboardCardItem;
  onClose: () => void;
};

const MENU_ITEMS: MenuItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, section: null },
  { name: "My Subjects", icon: BookOpenText, section: "STUDENT" },
  { name: "Lesson Schedule", icon: Calendar, section: null },
  { name: "Assignments", icon: ClipboardList, section: null },
  { name: "Subject Retake", icon: RotateCcw, section: null },
  { name: "Final Exam", icon: HelpCircle, section: null },
  { name: "Individual Plan", icon: ChartNoAxesCombined, section: null },
  { name: "About", icon: Info, section: null },
];

const PROFILE_INFO = {
  firstName: "Abdullox",
  lastName: "Jurayev",
};

const NOTIFICATION_PREVIEW = {
  badgeCount: "1",
  title: "main deadline title",
  subtitle: "title of day left",
  meta: "last period of deadline",
};
const DASHBOARD_CARD_ITEMS: DashboardCardItem[] = [
  {
    id: 1,
    title: "Website overview",
    description: "This website was developed by AJ Development and tracks learning progress over time.",
    dateTime: "13.03.2026 | 21:30",
  },
  {
    id: 2,
    title: "Assignment review",
    description:
      "Assignments uploaded to the system are reviewed automatically or with AI support, and the results are highly accurate.",
    dateTime: "13.03.2026 | 21:10",
  },
  {
    id: 3,
    title: "Semester structure",
    description:
      "The system has four semesters each year. During these semesters, students study, complete practical training, and take final exams.",
    dateTime: "13.03.2026 | 20:50",
  },
  {
    id: 4,
    title: "Attendance rules",
    description:
      "Students must familiarize themselves with the system's attendance rules and the terms of the contract.",
    dateTime: "13.03.2026 | 21:05",
  },
  {
    id: 5,
    title: "Assignments",
    description: "Students must complete assignments on time and upload them to the system.",
    dateTime: "13.03.2026 | 21:20",
  },
  {
    id: 6,
    title: "Assessment criteria",
    description:
      "Students are evaluated based on their activity during the season and the results of their assigned tasks.",
    dateTime: "13.03.2026 | 21:35",
  },
  {
    id: 7,
    title: "Contract terms",
    description:
      "The terms of the contract are established between the system and the student, and compliance with them is mandatory.",
    dateTime: "13.03.2026 | 21:40",
  },
];

const MOBILE_BREAKPOINT = 1024;
const ICON_SIZES = {
  small: 18,
  medium: 22,
  large: 26,
} as const;
const ICON_STROKE_WIDTH = 2;
const SOFT_DIVIDER_COLOR = "var(--ui-divider-soft)";
const SOFT_BORDER = `0.5px solid ${SOFT_DIVIDER_COLOR}`;
const PANEL_STYLE: CSSProperties = { border: SOFT_BORDER, boxShadow: "none" };
const SURFACE_TEXT_CLASS = "text-[var(--ui-text-primary)]";
const MUTED_TEXT_CLASS = "text-[var(--ui-text-secondary)]";
const HEADER_HEIGHT_CLASS = "h-[85px] lg:h-[90px]";
const SIDEBAR_TOP_OFFSET_CLASS = "top-[85px] lg:top-[90px]";
const HEADER_ICON_BUTTON_BASE_CLASS =
  `inline-flex shrink-0 touch-manipulation items-center justify-center cursor-pointer leading-none ${SURFACE_TEXT_CLASS} outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 active:bg-transparent hover:bg-transparent`;
const HEADER_TOPBAR_SLOT_CLASS = "relative flex h-full items-center";
const NOTIFICATION_BADGE_CLASS =
  "ui-text-badge absolute right-[2px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[var(--ui-surface)] bg-[var(--ui-danger)] font-bold text-[var(--ui-text-inverse)]";

const APP_SHELL_CLASS = "flex h-[100dvh] flex-col overflow-hidden bg-[var(--ui-shell-bg)] font-sans text-[var(--ui-text-primary)]";
const MOBILE_BACKDROP_CLASS =
  "fixed inset-0 z-30 bg-[var(--ui-overlay)] touch-manipulation transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden";
const HEADER_CLASS = `z-50 flex ${HEADER_HEIGHT_CLASS} items-center justify-between bg-[var(--ui-surface)] px-2 md:px-6 lg:px-7`;
const HEADER_LEFT_GROUP_CLASS = "flex h-full min-w-0 items-center gap-2 md:gap-3";
const HEADER_RIGHT_GROUP_CLASS = "flex h-full items-center gap-2 md:gap-3";
const HEADER_LOGO_WRAPPER_CLASS = "shrink-0";
const HEADER_LOGO_SIZE_CLASS = "h-[60px] w-[60px] object-contain lg:h-[68px] lg:w-[68px]";
const HEADER_BRAND_CLASS =
  `ui-text-brand line-clamp-2 cursor-pointer font-bold uppercase tracking-tight ${SURFACE_TEXT_CLASS}`;
const HEADER_MENU_BUTTON_CLASS =
  `ml-0 ${HEADER_ICON_BUTTON_BASE_CLASS} h-10 w-10 lg:h-11 lg:w-11`;
const HEADER_ACTION_BUTTON_CLASS =
  `relative ${HEADER_ICON_BUTTON_BASE_CLASS} h-9 w-9 lg:h-10 lg:w-10`;
const HEADER_SERVER_BLOCK_CLASS = "hidden min-w-[92px] self-center text-right sm:flex sm:flex-col sm:items-end sm:justify-center";
const HEADER_SERVER_LABEL_CLASS = `ui-text-overline mb-0.5 font-bold uppercase leading-none tracking-wider ${MUTED_TEXT_CLASS}`;
const HEADER_SERVER_TIME_CLASS = `ui-text-body tabular-nums font-bold leading-none ${SURFACE_TEXT_CLASS}`;

const SIDEBAR_CLASS =
  `custom-scrollbar touch-scroll fixed bottom-0 left-0 ${SIDEBAR_TOP_OFFSET_CLASS} z-40 w-[260px] overflow-x-hidden overflow-y-auto overscroll-y-contain bg-[var(--ui-surface)] ${SURFACE_TEXT_CLASS} transition-[transform,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform`;
const SIDEBAR_CONTENT_CLASS = "w-[260px] lg:w-[286px]";
const SIDEBAR_NAV_CLASS = "pb-4";
const SIDEBAR_MENU_BUTTON_CLASS =
  "relative flex w-full touch-manipulation cursor-pointer items-center gap-3 px-6 py-3 text-left transition-all lg:h-[52px] lg:gap-3.5 lg:px-7 lg:py-0";
const SIDEBAR_MENU_LABEL_CLASS = `ui-text-nav font-medium tracking-wide ${SURFACE_TEXT_CLASS}`;
const SIDEBAR_SECTION_LABEL_CLASS =
  `ui-text-overline my-4 px-6 font-bold uppercase leading-none tracking-wider ${MUTED_TEXT_CLASS} lg:px-7`;
const DASHBOARD_MENU_SLOT_CLASS = "relative h-[65px] lg:h-[75px]";
const DASHBOARD_MENU_BUTTON_POSITION_CLASS = "absolute inset-x-0 top-1/2 -translate-y-1/2";

const MAIN_CLASS = "min-w-0 flex flex-1 flex-col overflow-hidden bg-[var(--ui-canvas-bg)] px-4 pb-4 md:px-8 md:pb-8 lg:px-9 lg:pb-9";

const PROFILE_DROPDOWN_CLASS =
  "absolute right-0 top-full w-[min(13rem,calc(100vw-1rem))] overflow-hidden rounded-md bg-[var(--ui-surface)]";
const NOTIFICATION_DROPDOWN_CLASS =
  `custom-scrollbar touch-scroll fixed left-1/2 top-[85px] z-50 max-h-[min(22rem,calc(100dvh-6rem))] w-[min(17.5rem,calc(100vw-1.5rem))] -translate-x-1/2 overflow-y-auto overscroll-y-contain rounded-md bg-[var(--ui-surface)] touch-pan-y md:absolute md:left-auto md:right-[-10px] md:top-full md:max-h-[26rem] md:w-[320px] md:translate-x-0`;
const PROFILE_DROPDOWN_ACTION_CLASS =
  `ui-text-body-sm flex w-full touch-manipulation cursor-pointer items-center gap-3 px-4 py-2.5 text-left ${SURFACE_TEXT_CLASS}`;
const DASHBOARD_GRID_BASE_CLASS =
  "custom-scrollbar grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto pb-4 pr-1 pt-4 sm:grid-cols-2 md:pt-6 lg:gap-5 lg:pb-0";
const DASHBOARD_CARD_CLASS =
  "min-h-[190px] overflow-hidden rounded-xl bg-[var(--ui-surface)] shadow-[0_1px_2px_rgba(31,31,31,0.03)] lg:min-h-[206px]";
const DASHBOARD_CARD_CONTENT_CLASS = "grid h-full grid-rows-[auto,1fr,auto] gap-3 p-5 lg:p-6";
const DASHBOARD_CARD_TITLE_CLASS =
  `ui-text-card-title font-semibold tracking-[0.01em] ${SURFACE_TEXT_CLASS}`;
const DASHBOARD_CARD_DESCRIPTION_CLASS = `ui-text-body-sm max-w-[34ch] ${SURFACE_TEXT_CLASS}`;
const DASHBOARD_CARD_FOOTER_CLASS = "flex items-center justify-between gap-3";
const DASHBOARD_CARD_DATE_CLASS = `ui-text-meta font-medium leading-none ${MUTED_TEXT_CLASS}`;
const DASHBOARD_CARD_BUTTON_CLASS =
  `ui-text-button shrink-0 cursor-pointer rounded-lg bg-[var(--ui-surface-muted)] px-3.5 py-2 font-medium leading-none ${SURFACE_TEXT_CLASS} outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 active:bg-[var(--ui-surface-muted)] hover:bg-[var(--ui-surface-muted)] lg:px-4`;
const DASHBOARD_MODAL_OVERLAY_CLASS =
  "fixed inset-0 z-[60] flex items-center justify-center bg-[var(--ui-overlay)] px-3 py-4";
const DASHBOARD_MODAL_PANEL_CLASS =
  "custom-scrollbar w-[min(34rem,calc(100vw-1.5rem))] max-h-[min(34rem,calc(100dvh-2rem))] overflow-y-auto rounded-xl bg-[var(--ui-surface)] p-5 sm:p-6";
const DASHBOARD_MODAL_TITLE_CLASS = `ui-text-dialog-title font-semibold ${SURFACE_TEXT_CLASS}`;
const DASHBOARD_MODAL_DETAILS_CLASS = `ui-text-dialog-reading ${SURFACE_TEXT_CLASS}`;
const DASHBOARD_MODAL_DATE_CLASS = `ui-text-meta font-medium ${MUTED_TEXT_CLASS}`;
const DASHBOARD_MODAL_CLOSE_BUTTON_CLASS =
  "ui-text-button h-10 shrink-0 cursor-pointer rounded-lg px-4 font-medium text-[var(--ui-text-inverse)] outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 active:bg-[var(--ui-primary)] hover:bg-[var(--ui-primary)]";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatServerTime(date: Date, timeZone: string) {
  const day = date.toLocaleDateString("en-GB", { timeZone }).replaceAll("/", ".");
  const time = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone });
  return `${day} | ${time}`;
}

function isDesktopViewport() {
  return window.innerWidth >= MOBILE_BREAKPOINT;
}

function useServerTime(initialServerTimeIso: string, serverTimeZone?: string) {
  const normalizedServerTimeZone = serverTimeZone || "UTC";
  const initialServerEpoch = Date.parse(initialServerTimeIso);
  const [currentTime, setCurrentTime] = useState(() =>
    formatServerTime(
      new Date(Number.isFinite(initialServerEpoch) ? initialServerEpoch : 0),
      normalizedServerTimeZone,
    ),
  );

  useEffect(() => {
    const baseServerMs = Number.isFinite(initialServerEpoch) ? initialServerEpoch : Date.now();
    const startedAtMs = Date.now();

    const tick = () => {
      const elapsedMs = Date.now() - startedAtMs;
      setCurrentTime(formatServerTime(new Date(baseServerMs + elapsedMs), normalizedServerTimeZone));
    };

    tick();

    const timer = window.setInterval(tick, 30_000);
    return () => window.clearInterval(timer);
  }, [initialServerEpoch, normalizedServerTimeZone]);

  return currentTime;
}

function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (locked) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [locked]);
}

function MobileBackdrop({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <button
      type="button"
      className={cn(MOBILE_BACKDROP_CLASS, open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0")}
      onClick={onClose}
      aria-label="Close menu"
    />
  );
}

function NotificationMenu({ open }: { open: boolean }) {
  if (!open) {
    return null;
  }

  return (
    <div className={NOTIFICATION_DROPDOWN_CLASS} style={PANEL_STYLE}>
      <div className="ui-text-body-sm bg-[var(--ui-primary)] p-3 font-bold text-[var(--ui-text-inverse)]">Notifications</div>
      <div className="flex gap-4 border-b border-[var(--ui-border-subtle)] p-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[var(--ui-surface-muted)] ${SURFACE_TEXT_CLASS}`}>
          <FileText size={ICON_SIZES.small} strokeWidth={ICON_STROKE_WIDTH} />
        </div>
        <div className="flex flex-col">
          <p className={`ui-text-body-sm font-bold leading-tight ${SURFACE_TEXT_CLASS}`}>{NOTIFICATION_PREVIEW.title}</p>
          <p className={`ui-text-caption mt-1 font-medium ${MUTED_TEXT_CLASS}`}>{NOTIFICATION_PREVIEW.subtitle}</p>
          <p className={`ui-text-meta mt-1 font-normal ${MUTED_TEXT_CLASS}`}>{NOTIFICATION_PREVIEW.meta}</p>
        </div>
      </div>
    </div>
  );
}

function ProfileMenu({ open }: { open: boolean }) {
  if (!open) {
    return null;
  }

  return (
    <div className={PROFILE_DROPDOWN_CLASS} style={PANEL_STYLE}>
      <div className="bg-[var(--ui-primary)] p-3.5 text-[var(--ui-text-inverse)]">
        <p className="ui-text-body-sm font-bold uppercase leading-tight tracking-wide">{PROFILE_INFO.firstName}</p>
        <p className={`ui-text-caption font-medium ${MUTED_TEXT_CLASS}`}>{PROFILE_INFO.lastName}</p>
      </div>
      <div className="py-1">
        <button type="button" className={PROFILE_DROPDOWN_ACTION_CLASS}>
          <Settings size={ICON_SIZES.small} strokeWidth={ICON_STROKE_WIDTH} className={SURFACE_TEXT_CLASS} />{" "}
          Profile Settings
        </button>
        <form action={signOutAction}>
          <button type="submit" className={PROFILE_DROPDOWN_ACTION_CLASS}>
            <LogOut size={ICON_SIZES.small} strokeWidth={ICON_STROKE_WIDTH} className={SURFACE_TEXT_CLASS} />{" "}
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}

function DashboardCardGrid({ cards, isDesktopSidebarCollapsed, onCardOpen }: DashboardCardGridProps) {
  return (
    <section className={cn(DASHBOARD_GRID_BASE_CLASS, isDesktopSidebarCollapsed ? "lg:grid-cols-3" : "lg:grid-cols-2")}>
      {cards.map((card) => (
        <article key={card.id} className={DASHBOARD_CARD_CLASS} style={{ border: SOFT_BORDER }}>
          <div className={DASHBOARD_CARD_CONTENT_CLASS}>
            <div className="space-y-2">
              <p className={DASHBOARD_CARD_TITLE_CLASS}>{card.title}</p>
              <p className={DASHBOARD_CARD_DESCRIPTION_CLASS}>
                {card.description}
              </p>
            </div>

            <div />

            <div className={DASHBOARD_CARD_FOOTER_CLASS}>
              <p className={DASHBOARD_CARD_DATE_CLASS}>{card.dateTime}</p>
              <button
                type="button"
                onClick={() => onCardOpen(card)}
                className={DASHBOARD_CARD_BUTTON_CLASS}
                style={{ border: SOFT_BORDER }}
              >
                Read more
              </button>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

function DashboardCardModal({ card, onClose }: DashboardCardModalProps) {
  return (
    <div className={DASHBOARD_MODAL_OVERLAY_CLASS} onClick={onClose}>
      <div className={DASHBOARD_MODAL_PANEL_CLASS} style={{ border: SOFT_BORDER }} onClick={(event) => event.stopPropagation()}>
        <div className="space-y-4">
          <h2 className={DASHBOARD_MODAL_TITLE_CLASS}>{card.title}</h2>

          <div className="min-h-[140px] rounded-lg bg-[var(--ui-surface-muted)] p-4" style={{ border: SOFT_BORDER }}>
            <p className={DASHBOARD_MODAL_DETAILS_CLASS}>{card.description}</p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className={DASHBOARD_MODAL_DATE_CLASS}>{card.dateTime}</p>
            <button
              type="button"
              onClick={onClose}
              className={DASHBOARD_MODAL_CLOSE_BUTTON_CLASS}
              style={{ border: SOFT_BORDER, backgroundColor: "var(--ui-primary)" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppHeader({
  currentTime,
  isNotificationMenuOpen,
  isProfileMenuOpen,
  notificationRef,
  profileRef,
  onBrandClick,
  onMenuToggle,
  onNotificationsToggle,
  onProfileToggle,
}: AppHeaderProps) {
  return (
    <header className={HEADER_CLASS} style={{ borderBottom: SOFT_BORDER }}>
      <div className={HEADER_LEFT_GROUP_CLASS}>
        <div className={HEADER_LOGO_WRAPPER_CLASS}>
          <Image
            src="/manageme-white.png"
            alt="Logo"
            width={66}
            height={66}
            className={HEADER_LOGO_SIZE_CLASS}
            priority
          />
        </div>

        <button type="button" onClick={onBrandClick} className={HEADER_BRAND_CLASS}>
          MANAGE ME
        </button>

        <button type="button" onClick={onMenuToggle} className={HEADER_MENU_BUTTON_CLASS} aria-label="Toggle menu">
          <Menu size={ICON_SIZES.medium} strokeWidth={ICON_STROKE_WIDTH} />
        </button>
      </div>

      <div className={HEADER_RIGHT_GROUP_CLASS}>
        <div className={HEADER_SERVER_BLOCK_CLASS}>
          <p className={HEADER_SERVER_LABEL_CLASS}>SERVER TIME</p>
          <p className={HEADER_SERVER_TIME_CLASS}>{currentTime}</p>
        </div>

        <div ref={notificationRef} className={HEADER_TOPBAR_SLOT_CLASS}>
          <button
            type="button"
            onClick={onNotificationsToggle}
            className={HEADER_ACTION_BUTTON_CLASS}
            aria-label="Notifications"
            aria-haspopup="menu"
            aria-expanded={isNotificationMenuOpen}
          >
            <Bell size={ICON_SIZES.medium} strokeWidth={ICON_STROKE_WIDTH} />
            <span className={NOTIFICATION_BADGE_CLASS}>
              {NOTIFICATION_PREVIEW.badgeCount}
            </span>
          </button>
          <NotificationMenu open={isNotificationMenuOpen} />
        </div>

        <button type="button" className={HEADER_ACTION_BUTTON_CLASS} aria-label="Video">
          <Video size={ICON_SIZES.medium} strokeWidth={ICON_STROKE_WIDTH} />
        </button>

        <div ref={profileRef} className={HEADER_TOPBAR_SLOT_CLASS}>
          <button
            type="button"
            onClick={onProfileToggle}
            className={HEADER_ACTION_BUTTON_CLASS}
            aria-label="Profile menu"
            aria-haspopup="menu"
            aria-expanded={isProfileMenuOpen}
          >
            <User size={ICON_SIZES.large} strokeWidth={ICON_STROKE_WIDTH} className={SURFACE_TEXT_CLASS} />
          </button>
          <ProfileMenu open={isProfileMenuOpen} />
        </div>
      </div>
    </header>
  );
}

function Sidebar({ activeMenu, isMobileOpen, isDesktopCollapsed, onSelectMenu }: SidebarProps) {
  const sidebarClassName = cn(
    SIDEBAR_CLASS,
    isMobileOpen ? "translate-x-0" : "-translate-x-full",
    "lg:relative lg:bottom-auto lg:left-0 lg:top-auto lg:translate-x-0",
    isDesktopCollapsed ? "lg:w-0 lg:min-w-0 lg:overflow-hidden" : "lg:w-[286px]",
  );

  return (
    <aside className={sidebarClassName} style={{ borderRight: isDesktopCollapsed ? undefined : SOFT_BORDER }}>
      <div className={SIDEBAR_CONTENT_CLASS}>
        <nav className={SIDEBAR_NAV_CLASS}>
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.name;
            const isDashboardItem = item.name === "Dashboard";

            return (
              <div key={item.name} className={isDashboardItem ? DASHBOARD_MENU_SLOT_CLASS : undefined}>
                {item.section ? (
                  <div className={SIDEBAR_SECTION_LABEL_CLASS}>
                    {item.section}
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => onSelectMenu(item.name)}
                  className={cn(
                    SIDEBAR_MENU_BUTTON_CLASS,
                    isDashboardItem && DASHBOARD_MENU_BUTTON_POSITION_CLASS,
                    isActive ? "border-l-[3px] border-[var(--ui-text-primary)] pl-[21px] lg:pl-[25px]" : "border-l-[3px] border-transparent",
                  )}
                >
                  <Icon size={ICON_SIZES.medium} strokeWidth={ICON_STROKE_WIDTH} className={SURFACE_TEXT_CLASS} />
                  <span className={SIDEBAR_MENU_LABEL_CLASS}>{item.name}</span>
                </button>

                {isDashboardItem ? (
                  <div className="absolute bottom-0 h-[0.5px] w-full" style={{ backgroundColor: SOFT_DIVIDER_COLOR }} />
                ) : null}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export function DashboardShell({ initialServerTimeIso, serverTimeZone }: DashboardShellProps) {
  const currentTime = useServerTime(initialServerTimeIso, serverTimeZone);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [selectedCard, setSelectedCard] = useState<DashboardCardItem | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);

  const notificationRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const closeMobileSidebar = useCallback(() => setIsMobileSidebarOpen(false), []);
  const closeNotifications = useCallback(() => setIsNotificationMenuOpen(false), []);
  const closeProfile = useCallback(() => setIsProfileMenuOpen(false), []);
  const closeTopbarMenus = useCallback(() => {
    closeNotifications();
    closeProfile();
  }, [closeNotifications, closeProfile]);

  useBodyScrollLock(isMobileSidebarOpen || Boolean(selectedCard));

  useEffect(() => {
    const handleDocumentPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) {
        return;
      }

      if (!(notificationRef.current?.contains(target) ?? false)) {
        closeNotifications();
      }

      if (!(profileRef.current?.contains(target) ?? false)) {
        closeProfile();
      }
    };

    document.addEventListener("pointerdown", handleDocumentPointerDown);
    return () => document.removeEventListener("pointerdown", handleDocumentPointerDown);
  }, [closeNotifications, closeProfile]);

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
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedCard]);

  useEffect(() => {
    const handleResize = () => {
      if (isDesktopViewport()) {
        closeMobileSidebar();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [closeMobileSidebar]);

  const handleSidebarToggle = useCallback(() => {
    closeTopbarMenus();

    if (isDesktopViewport()) {
      setIsDesktopSidebarCollapsed((collapsed) => !collapsed);
      return;
    }

    setIsMobileSidebarOpen((open) => !open);
  }, [closeTopbarMenus]);

  const handleNotificationsToggle = useCallback(() => {
    setIsNotificationMenuOpen((open) => !open);
    closeProfile();
  }, [closeProfile]);

  const handleProfileToggle = useCallback(() => {
    setIsProfileMenuOpen((open) => !open);
    closeNotifications();
  }, [closeNotifications]);

  const handleMenuSelect = useCallback((name: string) => {
    setActiveMenu(name);
    setSelectedCard(null);
    closeMobileSidebar();
    closeTopbarMenus();
  }, [closeMobileSidebar, closeTopbarMenus]);

  const handleBrandClick = useCallback(() => {
    handleMenuSelect("Dashboard");
  }, [handleMenuSelect]);

  return (
    <div className={APP_SHELL_CLASS}>
      <MobileBackdrop open={isMobileSidebarOpen} onClose={closeMobileSidebar} />

      <AppHeader
        currentTime={currentTime}
        isNotificationMenuOpen={isNotificationMenuOpen}
        isProfileMenuOpen={isProfileMenuOpen}
        notificationRef={notificationRef}
        profileRef={profileRef}
        onBrandClick={handleBrandClick}
        onMenuToggle={handleSidebarToggle}
        onNotificationsToggle={handleNotificationsToggle}
        onProfileToggle={handleProfileToggle}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar
          activeMenu={activeMenu}
          isMobileOpen={isMobileSidebarOpen}
          isDesktopCollapsed={isDesktopSidebarCollapsed}
          onSelectMenu={handleMenuSelect}
        />
        <main className={MAIN_CLASS}>
          {activeMenu === "Dashboard" ? (
            <DashboardCardGrid
              cards={DASHBOARD_CARD_ITEMS}
              isDesktopSidebarCollapsed={isDesktopSidebarCollapsed}
              onCardOpen={setSelectedCard}
            />
          ) : null}
        </main>
      </div>

      {selectedCard ? <DashboardCardModal card={selectedCard} onClose={() => setSelectedCard(null)} /> : null}
    </div>
  );
}
