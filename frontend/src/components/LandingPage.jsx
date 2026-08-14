import { useEffect, useState } from "react";
import "./LandingPage.css";

function LandingPage({ onGetStarted }) {
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;

      setMouse({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className="landing-page"
      style={{
        "--mouse-x": `${mouse.x}%`,
        "--mouse-y": `${mouse.y}%`,
      }}
    >
      {/* Ambient background */}
      <div className="landing-noise" />
      <div className="landing-grid" />

      <div className="landing-orb landing-orb-one" />
      <div className="landing-orb landing-orb-two" />
      <div className="landing-orb landing-orb-three" />

      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-brand">
          <div className="brand-wolf">
            <span>𓃦</span>
          </div>

          <div className="brand-copy">
            <strong>SMART API</strong>
            <span>GUARD</span>
          </div>
        </div>

        <div className="landing-nav-status">
          <span className="nav-status-dot" />
          <span>SYSTEM SECURE</span>
        </div>
      </nav>

      {/* Main hero */}
      <main className="landing-hero">
        <section className="landing-content">
          <div className="landing-eyebrow">
            <span className="eyebrow-line" />
            <span>INTELLIGENT API SECURITY</span>
            <span className="eyebrow-line" />
          </div>

          <h1 className="landing-title">
            <span>SECURE.</span>
            <span className="title-gradient">MONITOR.</span>
            <span>CONTROL.</span>
          </h1>

          <p className="landing-description">
            A modern security gateway built to protect your APIs,
            monitor every request, enforce access policies and
            expose threats in real time.
          </p>

          <div className="landing-actions">
            <button
              type="button"
              className="landing-primary-button"
              onClick={onGetStarted}
            >
              <span>Enter Security Console</span>

              <span className="button-arrow">→</span>

              <span className="button-shine" />
            </button>

            <div className="landing-secure-note">
              <span className="secure-icon">◇</span>
              <span>Protected infrastructure</span>
            </div>
          </div>

          {/* Feature indicators */}
          <div className="landing-features">
            <div className="landing-feature">
              <span className="feature-number">01</span>

              <div>
                <strong>REAL-TIME</strong>
                <span>Traffic intelligence</span>
              </div>
            </div>

            <div className="feature-divider" />

            <div className="landing-feature">
              <span className="feature-number">02</span>

              <div>
                <strong>ZERO TRUST</strong>
                <span>Request validation</span>
              </div>
            </div>

            <div className="feature-divider" />

            <div className="landing-feature">
              <span className="feature-number">03</span>

              <div>
                <strong>LIVE DEFENSE</strong>
                <span>Threat monitoring</span>
              </div>
            </div>
          </div>
        </section>

        {/* Wolf centerpiece */}
        <section className="landing-visual">
          <div className="visual-radar">
            <div className="radar-ring radar-ring-one" />
            <div className="radar-ring radar-ring-two" />
            <div className="radar-ring radar-ring-three" />

            <div className="radar-cross horizontal" />
            <div className="radar-cross vertical" />

            <div className="radar-sweep" />

            <div className="radar-point point-one" />
            <div className="radar-point point-two" />
            <div className="radar-point point-three" />
          </div>

          <div className="wolf-container">
            <div className="wolf-aura" />
            <div className="wolf-aura wolf-aura-two" />

            <div className="wolf-glow-ring" />

            <div className="landing-wolf" aria-hidden="true">
              𓃦
            </div>

            <div className="wolf-scan" />
          </div>

          <div className="visual-label visual-label-top">
            <span className="label-dot" />
            <span>GUARD ACTIVE</span>
          </div>

          <div className="visual-label visual-label-bottom">
            <span>THREAT ENGINE</span>
            <strong>ONLINE</strong>
          </div>

          <div className="visual-coordinate">
            <span>SEC</span>
            <span>𓃦</span>
            <span>01</span>
          </div>
        </section>
      </main>

      {/* Bottom status bar */}
      <footer className="landing-footer">
        <div className="footer-system">
          <span className="footer-pulse" />
          <span>SMART API GUARD</span>
          <span className="footer-separator">/</span>
          <span>SECURITY CORE INITIALIZED</span>
        </div>

        <div className="footer-version">
          <span>v1.0</span>
          <span>LOCAL NODE</span>
        </div>
      </footer>

      {/* Mouse-following light */}
      <div className="mouse-light" />
    </div>
  );
}

export default LandingPage;