import { useEffect, useMemo, useRef, useState } from "react";

function Analytics({ requests = [] }) {
  const sectionRef = useRef(null);

  const [visible, setVisible] = useState(false);
  const [activeRange, setActiveRange] = useState("24H");

  /* =========================================================
     REVEAL ANIMATION
  ========================================================= */

  useEffect(() => {
    const element = sectionRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.12,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  /* =========================================================
     ANALYTICS
  ========================================================= */

  const analytics = useMemo(() => {
    const total = requests.length;

    const getStatus = (request) =>
      Number(
        request?.status ??
          request?.statusCode ??
          0
      );

    const successful = requests.filter((request) => {
      const status = getStatus(request);

      return status >= 200 && status < 300;
    }).length;

    const blocked = requests.filter((request) => {
      const status = getStatus(request);

      return status >= 400 && status !== 429;
    }).length;

    const rateLimited = requests.filter((request) => {
      return getStatus(request) === 429;
    }).length;

    const clientErrors = requests.filter((request) => {
      const status = getStatus(request);

      return status >= 400 && status < 500 && status !== 429;
    }).length;

    const serverErrors = requests.filter((request) => {
      const status = getStatus(request);

      return status >= 500;
    }).length;

    const successRate =
      total > 0
        ? Math.round((successful / total) * 100)
        : 0;

    const blockedRate =
      total > 0
        ? Math.round((blocked / total) * 100)
        : 0;

    return {
      total,
      successful,
      blocked,
      rateLimited,
      clientErrors,
      serverErrors,
      successRate,
      blockedRate,
    };
  }, [requests]);

  /* =========================================================
     REQUEST VOLUME
  ========================================================= */

  const chartData = useMemo(() => {
    if (!requests.length) {
      return [
        18,
        26,
        21,
        34,
        29,
        42,
        38,
        55,
        48,
        62,
        58,
        71,
        66,
        78,
        72,
        84,
      ];
    }

    const buckets = new Array(16).fill(0);

    requests.forEach((request, index) => {
      const timestamp =
        request?.timestamp ??
        request?.createdAt ??
        request?.time;

      if (timestamp) {
        const date = new Date(timestamp);

        if (!Number.isNaN(date.getTime())) {
          const hour = date.getHours();

          const bucket = Math.min(
            15,
            Math.floor((hour / 24) * 16)
          );

          buckets[bucket] += 1;

          return;
        }
      }

      buckets[index % buckets.length] += 1;
    });

    const max = Math.max(...buckets, 1);

    return buckets.map((value) =>
      Math.max(
        10,
        Math.round((value / max) * 100)
      )
    );
  }, [requests]);

  /* =========================================================
     CHART POINTS
  ========================================================= */

  const chartPoints = useMemo(() => {
    if (chartData.length < 2) {
      return "0,80 100,80";
    }

    return chartData
      .map((value, index) => {
        const x =
          (index / (chartData.length - 1)) * 100;

        const y = 100 - value;

        return `${x},${y}`;
      })
      .join(" ");
  }, [chartData]);

  const areaPoints = `0,100 ${chartPoints} 100,100`;

  /* =========================================================
     AVERAGE / PEAK
  ========================================================= */

  const averageRequests = useMemo(() => {
    if (!chartData.length) return 0;

    const total = chartData.reduce(
      (sum, value) => sum + value,
      0
    );

    return Math.round(total / chartData.length);
  }, [chartData]);

  const peakRequests = useMemo(() => {
    return Math.max(...chartData, 0);
  }, [chartData]);

  /* =========================================================
     RESPONSE HEALTH
  ========================================================= */

  const responseHealth = useMemo(() => {
    if (!analytics.total) return 0;

    const health =
      ((analytics.successful -
        analytics.rateLimited) /
        analytics.total) *
      100;

    return Math.max(
      0,
      Math.min(100, Math.round(health))
    );
  }, [analytics]);

  /* =========================================================
     DONUT
  ========================================================= */

  const donutSuccess =
    analytics.total > 0
      ? (analytics.successful /
          analytics.total) *
        100
      : 0;

  const donutBlocked =
    analytics.total > 0
      ? (analytics.blocked /
          analytics.total) *
        100
      : 0;

  const donutRate =
    analytics.total > 0
      ? (analytics.rateLimited /
          analytics.total) *
        100
      : 0;

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section
      ref={sectionRef}
      className={`analytics-page ${
        visible ? "analytics-visible" : ""
      }`}
    >
      {/* =====================================================
          AMBIENT BACKGROUND
      ====================================================== */}

      <div
        className="analytics-ambient analytics-ambient-one"
        aria-hidden="true"
      />

      <div
        className="analytics-ambient analytics-ambient-two"
        aria-hidden="true"
      />

      <div
        className="analytics-grid-background"
        aria-hidden="true"
      />

      {/* =====================================================
          HERO
      ====================================================== */}

      <header className="analytics-hero">
        {/* =================================================
            BRAND CORE
        ================================================== */}

        <div
          className="analytics-brand-core"
          aria-hidden="true"
        >
          <div className="analytics-core-orbit orbit-one" />

          <div className="analytics-core-orbit orbit-two" />

          <div className="analytics-core-orbit orbit-three" />

          <div className="analytics-core-particles">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>

          <div className="analytics-core-glow" />

          <div className="analytics-core-frame">
            <span>𓃦</span>
          </div>

          <div className="analytics-core-scan" />

          <div className="analytics-core-ring" />
        </div>

        {/* =================================================
            HERO CONTENT
        ================================================== */}

        <div className="analytics-hero-content">
          <div className="analytics-eyebrow">
            <span />

            04 / INTELLIGENCE LAYER
          </div>

          <h1>
            Traffic
            <strong> Intelligence.</strong>
          </h1>

          <p>
            Turn gateway activity into clear,
            actionable intelligence. Monitor
            request volume, security decisions
            and API health from one control layer.
          </p>

          <div className="analytics-hero-status">
            <span />

            <div>
              <strong>
                ANALYTICS CORE ONLINE
              </strong>

              <small>
                Live gateway telemetry
              </small>
            </div>
          </div>
        </div>

        {/* =================================================
            HERO METRICS
        ================================================== */}

        <div className="analytics-hero-metrics">
          <div>
            <span>REQUESTS</span>

            <strong>
              {analytics.total.toLocaleString()}
            </strong>
          </div>

          <div>
            <span>SUCCESS</span>

            <strong>
              {analytics.successRate}%
            </strong>
          </div>

          <div>
            <span>HEALTH</span>

            <strong>
              {responseHealth}%
            </strong>
          </div>
        </div>
      </header>

      {/* =====================================================
          LIVE BAR
      ====================================================== */}

      <div className="analytics-live-bar">
        <div className="analytics-live-state">
          <span />

          <strong>
            {requests.length
              ? "LIVE TELEMETRY"
              : "SYSTEM STANDBY"}
          </strong>

          <small>
            Gateway intelligence stream
          </small>
        </div>

        <div className="analytics-range">
          {["1H", "6H", "24H", "7D"].map(
            (range) => (
              <button
                key={range}
                type="button"
                className={
                  activeRange === range
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveRange(range)
                }
              >
                {range}
              </button>
            )
          )}
        </div>
      </div>

      {/* =====================================================
          SUMMARY
      ====================================================== */}

      <section className="analytics-summary">
        <article className="analytics-stat-card">
          <div className="analytics-stat-top">
            <span>01</span>

            <i>◈</i>
          </div>

          <small>
            TOTAL REQUESTS
          </small>

          <strong>
            {analytics.total.toLocaleString()}
          </strong>

          <p>
            Gateway traffic observed
          </p>

          <div className="analytics-stat-line">
            <span
              style={{
                width: `${Math.min(
                  100,
                  analytics.total
                    ? 100
                    : 4
                )}%`,
              }}
            />
          </div>
        </article>

        <article className="analytics-stat-card analytics-stat-success">
          <div className="analytics-stat-top">
            <span>02</span>

            <i>◉</i>
          </div>

          <small>
            SUCCESS RATE
          </small>

          <strong>
            {analytics.successRate}%
          </strong>

          <p>
            Requests completed successfully
          </p>

          <div className="analytics-stat-line">
            <span
              style={{
                width: `${analytics.successRate}%`,
              }}
            />
          </div>
        </article>

        <article className="analytics-stat-card analytics-stat-danger">
          <div className="analytics-stat-top">
            <span>03</span>

            <i>△</i>
          </div>

          <small>
            BLOCKED
          </small>

          <strong>
            {analytics.blocked.toLocaleString()}
          </strong>

          <p>
            Security decisions triggered
          </p>

          <div className="analytics-stat-line">
            <span
              style={{
                width: `${Math.min(
                  100,
                  analytics.blockedRate
                )}%`,
              }}
            />
          </div>
        </article>

        <article className="analytics-stat-card analytics-stat-warning">
          <div className="analytics-stat-top">
            <span>04</span>

            <i>◌</i>
          </div>

          <small>
            RATE LIMITED
          </small>

          <strong>
            {analytics.rateLimited.toLocaleString()}
          </strong>

          <p>
            Traffic throttled by gateway
          </p>

          <div className="analytics-stat-line">
            <span
              style={{
                width: `${Math.min(
                  100,
                  analytics.total
                    ? (analytics.rateLimited /
                        analytics.total) *
                        100
                    : 0
                )}%`,
              }}
            />
          </div>
        </article>
      </section>

      {/* =====================================================
          MAIN ANALYTICS GRID
      ====================================================== */}

      <section className="analytics-main-grid">
        {/* =================================================
            TRAFFIC GRAPH
        ================================================== */}

        <article className="analytics-panel analytics-traffic-panel">
          <div className="analytics-panel-header">
            <div>
              <span>
                REQUEST TELEMETRY
              </span>

              <h2>
                Gateway activity
              </h2>

              <p>
                Request volume across the selected
                observation window.
              </p>
            </div>

            <div className="analytics-panel-value">
              <small>
                PEAK
              </small>

              <strong>
                {peakRequests}
              </strong>
            </div>
          </div>

          <div className="analytics-chart-wrap">
            <div className="analytics-chart-y">
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>

            <div className="analytics-chart-area">
              <div className="analytics-chart-lines">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>

              <svg
                className="analytics-main-svg"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="analyticsTrafficGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#8fa86a"
                      stopOpacity="0.38"
                    />

                    <stop
                      offset="70%"
                      stopColor="#718352"
                      stopOpacity="0.10"
                    />

                    <stop
                      offset="100%"
                      stopColor="#718352"
                      stopOpacity="0"
                    />
                  </linearGradient>

                  <filter
                    id="analyticsGlow"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                  >
                    <feGaussianBlur
                      stdDeviation="1.5"
                      result="blur"
                    />

                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <polygon
                  points={areaPoints}
                  fill="url(#analyticsTrafficGradient)"
                  className="analytics-area-path"
                />

                <polyline
                  points={chartPoints}
                  fill="none"
                  stroke="#879b64"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  filter="url(#analyticsGlow)"
                  className="analytics-traffic-line"
                />

                {chartData.map(
                  (value, index) => {
                    const x =
                      chartData.length > 1
                        ? (index /
                            (chartData.length -
                              1)) *
                          100
                        : 50;

                    const y = 100 - value;

                    return (
                      <circle
                        key={index}
                        cx={x}
                        cy={y}
                        r="1.4"
                        fill="#f2eee4"
                        stroke="#879b64"
                        strokeWidth="1"
                        vectorEffect="non-scaling-stroke"
                        className="analytics-chart-point"
                        style={{
                          "--point-delay": `${
                            index * 80
                          }ms`,
                        }}
                      />
                    );
                  }
                )}
              </svg>

              <div className="analytics-chart-x">
                <span>00:00</span>
                <span>04:00</span>
                <span>08:00</span>
                <span>12:00</span>
                <span>16:00</span>
                <span>20:00</span>
                <span>24:00</span>
              </div>
            </div>
          </div>

          <div className="analytics-chart-footer">
            <div>
              <span>
                AVG / WINDOW
              </span>

              <strong>
                {averageRequests}
              </strong>
            </div>

            <div>
              <span>
                OBSERVATION
              </span>

              <strong>
                {activeRange}
              </strong>
            </div>

            <div>
              <span>
                TELEMETRY
              </span>

              <strong className="telemetry-online">
                ● ONLINE
              </strong>
            </div>
          </div>
        </article>

        {/* =================================================
            SECURITY DONUT
        ================================================== */}

        <article className="analytics-panel analytics-security-panel">
          <div className="analytics-panel-header">
            <div>
              <span>
                SECURITY OUTCOME
              </span>

              <h2>
                Request distribution
              </h2>

              <p>
                How the gateway is handling observed
                traffic.
              </p>
            </div>
          </div>

          <div className="analytics-donut-section">
            <div
              className="analytics-donut"
              style={{
                "--success":
                  `${donutSuccess}%`,
                "--blocked":
                  `${donutBlocked}%`,
                "--rate":
                  `${donutRate}%`,
              }}
            >
              <div className="analytics-donut-center">
                <span>
                  ALLOWED
                </span>

                <strong>
                  {analytics.successRate}%
                </strong>

                <small>
                  SUCCESS
                </small>
              </div>
            </div>

            <div className="analytics-security-legend">
              <div>
                <span className="legend-success" />

                <div>
                  <strong>
                    Successful
                  </strong>

                  <small>
                    {analytics.successful.toLocaleString()}
                  </small>
                </div>

                <b>
                  {Math.round(
                    donutSuccess
                  )}
                  %
                </b>
              </div>

              <div>
                <span className="legend-blocked" />

                <div>
                  <strong>
                    Blocked
                  </strong>

                  <small>
                    {analytics.blocked.toLocaleString()}
                  </small>
                </div>

                <b>
                  {Math.round(
                    donutBlocked
                  )}
                  %
                </b>
              </div>

              <div>
                <span className="legend-rate" />

                <div>
                  <strong>
                    Rate limited
                  </strong>

                  <small>
                    {analytics.rateLimited.toLocaleString()}
                  </small>
                </div>

                <b>
                  {Math.round(
                    donutRate
                  )}
                  %
                </b>
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* =====================================================
          LOWER INTELLIGENCE GRID
      ====================================================== */}

      <section className="analytics-lower-grid">
        {/* =================================================
            API HEALTH
        ================================================== */}

        <article className="analytics-panel analytics-health-panel">
          <div className="analytics-panel-header">
            <div>
              <span>
                GATEWAY HEALTH
              </span>

              <h2>
                System confidence
              </h2>
            </div>

            <span className="analytics-health-badge">
              {responseHealth >= 90
                ? "HEALTHY"
                : responseHealth >= 70
                ? "STABLE"
                : "ATTENTION"}
            </span>
          </div>

          <div className="analytics-health-meter">
            <div className="analytics-health-circle">
              <div>
                <strong>
                  {responseHealth}%
                </strong>

                <span>
                  HEALTH
                </span>
              </div>
            </div>

            <div className="analytics-health-copy">
              <p>
                Gateway health is calculated from
                successful request flow and security
                throttling activity.
              </p>

              <div className="health-row">
                <span>
                  Successful traffic
                </span>

                <strong>
                  {analytics.successRate}%
                </strong>
              </div>

              <div className="health-row">
                <span>
                  Client errors
                </span>

                <strong>
                  {analytics.clientErrors}
                </strong>
              </div>

              <div className="health-row">
                <span>
                  Server errors
                </span>

                <strong>
                  {analytics.serverErrors}
                </strong>
              </div>
            </div>
          </div>
        </article>

        {/* =================================================
            SECURITY EVENTS
        ================================================== */}

        <article className="analytics-panel analytics-events-panel">
          <div className="analytics-panel-header">
            <div>
              <span>
                SECURITY EVENTS
              </span>

              <h2>
                Decision stream
              </h2>
            </div>

            <span className="analytics-event-live">
              ● LIVE
            </span>
          </div>

          <div className="analytics-event-list">
            <div className="analytics-event">
              <span className="event-icon event-green">
                ✓
              </span>

              <div>
                <strong>
                  Successful requests
                </strong>

                <small>
                  Gateway accepted trusted traffic
                </small>
              </div>

              <b>
                {analytics.successful.toLocaleString()}
              </b>
            </div>

            <div className="analytics-event">
              <span className="event-icon event-red">
                !
              </span>

              <div>
                <strong>
                  Blocked requests
                </strong>

                <small>
                  Security layer denied traffic
                </small>
              </div>

              <b>
                {analytics.blocked.toLocaleString()}
              </b>
            </div>

            <div className="analytics-event">
              <span className="event-icon event-yellow">
                ≋
              </span>

              <div>
                <strong>
                  Rate-limit events
                </strong>

                <small>
                  Traffic throttling activated
                </small>
              </div>

              <b>
                {analytics.rateLimited.toLocaleString()}
              </b>
            </div>
          </div>
        </article>
      </section>

      {/* =====================================================
          INSIGHT
      ====================================================== */}

      <section className="analytics-insight-panel">
        <div className="analytics-insight-mark">
          <div className="insight-orbit" />

          <span>
            𓃦
          </span>
        </div>

        <div className="analytics-insight-content">
          <span>
            SECURITY INTELLIGENCE
          </span>

          <h2>
            {analytics.total
              ? `${analytics.successRate}% of observed traffic is moving through the gateway successfully.`
              : "The intelligence layer is ready."}
          </h2>

          <p>
            {analytics.total
              ? "Smart API Guard is continuously translating raw request activity into security signals, traffic patterns and operational visibility."
              : "Once API traffic begins flowing, this layer will transform gateway activity into request patterns, security outcomes and actionable intelligence."}
          </p>
        </div>

        <div className="analytics-insight-signal">
          <span />
          <span />
          <span />
          <strong>
            CORE
          </strong>
        </div>
      </section>
    </section>
  );
}

export default Analytics;