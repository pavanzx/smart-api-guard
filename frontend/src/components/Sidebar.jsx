

function Sidebar({
  activePage,
  setActivePage,
  online,
}) {
  const items = [
    {
      id: "dashboard",
      icon: "𓃑",
      label: "Dashboard",
      description: "Overview",
    },
    {
      id: "keys",
      icon: "🔑",
      label: "API Keys",
      description: "Access control",
    },
    {
      id: "requests",
      icon: "🕸️",
      label: "Requests",
      description: "API traffic",
    },
    {
      id: "analytics",
      icon: "🧩",
      label: "Analytics",
      description: "Performance",
    },
  ];

  return (
    <aside className="sidebar">

      {/* ================================================
          BRAND
      ================================================= */}

      <div className="sidebar-top">

        <div className="brand">

          <div className="brand-logo">
            <span>𓃦</span>
          </div>

          <div className="brand-copy">
            <strong>
              Smart API Guard
            </strong>

            <small>
              API Security Platform
            </small>
          </div>

        </div>

        {/* ==============================================
            SECTION TITLE
        ============================================== */}

        <div className="sidebar-section-title">
          PLATFORM
        </div>

        {/* ==============================================
            NAVIGATION
        ============================================== */}

        <nav className="sidebar-nav">

          {items.map((item) => {
            const isActive =
              activePage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                className={
                  isActive
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() =>
                  setActivePage(item.id)
                }
                aria-current={
                  isActive
                    ? "page"
                    : undefined
                }
              >

                <span className="nav-icon">
                  {item.icon}
                </span>

                <span className="nav-content">

                  <span className="nav-label">
                    {item.label}
                  </span>

                  <span className="nav-description">
                    {item.description}
                  </span>

                </span>

                <span className="nav-active-indicator" />

              </button>
            );
          })}

        </nav>

      </div>

      {/* ================================================
          BOTTOM STATUS
      ================================================= */}

      <div className="sidebar-bottom">

        <div className="system-status">

          {/* DYNAMIC STATUS DOT */}
          <span
            className={`system-dot ${
              online
                ? "online"
                : "offline"
            }`}
          />

          <div className="system-copy">

            <strong>
              {online
                ? "API Online"
                : "API Offline"}
            </strong>

            <small>
              localhost:8080
            </small>

          </div>

          {/* ONLY SHOW PULSE WHEN ONLINE */}
          {online && (
            <span className="status-pulse" />
          )}

        </div>

        <div className="version">
          SMART API GUARD&nbsp;&nbsp;·&nbsp;&nbsp;v1.0.0
        </div>

      </div>

    </aside>
  );
}

export default Sidebar;