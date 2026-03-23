"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from "react";
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
import {
  CONTRACT_TERMS_CARD,
  ContractTermsView,
  DASHBOARD_CARD_ITEMS,
  DashboardCardGrid,
  DashboardCardModal,
  type DashboardCardItem,
} from "@/components/dashboard";
import {
  ASSIGNMENT_RECORDS,
  ASSIGNMENTS_SUBJECT_OPTIONS,
  getAssignmentsNotificationPreview,
  type AssignmentsNotificationPreview,
  type AssignmentSubjectOption,
  AssignmentsView,
} from "@/components/assignments";
import { LessonScheduleCanvas, LessonScheduleToolbar } from "@/components/lesson-schedule";
import { MySubjectsView } from "@/components/my-subjects";

type MenuItem = {
  name: string;
  icon: LucideIcon;
  section: string | null;
};

type DashboardShellProps = {
  initialServerTimeIso: string;
  serverTimeZone?: string;
};

type DashboardContentView = "cards" | "contract-terms";

type AppHeaderProps = {
  currentTime: string;
  notificationPreview: AssignmentsNotificationPreview;
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
  const [serverNow, setServerNow] = useState(() =>
    new Date(Number.isFinite(initialServerEpoch) ? initialServerEpoch : Date.now()),
  );
  const currentTime = useMemo(
    () => formatServerTime(serverNow, normalizedServerTimeZone),
    [normalizedServerTimeZone, serverNow],
  );

  useEffect(() => {
    const baseServerMs = Number.isFinite(initialServerEpoch) ? initialServerEpoch : Date.now();
    const startedAtMs = Date.now();

    const tick = () => {
      const elapsedMs = Date.now() - startedAtMs;
      setServerNow(new Date(baseServerMs + elapsedMs));
    };

    tick();

    const timer = window.setInterval(tick, 30_000);
    return () => window.clearInterval(timer);
  }, [initialServerEpoch]);

  return {
    currentTime,
    serverNow,
    timeZone: normalizedServerTimeZone,
  };
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

function NotificationMenu({ open, preview }: { open: boolean; preview: AssignmentsNotificationPreview }) {
  if (!open) {
    return null;
  }

  const hasNotifications = preview.badgeCount !== "0";

  return (
    <div className={NOTIFICATION_DROPDOWN_CLASS} style={PANEL_STYLE}>
      <div className="ui-text-body-sm bg-[var(--ui-primary)] p-3 font-bold text-[var(--ui-text-inverse)]">Notifications</div>
      {hasNotifications ? (
        <div className="flex gap-4 border-b border-[var(--ui-border-subtle)] p-4">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[var(--ui-surface-muted)] ${SURFACE_TEXT_CLASS}`}>
            <FileText size={ICON_SIZES.small} strokeWidth={ICON_STROKE_WIDTH} />
          </div>
          <div className="flex flex-col">
            <p className={`ui-text-body-sm font-bold leading-tight ${SURFACE_TEXT_CLASS}`}>{preview.title}</p>
            <p className={`ui-text-caption mt-1 font-medium ${MUTED_TEXT_CLASS}`}>{preview.subtitle}</p>
            <p className={`ui-text-meta mt-1 font-normal ${MUTED_TEXT_CLASS}`}>{preview.meta}</p>
          </div>
        </div>
      ) : (
        <div className={`flex min-h-[132px] items-center justify-center p-4 text-center ui-text-body-sm font-medium ${MUTED_TEXT_CLASS}`}>
          No notifications
        </div>
      )}
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

function AppHeader({
  currentTime,
  notificationPreview,
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
            {notificationPreview.badgeCount !== "0" ? (
              <span className={NOTIFICATION_BADGE_CLASS}>
                {notificationPreview.badgeCount}
              </span>
            ) : null}
          </button>
          <NotificationMenu open={isNotificationMenuOpen} preview={notificationPreview} />
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
  const { currentTime, serverNow, timeZone } = useServerTime(initialServerTimeIso, serverTimeZone);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [selectedAssignmentsSubject, setSelectedAssignmentsSubject] = useState<AssignmentSubjectOption>(
    ASSIGNMENTS_SUBJECT_OPTIONS[0],
  );
  const [dashboardContentView, setDashboardContentView] = useState<DashboardContentView>("cards");
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

  const notificationPreview = useMemo(
    () => getAssignmentsNotificationPreview(ASSIGNMENT_RECORDS, serverNow),
    [serverNow],
  );

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
    setDashboardContentView("cards");
    setSelectedCard(null);
    closeMobileSidebar();
    closeTopbarMenus();
  }, [closeMobileSidebar, closeTopbarMenus]);

  const handleBrandClick = useCallback(() => {
    handleMenuSelect("Dashboard");
  }, [handleMenuSelect]);

  const handleCardLinkClick = useCallback((card: DashboardCardItem) => {
    if (card.modalLinkTarget !== "contract-terms") {
      return;
    }

    setActiveMenu("Dashboard");
    setDashboardContentView("contract-terms");
    setSelectedCard(null);
    closeMobileSidebar();
    closeTopbarMenus();
  }, [closeMobileSidebar, closeTopbarMenus]);

  const handleContractTermsBack = useCallback(() => {
    setActiveMenu("Dashboard");
    setDashboardContentView("cards");
    setSelectedCard(null);
    closeMobileSidebar();
    closeTopbarMenus();
  }, [closeMobileSidebar, closeTopbarMenus]);

  const handleAssignmentsOpenFromSubject = useCallback((subjectTitle: string) => {
    const matchingSubject = ASSIGNMENTS_SUBJECT_OPTIONS.find((subject) => subject === subjectTitle);

    if (matchingSubject) {
      setSelectedAssignmentsSubject(matchingSubject);
    }

    setActiveMenu("Assignments");
    setDashboardContentView("cards");
    setSelectedCard(null);
    closeMobileSidebar();
    closeTopbarMenus();
  }, [closeMobileSidebar, closeTopbarMenus]);

  return (
    <div className={APP_SHELL_CLASS}>
      <MobileBackdrop open={isMobileSidebarOpen} onClose={closeMobileSidebar} />

      <AppHeader
        currentTime={currentTime}
        notificationPreview={notificationPreview}
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
          {activeMenu === "Dashboard" && dashboardContentView === "cards" ? (
            <DashboardCardGrid
              cards={DASHBOARD_CARD_ITEMS}
              isDesktopSidebarCollapsed={isDesktopSidebarCollapsed}
              onCardOpen={setSelectedCard}
              onCardNavigate={handleCardLinkClick}
            />
          ) : null}

          {activeMenu === "Dashboard" && dashboardContentView === "contract-terms" ? (
            <ContractTermsView card={CONTRACT_TERMS_CARD} onBack={handleContractTermsBack} />
          ) : null}

          {activeMenu === "My Subjects" ? (
            <MySubjectsView
              referenceDate={serverNow}
              referenceTimeZone={timeZone}
              onAssignmentsOpen={(subject) => handleAssignmentsOpenFromSubject(subject.title)}
            />
          ) : null}

          {activeMenu === "Assignments" ? (
            <AssignmentsView
              initialSelectedSubject={selectedAssignmentsSubject}
              onSelectedSubjectChange={setSelectedAssignmentsSubject}
            />
          ) : null}

          {activeMenu === "Lesson Schedule" ? (
            <div className="min-h-0 flex flex-1 flex-col gap-0 pb-4 pt-0 lg:pb-0">
              <LessonScheduleToolbar />
              <LessonScheduleCanvas className="min-h-0 flex-1" referenceDate={serverNow} referenceTimeZone={timeZone} />
            </div>
          ) : null}
        </main>
      </div>

      {selectedCard ? (
        <DashboardCardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onLinkClick={handleCardLinkClick}
        />
      ) : null}
    </div>
  );
}
