import { useEffect, useState } from "react";

import ApiKeys from "./components/ApiKeys";
import Analytics from "./components/Analytics";
import Sidebar from "./components/Sidebar";

import "./App.css";

const API_BASE_URL = "http://localhost:8080";
const API_KEY = "PAVAN-PRO-KEY";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const [stats, setStats] = useState({
    totalRequests: 0,
    successfulRequests: 0,
    blockedRequests: 0,
    unauthorizedRequests: 0,
    rateLimitedRequests: 0,
  });

  const [requests, setRequests] = useState([]);

  const [online, setOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem("smart-api-theme") === "dark"
    );
  });

  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  const fetchDashboardData = async () => {
    setLoading(true);

    try {
      const [statsResponse, recentResponse] =
        await Promise.all([
          fetch(`${API_BASE_URL}/api/usage/stats`, {
            headers: {
              "X-API-KEY": API_KEY,
              Accept: "application/json",
            },
          }),

          fetch(`${API_BASE_URL}/api/usage/recent`, {
            headers: {
              "X-API-KEY": API_KEY,
              Accept: "application/json",
            },
          }),
        ]);

      if (!statsResponse.ok) {
        throw new Error(
          `Stats request failed: ${statsResponse.status}`
        );
      }

      if (!recentResponse.ok) {
        throw new Error(
          `Recent usage request failed: ${recentResponse.status}`
        );
      }

      const statsData = await statsResponse.json();
      const recentData = await recentResponse.json();

      setStats({
        totalRequests: statsData.totalRequests ?? 0,
        successfulRequests:
          statsData.successfulRequests ?? 0,
        blockedRequests:
          statsData.blockedRequests ?? 0,
        unauthorizedRequests:
          statsData.unauthorizedRequests ?? 0,
        rateLimitedRequests:
          statsData.rateLimitedRequests ?? 0,
      });

      setRequests(
        Array.isArray(recentData)
          ? recentData
          : []
      );

      setOnline(true);
      setLastUpdated(new Date());
    } catch (error) {
      console.error(
        "Unable to connect to Smart API Guard:",
        error
      );

      setOnline(false);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD + AUTO REFRESH
  // =====================================================

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // =====================================================
  // THEME
  // =====================================================

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      darkMode
    );

    localStorage.setItem(
      "smart-api-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  // =====================================================
  // HELPERS
  // =====================================================

  const formatTime = (dateTime) => {
    if (!dateTime) {
      return "--:--:--";
    }

    const date = new Date(dateTime);

    if (Number.isNaN(date.getTime())) {
      return "--:--:--";
    }

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const getStatusClass = (status) => {
    if (status >= 200 && status < 300) {
      return "status-success";
    }

    if (status === 401) {
      return "status-unauthorized";
    }

    if (status === 429) {
      return "status-rate-limit";
    }

    return "status-error";
  };

  // =====================================================
  // DASHBOARD
  // =====================================================

  const renderDashboard = () => {
    return (
      <>
        <section className="welcome">
          <div>
            <span className="eyebrow">
              REAL-TIME API SECURITY
            </span>

            <h2>API Gateway Dashboard</h2>

            <p>
              Monitor traffic, authentication,
              rate limits and blocked requests
              from one place.
            </p>
          </div>

          <div className="welcome-actions">
            {lastUpdated && (
              <span className="updated-label">
                Updated {formatTime(lastUpdated)}
              </span>
            )}

            <button
              type="button"
              className={`refresh-button ${
                loading ? "refreshing" : ""
              }`}
              onClick={fetchDashboardData}
              disabled={loading}
            >
              <span>↻</span>

              {loading
                ? "Refreshing..."
                : "Refresh"}
            </button>
          </div>
        </section>

        {!online && !loading && (
          <div className="connection-error">
            <div className="error-icon">!</div>

            <div>
              <strong>
                Unable to connect to Smart API Guard
              </strong>

              <span>
                Make sure Spring Boot is running
                on port 8080.
              </span>
            </div>

            <button
              type="button"
              className="error-retry"
              onClick={fetchDashboardData}
            >
              Retry
            </button>
          </div>
        )}

        <section className="stats-grid">
          <div className="stat-card blue-card">
            <div className="stat-top">
              <div className="stat-icon">↗</div>
              <span className="trend">LIVE</span>
            </div>

            <span className="stat-label">
              Total Requests
            </span>

            <strong>
              {stats.totalRequests}
            </strong>

            <div className="stat-bottom">
              <div className="stat-line"></div>
              <div className="stat-live-dot"></div>
            </div>

            <div className="stat-glow"></div>
          </div>

          <div className="stat-card green-card">
            <div className="stat-top">
              <div className="stat-icon">✓</div>
              <span className="trend">
                HEALTHY
              </span>
            </div>

            <span className="stat-label">
              Successful Requests
            </span>

            <strong>
              {stats.successfulRequests}
            </strong>

            <div className="stat-bottom">
              <div className="stat-line"></div>
              <div className="stat-live-dot"></div>
            </div>

            <div className="stat-glow"></div>
          </div>

          <div className="stat-card orange-card">
            <div className="stat-top">
              <div className="stat-icon">!</div>
              <span className="trend">
                BLOCKED
              </span>
            </div>

            <span className="stat-label">
              Blocked Requests
            </span>

            <strong>
              {stats.blockedRequests}
            </strong>

            <div className="stat-bottom">
              <div className="stat-line"></div>
              <div className="stat-live-dot"></div>
            </div>

            <div className="stat-glow"></div>
          </div>

          <div className="stat-card red-card">
            <div className="stat-top">
              <div className="stat-icon">🔒</div>
              <span className="trend">
                SECURITY
              </span>
            </div>

            <span className="stat-label">
              Unauthorized
            </span>

            <strong>
              {stats.unauthorizedRequests}
            </strong>

            <div className="stat-bottom">
              <div className="stat-line"></div>
              <div className="stat-live-dot"></div>
            </div>

            <div className="stat-glow"></div>
          </div>

          <div className="stat-card purple-card">
            <div className="stat-top">
              <div className="stat-icon">⚡</div>
              <span className="trend">
                LIMIT
              </span>
            </div>

            <span className="stat-label">
              Rate Limited
            </span>

            <strong>
              {stats.rateLimitedRequests}
            </strong>

            <div className="stat-bottom">
              <div className="stat-line"></div>
              <div className="stat-live-dot"></div>
            </div>

            <div className="stat-glow"></div>
          </div>
        </section>

        <section className="activity-section">
          <div className="section-header">
            <div>
              <span className="live-label">
                <span className="live-dot"></span>
                LIVE ACTIVITY
              </span>

              <h2>Recent API Requests</h2>

              <p>
                Latest requests processed
                by the gateway
              </p>
            </div>

            <div className="request-count">
              <strong>{requests.length}</strong>
              requests
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>TIME</th>
                  <th>API KEY</th>
                  <th>ENDPOINT</th>
                  <th>STATUS</th>
                  <th>ACCESS</th>
                </tr>
              </thead>

              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="empty-state"
                    >
                      <div className="empty-icon">
                        ◌
                      </div>

                      <strong>
                        No API requests found
                      </strong>

                      <span>
                        Requests will appear here
                        when traffic is received.
                      </span>
                    </td>
                  </tr>
                ) : (
                  requests.map((request) => (
                    <tr key={request.id}>
                      <td className="request-time">
                        {formatTime(
                          request.createdAt
                        )}
                      </td>

                      <td>
                        <code>
                          {request.apiKey || "—"}
                        </code>
                      </td>

                      <td>
                        <code className="endpoint">
                          {request.endpoint || "—"}
                        </code>
                      </td>

                      <td>
                        <div className="status-wrapper">
                          <span
                            className={`status-badge ${getStatusClass(
                              request.httpStatus
                            )}`}
                          >
                            {request.httpStatus}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span
                          className={
                            request.allowed
                              ? "access-allowed"
                              : "access-blocked"
                          }
                        >
                          <span></span>

                          {request.allowed
                            ? "Allowed"
                            : "Blocked"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <Analytics />
      </>
    );
  };

  // =====================================================
  // API KEYS
  // =====================================================

  const renderApiKeys = () => {
    return <ApiKeys />;
  };

  // =====================================================
  // REQUESTS
  // =====================================================

  const renderRequests = () => {
    return (
      <section className="requests-page">
        <div className="page-section-heading">
          <div>
            <span className="eyebrow">
              API MONITORING
            </span>

            <h2>All API Requests</h2>

            <p>
              Complete request activity
              processed through Smart API Guard.
            </p>
          </div>

          <div className="request-count">
            <strong>{requests.length}</strong>
            requests
          </div>
        </div>

        <div className="activity-section">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>TIME</th>
                  <th>API KEY</th>
                  <th>ENDPOINT</th>
                  <th>STATUS</th>
                  <th>ACCESS</th>
                </tr>
              </thead>

              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="empty-state"
                    >
                      No requests recorded yet.
                    </td>
                  </tr>
                ) : (
                  requests.map((request) => (
                    <tr key={request.id}>
                      <td className="request-time">
                        {formatTime(
                          request.createdAt
                        )}
                      </td>

                      <td>
                        <code>
                          {request.apiKey || "—"}
                        </code>
                      </td>

                      <td>
                        <code className="endpoint">
                          {request.endpoint || "—"}
                        </code>
                      </td>

                      <td>
                        <span
                          className={`status-badge ${getStatusClass(
                            request.httpStatus
                          )}`}
                        >
                          {request.httpStatus}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            request.allowed
                              ? "access-allowed"
                              : "access-blocked"
                          }
                        >
                          <span></span>

                          {request.allowed
                            ? "Allowed"
                            : "Blocked"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  };

  // =====================================================
  // ANALYTICS
  // =====================================================

  const renderAnalytics = () => {
    return (
      <section className="analytics-page">
        <Analytics />
      </section>
    );
  };

  // =====================================================
  // PAGE ROUTER
  // =====================================================

  const renderActivePage = () => {
    switch (activePage) {
      case "keys":
        return renderApiKeys();

      case "requests":
        return renderRequests();

      case "analytics":
        return renderAnalytics();

      case "dashboard":
      default:
        return renderDashboard();
    }
  };

  // =====================================================
  // APP
  // =====================================================

  return (
    <div className="app-layout">
      <div className="ambient ambient-one"></div>
      <div className="ambient ambient-two"></div>

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="main-content">
        <header className="topbar">
          <div className="topbar-title">
            <div className="breadcrumb">
              SECURITY / MONITORING
            </div>

            <h1>
              {activePage === "dashboard" &&
                "API Gateway"}

              {activePage === "keys" &&
                "API Keys"}

              {activePage === "requests" &&
                "Request Monitor"}

              {activePage === "analytics" &&
                "Analytics"}
            </h1>
          </div>

          <div className="topbar-right">
            <div
              className={`connection ${
                online
                  ? "online"
                  : "offline"
              }`}
            >
              <span></span>

              {online
                ? "API Online"
                : "API Offline"}
            </div>

            <button
              type="button"
              className="theme-toggle"
              onClick={() =>
                setDarkMode(
                  (value) => !value
                )
              }
              aria-label="Toggle theme"
            >
              <span
                className={
                  darkMode
                    ? "sun"
                    : "moon"
                }
              >
                {darkMode ? "☀" : "☾"}
              </span>
            </button>

            <div className="avatar">P</div>
          </div>
        </header>

        <main
          className={`page page-${activePage}`}
        >
          {renderActivePage()}

          <footer className="dashboard-footer">
            <span>
              <span className="footer-status"></span>

              Smart API Guard · Monitoring active
            </span>

            {lastUpdated && (
              <span>
                Last updated{" "}
                {formatTime(lastUpdated)}
              </span>
            )}
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
