"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type MenuItem = {
  key: string;
  label: string;
  group?: string;
};

const MENU_ITEMS: MenuItem[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "fan-tanlov", label: "Fan tanlov", group: "TALABA" },
  { key: "mening-fanlarim", label: "Mening fanlarim" },
  { key: "dars-jadvali", label: "Dars jadvali" },
  { key: "qayta-oqish", label: "Qayta o'qish" },
  { key: "yakuniy", label: "Yakuniy" },
  { key: "individual-reja", label: "Individual shaxsiy reja" },
  { key: "malumot", label: "Ma'lumot" },
  { key: "sorovnoma", label: "So'rovnoma" },
  { key: "talaba-xizmatlari", label: "Talaba xizmatlari" },
  { key: "olimpiadalar", label: "Olimpiadalar" },
  { key: "diplom-ishi", label: "Diplom ishi" },
];

function formatServerTime(value: Date): string {
  const date = value.toLocaleDateString("en-GB").replaceAll("/", ".");
  const time = value.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${date} | ${time}`;
}

export function DashboardShell() {
  const [activeKey, setActiveKey] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const activeLabel = useMemo(() => {
    return MENU_ITEMS.find((item) => item.key === activeKey)?.label ?? "Dashboard";
  }, [activeKey]);

  return (
    <main className="shell">
      <div className="topbar">
        <div className="brand-block">
          <div className="brand-logo-wrap">
            <Image
              src="/mm-monogram-logo-hexagon-style-vector-27349645.avif"
              alt="Manage Me logo"
              width={42}
              height={42}
              className="brand-logo"
              priority
            />
          </div>
          <p className="brand-title">MANAGE ME LMS</p>
        </div>

        <button
          type="button"
          className="menu-btn"
          onClick={() => setIsSidebarOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={isSidebarOpen}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        <div className="top-right">
          <div className="server-time">
            <span className="server-time-label">Server vaqti</span>
            <span className="server-time-value">{formatServerTime(now)}</span>
          </div>
          <button type="button" className="icon-btn" aria-label="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M7 9a5 5 0 0 1 10 0v4l1.2 2.2a1 1 0 0 1-.88 1.48H6.68a1 1 0 0 1-.88-1.48L7 13V9Z" />
              <path d="M10 18a2 2 0 0 0 4 0" />
            </svg>
          </button>
          <button type="button" className="avatar-btn" aria-label="Profile">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="8" r="4.2" />
              <path d="M4.8 19.4a7.2 7.2 0 0 1 14.4 0" />
            </svg>
          </button>
        </div>
      </div>

      <div className="layout">
        <aside className={`sidebar ${isSidebarOpen ? "sidebar-open" : ""}`}>
          <nav>
            {MENU_ITEMS.map((item, index) => {
              const prevItem = MENU_ITEMS[index - 1];
              const shouldRenderGroup = Boolean(item.group && item.group !== prevItem?.group);
              const isActive = item.key === activeKey;

              return (
                <div key={item.key}>
                  {shouldRenderGroup ? <p className="menu-group">{item.group}</p> : null}
                  <button
                    type="button"
                    className={`menu-item ${isActive ? "menu-item-active" : ""}`}
                    onClick={() => {
                      setActiveKey(item.key);
                      setIsSidebarOpen(false);
                    }}
                  >
                    <span className="menu-dot" />
                    <span>{item.label}</span>
                  </button>
                </div>
              );
            })}
          </nav>
        </aside>

        <section className="content">
          <h1>{activeLabel}</h1>
          <p>Bo&apos;sh ishchi maydon. Shu bo&apos;limni keyingi bosqichda to&apos;liq quramiz.</p>
        </section>
      </div>

      <style jsx>{`
        .shell {
          min-height: 100vh;
          background: #eef0f5;
          padding: 12px;
        }
        .topbar {
          min-height: 72px;
          border: 1px solid #d9dee7;
          background: #fff;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
        }
        .brand-block {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .brand-logo-wrap {
          width: 46px;
          height: 46px;
          border-radius: 10px;
          background: #1f1b23;
          display: grid;
          place-items: center;
        }
        .brand-logo {
          width: 28px;
          height: 28px;
          object-fit: cover;
        }
        .brand-title {
          font-size: 14px;
          font-weight: 600;
          color: #384559;
          letter-spacing: 0.04em;
        }
        .menu-btn {
          width: 42px;
          height: 42px;
          border: 1px solid #d7dce5;
          border-radius: 8px;
          display: grid;
          place-items: center;
          color: #445066;
        }
        .menu-btn svg {
          width: 20px;
          height: 20px;
        }
        .top-right {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .server-time {
          display: none;
          flex-direction: column;
          align-items: flex-end;
          color: #3f4c61;
        }
        .server-time-label {
          font-size: 12px;
          opacity: 0.8;
        }
        .server-time-value {
          font-size: 20px;
          line-height: 1;
          font-weight: 500;
        }
        .icon-btn,
        .avatar-btn {
          width: 40px;
          height: 40px;
          border: 1px solid #d7dce5;
          border-radius: 50%;
          color: #3f4c61;
          display: grid;
          place-items: center;
        }
        .icon-btn svg,
        .avatar-btn svg {
          width: 21px;
          height: 21px;
        }
        .layout {
          margin-top: 10px;
          display: grid;
          gap: 10px;
        }
        .sidebar {
          display: none;
          border: 1px solid #d0d7e2;
          background: #1f3166;
          color: #f1f4fa;
          padding: 12px 10px;
        }
        .sidebar-open {
          display: block;
        }
        .menu-group {
          margin: 14px 8px 8px;
          font-size: 11px;
          letter-spacing: 0.12em;
          font-weight: 700;
          color: #9fb0da;
        }
        .menu-item {
          width: 100%;
          min-height: 44px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 10px;
          color: #edf1fa;
          border-radius: 8px;
          transition: background-color 0.15s ease;
        }
        .menu-item:hover {
          background: #2d448a;
        }
        .menu-item-active {
          background: #2f4a94;
        }
        .menu-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #c7d3f4;
          flex-shrink: 0;
        }
        .content {
          min-height: 70vh;
          border: 1px solid #d8dde7;
          background: #fff;
          padding: 16px;
        }
        .content h1 {
          font-size: 32px;
          color: #1f2c44;
          font-weight: 600;
        }
        .content p {
          margin-top: 10px;
          color: #4f5b71;
          font-size: 18px;
        }
        @media (min-width: 768px) {
          .topbar {
            min-height: 84px;
            padding: 12px 18px;
          }
          .brand-title {
            font-size: 15px;
          }
          .server-time {
            display: flex;
          }
        }
        @media (min-width: 1024px) {
          .shell {
            padding: 14px;
          }
          .menu-btn {
            display: none;
          }
          .layout {
            grid-template-columns: 280px minmax(0, 1fr);
          }
          .sidebar {
            display: block;
            min-height: calc(100vh - 120px);
          }
          .content {
            min-height: calc(100vh - 120px);
            padding: 22px 26px;
          }
        }
      `}</style>
    </main>
  );
}
