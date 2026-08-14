import { useEffect, useRef } from "react";
import "./DashboardIntro.css";

function DashboardIntro() {
  const sectionsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("intro-visible");
          }
        });
      },
      {
        threshold: 0.18,
      }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const addRef = (element) => {
    if (element && !sectionsRef.current.includes(element)) {
      sectionsRef.current.push(element);
    }
  };

  return (
    <section className="dashboard-intro">

      {/* HERO */}

      <div ref={addRef} className="intro-hero intro-reveal-left">
        <div className="intro-hero-copy">
          <span className="intro-eyebrow">
            SMART API GUARD
          </span>

          <h2>
            Security,
            <br />
            <span>made intelligent.</span>
          </h2>

          <p>
            Smart API Guard is a security gateway designed to
            protect, observe and control modern API traffic
            from a single command centre.
          </p>
        </div>

        <div className="intro-hero-visual">
          <div className="intro-image-frame">
            <div className="intro-wolf-mark">𓃦</div>

            <span className="image-line image-line-one" />
            <span className="image-line image-line-two" />

            <span className="image-caption">
              SECURITY CORE
            </span>
          </div>
        </div>
      </div>

      {/* WHAT IS THE PROJECT */}

      <div
        ref={addRef}
        className="intro-slide intro-reveal-right"
      >
        <div className="intro-slide-image olive-panel">
          <span className="slide-number">01</span>

          <div className="abstract-shape shape-one" />
          <div className="abstract-shape shape-two" />

          <div className="slide-wolf">
            𓃦
          </div>
        </div>

        <div className="intro-slide-content">
          <span className="intro-label">
            THE FOUNDATION
          </span>

          <h3>
            What is
            <br />
            Smart API Guard?
          </h3>

          <p>
            A centralized API security layer that sits between
            clients and backend services. It validates requests,
            protects endpoints, monitors activity and provides
            visibility into the entire API ecosystem.
          </p>

          <div className="intro-accent-line" />
        </div>
      </div>

      {/* MOTIVE */}

      <div
        ref={addRef}
        className="intro-slide intro-reverse intro-reveal-left"
      >
        <div className="intro-slide-content">
          <span className="intro-label">
            THE MOTIVE
          </span>

          <h3>
            Protect every
            <br />
            request.
          </h3>

          <p>
            APIs are constantly exposed to authentication failures,
            unauthorized access, excessive traffic and malicious
            requests. Smart API Guard exists to make those threats
            visible and controllable.
          </p>

          <div className="intro-stat-row">
            <div>
              <strong>AUTH</strong>
              <span>Identity validation</span>
            </div>

            <div>
              <strong>LIMIT</strong>
              <span>Traffic control</span>
            </div>

            <div>
              <strong>WATCH</strong>
              <span>Threat visibility</span>
            </div>
          </div>
        </div>

        <div className="intro-slide-image beige-panel">
          <span className="slide-number">02</span>

          <div className="security-orbit">
            <span />
            <span />
            <span />
          </div>

          <div className="slide-wolf dark-wolf">
            𓃦
          </div>
        </div>
      </div>

      {/* GOALS */}

      <div
        ref={addRef}
        className="intro-slide intro-reveal-right"
      >
        <div className="intro-slide-image blue-panel">
          <span className="slide-number">03</span>

          <div className="goal-grid">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="goal-circle">
            𓃦
          </div>
        </div>

        <div className="intro-slide-content">
          <span className="intro-label">
            THE GOAL
          </span>

          <h3>
            One place.
            <br />
            Complete control.
          </h3>

          <p>
            Bring authentication, API keys, request monitoring,
            rate limiting and analytics into one clean security
            experience.
          </p>

          <ul className="goal-list">
            <li>Secure API access</li>
            <li>Monitor live traffic</li>
            <li>Detect abnormal activity</li>
            <li>Understand API usage</li>
          </ul>
        </div>
      </div>

      {/* FEATURES */}

      <div
        ref={addRef}
        className="intro-features intro-reveal-left"
      >
        <div className="intro-section-heading">
          <span className="intro-label">
            CORE CAPABILITIES
          </span>

          <h3>
            Everything your API
            <br />
            security layer needs.
          </h3>
        </div>

        <div className="feature-cards">

          <div className="intro-feature-card">
            <span>01</span>
            <strong>AUTHENTICATION</strong>
            <p>
              Verify who is accessing your API.
            </p>
          </div>

          <div className="intro-feature-card">
            <span>02</span>
            <strong>API KEYS</strong>
            <p>
              Create and control secure API credentials.
            </p>
          </div>

          <div className="intro-feature-card">
            <span>03</span>
            <strong>REQUEST MONITOR</strong>
            <p>
              Observe requests flowing through the gateway.
            </p>
          </div>

          <div className="intro-feature-card">
            <span>04</span>
            <strong>RATE LIMITING</strong>
            <p>
              Prevent excessive or abusive traffic.
            </p>
          </div>

          <div className="intro-feature-card">
            <span>05</span>
            <strong>ANALYTICS</strong>
            <p>
              Turn API traffic into useful insights.
            </p>
          </div>

          <div className="intro-feature-card">
            <span>06</span>
            <strong>THREAT CONTROL</strong>
            <p>
              Identify and respond to suspicious activity.
            </p>
          </div>

        </div>
      </div>

      {/* NAVIGATION GUIDE */}

      <div
        ref={addRef}
        className="intro-navigation intro-reveal-right"
      >
        <div>
          <span className="intro-label">
            SECURITY CONSOLE
          </span>

          <h3>
            Your security
            <br />
            command centre.
          </h3>
        </div>

        <div className="navigation-guide">

          <div className="guide-item">
            <span>01</span>

            <div>
              <strong>Dashboard</strong>

              <p>
                Your real-time security overview.
              </p>
            </div>
          </div>

          <div className="guide-item">
            <span>02</span>

            <div>
              <strong>API Keys</strong>

              <p>
                Manage credentials and API access.
              </p>
            </div>
          </div>

          <div className="guide-item">
            <span>03</span>

            <div>
              <strong>Request Monitor</strong>

              <p>
                Inspect requests and access decisions.
              </p>
            </div>
          </div>

          <div className="guide-item">
            <span>04</span>

            <div>
              <strong>Analytics</strong>

              <p>
                Understand traffic and security patterns.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ENDING */}

      <div
        ref={addRef}
        className="intro-ending intro-reveal-left"
      >
        <div className="ending-wolf">
          𓃦
        </div>

        <span className="intro-label">
          SMART API GUARD
        </span>

        <h3>
          Guard the API.
          <br />
          Understand the traffic.
        </h3>

        <p>
          Security starts with visibility.
        </p>
      </div>

     

    </section>
  );
}

export default DashboardIntro;