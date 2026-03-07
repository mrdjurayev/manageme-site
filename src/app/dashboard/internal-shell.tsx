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
  excerpt: string;
  date: string;
};

const MENU_ITEMS: MenuItem[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "fan-tanlov", label: "Fan tanlov", group: "TALABA" },
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
  { id: "n1", title: "Grant taqsimoti", excerpt: "Grant taqsimoti", date: "08:08:2025" },
  { id: "n2", title: "Hurmatli 4-bosqich talabalari!", excerpt: "Hurmatli 4-bosqich talabalari!", date: "26:04:2025" },
  { id: "n3", title: "Hurmatli 1-bosqich talabalari!", excerpt: "Hurmatli 1-bosqich talabalari!", date: "03:01:2025" },
  { id: "n4", title: "Hurmatli qayta o'qishda o'qiyotgan talabalar diqqatiga!", excerpt: "Hurmatli qayta o'qishda o'qiyotgan talabalar diqqatiga!", date: "19:07:2024" },
  { id: "n5", title: "\"Qayta o'qish\"", excerpt: "\"Qayta o'qish\"", date: "11:07:2024" },
  { id: "n6", title: "Qayta o'qishda qatnashish shart!", excerpt: "Qayta o'qishda qatnashish shart!", date: "01:07:2024" },
  { id: "n7", title: "\"Qayta o'qish\"", excerpt: "\"Qayta o'qish\"", date: "21:06:2024" },
  { id: "n8", title: "\"Qayta o'qish\"", excerpt: "\"Qayta o'qish\"", date: "21:06:2024" },
  { id: "n9", title: "Yakuniy nazorat", excerpt: "Yakuniy nazorat", date: "31:05:2024" },
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
      <header className="topbar">
        <div className="brand">
          <div className="brand-logo">
            <Image
              src="/mm-monogram-logo-hexagon-style-vector-27349645.avif"
              alt="Manage Me logo"
              width={44}
              height={44}
              className="logo-img"
              priority
            />
          </div>
          <p className="brand-text">MUHAMMAD AL-XORAZMIY NOMIDAGI TOSHKENT AXBOROT TEXNOLOGIYALARI UNIVERSITETI</p>
        </div>

        <button
          type="button"
          className="menu-trigger"
          onClick={() => setIsSidebarOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={isSidebarOpen}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        <div className="top-actions">
          <div className="server-time">
            <span>Server vaqti</span>
            <strong>{formatServerTime(now)}</strong>
          </div>
          <button type="button" className="icon-btn" aria-label="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M7 9a5 5 0 0 1 10 0v4l1.2 2.2a1 1 0 0 1-.88 1.48H6.68a1 1 0 0 1-.88-1.48L7 13V9Z" />
              <path d="M10 18a2 2 0 0 0 4 0" />
            </svg>
            <span className="notif-dot">1</span>
          </button>
          <button type="button" className="icon-btn" aria-label="Video">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="7" width="12" height="10" rx="2" />
              <path d="M15 10l6-3v10l-6-3" />
            </svg>
          </button>
          <button type="button" className="avatar-btn" aria-label="Profile">
            <Image
              src="/mm-monogram-logo-hexagon-style-vector-27349645.avif"
              alt="Profile"
              width={36}
              height={36}
              className="avatar-img"
            />
          </button>
        </div>
      </header>

      <div className="layout">
        <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
          <nav className="menu-list">
            {MENU_ITEMS.map((item, index) => {
              const prev = MENU_ITEMS[index - 1];
              const showGroup = Boolean(item.group && item.group !== prev?.group);
              const isActive = item.key === activeKey;

              return (
                <div key={item.key}>
                  {showGroup ? <p className="menu-group">{item.group}</p> : null}
                  <button
                    type="button"
                    className={`menu-item ${isActive ? "active" : ""}`}
                    onClick={() => {
                      setActiveKey(item.key);
                      setIsSidebarOpen(false);
                    }}
                  >
                    <span className="menu-icon" />
                    <span>{item.label}</span>
                  </button>
                </div>
              );
            })}
          </nav>
        </aside>

        <section className="content">
          {activeKey === "dashboard" ? (
            <>
              <div className="notice-grid">
                {NOTICE_ITEMS.map((item) => (
                  <article key={item.id} className="notice-card">
                    <h3>{item.title}</h3>
                    <p>{item.excerpt}</p>
                    <div className="notice-footer">
                      <span>{item.date}</span>
                      <button type="button">Batafsil</button>
                    </div>
                  </article>
                ))}
              </div>
              <p className="pager">« Oldingi Keyingi »</p>
            </>
          ) : (
            <div className="module-empty">
              <h2>{activeLabel}</h2>
              <p>Ushbu bo&apos;lim shu skelet asosida keyingi bosqichda to&apos;liq quriladi.</p>
            </div>
          )}
        </section>
      </div>

      <style jsx>{`
        .shell {
          min-height: 100vh;
          background: #dfe3e8;
        }
        .topbar {
          height: 92px;
          background: #f3f4f7;
          border-bottom: 1px solid #d6dbe4;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 0 14px;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .brand-logo {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: #fff;
          border: 1px solid #d3d8e2;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }
        .logo-img {
          width: 36px;
          height: 36px;
          object-fit: cover;
          border-radius: 8px;
        }
        .brand-text {
          max-width: 310px;
          color: #223459;
          font-size: 13px;
          line-height: 1.2;
          font-weight: 700;
        }
        .menu-trigger {
          margin-left: 8px;
          width: 42px;
          height: 42px;
          border-radius: 8px;
          color: #20315f;
        }
        .menu-trigger svg {
          width: 24px;
          height: 24px;
        }
        .top-actions {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .server-time {
          display: none;
          flex-direction: column;
          align-items: flex-end;
          color: #1f3462;
          margin-right: 8px;
        }
        .server-time span {
          font-size: 14px;
        }
        .server-time strong {
          font-size: 34px;
          line-height: 1;
        }
        .icon-btn,
        .avatar-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: #21386b;
          position: relative;
        }
        .icon-btn svg {
          width: 24px;
          height: 24px;
        }
        .notif-dot {
          position: absolute;
          top: -3px;
          right: -2px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ed3f4f;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          display: grid;
          place-items: center;
        }
        .avatar-btn {
          border: 1px solid #d2d8e1;
          background: #fff;
        }
        .avatar-img {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          object-fit: cover;
        }
        .layout {
          display: grid;
          min-height: calc(100vh - 92px);
        }
        .sidebar {
          display: none;
          background: #1f346b;
          color: #e8eefb;
          padding: 16px 0;
          border-right: 1px solid #162752;
        }
        .sidebar.open {
          display: block;
        }
        .menu-list {
          max-height: calc(100vh - 124px);
          overflow: auto;
          padding-right: 6px;
        }
        .menu-group {
          margin: 14px 22px 8px;
          color: #b7c5ea;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.07em;
        }
        .menu-item {
          width: 100%;
          min-height: 50px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 20px;
          color: #ebeff9;
          font-size: 36px;
          border-top: 1px solid transparent;
          border-bottom: 1px solid transparent;
          transition: background-color 0.15s ease;
        }
        .menu-item span:last-child {
          font-size: 34px;
          line-height: 1;
        }
        .menu-item:hover {
          background: #2c467f;
        }
        .menu-item.active {
          background: #2f4b87;
          border-top-color: #3d5b95;
          border-bottom-color: #3d5b95;
        }
        .menu-icon {
          width: 10px;
          height: 10px;
          border-radius: 2px;
          background: #cad4f0;
          flex-shrink: 0;
        }
        .content {
          padding: 18px;
          background: #dfe3e8;
        }
        .notice-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(1, minmax(0, 1fr));
        }
        .notice-card {
          background: #f7f8fa;
          border-radius: 8px;
          border: 1px solid #dde2ea;
          min-height: 154px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
        }
        .notice-card h3 {
          color: #1f3566;
          font-size: 36px;
          font-weight: 700;
          line-height: 1.2;
        }
        .notice-card p {
          margin-top: 8px;
          color: #2e3442;
          font-size: 35px;
          line-height: 1.35;
        }
        .notice-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #b2b7c1;
          font-size: 33px;
        }
        .notice-footer button {
          min-width: 84px;
          height: 34px;
          border-radius: 7px;
          background: #1e3367;
          color: #fff;
          font-size: 27px;
          font-weight: 600;
          padding: 0 14px;
        }
        .pager {
          margin-top: 10px;
          text-align: right;
          color: #2f3646;
          font-size: 38px;
        }
        .module-empty {
          background: #f7f8fa;
          border: 1px solid #dde2ea;
          border-radius: 8px;
          padding: 20px;
        }
        .module-empty h2 {
          color: #1f3566;
          font-size: 44px;
          font-weight: 700;
        }
        .module-empty p {
          margin-top: 10px;
          color: #3a4251;
          font-size: 34px;
        }
        @media (min-width: 768px) {
          .server-time {
            display: flex;
          }
          .menu-item {
            font-size: 24px;
          }
          .menu-item span:last-child {
            font-size: 18px;
          }
          .notice-card h3 {
            font-size: 23px;
          }
          .notice-card p,
          .notice-footer,
          .pager,
          .module-empty p {
            font-size: 16px;
          }
          .notice-footer button {
            font-size: 16px;
          }
          .module-empty h2 {
            font-size: 30px;
          }
        }
        @media (min-width: 1024px) {
          .menu-trigger {
            margin-left: 20px;
          }
          .layout {
            grid-template-columns: 380px minmax(0, 1fr);
          }
          .sidebar {
            display: block;
          }
          .content {
            padding: 34px 30px;
          }
          .notice-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (min-width: 1280px) {
          .notice-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
      `}</style>
    </main>
  );
}
