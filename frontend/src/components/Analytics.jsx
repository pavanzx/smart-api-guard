import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:8080";
const API_KEY = "PAVAN-PRO-KEY";

function Analytics() {
  const [analytics, setAnalytics] = useState({
    endpointCounts: {},
    statusCounts: {},
  });

  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(false);
  const [error, setError] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await fetch(
        `${API_BASE_URL}/api/usage/analytics`,
        {
          headers: {
            "X-API-KEY": API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Analytics request failed");
      }

      const data = await response.json();

      setAnalytics({
        endpointCounts: data.endpointCounts || {},
        statusCounts: data.statusCounts || {},
      });

      setOnline(true);
    } catch (err) {
      console.error("Unable to load analytics:", err);
      setOnline(false);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    const interval = setInterval(fetchAnalytics, 5000);

    return () => clearInterval(interval);
  }, []);

  const endpoints = Object.entries(
    analytics.endpointCounts
  ).sort((a, b) => b[1] - a[1]);

  const statuses = Object.entries(
    analytics.statusCounts
  ).sort((a, b) => b[1] - a[1]);

  const totalStatuses = statuses.reduce(
    (sum, [, value]) => sum + Number(value),
    0
  );

  const getPercentage = (value) => {
    if (!totalStatuses) return 0;

    return Math.round(
      (Number(value) / totalStatuses) * 100
    );
  };

  const maxEndpointCount =
    endpoints.length > 0
      ? Number(endpoints[0][1])
      : 0;

  if (loading && !online) {
    return (
      <section className="analytics-section">
        <div className="analytics-loading">
          <div className="analytics-loading-spinner"></div>

          <strong>Loading analytics...</strong>

          <span>
            Connecting to Smart API Guard
          </span>
        </div>
      </section>
    );
  }

  return (
    <section className="analytics-section">

      {/* ANALYTICS HEADER */}
      <div className="analytics-header">

        <div>
          <span className="eyebrow">
            SYSTEM ANALYTICS
          </span>

          <h2>
            Traffic Overview
          </h2>

          <p>
            Monitor API traffic, response status and
            endpoint activity in real time.
          </p>
        </div>

        <div
          className={`analytics-live ${
            online
              ? "analytics-online"
              : "analytics-offline"
          }`}
        >
          <span></span>

          {online ? "LIVE" : "OFFLINE"}
        </div>

      </div>

      {/* ERROR */}
      {error && (
        <div className="analytics-error">

          <div className="analytics-error-content">

            <strong>
              Unable to load analytics
            </strong>

            <span>
              Make sure the Spring Boot analytics
              endpoint is running on port 8080.
            </span>

          </div>

          <button
            onClick={fetchAnalytics}
            type="button"
          >
            Retry
          </button>

        </div>
      )}

      {/* ANALYTICS CARDS */}
      <div className="analytics-grid">

        {/* RESPONSE STATUS */}
        <div className="analytics-card">

          <div className="analytics-card-header">

            <div>
              <span className="analytics-label">
                RESPONSE STATUS
              </span>

              <h3>
                HTTP Status Distribution
              </h3>
            </div>

            <span className="analytics-icon">
              ↗
            </span>

          </div>

          {statuses.length === 0 ? (

            <div className="analytics-empty">

              <div className="analytics-empty-icon">
                ◌
              </div>

              <strong>
                No status data yet
              </strong>

              <span>
                API requests will appear here once
                traffic is recorded.
              </span>

            </div>

          ) : (

            <div className="status-list">

              {statuses.map(([status, count]) => {

                const percentage =
                  getPercentage(count);

                return (
                  <div
                    className="status-row"
                    key={status}
                  >

                    <div className="status-row-top">

                      <div className="status-name">

                        <span
                          className={`analytics-status status-${status}`}
                        >
                          {status}
                        </span>

                        <span className="status-description">
                          {status === "200"
                            ? "Success"
                            : status === "201"
                            ? "Created"
                            : status === "401"
                            ? "Unauthorized"
                            : status === "429"
                            ? "Rate Limited"
                            : "HTTP Response"}
                        </span>

                      </div>

                      <div className="status-value">

                        <strong>
                          {count}
                        </strong>

                        <span>
                          {percentage}%
                        </span>

                      </div>

                    </div>

                    <div className="progress-track">

                      <div
                        className={`progress-fill progress-${status}`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* TOP ENDPOINTS */}
        <div className="analytics-card">

          <div className="analytics-card-header">

            <div>
              <span className="analytics-label">
                API TRAFFIC
              </span>

              <h3>
                Top Endpoints
              </h3>
            </div>

            <span className="analytics-icon">
              ◉
            </span>

          </div>

          {endpoints.length === 0 ? (

            <div className="analytics-empty">

              <div className="analytics-empty-icon">
                ◌
              </div>

              <strong>
                No endpoint activity yet
              </strong>

              <span>
                Your API endpoints will appear here
                as they receive requests.
              </span>

            </div>

          ) : (

            <div className="endpoint-list">

              {endpoints.slice(0, 8).map(
                ([endpoint, count], index) => {

                  const endpointPercentage =
                    maxEndpointCount > 0
                      ? (Number(count) /
                          maxEndpointCount) *
                        100
                      : 0;

                  return (
                    <div
                      className="endpoint-row"
                      key={endpoint}
                    >

                      <div className="endpoint-rank">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <div className="endpoint-info">

                        <div className="endpoint-top">

                          <code>
                            {endpoint}
                          </code>

                          <strong>
                            {count}
                          </strong>

                        </div>

                        <div className="endpoint-bar">

                          <span
                            style={{
                              width: `${endpointPercentage}%`,
                            }}
                          />

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </div>

      </div>

    </section>
  );
}

export default Analytics;
