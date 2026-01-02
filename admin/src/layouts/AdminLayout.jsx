// admin/src/layouts/AdminLayout.jsx
import React, { useEffect, useState, useCallback } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import logoWhite from "../assets/logo-white.png";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 640 : true
  );

  const navigate = useNavigate();
  const location = useLocation();

  const [counts, setCounts] = useState({ events: 0, speakers: 0, sponsors: 0, tickets: 0 });
  const [loadingCounts, setLoadingCounts] = useState(true);

  const menu = [
    { to: "/admin/events", label: "Events", icon: "calendar" },
    { to: "/admin/bookings", label: "Bookings", icon: "ticket" }, // ADDED BOOKINGS
    { to: "/admin/speakers", label: "Speakers", icon: "mic" },
    { to: "/admin/sponsors", label: "Sponsors", icon: "handshake" },
    { to: "/admin/organizers", label: "Organizers", icon: "users" },
    { to: "/admin/coordinators", label: "Coordinators", icon: "badge" },
    { to: "/admin/map", label: "Map", icon: "map" },
    { to: "/admin/media", label: "Media", icon: "badge" },
  ];

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 640);
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  // load counts from API (events, speakers, sponsors, bookings)
  const loadCounts = useCallback(async () => {
    setLoadingCounts(true);
    try {
      const [evRes, spRes, spnRes, bkRes] = await Promise.allSettled([
        api.get("/admin/events"),
        api.get("/admin/speakers"),
        api.get("/admin/sponsors"),
        api.get("/admin/bookings"), // expects admin bookings endpoint returning array
      ]);

      const normalize = (r) => {
        if (!r || r.status === "rejected") return 0;
        const data = r.value?.data;
        const arr = data?.data ?? data ?? [];
        if (Array.isArray(arr)) return arr.length;
        if (typeof arr === "object") return arr.count ?? arr.total ?? 0;
        return 0;
      };

      setCounts({
        events: normalize(evRes),
        speakers: normalize(spRes),
        sponsors: normalize(spnRes),
        tickets: normalize(bkRes),
      });
    } catch (err) {
      console.error("Failed to load counts", err);
      setCounts({ events: 0, speakers: 0, sponsors: 0, tickets: 0 });
    } finally {
      setLoadingCounts(false);
    }
  }, []);

  useEffect(() => {
    loadCounts();
    setOpen(false);
    document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [location.pathname, loadCounts]);

  const logout = () => {
    localStorage.removeItem("admin_token");
    navigate("/");
  };

  const toggleSidebar = () => {
    if (isDesktop) setCollapsed((c) => !c);
    else setOpen((o) => !o);
  };

  const Icon = ({ name }) => {
    const base = "w-5 h-5 mr-3 flex-none stroke-current";
    switch (name) {
      case "calendar":
        return (
          <svg className={base} viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M8 7V3M16 7V3M3 11H21M5 21H19C20.1046 21 21 20.1046 21 19V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V19C3 20.1046 3.89543 21 5 21Z"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "mic":
        return (
          <svg className={base} viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 1V13M5 8V9C5 13.4183 8.58172 17 13 17C17.4183 17 21 13.4183 21 9V8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 21H16"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "handshake":
        return (
          <svg className={base} viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M2 12L6 16L10 12L14 16L22 8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "users":
        return (
          <svg className={base} viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M17 21V19C17 17.3431 15.6569 16 14 16H10C8.34315 16 7 17.3431 7 19V21"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "badge":
        return (
          <svg className={base} viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "map":
        return (
          <svg className={base} viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M20.5 3L15 5L8 3L3.5 5V19L9 17L16 19L20.5 17V3Z"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "ticket":
        // simple ticket icon
        return (
          <svg className={base} viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M21 7v10a1 1 0 0 1-1 1h-2a1 1 0 0 0 0 2H6a1 1 0 0 0 0-2H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h2a1 1 0 0 0 0-2h12a1 1 0 0 0 0 2h2a1 1 0 0 1 1 1z"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 10h.01M12 10h.01M17 10h.01"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const sidebarWidthPx = isDesktop ? (collapsed ? 64 : 256) : 0;
  const mainStyle = isDesktop
    ? { marginLeft: sidebarWidthPx, transition: "margin-left 200ms" }
    : {};

  const dashboardInnerHeight = `calc(100vh - 96px)`;

  return (
    <div className="min-h-screen flex bg-black text-white">
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 transition-opacity sm:hidden ${
          open
            ? "opacity-100 pointer-events-auto bg-black/60"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden
      />

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 transform bg-black border-r border-red-700 p-4 transition-all`}
        style={{
          width: isDesktop ? (collapsed ? 64 : 256) : 256,
          boxSizing: "border-box",
          transform: !isDesktop && !open ? "translateX(-110%)" : "translateX(0)",
        }}
      >
        {/* ✔ UPDATED LOGO SECTION */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Bigger Logo */}
            <img
              src={logoWhite}
              alt="TEDxSMEC Logo"
              style={{
                width: collapsed ? 48 : 72,
                height: collapsed ? 48 : 72,
                objectFit: "contain",
              }}
            />

            {/* Administrator text */}
            {!collapsed && (
              <div>
                <div className="text-xs text-red-300">Administrator</div>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          {!isDesktop && (
            <button
              className="p-2 rounded-md hover:bg-red-700/20 text-white"
              onClick={() => setOpen(false)}
              aria-label="Close sidebar"
            >
              ✕
            </button>
          )}
        </div>

        <nav className="flex-1">
          <ul className="space-y-1">
            {menu.map((m) => (
              <li key={m.to}>
                <NavLink
                  to={m.to}
                  className={({ isActive }) =>
                    `group flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-red-600 text-white"
                        : "text-white hover:bg-red-700/10"
                    }`
                  }
                  style={{ whiteSpace: "nowrap" }}
                >
                  <Icon name={m.icon} />
                  {!collapsed && <span className="truncate">{m.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-6 border-t border-red-800 pt-4">
          <button
            onClick={logout}
            className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-red-700/10"
          >
            <svg
              className="w-5 h-5 mr-3 flex-none stroke-current"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M16 17L21 12L16 7"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12H9"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13 5H8C6.89543 5 6 5.89543 6 7V17C6 18.1046 6.89543 19 8 19H13"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* TOPBAR */}
      <header
        className="fixed top-0 left-0 right-0 bg-black border-b border-red-800 p-2 z-30 flex items-center justify-between"
        style={{ height: 64 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-red-700/10 text-white"
            aria-label="Toggle sidebar"
            title={isDesktop ? (collapsed ? 'Expand sidebar' : 'Collapse sidebar') : (open ? 'Close menu' : 'Open menu')}
          >
            ☰
          </button>

          <div style={{ fontWeight: 700, color: "white" }}>Admin</div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={loadCounts}
            className="px-3 py-1 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700/90"
          >
            Refresh
          </button>
          <button className="px-3 py-1 rounded-md border border-red-700 text-white hover:bg-red-700/10">
            Settings
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main
        className="flex-1 min-h-screen bg-black"
        style={{
          paddingTop: 64,
          ...mainStyle,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1280,
            margin: "0 auto",
            padding: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 8px 0 8px",
            }}
          >
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>
              Dashboard
            </h1>
          </div>

          <div style={{ height: dashboardInnerHeight }}>
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                height: "25%",
                overflow: "auto",
                padding: 0,
              }}
            >
              {/* Events */}
              <div
                style={{
                  width: 260,
                  minHeight: 140,
                  borderRadius: 12,
                  padding: 18,
                  border: "1px solid rgba(178,13,18,0.18)",
                  background: "rgba(255,255,255,0.02)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ color: "#ff7b7b", fontWeight: 600, marginBottom: 6 }}>
                    Events
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 800 }}>
                    {loadingCounts ? "…" : counts.events}
                  </div>
                </div>
                <div style={{ color: "#ff7b7b", fontSize: 12, marginTop: 8 }}>
                  Last updated: {new Date().toLocaleString()}
                </div>
              </div>

              {/* Tickets */}
              <div
                style={{
                  width: 260,
                  minHeight: 140,
                  borderRadius: 12,
                  padding: 18,
                  border: "1px solid rgba(178,13,18,0.18)",
                  background: "rgba(255,255,255,0.02)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ color: "#ff7b7b", fontWeight: 600, marginBottom: 6 }}>
                    Tickets
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 800 }}>
                    {loadingCounts ? "…" : counts.tickets}
                  </div>
                </div>
                <div style={{ color: "#ff7b7b", fontSize: 12, marginTop: 8 }}>
                  Manage bookings
                </div>
              </div>

              {/* Speakers */}
              <div
                style={{
                  width: 260,
                  minHeight: 140,
                  borderRadius: 12,
                  padding: 18,
                  border: "1px solid rgba(178,13,18,0.18)",
                  background: "rgba(255,255,255,0.02)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ color: "#ff7b7b", fontWeight: 600, marginBottom: 6 }}>
                    Speakers
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 800 }}>
                    {loadingCounts ? "…" : counts.speakers}
                  </div>
                </div>
                <div style={{ color: "#ff7b7b", fontSize: 12, marginTop: 8 }}>
                  Manage speakers
                </div>
              </div>

              {/* Sponsors */}
              <div
                style={{
                  width: 260,
                  minHeight: 140,
                  borderRadius: 12,
                  padding: 18,
                  border: "1px solid rgba(178,13,18,0.18)",
                  background: "rgba(255,255,255,0.02)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ color: "#ff7b7b", fontWeight: 600, marginBottom: 6 }}>
                    Sponsors
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 800 }}>
                    {loadingCounts ? "…" : counts.sponsors}
                  </div>
                </div>
                <div style={{ color: "#ff7b7b", fontSize: 12, marginTop: 8 }}>
                  Manage sponsors
                </div>
              </div>
            </div>

            <div style={{ marginTop: 12, padding: 8 }}>
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
