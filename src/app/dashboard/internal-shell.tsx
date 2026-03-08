"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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

type MenuItem = {
  name: string;
  icon: LucideIcon;
  section: string | null;
};

const menuItems: MenuItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, section: null },
  { name: "My Subjects", icon: BookOpen, section: "STUDENT" },
  { name: "Lesson Schedule", icon: Calendar, section: null },
  { name: "Assignments", icon: ClipboardList, section: null },
  { name: "Retake a Subject", icon: RotateCcw, section: null },
  { name: "Final Exam", icon: HelpCircle, section: null },
  { name: "Individual Plan", icon: ChartNoAxesCombined, section: null },
  { name: "About", icon: Info, section: null },
];

const SOFT_DIVIDER_COLOR = "rgba(203,213,225,0.45)";
const MOBILE_BREAKPOINT = 1024;

function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

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
  const notifRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(formatServerTime(new Date())), 30_000);
    return () => window.clearInterval(timer);
  }, []);

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
    "custom-scrollbar fixed bottom-0 left-0 top-20 z-40 w-[260px] overflow-x-hidden overflow-y-auto bg-white text-[rgb(36,31,33)] transition-[transform,width] duration-200 ease-out",
    mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
    "lg:relative lg:bottom-auto lg:left-0 lg:top-auto lg:translate-x-0",
    desktopSidebarCollapsed ? "lg:w-0 lg:min-w-0 lg:overflow-hidden" : "lg:w-[260px]",
  );

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

      <header
        className="z-50 flex h-20 items-center justify-between bg-white px-2 md:px-6"
        style={{ borderBottom: `0.5px solid ${SOFT_DIVIDER_COLOR}` }}
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

          <div ref={notifRef} className="relative">
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
              <div className="absolute right-[-10px] mt-4 w-[320px] overflow-hidden rounded-md border border-slate-100 bg-white shadow-2xl">
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

          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={toggleProfile}
              className="flex h-10 w-10 cursor-pointer items-center justify-center focus:outline-none"
              aria-label="Profile menu"
            >
              <UserCircle2 size={30} strokeWidth={1.6} className="text-[rgb(36,31,33)]" />
            </button>

            {isProfileOpen ? (
              <div className="absolute right-0 mt-4 w-52 overflow-hidden rounded-md border border-slate-100 bg-white shadow-2xl">
                <div className="bg-[rgb(36,31,33)] p-3.5 text-white">
                  <p className="text-[13px] font-bold uppercase leading-tight tracking-wide">Abdullox</p>
                  <p className="text-[12px] font-medium text-[#6b7280]">Jurayev</p>
                </div>
                <div className="py-1">
                  <button className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-[13px] text-[rgb(36,31,33)]">
                    <Settings size={15} className="text-[rgb(36,31,33)]" /> Profile Settings
                  </button>
                  <button className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-[13px] text-[rgb(36,31,33)]">
                    <LogOut size={15} className="text-[rgb(36,31,33)]" /> Logout
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className={sidebarClassName} style={{ borderRight: `0.5px solid ${SOFT_DIVIDER_COLOR}` }}>
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

        <main className="custom-scrollbar min-w-0 flex-1 overflow-y-auto bg-[rgb(250,250,250)] p-4 md:p-8" />
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
