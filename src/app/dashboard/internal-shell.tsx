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
    <main className="shell-page">
      <div className="shell-wrap">
        <header className="shell-topbar">
          <div className="shell-logo-pill">
            <Image
              src="/mm-monogram-logo-hexagon-style-vector-27349645.avif"
              alt="Manage Me logo"
              width={44}
              height={44}
              className="shell-logo-image"
              priority
            />
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((value) => !value)}
            className="menu-toggle lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg viewBox="0 0 24 24" className="icon-mid" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3.2" y="4.2" width="7.5" height="15.6" rx="2" />
              <rect x="13.3" y="4.2" width="7.5" height="15.6" rx="2" />
            </svg>
          </button>

          <div className="shell-right">
            <p className="date-label">{formatNow(now)}</p>
            <button
              type="button"
              className="icon-circle"
              aria-label="Notifications"
            >
              <svg viewBox="0 0 24 24" className="icon-small" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M7 9a5 5 0 0 1 10 0v4l1.3 2.4A1 1 0 0 1 17.4 17H6.6a1 1 0 0 1-.9-1.6L7 13V9Z" />
                <path d="M10 18a2 2 0 0 0 4 0" />
              </svg>
            </button>
            <button
              type="button"
              className="profile-circle"
              aria-label="Profile"
            >
              <svg viewBox="0 0 24 24" className="icon-large" fill="currentColor">
                <circle cx="12" cy="8" r="4.2" />
                <path d="M4.6 19.6a7.4 7.4 0 0 1 14.8 0" />
              </svg>
            </button>
          </div>
        </header>

        <div className="shell-grid">
          <aside
            className={`shell-sidebar ${isMenuOpen ? "menu-open" : "menu-closed"}`}
          >
            <nav className="sidebar-nav">
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
                    className={`menu-item ${isActive ? "menu-item-active" : ""}`}
                  >
                    <span className="menu-text">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <section className="shell-content">
            <h2 className="content-title">{title}</h2>
            <p className="content-note">
              Empty workspace. We will build this module from zero in the next step.
            </p>
          </section>
        </div>
      </div>
      <style jsx>{`
        .shell-page {
          min-height: 100vh;
          background: #f3f4f6;
          padding: 16px;
        }
        .shell-wrap {
          max-width: 1500px;
          margin: 0 auto;
        }
        .shell-topbar {
          display: flex;
          align-items: center;
          gap: 12px;
          height: 92px;
          border: 1px solid #cfd4dd;
          border-radius: 30px;
          background: #f7f8fa;
          padding: 0 16px;
          box-shadow: 0 3px 12px rgba(31, 31, 31, 0.07);
        }
        .shell-logo-pill {
          width: 130px;
          height: 66px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #d1d5db;
          border-radius: 999px;
          background: #f1f3f6;
          box-shadow: 0 2px 8px rgba(31, 31, 31, 0.08);
        }
        .shell-logo-image {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          object-fit: cover;
        }
        .menu-toggle {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          background: #eff2f6;
          color: #7b8494;
        }
        .shell-right {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #7f8796;
        }
        .date-label {
          display: none;
          font-size: 28px;
          font-weight: 500;
        }
        .icon-circle,
        .profile-circle {
          display: grid;
          place-items: center;
          border-radius: 999px;
          background: #eff2f6;
        }
        .icon-circle {
          width: 44px;
          height: 44px;
          border: 1px solid #d1d5db;
          color: #7f8796;
        }
        .profile-circle {
          width: 56px;
          height: 56px;
          border: 1px solid #cfd4dd;
          color: #7d8592;
        }
        .icon-small {
          width: 24px;
          height: 24px;
        }
        .icon-mid {
          width: 28px;
          height: 28px;
        }
        .icon-large {
          width: 32px;
          height: 32px;
        }
        .shell-grid {
          margin-top: 20px;
          display: grid;
          gap: 20px;
        }
        .shell-sidebar {
          border: 1px solid #cfd4dd;
          border-radius: 34px;
          background: #f7f8fa;
          padding: 20px;
          box-shadow: 0 3px 12px rgba(31, 31, 31, 0.07);
        }
        .menu-closed {
          display: none;
        }
        .menu-open {
          display: block;
        }
        .sidebar-nav {
          display: grid;
          gap: 16px;
        }
        .menu-item {
          width: 100%;
          height: 86px;
          border: 1px solid #d3d8e0;
          border-radius: 24px;
          background: #f4f6f9;
          color: #768093;
          box-shadow: 0 3px 8px rgba(31, 31, 31, 0.06);
        }
        .menu-item-active {
          border-color: #bcc4d0;
          background: #edf1f6;
          color: #5f6878;
        }
        .menu-text {
          font-size: clamp(1.8rem, 2.6vw, 3.05rem);
          line-height: 1;
        }
        .shell-content {
          min-height: 600px;
          border: 1px solid #d6dbe4;
          border-radius: 34px;
          background: #f8f9fb;
          padding: 28px;
          box-shadow: 0 3px 12px rgba(31, 31, 31, 0.04);
        }
        .content-title {
          font-size: clamp(2rem, 3vw, 3rem);
          font-weight: 500;
          color: #6f7888;
        }
        .content-note {
          margin-top: 12px;
          font-size: 22px;
          color: #8a93a2;
        }
        @media (min-width: 768px) {
          .shell-page {
            padding: 24px;
          }
          .shell-topbar {
            height: 98px;
            gap: 20px;
            padding: 0 32px;
          }
          .shell-logo-pill {
            width: 160px;
            height: 70px;
          }
          .shell-right {
            gap: 28px;
          }
          .date-label {
            display: block;
          }
        }
        @media (min-width: 1024px) {
          .menu-toggle {
            display: none;
          }
          .shell-grid {
            grid-template-columns: 340px minmax(0, 1fr);
          }
          .shell-sidebar {
            display: block !important;
          }
        }
      `}</style>
    </main>
  );
}
