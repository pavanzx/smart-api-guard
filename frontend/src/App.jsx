import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import ApiKeys from "./components/ApiKeys";
import Analytics from "./components/Analytics";
import Sidebar from "./components/Sidebar";
import AnimatedBackground from "./components/AnimatedBackground";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import RequestTable from "./components/RequestTable";
import DashboardIntro from "./components/DashboardIntro";
import PlatformGuide from "./components/PlatformGuide";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";


import "./App.css";

/* =====================================================
   CONFIG
===================================================== */

const API_BASE_URL = "";

const INITIAL_STATS = {
  totalRequests: 0,
  successfulRequests: 0,
  blockedRequests: 0,
  unauthorizedRequests: 0,
  rateLimitedRequests: 0,
};

/* =====================================================
   SCROLL PATH WOLF
===================================================== */

function SecurityPath() {
  const sectionRef = useRef(null);
  const pathRef = useRef(null);
  const wolfRef = useRef(null);

  const animationFrameRef = useRef(null);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);

  const [progress, setProgress] = useState(0);
  const [pathReady, setPathReady] = useState(false);

  const protectionSteps = [
    {
      id: "authentication",
      label: "AUTHENTICATION",
      position: 0.22,
    },
    {
      id: "api-keys",
      label: "API KEYS",
      position: 0.43,
    },
    {
      id: "rate-limit",
      label: "RATE LIMIT",
      position: 0.64,
    },
    {
      id: "monitor",
      label: "REQUEST MONITOR",
      position: 0.82,
    },
  ];

  /* ===================================================
     GET SCROLL PROGRESS
  =================================================== */
const updateTargetProgress = useCallback(() => {
  if (!sectionRef.current) return;

  const rect =
    sectionRef.current.getBoundingClientRect();

  const viewportHeight = window.innerHeight;

  // Start only when the section is properly visible
  const startOffset =
    viewportHeight * 0.95;

  // End near the destination
  const endOffset =
    viewportHeight * 0.75;

  const start =
    viewportHeight - startOffset;

  const end =
    -rect.height + endOffset;

  const travelDistance =
    start - end;

  const travelled =
    start - rect.top;

  let nextProgress =
    travelled /
    Math.max(travelDistance, 1);

  nextProgress = Math.max(
    0,
    Math.min(1, nextProgress)
  );

  targetProgressRef.current =
    nextProgress;
}, []);
  /* ===================================================
     SMOOTH WOLF MOTION
  =================================================== */

  useEffect(() => {
    const animate = () => {
      const target =
        targetProgressRef.current;

      const current =
        currentProgressRef.current;

      const difference =
        target - current;

      let next =
        current + difference * 0.115;

      if (Math.abs(difference) < 0.00035) {
        next = target;
      }

      currentProgressRef.current = next;

      setProgress(next);

      animationFrameRef.current =
        requestAnimationFrame(animate);
    };

    animationFrameRef.current =
      requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(
          animationFrameRef.current
        );
      }
    };
  }, []);

  /* ===================================================
     SCROLL LISTENER
  =================================================== */

  useEffect(() => {
    updateTargetProgress();

    const handleScroll = () => {
      updateTargetProgress();
    };

    const handleResize = () => {
      updateTargetProgress();
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );

      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, [updateTargetProgress]);

  /* ===================================================
     SVG PATH → EXACT 𓃦 POSITION
  =================================================== */

  useEffect(() => {
    if (!pathRef.current) return;

    const path = pathRef.current;

    let totalLength = 0;

    try {
      totalLength =
        path.getTotalLength();
    } catch {
      return;
    }

    if (!totalLength) return;

    setPathReady(true);

    const point =
      path.getPointAtLength(
        totalLength * progress
      );

    const aheadProgress =
      Math.min(
        progress + 0.003,
        1
      );

    const ahead =
      path.getPointAtLength(
        totalLength * aheadProgress
      );

    const dx =
      ahead.x - point.x;

    const dy =
      ahead.y - point.y;

    const angle =
      Math.atan2(dy, dx) *
      (180 / Math.PI);

    if (wolfRef.current) {
      wolfRef.current.style.left =
        `${point.x}px`;

      wolfRef.current.style.top =
        `${point.y}px`;

      const facing =
        dx >= 0 ? 1 : -1;

      wolfRef.current.style.transform =
        `translate(-50%, -50%) rotate(${angle * 0.15}deg) scaleX(${facing})`;
    }
  }, [progress, pathReady]);

  return (
    <section
      ref={sectionRef}
      className="security-path-section"
    >
      {/* =================================================
          PATH HEADER
      ================================================= */}

      <div className="security-path-heading">
        <span className="security-path-eyebrow">
          SECURITY FLOW
        </span>

        <h2>
          Every request passes
          <br />
          through a layer of protection.
        </h2>

        <p>
          Scroll through the security architecture.
          The guard follows the same path your request
          takes through the gateway.
        </p>
      </div>

      {/* =================================================
          PATH CANVAS
      ================================================= */}

      <div className="security-path-canvas">

        <svg
          className="security-path-svg"
          viewBox="0 0 1000 900"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="securityPathGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor="#536dff"
                stopOpacity="0.25"
              />

              <stop
                offset="48%"
                stopColor="#7188ff"
                stopOpacity="0.95"
              />

              <stop
                offset="100%"
                stopColor="#69d9ff"
                stopOpacity="0.5"
              />
            </linearGradient>

            <filter
              id="pathGlow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur
                stdDeviation="5"
                result="blur"
              />

              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* subtle under-glow */}

          <path
            d="
              M 70 80
              C 170 100,
                120 230,
                260 270
              C 420 315,
                570 190,
                620 350
              C 670 510,
                420 535,
                540 650
              C 650 760,
                830 690,
                930 820
            "
            className="security-path-glow"
          />

          {/* main path */}

          <path
            ref={pathRef}
            d="
              M 70 80
              C 170 100,
                120 230,
                260 270
              C 420 315,
                570 190,
                620 350
              C 670 510,
                420 535,
                540 650
              C 650 760,
                830 690,
                930 820
            "
            className="security-path-line"
            pathLength="1"
          />
        </svg>

        {/* =================================================
            START DOT
        ================================================= */}

        <div
          className="security-path-dot security-path-start"
          aria-hidden="true"
        />

        {/* =================================================
            END DOT
        ================================================= */}

        <div
          className="security-path-dot security-path-end"
          aria-hidden="true"
        />

        {/* =================================================
            𓃦 SCROLL PATH GUARD
        ================================================= */}

        <div
          ref={wolfRef}
          className="scroll-path-wolf"
          aria-hidden="true"
        >
          <div className="scroll-wolf-aura" />

          <div className="scroll-wolf-energy-ring" />

          {/* =================================================
              SVG REMOVED

              CUSTOM 𓃦 CHARACTER
          ================================================= */}

          <span className="scroll-wolf-glyph">
            𓃦
          </span>

          <div className="scroll-wolf-core" />
        </div>

        {/* =================================================
            STEP MARKERS
        ================================================= */}

        {protectionSteps.map((step) => {
          const active =
            progress >= step.position;

          return (
            <div
              key={step.id}
              className={`security-step security-step-${step.id} ${
                active
                  ? "security-step-active"
                  : ""
              }`}
            >
              <span className="security-step-point" />

              <span className="security-step-label">
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* =================================================
          NAVIGATION
      ================================================= */}

      <div className="dashboard-page-navigation">

        <button
          type="button"
          onClick={() =>
            document
              .querySelector(".page-dashboard")
              ?.scrollIntoView({
                behavior: "smooth",
              })
          }
        >
          <span className="nav-number">
            01
          </span>

          <span>
            Dashboard
          </span>

          <b>→</b>
        </button>

        <button
          type="button"
          onClick={() =>
            document
              .querySelector(".page-keys")
              ?.scrollIntoView({
                behavior: "smooth",
              })
          }
        >
          <span className="nav-number">
            02
          </span>

          <span>
            API Keys
          </span>

          <b>→</b>
        </button>

        <button
          type="button"
          onClick={() =>
            document
              .querySelector(".page-requests")
              ?.scrollIntoView({
                behavior: "smooth",
              })
          }
        >
          <span className="nav-number">
            03
          </span>

          <span>
            Request Monitor
          </span>

          <b>→</b>
        </button>

        <button
          type="button"
          onClick={() =>
            document
              .querySelector(".page-analytics")
              ?.scrollIntoView({
                behavior: "smooth",
              })
          }
        >
          <span className="nav-number">
            04
          </span>

          <span>
            Analytics
          </span>

          <b>→</b>
        </button>
      </div>
    </section>
  );
}

/* =====================================================
   APP
===================================================== */

function App() {
  /* ===================================================
     SCREEN
  =================================================== */

  const [appScreen, setAppScreen] = useState(() => {
    return (
      localStorage.getItem(
        "smart-api-authenticated"
      ) === "true"
    )
      ? "dashboard"
      : "home";
  });

  const [activePage, setActivePage] =
    useState("dashboard");

  /* ===================================================
     DASHBOARD ARRIVAL
  =================================================== */

  const [
    showDashboardArrival,
    setShowDashboardArrival,
  ] = useState(false);

  /* ===================================================
     DASHBOARD STATE
  =================================================== */

  const [stats, setStats] =
    useState(INITIAL_STATS);

  const [requests, setRequests] =
    useState([]);

  const [online, setOnline] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [lastUpdated, setLastUpdated] =
    useState(null);

  /* ===================================================
     THEME
  =================================================== */

  const [darkMode, setDarkMode] =
    useState(() => {
      return (
        localStorage.getItem(
          "smart-api-theme"
        ) === "dark"
      );
    });

  /* ===================================================
     LOGIN → DASHBOARD
  =================================================== */

  const handleAuthenticated =
    useCallback(() => {
      localStorage.setItem(
        "smart-api-authenticated",
        "true"
      );

      setActivePage("dashboard");

      setAppScreen("dashboard");

      setShowDashboardArrival(true);

      const timer = setTimeout(() => {
        setShowDashboardArrival(false);
      }, 900);

      return () => clearTimeout(timer);
    }, []);

  /* ===================================================
     LOGOUT
  =================================================== */

  const handleLogout =
    useCallback(() => {
      localStorage.removeItem(
        "smart-api-authenticated"
      );

      setAppScreen("home");
      setActivePage("dashboard");
      setOnline(false);
      setShowDashboardArrival(false);
    }, []);

  /* ===================================================
     FETCH DASHBOARD DATA
  =================================================== */

  const fetchDashboardData =
    useCallback(async () => {
      setLoading(true);

      /* -----------------------------------------------
         HEALTH CHECK
      ----------------------------------------------- */

      try {
        const healthResponse =
          await fetch(
            `${API_BASE_URL}/api/keys`,
            {
              method: "GET",
              headers: {
                "X-API-KEY": API_KEY,
                Accept:
                  "application/json",
              },
            }
          );

        if (!healthResponse.ok) {
          throw new Error(
            `Backend health check failed: ${healthResponse.status}`
          );
        }

        setOnline(true);
      } catch (error) {
        console.error(
          "Smart API Guard health check failed:",
          error
        );

        setOnline(false);
        setLoading(false);

        return;
      }

      /* -----------------------------------------------
         STATS
      ----------------------------------------------- */

      try {
        const statsResponse =
          await fetch(
            `${API_BASE_URL}/api/usage/stats`,
            {
              method: "GET",
              headers: {
                "X-API-KEY": API_KEY,
                Accept:
                  "application/json",
              },
            }
          );

        if (!statsResponse.ok) {
          console.warn(
            `Stats endpoint returned ${statsResponse.status}`
          );
        } else {
          const statsData =
            await statsResponse.json();

          setStats({
            totalRequests:
              statsData.totalRequests ??
              0,

            successfulRequests:
              statsData.successfulRequests ??
              0,

            blockedRequests:
              statsData.blockedRequests ??
              0,

            unauthorizedRequests:
              statsData.unauthorizedRequests ??
              0,

            rateLimitedRequests:
              statsData.rateLimitedRequests ??
              0,
          });
        }
      } catch (error) {
        console.warn(
          "Unable to load usage statistics:",
          error
        );
      }

      /* -----------------------------------------------
         RECENT REQUESTS
      ----------------------------------------------- */

      try {
        const recentResponse =
          await fetch(
            `${API_BASE_URL}/api/usage/recent`,
            {
              method: "GET",
              headers: {
                "X-API-KEY": API_KEY,
                Accept:
                  "application/json",
              },
            }
          );

        if (!recentResponse.ok) {
          console.warn(
            `Recent endpoint returned ${recentResponse.status}`
          );
        } else {
          const recentData =
            await recentResponse.json();

          setRequests(
            Array.isArray(recentData)
              ? recentData
              : []
          );
        }
      } catch (error) {
        console.warn(
          "Unable to load recent requests:",
          error
        );
      }

      setOnline(true);
      setLastUpdated(new Date());
      setLoading(false);
    }, []);

  /* ===================================================
     AUTO REFRESH
  =================================================== */

  useEffect(() => {
    if (appScreen !== "dashboard") {
      return undefined;
    }

    let cancelled = false;
    let timeoutId = null;

    const refresh = async () => {
      if (cancelled) return;

      await fetchDashboardData();

      if (!cancelled) {
        timeoutId =
          setTimeout(
            refresh,
            5000
          );
      }
    };

    refresh();

    return () => {
      cancelled = true;

      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [
    appScreen,
    fetchDashboardData,
  ]);

  /* ===================================================
     THEME
  =================================================== */

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      darkMode
    );

    localStorage.setItem(
      "smart-api-theme",
      darkMode
        ? "dark"
        : "light"
    );
  }, [darkMode]);

  /* ===================================================
     HELPERS
  =================================================== */

  const formatTime = (dateTime) => {
    if (!dateTime) {
      return "--:--:--";
    }

    const date =
      new Date(dateTime);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "--:--:--";
    }

    return date.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }
    );
  };

  const getStatusClass = (
    status
  ) => {
    const code =
      Number(status);

    if (
      code >= 200 &&
      code < 300
    ) {
      return "status-success";
    }

    if (
      code === 401 ||
      code === 403
    ) {
      return "status-unauthorized";
    }

    if (code === 429) {
      return "status-rate-limit";
    }

    return "status-error";
  };

  /* ===================================================
     STAT CARD
  =================================================== */

  const renderStatCard = ({
    cardClass,
    icon,
    trend,
    label,
    value,
  }) => {
    return (
      <div
        className={`stat-card ${cardClass}`}
      >
        <div className="stat-top">
          <div className="stat-icon">
            {icon}
          </div>

          <span className="trend">
            {trend}
          </span>
        </div>

        <span className="stat-label">
          {label}
        </span>

        <strong>
          {value}
        </strong>

        <div className="stat-bottom">
          <div className="stat-line" />

          <div className="stat-live-dot" />
        </div>

        <div className="stat-glow" />
      </div>
    );
  };

  /* ===================================================
     DASHBOARD
  =================================================== */

  const renderDashboard = () => {
    return (
      <>
        <DashboardIntro />

        <SecurityPath />

        <PlatformGuide />

        {/* =================================================
            API GATEWAY
        ================================================= */}

        <section className="welcome">
          <div>
            <span className="eyebrow">
              REAL-TIME API SECURITY
            </span>

            <h2>
              API Gateway Dashboard
            </h2>

            <p>
              Monitor gateway health,
              authentication, rate limits
              and security activity from
              one protected control layer.
            </p>
          </div>

          <div className="welcome-actions">
            {lastUpdated && (
              <span className="updated-label">
                Updated{" "}
                {formatTime(
                  lastUpdated
                )}
              </span>
            )}

            <button
              type="button"
              className={`refresh-button ${
                loading
                  ? "refreshing"
                  : ""
              }`}
              onClick={
                fetchDashboardData
              }
              disabled={loading}
            >
              <span>↻</span>

              {loading
                ? "Refreshing..."
                : "Refresh"}
            </button>
          </div>
        </section>

        {/* =================================================
            CONNECTION ERROR
        ================================================= */}

        {!online &&
          !loading && (
            <div className="connection-error">
              <div className="error-icon">
                !
              </div>

              <div>
                <strong>
                  Unable to connect to
                  Smart API Guard
                </strong>

                <span>
                  Make sure Spring Boot
                  is running on port 8080.
                </span>
              </div>

              <button
                type="button"
                className="error-retry"
                onClick={
                  fetchDashboardData
                }
              >
                Retry
              </button>
            </div>
          )}

        {/* =================================================
            STATISTICS
        ================================================= */}

        <section className="stats-grid">
          {renderStatCard({
            cardClass:
              "blue-card",
            icon: "↗",
            trend: "LIVE",
            label:
              "Total Requests",
            value:
              stats.totalRequests,
          })}

          {renderStatCard({
            cardClass:
              "green-card",
            icon: "✓",
            trend:
              "HEALTHY",
            label:
              "Successful Requests",
            value:
              stats.successfulRequests,
          })}

          {renderStatCard({
            cardClass:
              "orange-card",
            icon: "!",
            trend:
              "BLOCKED",
            label:
              "Blocked Requests",
            value:
              stats.blockedRequests,
          })}

          {renderStatCard({
            cardClass:
              "red-card",
            icon: "🔒",
            trend:
              "SECURITY",
            label:
              "Unauthorized",
            value:
              stats.unauthorizedRequests,
          })}

          {renderStatCard({
            cardClass:
              "purple-card",
            icon: "⚡",
            trend:
              "LIMIT",
            label:
              "Rate Limited",
            value:
              stats.rateLimitedRequests,
          })}
        </section>

        {/* =================================================
            DASHBOARD NAVIGATION
        ================================================= */}

        <section className="dashboard-command-navigation">

          <div className="command-navigation-header">
            <span className="eyebrow">
              SECURITY MODULES
            </span>

            <h2>
              Explore the security
              control layer.
            </h2>

            <p>
              Open a dedicated workspace
              for deeper inspection.
            </p>
          </div>

          <div className="command-navigation-grid">

            <button
              type="button"
              className="command-navigation-card"
              onClick={() =>
                setActivePage(
                  "keys"
                )
              }
            >
              <span className="command-card-number">
                01
              </span>

              <div>
                <strong>
                  API Keys
                </strong>

                <span>
                  Manage credentials
                  and secure access.
                </span>
              </div>

              <b>→</b>
            </button>

            <button
              type="button"
              className="command-navigation-card"
              onClick={() =>
                setActivePage(
                  "requests"
                )
              }
            >
              <span className="command-card-number">
                02
              </span>

              <div>
                <strong>
                  Request Monitor
                </strong>

                <span>
                  Inspect live gateway
                  traffic and decisions.
                </span>
              </div>

              <b>→</b>
            </button>

            <button
              type="button"
              className="command-navigation-card"
              onClick={() =>
                setActivePage(
                  "analytics"
                )
              }
            >
              <span className="command-card-number">
                03
              </span>

              <div>
                <strong>
                  Analytics
                </strong>

                <span>
                  Understand API traffic
                  and security patterns.
                </span>
              </div>

              <b>→</b>
            </button>

          </div>
        </section>

        <Footer />
      </>
    );
  };

  /* ===================================================
     API KEYS
  =================================================== */

  const renderApiKeys = () => {
    return <ApiKeys />;
  };

  /* ===================================================
     REQUEST MONITOR
  =================================================== */

  const renderRequests = () => {
    return (
      <section className="requests-page">
        <div className="section-header">
          <div>
            <span className="live-label">
              <span className="live-dot" />
              LIVE ACTIVITY
            </span>

            <h2>
              Request Monitor
            </h2>

            <p>
              Latest requests processed
              by the gateway
            </p>
          </div>

          <div className="request-count">
            <strong>
              {requests.length}
            </strong>

            requests
          </div>
        </div>

        <RequestTable
          requests={requests}
          formatTime={formatTime}
          getStatusClass={
            getStatusClass
          }
        />
      </section>
    );
  };

  /* ===================================================
     ANALYTICS
  =================================================== */

  const renderAnalytics = () => {
    return (
      <section className="analytics-page">
        <Analytics />
      </section>
    );
  };

  /* ===================================================
     PAGE ROUTER
  =================================================== */

  const renderActivePage =
    () => {
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

  /* ===================================================
     HOME
  =================================================== */

  if (
    appScreen === "home"
  ) {
    return (
      <LandingPage
        onGetStarted={() => {
          setAppScreen(
            "auth"
          );
        }}
      />
    );
  }

  /* ===================================================
     AUTH
  =================================================== */

  if (
    appScreen === "auth"
  ) {
    return (
      <AuthPage
        onBack={() => {
          setAppScreen(
            "home"
          );
        }}
        onAuthenticated={
          handleAuthenticated
        }
      />
    );
  }

  /* ===================================================
     DASHBOARD
  =================================================== */

  return (
    <>
      <div className="app-layout">

        <AnimatedBackground
          page={activePage}
        />

        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />

        {/* SIDEBAR */}

        <Sidebar
          activePage={
            activePage
          }
          setActivePage={
            setActivePage
          }
          online={online}
        />

        {/* MAIN CONTENT */}

        <div className="main-content">

          {/* TOPBAR */}

          <header className="topbar">

            <div className="topbar-title">
              <div className="breadcrumb">
                SECURITY / MONITORING
              </div>

              <h1>
                {activePage ===
                  "dashboard" &&
                  "API Gateway"}

                {activePage ===
                  "keys" &&
                  "API Keys"}

                {activePage ===
                  "requests" &&
                  "Request Monitor"}

                {activePage ===
                  "analytics" &&
                  "Analytics"}
              </h1>
            </div>

            <div className="topbar-right">

              {/* CONNECTION */}

              <div
                className={`connection ${
                  online
                    ? "online"
                    : "offline"
                }`}
              >
                <span />

                {online
                  ? "API Online"
                  : "API Offline"}
              </div>

              {/* THEME */}

              <button
                type="button"
                className="theme-toggle"
                onClick={() =>
                  setDarkMode(
                    (value) =>
                      !value
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
                  {darkMode
                    ? "☀"
                    : "☾"}
                </span>
              </button>

              {/* AVATAR */}

              <div className="avatar">
                P
              </div>

              {/* LOGOUT */}

              <button
                type="button"
                className="logout-button"
                onClick={
                  handleLogout
                }
                title="Logout"
                aria-label="Logout"
              >
                ⎋
              </button>
            </div>
          </header>

          {/* ACTIVE PAGE */}

          <main
            className={`page page-${activePage}`}
          >
            <PageTransition
              pageKey={
                activePage
              }
            >
              {renderActivePage()}
            </PageTransition>

            {/* DASHBOARD FOOTER */}

            <footer className="dashboard-footer">
              <span>
                <span className="footer-status" />

                Smart API Guard ·
                Monitoring active
              </span>

              {lastUpdated && (
                <span>
                  Last updated{" "}
                  {formatTime(
                    lastUpdated
                  )}
                </span>
              )}
            </footer>
          </main>
        </div>
      </div>

      {/* =================================================
          0.9 SECOND 𓃦 ARRIVAL
      ================================================= */}

      {showDashboardArrival && (
        <div
          className="dashboard-arrival"
          aria-hidden="true"
        >

          {/* Dashboard cover */}

          <div className="arrival-cover" />

          {/* Blue reveal line */}

          <div className="arrival-reveal-line" />

          {/* 𓃦 */}

          <div className="arrival-wolf">

            <div className="arrival-wolf-aura" />

            <span>
              𓃦
            </span>

          </div>
        </div>
      )}

      {/* =================================================
          OVERRIDE CSS
      ================================================= */}

      <style>{`

        /* =================================================
           DASHBOARD ARRIVAL
        ================================================= */

        .dashboard-arrival {
          position: fixed;
          inset: 0;
          z-index: 9999999;
          overflow: hidden;
          pointer-events: all;
          background: #050914;
        }

        .arrival-cover {
          position: absolute;
          inset: 0;
          z-index: 1;

          background:
            linear-gradient(
              110deg,
              #03050b 0%,
              #071020 48%,
              #0a1630 72%,
              rgba(10,22,48,0.72) 88%,
              transparent 100%
            );

          transform: translateX(0);

          animation:
            arrivalCoverReveal
            0.9s
            cubic-bezier(
              0.22,
              0.76,
              0.18,
              1
            )
            forwards;
        }

        .arrival-wolf {
          position: absolute;
          z-index: 20;

          left: -180px;
          top: 50%;

          width: 250px;
          height: 250px;

          display: grid;
          place-items: center;

          color: #f1f5ff;

          filter:
            drop-shadow(
              0 0 8px
              rgba(105,140,255,0.95)
            )
            drop-shadow(
              0 0 28px
              rgba(70,105,255,0.62)
            );

          animation:
            arrivalWolfRun
            0.9s
            cubic-bezier(
              0.18,
              0.82,
              0.18,
              1
            )
            forwards;
        }

        .arrival-wolf span {
          position: relative;
          z-index: 4;

          display: block;

          font-family:
            "Times New Roman",
            serif;

          font-size: 210px;
          line-height: 1;

          color: #edf2ff;

          transform:
            scaleX(-1);

          text-shadow:
            0 0 8px
            rgba(210,220,255,0.9),
            0 0 20px
            rgba(100,130,255,0.75),
            0 0 50px
            rgba(65,95,255,0.45);
        }

        .arrival-wolf-aura {
          position: absolute;

          width: 220px;
          height: 220px;

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(
                76,
                112,
                255,
                0.32
              ) 0%,
              rgba(
                76,
                112,
                255,
                0.14
              ) 30%,
              transparent 72%
            );

          filter: blur(10px);

          transform:
            scale(0.72);

          animation:
            arrivalAura
            0.9s
            ease-out
            forwards;
        }

        .arrival-reveal-line {
          position: absolute;
          z-index: 15;

          top: 0;
          bottom: 0;
          left: 0;

          width: 3px;

          background:
            linear-gradient(
              180deg,
              transparent,
              rgba(
                120,
                150,
                255,
                0.95
              ),
              transparent
            );

          box-shadow:
            0 0 18px
            rgba(
              95,
              130,
              255,
              0.9
            ),
            0 0 45px
            rgba(
              65,
              100,
              255,
              0.55
            );

          animation:
            arrivalLine
            0.9s
            cubic-bezier(
              0.2,
              0.8,
              0.15,
              1
            )
            forwards;
        }

        @keyframes arrivalWolfRun {

          0% {
            left: -190px;
            transform:
              translateY(-50%)
              scale(0.78);
          }

          12% {
            left: 8%;
            transform:
              translateY(-50%)
              scale(0.94);
          }

          50% {
            left: 51%;
            transform:
              translate(-50%, -50%)
              scale(1.08);
          }

          62% {
            left: 59%;
            transform:
              translate(-50%, -50%)
              scale(1.03);
          }

          100% {
            left: calc(100% + 190px);
            transform:
              translateY(-50%)
              scale(0.82);
          }
        }

        @keyframes arrivalCoverReveal {

          0% {
            transform:
              translateX(0);
          }

          45% {
            transform:
              translateX(38%);
          }

          100% {
            transform:
              translateX(108%);
          }
        }

        @keyframes arrivalLine {

          0% {
            left: 0;
            opacity: 0;
          }

          10% {
            opacity: 1;
          }

          100% {
            left: 100%;
            opacity: 0;
          }
        }

        @keyframes arrivalAura {

          0% {
            opacity: 0;
            transform:
              scale(0.55);
          }

          18% {
            opacity: 0.65;
            transform:
              scale(0.9);
          }

          50% {
            opacity: 0.9;
            transform:
              scale(1.08);
          }

          100% {
            opacity: 0;
            transform:
              scale(0.72);
          }
        }


        /* =================================================
           SECURITY PATH
        ================================================= */

        .security-path-section {
          position: relative;

          width: 100%;
          min-height: 1250px;

          padding:
            120px
            clamp(24px, 6vw, 100px)
            120px;

          overflow: hidden;

          background:
            radial-gradient(
              circle at 18% 15%,
              rgba(
                55,
                95,
                255,
                0.12
              ),
              transparent 30%
            ),
            radial-gradient(
              circle at 82% 80%,
              rgba(
                30,
                160,
                255,
                0.08
              ),
              transparent 32%
            );
        }

        .security-path-heading {
          position: relative;
          z-index: 5;

          max-width: 760px;

          margin-bottom: 40px;
        }

        .security-path-eyebrow {
          display: inline-flex;
          align-items: center;

          gap: 9px;

          margin-bottom: 16px;

          color: #7790ff;

          font-size: 10px;
          font-weight: 900;

          letter-spacing: 0.24em;
        }

        .security-path-eyebrow::before {
          content: "";

          width: 22px;
          height: 1px;

          background:
            #6e89ff;

          box-shadow:
            0 0 12px
            rgba(
              90,
              120,
              255,
              0.8
            );
        }

        .security-path-heading h2 {
          margin: 0;

          color: #f4f7ff;

          font-size:
            clamp(
              34px,
              5vw,
              70px
            );

          line-height: 0.98;

          letter-spacing: -0.045em;
        }

        .security-path-heading p {
          max-width: 620px;

          margin-top: 22px;

          color:
            rgba(
              215,
              224,
              250,
              0.55
            );

          font-size: 14px;
          line-height: 1.8;
        }

        .security-path-canvas {
          position: relative;

          width: 100%;
          height: 900px;

          margin-top: 15px;
        }

        .security-path-svg {
          position: absolute;

          inset: 0;

          width: 100%;
          height: 100%;

          overflow: visible;
        }

        .security-path-glow {
          fill: none;

          stroke:
            rgba(
              65,
              100,
              255,
              0.18
            );

          stroke-width: 13;

          filter:
            blur(9px);
        }

        .security-path-line {
          fill: none;

          stroke:
            url(
              #securityPathGradient
            );

          stroke-width: 2.5;

          stroke-linecap: round;

          filter:
            url(#pathGlow);

          opacity: 0.9;
        }

        /* =================================================
           ENDPOINT DOTS
        ================================================= */

        .security-path-dot {
          position: absolute;

          width: 9px;
          height: 9px;

          border-radius: 50%;

          background:
            #7c96ff;

          box-shadow:
            0 0 0 4px
              rgba(
                95,
                125,
                255,
                0.12
              ),
            0 0 20px
              rgba(
                80,
                115,
                255,
                0.8
              );
        }

        .security-path-start {
          left: 6.8%;
          top: 8.2%;
        }

        .security-path-end {
          right: 6.3%;
          bottom: 7.6%;

          background:
            #78dfff;

          box-shadow:
            0 0 0 4px
              rgba(
                75,
                210,
                255,
                0.1
              ),
            0 0 24px
              rgba(
                75,
                210,
                255,
                0.85
              );
        }

        /* =================================================
           𓃦 SCROLL PATH WOLF
        ================================================= */

        .scroll-path-wolf {
          position: absolute;

          left: 0;
          top: 0;

          width: 118px;
          height: 100px;

          display: grid;
          place-items: center;

          pointer-events: none;

          z-index: 20;

          will-change:
            left,
            top,
            transform;

          isolation: isolate;
        }

        /* =================================================
           𓃦 CHARACTER

           SVG WOLF COMPLETELY REMOVED.
        ================================================= */

        .scroll-wolf-glyph {
          position: relative;

          z-index: 4;

          display: block;

          font-family:
            "Times New Roman",
            "Noto Sans Egyptian Hieroglyphs",
            serif;

          font-size: 112px;

          line-height: 1;

          color: #edf2ff;

          white-space: nowrap;

          transform:
            scaleX(-1);

          transform-origin: center;

          text-shadow:
            0 0 3px
              rgba(
                240,
                245,
                255,
                1
              ),
            0 0 9px
              rgba(
                105,
                140,
                255,
                0.95
              ),
            0 0 22px
              rgba(
                65,
                105,
                255,
                0.7
              ),
            0 0 42px
              rgba(
                65,
                105,
                255,
                0.35
              );

          filter:
            drop-shadow(
              0 0 4px
              rgba(
                235,
                242,
                255,
                0.95
              )
            )
            drop-shadow(
              0 0 12px
              rgba(
                105,
                140,
                255,
                0.9
              )
            )
            drop-shadow(
              0 0 24px
              rgba(
                65,
                105,
                255,
                0.58
              )
            );

          animation:
            scrollWolfFloat
            1.8s
            ease-in-out
            infinite;
        }

        .scroll-wolf-aura {
          position: absolute;

          width: 108px;
          height: 108px;

          left: 50%;
          top: 50%;

          transform:
            translate(-50%, -50%);

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(
                84,
                118,
                255,
                0.3
              ) 0%,
              rgba(
                84,
                118,
                255,
                0.14
              ) 34%,
              transparent 72%
            );

          filter: blur(7px);

          z-index: 1;

          animation:
            scrollWolfAuraPulse
            1.8s
            ease-in-out
            infinite;
        }

        .scroll-wolf-energy-ring {
          position: absolute;

          width: 68px;
          height: 68px;

          left: 50%;
          top: 50%;

          transform:
            translate(-50%, -50%)
            rotate(0deg);

          border-radius: 50%;

          border:
            1px solid
            rgba(
              103,
              139,
              255,
              0.22
            );

          box-shadow:
            0 0 12px
              rgba(
                80,
                115,
                255,
                0.22
              ),
            inset 0 0 12px
              rgba(
                80,
                115,
                255,
                0.08
              );

          z-index: 2;

          animation:
            scrollWolfRing
            3.4s
            linear
            infinite;
        }

        .scroll-wolf-core {
          position: absolute;

          width: 5px;
          height: 5px;

          left: 73%;
          top: 48%;

          border-radius: 50%;

          background:
            #b9f4ff;

          box-shadow:
            0 0 6px
              rgba(
                150,
                230,
                255,
                1
              ),
            0 0 15px
              rgba(
                80,
                150,
                255,
                0.9
              );

          z-index: 6;

          animation:
            scrollWolfEye
            1.8s
            ease-in-out
            infinite;
        }

        /* =================================================
           𓃦 FLOAT ANIMATION
        ================================================= */

        @keyframes scrollWolfFloat {
          0%,
          100% {
            transform:
              translateY(0)
              scale(1)
              scaleX(-1);
          }

          50% {
            transform:
              translateY(-3px)
              scale(1.025)
              scaleX(-1);
          }
        }

        @keyframes scrollWolfAuraPulse {
          0%,
          100% {
            opacity: 0.48;

            transform:
              translate(-50%, -50%)
              scale(0.82);
          }

          50% {
            opacity: 0.78;

            transform:
              translate(-50%, -50%)
              scale(1.04);
          }
        }

        @keyframes scrollWolfRing {
          from {
            transform:
              translate(-50%, -50%)
              rotate(0deg);
          }

          to {
            transform:
              translate(-50%, -50%)
              rotate(360deg);
          }
        }

        @keyframes scrollWolfEye {
          0%,
          100% {
            opacity: 0.65;

            box-shadow:
              0 0 5px
                rgba(
                  150,
                  230,
                  255,
                  0.75
                ),
              0 0 12px
                rgba(
                  80,
                  150,
                  255,
                  0.65
                );
          }

          50% {
            opacity: 1;

            box-shadow:
              0 0 8px
                rgba(
                  180,
                  245,
                  255,
                  1
                ),
              0 0 20px
                rgba(
                  80,
                  150,
                  255,
                  0.95
                );
          }
        }

        /* =================================================
           SECURITY STEP MARKERS
        ================================================= */

        .security-step {
          position: absolute;

          display: flex;
          align-items: center;

          gap: 10px;

          z-index: 8;

          pointer-events: none;

          transition:
            opacity 0.25s ease,
            transform 0.25s ease;
        }

        .security-step-point {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background:
            rgba(
              150,
              165,
              210,
              0.4
            );

          box-shadow:
            0 0 0 3px
            rgba(
              120,
              140,
              190,
              0.06
            );

          transition:
            background 0.25s ease,
            box-shadow 0.25s ease,
            transform 0.25s ease;
        }

        .security-step-label {
          color:
            rgba(
              210,
              220,
              245,
              0.35
            );

          font-size: 8px;
          font-weight: 900;

          letter-spacing:
            0.16em;

          white-space: nowrap;

          transition:
            color 0.25s ease;
        }

        .security-step-active
          .security-step-point {
          background:
            #6f8cff;

          transform:
            scale(1.35);

          box-shadow:
            0 0 0 4px
              rgba(
                85,
                115,
                255,
                0.1
              ),
            0 0 16px
              rgba(
                80,
                115,
                255,
                0.8
              );
        }

        .security-step-active
          .security-step-label {
          color:
            #91a5ff;
        }

        .security-step-authentication {
          left: 23%;
          top: 28%;
        }

        .security-step-api-keys {
          left: 54%;
          top: 27%;
        }

        .security-step-rate-limit {
          left: 52%;
          top: 61%;
        }

        .security-step-monitor {
          left: 76%;
          top: 78%;
        }

        /* =================================================
           NAVIGATION
        ================================================= */

        .dashboard-page-navigation {
          position: relative;
          z-index: 20;

          display: grid;

          grid-template-columns:
            repeat(
              4,
              minmax(0, 1fr)
            );

          gap: 14px;

          margin-top: 40px;
        }

        .dashboard-page-navigation button {
          position: relative;

          min-height: 78px;

          display: grid;

          grid-template-columns:
            auto 1fr auto;

          align-items: center;

          gap: 14px;

          padding:
            16px 18px;

          border: 1px solid
            rgba(
              115,
              140,
              255,
              0.18
            );

          border-radius: 16px;

          background:
            linear-gradient(
              145deg,
              rgba(
                28,
                43,
                82,
                0.82
              ),
              rgba(
                10,
                17,
                34,
                0.94
              )
            );

          color: #fff;

          cursor: pointer;

          text-align: left;

          box-shadow:
            0 12px 35px
              rgba(
                0,
                0,
                0,
                0.18
              ),
            inset 0 1px
              rgba(
                255,
                255,
                255,
                0.05
              );

          transition:
            transform 0.22s ease,
            border-color 0.22s ease,
            box-shadow 0.22s ease,
            background 0.22s ease;
        }

        .dashboard-page-navigation button:hover {
          transform:
            translateY(-5px);

          border-color:
            rgba(
              105,
              135,
              255,
              0.5
            );

          background:
            linear-gradient(
              145deg,
              rgba(
                40,
                60,
                115,
                0.92
              ),
              rgba(
                12,
                22,
                45,
                0.98
              )
            );

          box-shadow:
            0 20px 45px
              rgba(
                35,
                70,
                180,
                0.22
              ),
            0 0 25px
              rgba(
                70,
                105,
                255,
                0.1
              );
        }

        .dashboard-page-navigation button:active {
          transform:
            translateY(-1px)
            scale(0.99);
        }

        .nav-number {
          display: grid;

          place-items: center;

          width: 32px;
          height: 32px;

          border-radius: 9px;

          background:
            rgba(
              100,
              125,
              255,
              0.1
            );

          color:
            #8398ff;

          font-size: 9px;
          font-weight: 900;
        }

        .dashboard-page-navigation
          button
          span:not(.nav-number) {
          font-size: 12px;
          font-weight: 850;

          letter-spacing:
            0.04em;
        }

        .dashboard-page-navigation
          button
          b {
          color:
            #8198ff;

          font-size: 18px;

          transition:
            transform 0.2s ease;
        }

        .dashboard-page-navigation
          button:hover
          b {
          transform:
            translateX(4px);
        }

        /* =================================================
           COMMAND NAVIGATION
        ================================================= */

        .dashboard-command-navigation {
          position: relative;

          margin:
            100px
            0;

          padding:
            80px
            clamp(24px, 6vw, 80px);

          border-top:
            1px solid
            rgba(
              100,
              125,
              255,
              0.1
            );

          border-bottom:
            1px solid
            rgba(
              100,
              125,
              255,
              0.1
            );

          background:
            radial-gradient(
              circle at 20% 50%,
              rgba(
                50,
                85,
                255,
                0.09
              ),
              transparent 34%
            );
        }

        .command-navigation-header {
          max-width: 650px;

          margin-bottom: 36px;
        }

        .command-navigation-header h2 {
          margin:
            12px 0;

          color: #eef2ff;

          font-size:
            clamp(
              28px,
              4vw,
              52px
            );

          line-height: 1;
          letter-spacing:
            -0.04em;
        }

        .command-navigation-header p {
          color:
            rgba(
              215,
              224,
              250,
              0.52
            );

          line-height: 1.7;
        }

        .command-navigation-grid {
          display: grid;

          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );

          gap: 16px;
        }

        .command-navigation-card {
          min-height: 190px;

          display: grid;

          grid-template-columns:
            auto 1fr auto;

          align-items:
            flex-start;

          gap: 18px;

          padding: 25px;

          border:
            1px solid
            rgba(
              110,
              135,
              255,
              0.16
            );

          border-radius: 20px;

          background:
            linear-gradient(
              145deg,
              rgba(
                20,
                32,
                65,
                0.88
              ),
              rgba(
                8,
                14,
                28,
                0.95
              )
            );

          color: #fff;

          cursor: pointer;

          text-align: left;

          box-shadow:
            0 15px 45px
              rgba(
                0,
                0,
                0,
                0.2
              );

          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .command-navigation-card:hover {
          transform:
            translateY(-8px);

          border-color:
            rgba(
              100,
              135,
              255,
              0.45
            );

          box-shadow:
            0 25px 60px
              rgba(
                25,
                60,
                170,
                0.24
              );
        }

        .command-card-number {
          color:
            #7d94ff;

          font-size: 10px;
          font-weight: 900;

          letter-spacing:
            0.12em;
        }

        .command-navigation-card
          div {
          display: flex;

          flex-direction:
            column;

          gap: 10px;
        }

        .command-navigation-card
          strong {
          font-size: 16px;
          font-weight: 850;
        }

        .command-navigation-card
          div
          span {
          color:
            rgba(
              215,
              224,
              250,
              0.45
            );

          font-size: 11px;
          line-height: 1.65;
        }

        .command-navigation-card
          b {
          color:
            #849aff;

          font-size: 22px;
        }

        /* =================================================
           MORE BLUE / LESS OLIVE / LESS BEIGE
        ================================================= */

        .olive-panel,
        .beige-panel {
          background:
            linear-gradient(
              145deg,
              #101b3c,
              #172b63
            ) !important;
        }

        .blue-panel {
          background:
            linear-gradient(
              145deg,
              #091b4a,
              #102d76
            ) !important;
        }

        .auth-wolf,
        .slide-wolf,
        .ending-wolf {
          color:
            #718cff !important;

          filter:
            drop-shadow(
              0 0 20px
              rgba(
                70,
                105,
                255,
                0.35
              )
            );
        }

        /* =================================================
           MOBILE
        ================================================= */

        @media (max-width: 900px) {

          .security-path-section {
            min-height: 1100px;

            padding:
              80px
              20px;
          }

          .security-path-canvas {
            height: 720px;
          }

          .security-step-label {
            font-size: 7px;
          }

          .dashboard-page-navigation {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }

          .command-navigation-grid {
            grid-template-columns:
              1fr;
          }

          .arrival-wolf {
            width: 190px;
            height: 190px;
          }

          .arrival-wolf span {
            font-size: 160px;
          }

          .scroll-path-wolf {
            width: 100px;
            height: 90px;
          }

          .scroll-wolf-glyph {
            font-size: 94px;
          }

          .scroll-wolf-energy-ring {
            width: 60px;
            height: 60px;
          }

          .scroll-wolf-aura {
            width: 94px;
            height: 94px;
          }
        }

        @media (max-width: 600px) {

          .security-path-section {
            min-height: 950px;
          }

          .security-path-canvas {
            height: 600px;
          }

          .dashboard-page-navigation {
            grid-template-columns:
              1fr;
          }

          .security-step-label {
            display: none;
          }

          .scroll-path-wolf {
            width: 78px;
            height: 70px;
          }

          .scroll-wolf-glyph {
            font-size: 76px;
          }

          .scroll-wolf-aura {
            width: 76px;
            height: 76px;
          }

          .scroll-wolf-energy-ring {
            width: 48px;
            height: 48px;
          }

          .scroll-wolf-core {
            width: 4px;
            height: 4px;
          }

          .arrival-wolf {
            width: 150px;
            height: 150px;
          }

          .arrival-wolf span {
            font-size: 125px;
          }
        }

        /* =================================================
           REDUCED MOTION
        ================================================= */

        @media (
          prefers-reduced-motion: reduce
        ) {

          .dashboard-arrival,
          .arrival-cover,
          .arrival-wolf,
          .arrival-wolf-aura,
          .arrival-reveal-line,
          .scroll-wolf-glyph,
          .scroll-wolf-aura,
          .scroll-wolf-energy-ring,
          .scroll-wolf-core {
            animation-duration:
              0.01ms !important;

            animation-delay:
              0ms !important;
          }
        }

      `}</style>
    </>
  );
}

export default App;