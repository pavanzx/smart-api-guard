function Sidebar({ activePage, setActivePage }) {
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

      {/* BRAND */}
      <div className="sidebar-top">

        <div className="brand">

          <div className="brand-logo">
            <span>𓃦</span>
          </div>

          <div className="brand-copy">
            <strong>Smart API Guard</strong>
            <small>API Security Platform</small>
          </div>

        </div>

        {/* SECTION TITLE */}
        <div className="sidebar-section-title">
          PLATFORM
        </div>

        {/* NAVIGATION */}
        <nav className="sidebar-nav">

          {items.map((item) => (

            <button
              key={item.id}
              type="button"
              className={
                activePage === item.id
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() => setActivePage(item.id)}
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

              <span className="nav-active-indicator"></span>

            </button>

          ))}

        </nav>

      </div>

      {/* BOTTOM */}
      <div className="sidebar-bottom">

        <div className="system-status">

          <span className="system-dot"></span>

          <div className="system-copy">
            <strong>API Online</strong>
            <small>localhost:8080</small>
          </div>

          <span className="status-pulse"></span>

        </div>

        <div className="version">
          SMART API GUARD&nbsp;&nbsp;·&nbsp;&nbsp;v1.0.0
        </div>

      </div>

    </aside>
  );
}

export default Sidebar;     