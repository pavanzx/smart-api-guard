import { useEffect, useMemo, useState } from "react";
import "./RequestTable.css";

/* =========================================================
   INITIAL REQUEST DATA
========================================================= */

const initialRequests = [
  {
    id: 1,
    method: "GET",
    endpoint: "/api/v1/users",
    status: "SUCCESS",
    statusCode: 200,
    latency: 84,
    ip: "10.24.18.42",
    environment: "PRODUCTION",
    key: "Production Gateway",
    time: "2 sec ago",
  },
  {
    id: 2,
    method: "POST",
    endpoint: "/api/v1/auth/validate",
    status: "SUCCESS",
    statusCode: 200,
    latency: 126,
    ip: "10.24.18.51",
    environment: "PRODUCTION",
    key: "Production Gateway",
    time: "8 sec ago",
  },
  {
    id: 3,
    method: "GET",
    endpoint: "/api/v1/projects",
    status: "SUCCESS",
    statusCode: 200,
    latency: 63,
    ip: "192.168.1.42",
    environment: "DEVELOPMENT",
    key: "Development Client",
    time: "14 sec ago",
  },
  {
    id: 4,
    method: "DELETE",
    endpoint: "/api/v1/session/expired",
    status: "BLOCKED",
    statusCode: 403,
    latency: 31,
    ip: "172.16.42.17",
    environment: "PRODUCTION",
    key: "Unknown Credential",
    time: "21 sec ago",
  },
  {
    id: 5,
    method: "PUT",
    endpoint: "/api/v1/profile",
    status: "SUCCESS",
    statusCode: 200,
    latency: 142,
    ip: "10.24.18.92",
    environment: "PRODUCTION",
    key: "Production Gateway",
    time: "29 sec ago",
  },
  {
    id: 6,
    method: "GET",
    endpoint: "/api/v1/analytics",
    status: "SUCCESS",
    statusCode: 200,
    latency: 97,
    ip: "10.24.19.11",
    environment: "PRODUCTION",
    key: "Production Gateway",
    time: "38 sec ago",
  },
  {
    id: 7,
    method: "POST",
    endpoint: "/api/v1/webhooks",
    status: "ERROR",
    statusCode: 500,
    latency: 284,
    ip: "10.24.21.31",
    environment: "DEVELOPMENT",
    key: "Development Client",
    time: "46 sec ago",
  },
  {
    id: 8,
    method: "GET",
    endpoint: "/api/v1/health",
    status: "SUCCESS",
    statusCode: 200,
    latency: 42,
    ip: "127.0.0.1",
    environment: "LOCAL",
    key: "Administrative Control",
    time: "54 sec ago",
  },
  {
    id: 9,
    method: "PATCH",
    endpoint: "/api/v1/settings",
    status: "SUCCESS",
    statusCode: 200,
    latency: 118,
    ip: "10.24.18.71",
    environment: "PRODUCTION",
    key: "Production Gateway",
    time: "1 min ago",
  },
  {
    id: 10,
    method: "POST",
    endpoint: "/api/v1/payments",
    status: "BLOCKED",
    statusCode: 401,
    latency: 27,
    ip: "45.81.22.17",
    environment: "PRODUCTION",
    key: "Unknown Credential",
    time: "1 min ago",
  },
  {
    id: 11,
    method: "GET",
    endpoint: "/api/v1/notifications",
    status: "SUCCESS",
    statusCode: 200,
    latency: 73,
    ip: "10.24.19.45",
    environment: "PRODUCTION",
    key: "Production Gateway",
    time: "2 min ago",
  },
  {
    id: 12,
    method: "POST",
    endpoint: "/api/v1/token/refresh",
    status: "SUCCESS",
    statusCode: 200,
    latency: 91,
    ip: "10.24.18.22",
    environment: "PRODUCTION",
    key: "Production Gateway",
    time: "2 min ago",
  },
];

/* =========================================================
   METHOD OPTIONS
========================================================= */

const methodOptions = [
  "ALL",
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
];

/* =========================================================
   STATUS OPTIONS
========================================================= */

const statusOptions = [
  "ALL",
  "SUCCESS",
  "BLOCKED",
  "ERROR",
];

/* =========================================================
   RANDOM REQUEST GENERATOR
========================================================= */

function generateLiveRequest(id) {
  const methods = ["GET", "POST", "PUT", "PATCH"];

  const endpoints = [
    "/api/v1/users",
    "/api/v1/projects",
    "/api/v1/auth/validate",
    "/api/v1/analytics",
    "/api/v1/profile",
    "/api/v1/notifications",
    "/api/v1/health",
    "/api/v1/settings",
  ];

  const method =
    methods[Math.floor(Math.random() * methods.length)];

  const endpoint =
    endpoints[
      Math.floor(Math.random() * endpoints.length)
    ];

  const blocked =
    Math.random() < 0.12;

  const error =
    !blocked && Math.random() < 0.06;

  const status = blocked
    ? "BLOCKED"
    : error
      ? "ERROR"
      : "SUCCESS";

  const statusCode = blocked
    ? 403
    : error
      ? 500
      : 200;

  return {
    id,
    method,
    endpoint,
    status,
    statusCode,
    latency: Math.floor(
      Math.random() * 190 + 35
    ),
    ip: `10.24.${Math.floor(
      Math.random() * 30
    )}.${Math.floor(
      Math.random() * 220 + 10
    )}`,
    environment: "PRODUCTION",
    key: blocked
      ? "Unknown Credential"
      : "Production Gateway",
    time: "Just now",
  };
}

/* =========================================================
   REQ TABLE
========================================================= */

function RequestTable() {
  /* =======================================================
     STATE
  ======================================================= */

  const [requests, setRequests] =
    useState(initialRequests);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [methodFilter, setMethodFilter] =
    useState("ALL");

  const [autoRefresh, setAutoRefresh] =
    useState(true);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [selectedRequest, setSelectedRequest] =
    useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [securityPulse, setSecurityPulse] =
    useState(false);

  const rowsPerPage = 8;

  /* =======================================================
     SECURITY CORE ANIMATION
  ======================================================= */

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSecurityPulse((value) => !value);
    }, 2200);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  /* =======================================================
     AUTO REFRESH
  ======================================================= */

  useEffect(() => {
    if (!autoRefresh) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setRequests((current) => {
        const nextId =
          Math.max(
            ...current.map((request) => request.id),
            0
          ) + 1;

        const newRequest =
          generateLiveRequest(nextId);

        return [
          newRequest,
          ...current,
        ].slice(0, 30);
      });
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [autoRefresh]);

  /* =======================================================
     MANUAL REFRESH
  ======================================================= */

  const handleRefresh = () => {
    if (isRefreshing) {
      return;
    }

    setIsRefreshing(true);

    window.setTimeout(() => {
      setRequests((current) => {
        const nextId =
          Math.max(
            ...current.map((request) => request.id),
            0
          ) + 1;

        return [
          generateLiveRequest(nextId),
          ...current,
        ].slice(0, 30);
      });

      setIsRefreshing(false);
    }, 700);
  };

  /* =======================================================
     FILTER REQUESTS
  ======================================================= */

  const filteredRequests = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesSearch =
        !query ||
        request.endpoint
          .toLowerCase()
          .includes(query) ||
        request.ip
          .toLowerCase()
          .includes(query) ||
        request.key
          .toLowerCase()
          .includes(query) ||
        request.environment
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        request.status === statusFilter;

      const matchesMethod =
        methodFilter === "ALL" ||
        request.method === methodFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesMethod
      );
    });
  }, [
    requests,
    search,
    statusFilter,
    methodFilter,
  ]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredRequests.length /
        rowsPerPage
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedRequests =
    filteredRequests.slice(
      (safeCurrentPage - 1) *
        rowsPerPage,
      safeCurrentPage *
        rowsPerPage
    );

  /* =======================================================
     FILTER RESET PAGE
  ======================================================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    methodFilter,
  ]);

  /* =======================================================
     STATISTICS
  ======================================================= */

  const totalRequests =
    requests.length;

  const successfulRequests =
    requests.filter(
      (request) =>
        request.status === "SUCCESS"
    ).length;

  const blockedRequests =
    requests.filter(
      (request) =>
        request.status === "BLOCKED"
    ).length;

  const errorRequests =
    requests.filter(
      (request) =>
        request.status === "ERROR"
    ).length;

  const averageLatency =
    requests.length > 0
      ? Math.round(
          requests.reduce(
            (sum, request) =>
              sum + request.latency,
            0
          ) / requests.length
        )
      : 0;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="request-monitor-page">

      {/* =================================================
          AMBIENT BACKGROUND
      ================================================= */}

      <div
        className="request-monitor-ambient ambient-one"
        aria-hidden="true"
      />

      <div
        className="request-monitor-ambient ambient-two"
        aria-hidden="true"
      />

      <div
        className="request-monitor-grid"
        aria-hidden="true"
      />

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="request-monitor-header">

        {/* =================================================
            BRAND ANIMATION
        ================================================= */}

        <div
          className={`monitor-brand-core ${
            securityPulse
              ? "brand-core-pulse"
              : ""
          }`}
          aria-hidden="true"
        >

          <div className="brand-core-orbit orbit-one" />

          <div className="brand-core-orbit orbit-two" />

          <div className="brand-core-particles">
            <i />
            <i />
            <i />
            <i />
          </div>

          <div className="brand-core-frame">
            <span className="brand-core-wolf">
              𓃦
            </span>
          </div>

          <div className="brand-core-scan" />

        </div>

        {/* =================================================
            HEADING
        ================================================= */}

        <div className="monitor-heading">

          <div className="monitor-label">
            <span className="label-line" />
            REQUEST INTELLIGENCE
          </div>

          <h1>
            Gateway
            <strong> Activity</strong>
          </h1>

          <p>
            Real-time visibility across
            protected API traffic.
          </p>

        </div>

        {/* =================================================
            META
        ================================================= */}

        <div className="monitor-meta">

          <div className="traffic-count">
            <strong>
              {requests.length}
            </strong>

            <span>
              REQUESTS
            </span>
          </div>

          <div className="monitor-status">
            <span />
            ACTIVE
          </div>

        </div>

      </header>

      {/* =================================================
          OVERVIEW
      ================================================= */}

      <section className="request-overview">

        <article className="request-stat-card">
          <div className="stat-icon">
            ◈
          </div>

          <div className="stat-content">
            <span>
              TOTAL REQUESTS
            </span>

            <strong>
              {totalRequests
                .toString()
                .padStart(2, "0")}
            </strong>

            <small>
              Traffic observed
            </small>
          </div>

          <div className="stat-line" />
        </article>

        <article className="request-stat-card stat-success">
          <div className="stat-icon">
            ◉
          </div>

          <div className="stat-content">
            <span>
              SUCCESSFUL
            </span>

            <strong>
              {successfulRequests
                .toString()
                .padStart(2, "0")}
            </strong>

            <small>
              Authorized traffic
            </small>
          </div>

          <div className="stat-line" />
        </article>

        <article className="request-stat-card stat-blocked">
          <div className="stat-icon">
            ⊘
          </div>

          <div className="stat-content">
            <span>
              BLOCKED
            </span>

            <strong>
              {blockedRequests
                .toString()
                .padStart(2, "0")}
            </strong>

            <small>
              Guard intervention
            </small>
          </div>

          <div className="stat-line" />
        </article>

        <article className="request-stat-card stat-latency">
          <div className="stat-icon">
            ◌
          </div>

          <div className="stat-content">
            <span>
              AVG LATENCY
            </span>

            <strong>
              {averageLatency}
              <small className="unit">
                ms
              </small>
            </strong>

            <small>
              Gateway response
            </small>
          </div>

          <div className="stat-line" />
        </article>

      </section>

      {/* =================================================
          TABLE SECTION
      ================================================= */}

      <section className="request-table-section">

        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <div className="request-section-header">

          <div>
            <span className="section-eyebrow">
              TRAFFIC MONITOR
            </span>

            <h2>
              Live Requests
            </h2>

            <p>
              Inspect requests passing
              through the Smart API Guard.
            </p>
          </div>

          <div className="header-actions">

            <button
              type="button"
              className={`auto-refresh ${
                autoRefresh
                  ? "auto-refresh-active"
                  : ""
              }`}
              onClick={() =>
                setAutoRefresh(
                  (value) => !value
                )
              }
            >
              <span />
              AUTO REFRESH
            </button>

            <button
              type="button"
              className={`refresh-button ${
                isRefreshing
                  ? "refreshing"
                  : ""
              }`}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              ↻
              {isRefreshing
                ? " REFRESHING"
                : " REFRESH"}
            </button>

          </div>

        </div>

        {/* =================================================
            FILTER BAR
        ================================================= */}

        <div className="request-filter-bar">

          <div className="search-box">
            <span>
              ⌕
            </span>

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search endpoint, IP, credential..."
              aria-label="Search requests"
            />
          </div>

          <label className="filter-control">
            <span>
              METHOD
            </span>

            <select
              value={methodFilter}
              onChange={(event) =>
                setMethodFilter(
                  event.target.value
                )
              }
            >
              {methodOptions.map(
                (method) => (
                  <option
                    value={method}
                    key={method}
                  >
                    {method}
                  </option>
                )
              )}
            </select>
          </label>

          <label className="filter-control">
            <span>
              STATUS
            </span>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
            >
              {statusOptions.map(
                (status) => (
                  <option
                    value={status}
                    key={status}
                  >
                    {status}
                  </option>
                )
              )}
            </select>
          </label>

        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="request-table-wrapper">

          <table className="request-table">

            <thead>
              <tr>
                <th>
                  METHOD
                </th>

                <th>
                  ENDPOINT
                </th>

                <th>
                  STATUS
                </th>

                <th>
                  LATENCY
                </th>

                <th>
                  SOURCE
                </th>

                <th>
                  ENVIRONMENT
                </th>

                <th>
                  TIME
                </th>

                <th>
                  VIEW
                </th>
              </tr>
            </thead>

            <tbody>

              {paginatedRequests.length >
              0 ? (
                paginatedRequests.map(
                  (request, index) => (
                    <tr
                      key={request.id}
                      style={{
                        "--row-index":
                          index,
                      }}
                    >

                      {/* METHOD */}

                      <td>
                        <span
                          className={`method-badge method-${request.method.toLowerCase()}`}
                        >
                          {request.method}
                        </span>
                      </td>

                      {/* ENDPOINT */}

                      <td>
                        <div className="endpoint-cell">
                          <span className="endpoint-dot" />

                          <code>
                            {request.endpoint}
                          </code>
                        </div>
                      </td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={`request-status status-${request.status.toLowerCase()}`}
                        >
                          <i />
                          {request.status}
                        </span>
                      </td>

                      {/* LATENCY */}

                      <td>
                        <div className="latency-cell">

                          <strong
                            className={
                              request.latency >
                              200
                                ? "latency-high"
                                : request.latency >
                                  120
                                ? "latency-medium"
                                : ""
                            }
                          >
                            {request.latency}
                            ms
                          </strong>

                          <div className="latency-bar">
                            <span
                              style={{
                                width: `${Math.min(
                                  request.latency /
                                    3,
                                  100
                                )}%`,
                              }}
                            />
                          </div>

                        </div>
                      </td>

                      {/* SOURCE */}

                      <td>
                        <div className="source-cell">
                          <strong>
                            {request.ip}
                          </strong>

                          <small>
                            {request.key}
                          </small>
                        </div>
                      </td>

                      {/* ENVIRONMENT */}

                      <td>
                        <span
                          className={`environment-tag ${request.environment.toLowerCase()}`}
                        >
                          {request.environment}
                        </span>
                      </td>

                      {/* TIME */}

                      <td>
                        <span className="request-time">
                          {request.time}
                        </span>
                      </td>

                      {/* VIEW */}

                      <td>
                        <button
                          type="button"
                          className="view-request"
                          onClick={() =>
                            setSelectedRequest(
                              request
                            )
                          }
                        >
                          VIEW
                        </button>
                      </td>

                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="empty-request-cell"
                  >
                    <div className="empty-state">
                      <span>
                        ◌
                      </span>

                      <strong>
                        NO REQUESTS FOUND
                      </strong>

                      <small>
                        Try changing your
                        filters or search
                        query.
                      </small>
                    </div>
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        {/* =================================================
            PAGINATION
        ================================================= */}

        <div className="request-table-footer">

          <span className="result-count">
            SHOWING{" "}
            <strong>
              {paginatedRequests.length}
            </strong>{" "}
            OF{" "}
            <strong>
              {filteredRequests.length}
            </strong>{" "}
            REQUESTS
          </span>

          <div className="pagination">

            <button
              type="button"
              disabled={
                safeCurrentPage === 1
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(
                      1,
                      page - 1
                    )
                )
              }
            >
              ←
            </button>

            {Array.from(
              {
                length: totalPages,
              },
              (_, index) => index + 1
            )
              .slice(0, 5)
              .map((page) => (
                <button
                  type="button"
                  key={page}
                  className={
                    safeCurrentPage ===
                    page
                      ? "page-active"
                      : ""
                  }
                  onClick={() =>
                    setCurrentPage(page)
                  }
                >
                  {page
                    .toString()
                    .padStart(2, "0")}
                </button>
              ))}

            <button
              type="button"
              disabled={
                safeCurrentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.min(
                      totalPages,
                      page + 1
                    )
                )
              }
            >
              →
            </button>

          </div>

        </div>

      </section>

      {/* =================================================
          SECURITY FOOTER
      ================================================= */}

      <section className="request-security-panel">

        <div className="security-panel-core">
          <div className="security-panel-orbit" />

          <span>
            𓃦
          </span>
        </div>

        <div className="security-panel-content">

          <span>
            GUARD PROTOCOL
          </span>

          <h2>
            Every request
            <strong>
              {" "}has a story.
            </strong>
          </h2>

          <p>
            Smart API Guard observes traffic,
            validates credentials and identifies
            blocked access before it reaches
            protected services.
          </p>

        </div>

        <div className="security-panel-metrics">

          <div>
            <strong>
              {blockedRequests
                .toString()
                .padStart(2, "0")}
            </strong>

            <span>
              BLOCKED
            </span>
          </div>

          <div>
            <strong>
              {errorRequests
                .toString()
                .padStart(2, "0")}
            </strong>

            <span>
              ERRORS
            </span>
          </div>

          <div>
            <strong>
              {averageLatency}
              <small>
                ms
              </small>
            </strong>

            <span>
              LATENCY
            </span>
          </div>

        </div>

      </section>

      {/* =================================================
          REQUEST DETAILS MODAL
      ================================================= */}

      {selectedRequest && (
        <div
          className="request-modal-backdrop"
          role="presentation"
          onClick={() =>
            setSelectedRequest(null)
          }
        >

          <div
            className="request-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-details-title"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="modal-close"
              onClick={() =>
                setSelectedRequest(null)
              }
              aria-label="Close request details"
            >
              ×
            </button>

            <div className="modal-core-logo">
              <span>
                𓃦
              </span>
            </div>

            <span className="modal-eyebrow">
              REQUEST INSPECTION
            </span>

            <h2 id="request-details-title">
              Traffic Details
            </h2>

            <p className="modal-endpoint">
              {selectedRequest.endpoint}
            </p>

            <div className="modal-status-row">

              <span
                className={`request-status status-${selectedRequest.status.toLowerCase()}`}
              >
                <i />
                {selectedRequest.status}
              </span>

              <span className="modal-code">
                HTTP{" "}
                {selectedRequest.statusCode}
              </span>

            </div>

            <div className="modal-detail-grid">

              <div>
                <span>
                  METHOD
                </span>

                <strong>
                  {selectedRequest.method}
                </strong>
              </div>

              <div>
                <span>
                  LATENCY
                </span>

                <strong>
                  {selectedRequest.latency}
                  ms
                </strong>
              </div>

              <div>
                <span>
                  SOURCE IP
                </span>

                <strong>
                  {selectedRequest.ip}
                </strong>
              </div>

              <div>
                <span>
                  ENVIRONMENT
                </span>

                <strong>
                  {selectedRequest.environment}
                </strong>
              </div>

              <div>
                <span>
                  CREDENTIAL
                </span>

                <strong>
                  {selectedRequest.key}
                </strong>
              </div>

              <div>
                <span>
                  OBSERVED
                </span>

                <strong>
                  {selectedRequest.time}
                </strong>
              </div>

            </div>

            <div className="modal-footer-line">
              <span />
            </div>

          </div>

        </div>
      )}

    </section>
  );
}

export default RequestTable;