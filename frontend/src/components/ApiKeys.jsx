
import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = "http://localhost:8080";
const API_KEY = "PAVAN-PRO-KEY";

function ApiKeys() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [showKeyModal, setShowKeyModal] =
    useState(false);

  const [newKeyName, setNewKeyName] = useState("");
  const [createdKey, setCreatedKey] = useState(null);

  const [copied, setCopied] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState({});
  const [actionId, setActionId] = useState(null);

  // =====================================================
  // FETCH API KEYS
  // =====================================================

  const fetchKeys = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/keys`,
        {
          method: "GET",
          headers: {
            "X-API-KEY": API_KEY,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Unable to load API keys (${response.status})`
        );
      }

      const data = await response.json();

      setKeys(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(
        "Unable to load API keys:",
        err
      );

      setKeys([]);

      setError(
        "Unable to load API keys. Make sure Spring Boot is running on port 8080."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchKeys();
  }, []);

  // =====================================================
  // COUNTS
  // =====================================================

  const activeCount = useMemo(
    () =>
      keys.filter(
        (key) => key.active === true
      ).length,
    [keys]
  );

  const inactiveCount = useMemo(
    () =>
      keys.filter(
        (key) => key.active !== true
      ).length,
    [keys]
  );

  // =====================================================
  // CREATE API KEY
  // =====================================================

  const createApiKey = async (event) => {
    event.preventDefault();

    const name = newKeyName.trim();

    if (!name) {
      return;
    }

    setCreating(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/keys`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Accept: "application/json",
          },
          body: JSON.stringify({
            name,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to create API key"
        );
      }

      setCreatedKey(data);
      setNewKeyName("");

      setShowCreateModal(false);
      setShowKeyModal(true);

      await fetchKeys();
    } catch (err) {
      console.error(
        "Unable to create API key:",
        err
      );

      setError(
        err.message ||
          "Unable to create API key."
      );
    } finally {
      setCreating(false);
    }
  };

  // =====================================================
  // ACTIVATE / DEACTIVATE
  // =====================================================

  const toggleKeyStatus = async (key) => {
    if (!key?.id) {
      return;
    }

    setActionId(key.id);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/keys/${key.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Accept: "application/json",
          },
          body: JSON.stringify({
            active: !key.active,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to update API key"
        );
      }

      setKeys((currentKeys) =>
        currentKeys.map((item) =>
          item.id === key.id ? data : item
        )
      );
    } catch (err) {
      console.error(
        "Unable to update API key:",
        err
      );

      setError(
        err.message ||
          "Unable to update API key."
      );
    } finally {
      setActionId(null);
    }
  };

  // =====================================================
  // DELETE API KEY
  // =====================================================

  const deleteApiKey = async (key) => {
    if (!key?.id) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${key.name}" permanently?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setActionId(key.id);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/keys/${key.id}`,
        {
          method: "DELETE",
          headers: {
            "X-API-KEY": API_KEY,
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to delete API key"
        );
      }

      setKeys((currentKeys) =>
        currentKeys.filter(
          (item) => item.id !== key.id
        )
      );
    } catch (err) {
      console.error(
        "Unable to delete API key:",
        err
      );

      setError(
        err.message ||
          "Unable to delete API key."
      );
    } finally {
      setActionId(null);
    }
  };

  // =====================================================
  // SHOW / HIDE KEY
  // =====================================================

  const toggleVisibility = (id) => {
    setVisibleKeys((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  // =====================================================
  // MASK KEY
  // =====================================================

  const maskKey = (keyValue) => {
    if (!keyValue) {
      return "—";
    }

    if (keyValue.length <= 12) {
      return "••••••••••••";
    }

    return `${keyValue.substring(
      0,
      8
    )}••••••••••••${keyValue.slice(-4)}`;
  };

  // =====================================================
  // COPY KEY
  // =====================================================

  const copyKey = async (value) => {
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (err) {
      console.error(
        "Unable to copy API key:",
        err
      );
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // OPEN CREATE MODAL
  // =====================================================

  const openCreateModal = () => {
    setError("");
    setNewKeyName("");
    setShowCreateModal(true);
  };

  // =====================================================
  // CLOSE CREATED KEY MODAL
  // =====================================================

  const closeCreatedKeyModal = () => {
    setShowKeyModal(false);
    setCreatedKey(null);
    setCopied(false);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section className="api-keys-page">
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="api-keys-header">
        <div>
          <span className="api-keys-eyebrow">
            ACCESS MANAGEMENT
          </span>

          <h2>API Keys</h2>

          <p>
            Create, manage and control credentials
            used to access your Smart API Guard
            gateway.
          </p>
        </div>

        <div className="api-keys-actions">
          <button
            type="button"
            className="api-keys-refresh"
            onClick={fetchKeys}
            disabled={loading}
          >
            <span
              className={
                loading ? "spinning" : ""
              }
            >
              ↻
            </span>

            {loading
              ? "Refreshing..."
              : "Refresh"}
          </button>

          <button
            type="button"
            className="api-keys-create"
            onClick={openCreateModal}
          >
            <span>＋</span>
            Create API Key
          </button>
        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="api-keys-error">
          <div className="api-keys-error-icon">
            !
          </div>

          <div>
            <strong>
              Something went wrong
            </strong>

            <span>{error}</span>
          </div>

          <button
            type="button"
            onClick={fetchKeys}
          >
            Try again
          </button>
        </div>
      )}

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="api-keys-summary">
        <div className="api-summary-card">
          <div className="api-summary-icon">
            ⌁
          </div>

          <div>
            <span>Total Keys</span>
            <strong>{keys.length}</strong>
          </div>
        </div>

        <div className="api-summary-card active-summary">
          <div className="api-summary-icon">
            ✓
          </div>

          <div>
            <span>Active</span>
            <strong>{activeCount}</strong>
          </div>
        </div>

        <div className="api-summary-card inactive-summary">
          <div className="api-summary-icon">
            ○
          </div>

          <div>
            <span>Inactive</span>
            <strong>{inactiveCount}</strong>
          </div>
        </div>
      </div>

      {/* =================================================
          API KEY REGISTRY
      ================================================= */}

      <div className="api-keys-card">
        <div className="api-keys-card-header">
          <div>
            <span>YOUR CREDENTIALS</span>

            <h3>API Key Registry</h3>
          </div>

          <div className="api-key-count">
            {keys.length}{" "}
            {keys.length === 1
              ? "key"
              : "keys"}
          </div>
        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (
          <div className="api-keys-loading">
            <div className="api-loading-spinner"></div>

            <strong>
              Loading API keys...
            </strong>

            <span>
              Connecting to Smart API Guard
            </span>
          </div>
        ) : keys.length === 0 ? (
          /* =================================================
             EMPTY
          ================================================= */

          <div className="api-keys-empty">
            <div className="api-empty-icon">
              🔐
            </div>

            <strong>
              No API keys yet
            </strong>

            <span>
              Create your first API key to start
              securing applications through the
              gateway.
            </span>

            <button
              type="button"
              onClick={openCreateModal}
            >
              ＋ Create Your First Key
            </button>
          </div>
        ) : (
          /* =================================================
             KEY LIST
          ================================================= */

          <div className="api-key-list">
            {keys.map((key) => {
              const isVisible =
                visibleKeys[key.id];

              const isActionLoading =
                actionId === key.id;

              return (
                <div
                  className={`api-key-row ${
                    key.active
                      ? "key-active"
                      : "key-inactive"
                  }`}
                  key={key.id}
                >
                  {/* ICON */}

                  <div className="api-key-main-icon">
                    🔑
                  </div>

                  {/* NAME */}

                  <div className="api-key-name">
                    <strong>
                      {key.name ||
                        "Unnamed key"}
                    </strong>

                    <span>
                      Created{" "}
                      {formatDate(
                        key.createdAt
                      )}
                    </span>
                  </div>

                  {/* KEY */}

                  <div className="api-key-value">
                    <span className="api-column-label">
                      API KEY
                    </span>

                    <code>
                      {isVisible
                        ? key.keyValue
                        : maskKey(
                            key.keyValue
                          )}
                    </code>

                    <div className="api-key-controls">
                      <button
                        type="button"
                        onClick={() =>
                          toggleVisibility(
                            key.id
                          )
                        }
                        title={
                          isVisible
                            ? "Hide API key"
                            : "Show API key"
                        }
                        aria-label={
                          isVisible
                            ? "Hide API key"
                            : "Show API key"
                        }
                      >
                        {isVisible
                          ? "◉"
                          : "◌"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          copyKey(
                            key.keyValue
                          )
                        }
                        title="Copy API key"
                        aria-label="Copy API key"
                      >
                        ⧉
                      </button>
                    </div>
                  </div>

                  {/* TIER */}

                  <div className="api-key-tier">
                    <span className="api-column-label">
                      TIER
                    </span>

                    <span className="tier-badge">
                      {key.tier || "FREE"}
                    </span>
                  </div>

                  {/* RATE LIMIT */}

                  <div className="api-key-limit">
                    <span className="api-column-label">
                      RATE LIMIT
                    </span>

                    <strong>
                      {key.rateLimit ?? 0}
                    </strong>

                    <small>
                      req / min
                    </small>
                  </div>

                  {/* STATUS */}

                  <div className="api-key-status">
                    <span className="api-column-label">
                      STATUS
                    </span>

                    <button
                      type="button"
                      className={
                        key.active
                          ? "status-toggle active"
                          : "status-toggle inactive"
                      }
                      onClick={() =>
                        toggleKeyStatus(
                          key
                        )
                      }
                      disabled={
                        isActionLoading
                      }
                    >
                      <span></span>

                      {key.active
                        ? "Active"
                        : "Inactive"}
                    </button>
                  </div>

                  {/* DELETE */}

                  <button
                    type="button"
                    className="api-key-delete"
                    onClick={() =>
                      deleteApiKey(key)
                    }
                    disabled={
                      isActionLoading
                    }
                    title="Delete API key"
                    aria-label="Delete API key"
                  >
                    {isActionLoading
                      ? "…"
                      : "⌫"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =================================================
          SECURITY NOTE
      ================================================= */}

      <div className="api-security-note">
        <div className="api-security-icon">
          ✦
        </div>

        <div>
          <strong>
            Keep your API keys secure
          </strong>

          <span>
            Treat API keys like passwords. Never
            expose them in public repositories,
            frontend source code or client-side
            logs.
          </span>
        </div>
      </div>

      {/* =================================================
          CREATE MODAL
      ================================================= */}

      {showCreateModal && (
        <div
          className="api-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setShowCreateModal(false);
            }
          }}
        >
          <div className="api-modal">
            <button
              type="button"
              className="api-modal-close"
              onClick={() =>
                setShowCreateModal(false)
              }
              aria-label="Close"
            >
              ×
            </button>

            <div className="api-modal-icon">
              🔑
            </div>

            <span className="api-modal-eyebrow">
              NEW CREDENTIAL
            </span>

            <h3>Create API Key</h3>

            <p>
              Give your API key a recognizable
              name so you can identify it later.
            </p>

            <form onSubmit={createApiKey}>
              <label htmlFor="api-key-name">
                Key name
              </label>

              <input
                id="api-key-name"
                type="text"
                value={newKeyName}
                onChange={(event) =>
                  setNewKeyName(
                    event.target.value
                  )
                }
                placeholder="e.g. Production App"
                maxLength={100}
                autoFocus
              />

              <div className="api-modal-actions">
                <button
                  type="button"
                  className="api-modal-cancel"
                  onClick={() =>
                    setShowCreateModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="api-modal-create"
                  disabled={
                    creating ||
                    !newKeyName.trim()
                  }
                >
                  {creating
                    ? "Generating..."
                    : "Generate Key"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================
          CREATED KEY MODAL
      ================================================= */}

      {showKeyModal && createdKey && (
        <div
          className="api-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeCreatedKeyModal();
            }
          }}
        >
          <div className="api-modal created-key-modal">
            <div className="created-success-icon">
              ✓
            </div>

            <span className="api-modal-eyebrow">
              KEY GENERATED
            </span>

            <h3>API Key Created</h3>

            <p>
              Your new credential for{" "}
              <strong>
                {createdKey.name}
              </strong>{" "}
              is ready.
            </p>

            <div className="created-key-box">
              <code>
                {createdKey.keyValue}
              </code>

              <button
                type="button"
                onClick={() =>
                  copyKey(
                    createdKey.keyValue
                  )
                }
              >
                {copied
                  ? "✓ Copied"
                  : "⧉ Copy"}
              </button>
            </div>

            <div className="created-warning">
              <span>!</span>

              <p>
                Copy this key now and store it
                somewhere secure. Never share it
                publicly.
              </p>
            </div>

            <button
              type="button"
              className="api-modal-done"
              onClick={
                closeCreatedKeyModal
              }
            >
              Done
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default ApiKeys;