
import { useEffect, useMemo, useState } from "react";
import "./ApiKeys.css";

const initialKeys = [
  {
    id: 1,
    name: "Production Gateway",
    tier: "PRO",
    environment: "PRODUCTION",
    key: "SAG-PAVAN-8F42-XK91",
    status: "ACTIVE",
    created: "Today",
    lastUsed: "2 min ago",
    requests: 12482,
  },
  {
    id: 2,
    name: "Development Client",
    tier: "FREE",
    environment: "DEVELOPMENT",
    key: "SAG-DEV42-K8LM-Q731",
    status: "ACTIVE",
    created: "Yesterday",
    lastUsed: "18 min ago",
    requests: 3421,
  },
  {
    id: 3,
    name: "Administrative Control",
    tier: "ADMIN",
    environment: "LOCAL",
    key: "SAG-ADM77-XP92-L4Q8",
    status: "INACTIVE",
    created: "3 days ago",
    lastUsed: "Never",
    requests: 0,
  },
];

/* =========================================================
   API KEY GENERATOR
========================================================= */

function generateApiKey() {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  const randomPart = (length) => {
    let result = "";

    for (let i = 0; i < length; i++) {
      result += chars.charAt(
        Math.floor(Math.random() * chars.length)
      );
    }

    return result;
  };

  return `SAG-${randomPart(5)}-${randomPart(5)}-${randomPart(5)}`;
}

/* =========================================================
   MASK KEY
========================================================= */

function maskKey(key) {
  if (!key) {
    return "";
  }

  const parts = key.split("-");

  if (parts.length < 2) {
    return "••••••••••••••••";
  }

  return `${parts[0]}-••••••••••••-${parts[parts.length - 1]}`;
}

/* =========================================================
   API KEYS
========================================================= */

function ApiKeys() {
  const [keys, setKeys] =
    useState(initialKeys);

  const [revealedKeys, setRevealedKeys] =
    useState({});

  const [copiedId, setCopiedId] =
    useState(null);

  const [showCreate, setShowCreate] =
    useState(false);

  const [newKeyName, setNewKeyName] =
    useState("");

  const [newEnvironment, setNewEnvironment] =
    useState("PRODUCTION");

  const [newTier, setNewTier] =
    useState("PRO");

  const [securityPulse, setSecurityPulse] =
    useState(false);

  /* =====================================================
     KEY COUNTS
  ===================================================== */

  const totalKeys = useMemo(
    () => keys.length,
    [keys]
  );

  const activeKeys = useMemo(
    () =>
      keys.filter(
        (key) =>
          key.status === "ACTIVE"
      ).length,
    [keys]
  );

  const inactiveKeys = useMemo(
    () =>
      keys.filter(
        (key) =>
          key.status === "INACTIVE"
      ).length,
    [keys]
  );

  /* =====================================================
     TOTAL REQUESTS
  ===================================================== */

  const totalRequests = useMemo(
    () =>
      keys.reduce(
        (total, key) =>
          total + (key.requests || 0),
        0
      ),
    [keys]
  );

  /* =====================================================
     SECURITY CORE ANIMATION
  ===================================================== */

  useEffect(() => {
    const interval = setInterval(() => {
      setSecurityPulse(
        (value) => !value
      );
    }, 2200);

    return () =>
      clearInterval(interval);
  }, []);

  /* =====================================================
     CREATE KEY
  ===================================================== */

  const handleCreateKey = () => {
    const cleanName =
      newKeyName.trim() ||
      "New Gateway Key";

    const newKey = {
      id: Date.now(),
      name: cleanName,
      tier: newTier,
      environment: newEnvironment,
      key: generateApiKey(),
      status: "ACTIVE",
      created: "Just now",
      lastUsed: "Never",
      requests: 0,
    };

    setKeys((current) => [
      newKey,
      ...current,
    ]);

    setRevealedKeys((current) => ({
      ...current,
      [newKey.id]: true,
    }));

    setNewKeyName("");
    setNewEnvironment("PRODUCTION");
    setNewTier("PRO");

    setShowCreate(false);
  };

  /* =====================================================
     COPY KEY
  ===================================================== */

  const handleCopy = async (key) => {
    try {
      await navigator.clipboard.writeText(
        key.key
      );

      setCopiedId(key.id);

      setTimeout(() => {
        setCopiedId(null);
      }, 1800);
    } catch (error) {
      console.error(
        "Unable to copy API key:",
        error
      );
    }
  };

  /* =====================================================
     REVEAL / HIDE
  ===================================================== */

  const toggleReveal = (id) => {
    setRevealedKeys((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  /* =====================================================
     ACTIVE / INACTIVE
  ===================================================== */

  const toggleKeyStatus = (id) => {
    setKeys((current) =>
      current.map((key) =>
        key.id === id
          ? {
              ...key,
              status:
                key.status === "ACTIVE"
                  ? "INACTIVE"
                  : "ACTIVE",
            }
          : key
      )
    );
  };

  /* =====================================================
     ROTATE KEY
  ===================================================== */

  const handleRotate = (id) => {
    setKeys((current) =>
      current.map((key) =>
        key.id === id
          ? {
              ...key,
              key: generateApiKey(),
              created: "Just now",
              lastUsed: "Never",
              requests: 0,
              status: "ACTIVE",
            }
          : key
      )
    );

    setRevealedKeys((current) => ({
      ...current,
      [id]: true,
    }));
  };

  return (
    <section className="api-keys-page">

      {/* =================================================
          AMBIENT BACKGROUND
      ================================================= */}

      <div className="keys-ambient keys-ambient-one" />
      <div className="keys-ambient keys-ambient-two" />
      <div className="keys-grid" />

      {/* =================================================
          HERO
      ================================================= */}

      <header className="keys-hero">

        <div className="keys-hero-content">

          <div className="keys-eyebrow">
            <span />
            SECURITY CREDENTIALS
          </div>

          <h1>
            API
            <strong> Keys</strong>
          </h1>

          <p>
            Control the credentials that authorize
            trusted applications to communicate with
            Smart API Guard.
          </p>

          <div className="keys-hero-status">

            <div className="hero-status-light">
              <span />
            </div>

            <div>
              <strong>
                KEY MANAGEMENT ACTIVE
              </strong>

              <small>
                Credential layer operational
              </small>
            </div>

          </div>

        </div>

        {/* =================================================
            SECURITY CORE
        ================================================= */}

        <div
          className={`security-core ${
            securityPulse
              ? "security-core-pulse"
              : ""
          }`}
        >

          <div className="core-orbit core-orbit-one" />
          <div className="core-orbit core-orbit-two" />
          <div className="core-orbit core-orbit-three" />

          <div className="core-glow" />

          <div className="core-inner">
            <span>𓃦</span>
          </div>

          <div className="core-scan" />

          <div className="core-label">
            <small>GUARD</small>
            <strong>
              IDENTITY CORE
            </strong>
          </div>

        </div>

      </header>

      {/* =================================================
          OVERVIEW
      ================================================= */}

      <div className="keys-overview">

        {/* TOTAL */}

        <div className="overview-card">

          <span className="overview-icon">
            ◈
          </span>

          <div>
            <small>
              TOTAL KEYS
            </small>

            <strong>
              {totalKeys
                .toString()
                .padStart(2, "0")}
            </strong>
          </div>

          <i />

        </div>

        {/* ACTIVE */}

        <div className="overview-card">

          <span className="overview-icon">
            ◉
          </span>

          <div>
            <small>
              ACTIVE KEYS
            </small>

            <strong className="secure-text">
              {activeKeys
                .toString()
                .padStart(2, "0")}
            </strong>
          </div>

          <i />

        </div>

        {/* INACTIVE */}

        <div className="overview-card">

          <span className="overview-icon">
            ◌
          </span>

          <div>
            <small>
              INACTIVE KEYS
            </small>

            <strong>
              {inactiveKeys
                .toString()
                .padStart(2, "0")}
            </strong>
          </div>

          <i />

        </div>

      </div>

      {/* =================================================
          KEY SECTION HEADER
      ================================================= */}

      <div className="keys-section-header">

        <div>

          <span>
            CREDENTIAL VAULT
          </span>

          <h2>
            Your API Keys
          </h2>

        </div>

        <button
          type="button"
          className="create-key-button"
          onClick={() =>
            setShowCreate(true)
          }
        >
          <span>+</span>
          CREATE NEW API KEY
        </button>

      </div>

      {/* =================================================
          KEY LIST
      ================================================= */}

      <div className="keys-list">

        {keys.map((key, index) => {

          const isRevealed =
            revealedKeys[key.id];

          const isInactive =
            key.status === "INACTIVE";

          return (
            <article
              className={`credential-card ${
                isInactive
                  ? "credential-inactive"
                  : ""
              }`}
              key={key.id}
              style={{
                "--key-index": index,
              }}
            >

              {/* CARD LIGHT */}

              <div className="credential-light" />

              {/* =================================================
                  TOP
              ================================================= */}

              <div className="credential-top">

                <div className="credential-identity">

                  <div className="credential-icon">
                    <span>
                      ◈
                    </span>
                  </div>

                  <div>

                    <div className="credential-name-row">

                      <h3>
                        {key.name}
                      </h3>

                      {/* TIER */}

                      <span
                        className={`tier-badge tier-${key.tier.toLowerCase()}`}
                      >
                        {key.tier}
                      </span>

                      {/* ENVIRONMENT */}

                      <span
                        className={`environment-badge ${
                          key.environment.toLowerCase()
                        }`}
                      >
                        {key.environment}
                      </span>

                    </div>

                    <span className="credential-subtitle">
                      Gateway access credential
                    </span>

                  </div>

                </div>

                {/* STATUS */}

                <span
                  className={`credential-status ${
                    key.status.toLowerCase()
                  }`}
                >
                  <i />
                  {key.status}
                </span>

              </div>

              {/* =================================================
                  KEY DISPLAY
              ================================================= */}

              <div className="credential-key">

                <div className="credential-key-label">

                  <span>
                    API KEY
                  </span>

                  <small>
                    {isInactive
                      ? "ACCESS DISABLED"
                      : "PROTECTED CREDENTIAL"}
                  </small>

                </div>

                <code>
                  {isInactive
                    ? "••••••••••••••••••••"
                    : isRevealed
                    ? key.key
                    : maskKey(key.key)}
                </code>

                {!isInactive && (
                  <button
                    type="button"
                    className="key-reveal-button"
                    onClick={() =>
                      toggleReveal(key.id)
                    }
                  >
                    {isRevealed
                      ? "HIDE"
                      : "REVEAL"}
                  </button>
                )}

              </div>

              {/* =================================================
                  METADATA
              ================================================= */}

              <div className="credential-meta">

                <div>
                  <span>
                    TIER
                  </span>

                  <strong>
                    {key.tier}
                  </strong>
                </div>

                <div>
                  <span>
                    CREATED
                  </span>

                  <strong>
                    {key.created}
                  </strong>
                </div>

                <div>
                  <span>
                    LAST USED
                  </span>

                  <strong>
                    {key.lastUsed}
                  </strong>
                </div>

                <div>
                  <span>
                    REQUESTS
                  </span>

                  <strong>
                    {key.requests.toLocaleString()}
                  </strong>
                </div>

              </div>

              {/* =================================================
                  ACTIONS
              ================================================= */}

              <div className="credential-actions">

                {!isInactive && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(key)
                      }
                    >
                      {copiedId === key.id
                        ? "✓ COPIED"
                        : "COPY KEY"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleRotate(key.id)
                      }
                    >
                      ↻ ROTATE
                    </button>
                  </>
                )}

                {/* ACTIVE / INACTIVE */}

                <button
                  type="button"
                  className={
                    isInactive
                      ? "activate-action"
                      : "danger-action"
                  }
                  onClick={() =>
                    toggleKeyStatus(key.id)
                  }
                >
                  {isInactive
                    ? "SET ACTIVE"
                    : "SET INACTIVE"}
                </button>

              </div>

              {/* =================================================
                  BOTTOM LINE
              ================================================= */}

              <div className="credential-line">
                <span />
              </div>

            </article>
          );
        })}

      </div>

      {/* =================================================
          SECURITY INFORMATION
      ================================================= */}

      <section className="key-security-section">

        <div className="security-heading">

          <span>
            GUARD PROTOCOL
          </span>

          <h2>
            Every credential is a
            <strong>
              {" "}trust boundary.
            </strong>
          </h2>

        </div>

        <div className="security-info-grid">

          <article>

            <span>
              01
            </span>

            <div>
              <h3>
                Authentication
              </h3>

              <p>
                Requests can be validated against
                an active credential before reaching
                protected APIs.
              </p>
            </div>

          </article>

          <article>

            <span>
              02
            </span>

            <div>
              <h3>
                Controlled Access
              </h3>

              <p>
                Each credential provides an explicit
                identity layer for trusted applications
                and services.
              </p>
            </div>

          </article>

          <article>

            <span>
              03
            </span>

            <div>
              <h3>
                Protected Secrets
              </h3>

              <p>
                Credentials can be rotated or
                temporarily disabled whenever
                access needs to change.
              </p>
            </div>

          </article>

        </div>

      </section>

      {/* =================================================
          CREATE MODAL
      ================================================= */}

      {showCreate && (
        <div
          className="key-modal-backdrop"
          onClick={() =>
            setShowCreate(false)
          }
        >

          <div
            className="key-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="modal-core">
              <span>
                𓃦
              </span>
            </div>

            <div className="modal-heading">

              <span>
                NEW CREDENTIAL
              </span>

              <h2>
                Create API Key
              </h2>

              <p>
                Generate a new credential for a
                trusted application or gateway.
              </p>

            </div>

            {/* KEY NAME */}

            <label>

              <span>
                KEY NAME
              </span>

              <input
                type="text"
                value={newKeyName}
                onChange={(event) =>
                  setNewKeyName(
                    event.target.value
                  )
                }
                placeholder="Production Gateway"
                autoFocus
              />

            </label>

            {/* TIER */}

            <label>

              <span>
                KEY TIER
              </span>

              <select
                value={newTier}
                onChange={(event) =>
                  setNewTier(
                    event.target.value
                  )
                }
              >

                <option value="FREE">
                  FREE
                </option>

                <option value="PRO">
                  PRO
                </option>

                <option value="ADMIN">
                  ADMIN
                </option>

              </select>

            </label>

            {/* ENVIRONMENT */}

            <label>

              <span>
                ENVIRONMENT
              </span>

              <select
                value={newEnvironment}
                onChange={(event) =>
                  setNewEnvironment(
                    event.target.value
                  )
                }
              >

                <option value="PRODUCTION">
                  PRODUCTION
                </option>

                <option value="DEVELOPMENT">
                  DEVELOPMENT
                </option>

                <option value="LOCAL">
                  LOCAL
                </option>

              </select>

            </label>

            {/* WARNING */}

            <div className="modal-warning">

              <span>
                !
              </span>

              <p>
                Store the generated credential
                securely. Never expose API keys
                in public client-side code.
              </p>

            </div>

            {/* ACTIONS */}

            <div className="modal-actions">

              <button
                type="button"
                className="modal-cancel"
                onClick={() =>
                  setShowCreate(false)
                }
              >
                CANCEL
              </button>

              <button
                type="button"
                className="modal-create"
                onClick={handleCreateKey}
              >
                GENERATE KEY
                <span>
                  →
                </span>
              </button>

            </div>

          </div>

        </div>
      )}

    </section>
  );
}

export default ApiKeys;