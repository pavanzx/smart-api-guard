import { useEffect, useState } from "react";
import "./AuthPage.css";

function AuthPage({ onBack, onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const [securityInitializing, setSecurityInitializing] =
    useState(false);

  const [error, setError] = useState("");

  /* =========================================================
     AUTHENTICATION
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Enter your credentials to continue.");
      return;
    }

    setLoading(true);

    try {
      /*
       * Temporary UI authentication.
       * Replace this with your real backend authentication later.
       */
      await new Promise((resolve) =>
        setTimeout(resolve, 900)
      );

      if (remember) {
        localStorage.setItem(
          "smart-api-remember",
          "true"
        );
      } else {
        localStorage.removeItem(
          "smart-api-remember"
        );
      }

      setLoading(false);

      /*
       * Start security initialization.
       */
      setSecurityInitializing(true);
    } catch {
      setLoading(false);

      setError(
        "Authentication failed. Please try again."
      );
    }
  };

  /* =========================================================
     SECURITY INITIALIZATION
  ========================================================= */

  useEffect(() => {
    if (!securityInitializing) return;

    /*
     * Keep the security initialization screen visible
     * for 1.6 seconds, then enter the dashboard directly.
     */
    const timer = setTimeout(() => {
      onAuthenticated();
    }, 1600);

    return () => clearTimeout(timer);
  }, [securityInitializing, onAuthenticated]);

  /* =========================================================
     BIOMETRIC AUTHENTICATION
  ========================================================= */

  const handleBiometric = async () => {
    setError("");

    if (!window.PublicKeyCredential) {
      setError(
        "Biometric authentication is not supported by this browser."
      );
      return;
    }

    setLoading(true);

    try {
      /*
       * WebAuthn will be connected to the backend later.
       */
      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      setError(
        "Biometric setup requires the backend WebAuthn registration."
      );
    } catch {
      setError(
        "Biometric authentication failed."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     SECURITY INITIALIZATION SCREEN
  ========================================================= */

  if (securityInitializing) {
    return (
      <div className="security-init">

        <div className="security-init-background">

          <div className="security-init-grid" />

          <div className="security-init-orb" />

          <div
            className="
              security-init-orb
              security-init-orb-two
            "
          />

        </div>

        <div className="security-init-content">

          <div className="security-init-wolf">
            <span>𓃦</span>
          </div>

          <span className="security-init-eyebrow">
            SMART API GUARD
          </span>

          <h1>
            SECURITY INITIALIZATION
          </h1>

          <p>
            Establishing a protected command session.
          </p>

          <div className="security-progress">
            <span />
          </div>

          <div className="security-status">

            <span className="security-status-dot" />

            <span>
              VERIFYING SECURE ENVIRONMENT
            </span>

          </div>

        </div>

      </div>
    );
  }

  /* =========================================================
     AUTH PAGE
  ========================================================= */

  return (
    <div className="auth-page">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="auth-background">

        <div className="auth-grid" />

        <div className="auth-orb auth-orb-one" />

        <div className="auth-orb auth-orb-two" />

        <div className="auth-wolf">
          𓃦
        </div>

        <div className="auth-scan-line" />

      </div>

      {/* =====================================================
          BACK BUTTON
      ===================================================== */}

      <button
        type="button"
        className="auth-back"
        onClick={onBack}
        disabled={loading}
      >
        <span>←</span>
        Back
      </button>

      {/* =====================================================
          AUTH SHELL
      ===================================================== */}

      <div className="auth-shell">

        {/* ===================================================
            BRAND
        =================================================== */}

        <div className="auth-brand">

          <div className="auth-logo">
            𓃦
          </div>

          <div>

            <strong>
              SMART API GUARD
            </strong>

            <span>
              SECURITY CORE
            </span>

          </div>

        </div>

        {/* ===================================================
            AUTH CARD
        =================================================== */}

        <div className="auth-card">

          <div className="auth-card-glow" />

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="auth-header">

            <span className="auth-eyebrow">

              <span className="auth-status-dot" />

              SECURE ACCESS

            </span>

            <h1>
              {mode === "login"
                ? "Welcome back."
                : "Create access."}
            </h1>

            <p>
              {mode === "login"
                ? "Authenticate to access your API security command center."
                : "Create your secure Smart API Guard workspace."}
            </p>

          </div>

          {/* =================================================
              LOGIN / REGISTER SWITCH
          ================================================= */}

          <div className="auth-mode">

            <button
              type="button"
              className={
                mode === "login"
                  ? "active"
                  : ""
              }
              onClick={() => {
                setMode("login");
                setError("");
              }}
              disabled={loading}
            >
              Sign in
            </button>

            <button
              type="button"
              className={
                mode === "signup"
                  ? "active"
                  : ""
              }
              onClick={() => {
                setMode("signup");
                setError("");
              }}
              disabled={loading}
            >
              Register
            </button>

          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            {/* EMAIL */}

            <label>

              <span>
                EMAIL ADDRESS
              </span>

              <div className="auth-input">

                <span className="input-icon">
                  @
                </span>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="operator@example.com"
                  autoComplete="email"
                  disabled={loading}
                />

              </div>

            </label>

            {/* PASSWORD */}

            <label>

              <span>
                ACCESS PASSWORD
              </span>

              <div className="auth-input">

                <span className="input-icon">
                  ◆
                </span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter secure password"
                  autoComplete={
                    mode === "login"
                      ? "current-password"
                      : "new-password"
                  }
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (value) => !value
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword
                    ? "◉"
                    : "○"}
                </button>

              </div>

            </label>

            {/* =================================================
                OPTIONS
            ================================================= */}

            {mode === "login" && (

              <div className="auth-options">

                <label className="remember-option">

                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) =>
                      setRemember(
                        event.target.checked
                      )
                    }
                    disabled={loading}
                  />

                  <span className="custom-checkbox">
                    ✓
                  </span>

                  Remember this device

                </label>

                <button
                  type="button"
                  className="forgot-button"
                  onClick={() =>
                    setError(
                      "Password recovery will be connected to the backend."
                    )
                  }
                  disabled={loading}
                >
                  Forgot password?
                </button>

              </div>

            )}

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

              <div
                className="auth-error"
                role="alert"
              >

                <span>
                  !
                </span>

                {error}

              </div>

            )}

            {/* =================================================
                SUBMIT
            ================================================= */}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >

              <span className="submit-wolf">
                𓃦
              </span>

              <span>
                {loading
                  ? "AUTHENTICATING..."
                  : mode === "login"
                  ? "ENTER COMMAND CENTER"
                  : "CREATE SECURE ACCESS"}
              </span>

              {!loading && (

                <span className="submit-arrow">
                  →
                </span>

              )}

            </button>

          </form>

          {/* =================================================
              BIOMETRIC
          ================================================= */}

          <div className="auth-divider">

            <span />

            OR CONTINUE WITH

            <span />

          </div>

          <button
            type="button"
            className="biometric-button"
            onClick={handleBiometric}
            disabled={loading}
          >

            <span className="biometric-icon">
              ◈
            </span>

            <span>
              Use biometric authentication
            </span>

            <span className="biometric-arrow">
              →
            </span>

          </button>

          {/* =================================================
              SECURITY NOTICE
          ================================================= */}

          <div className="auth-security">

            <span className="security-lock">
              ◆
            </span>

            <div>

              <strong>
                ZERO-TRUST ACCESS
              </strong>

              <span>
                Your session is protected by
                encrypted authentication.
              </span>

            </div>

          </div>

        </div>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <div className="auth-footer">

          <span>

            <i />

            SYSTEM READY

          </span>

          <span>
            SMART API GUARD · SECURE NODE
          </span>

        </div>

      </div>

    </div>
  );
}

export default AuthPage;