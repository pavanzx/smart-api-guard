import { useEffect, useRef } from "react";
import "./ProjectIntro.css";

function ProjectIntro() {
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("project-visible");
          }
        });
      },
      {
        threshold: 0.18,
      }
    );

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const addRef = (element) => {
    if (element && !sectionRefs.current.includes(element)) {
      sectionRefs.current.push(element);
    }
  };

  return (
    <div className="project-intro">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="project-story-hero">

        <div className="story-kicker">
          SMART API GUARD
        </div>

        <h1>
          Security,
          <span>with intention.</span>
        </h1>

        <p>
          Smart API Guard is designed to make API security
          easier to understand, easier to monitor and easier
          to control.
        </p>

        <div className="story-scroll">
          <span />
          SCROLL TO EXPLORE
        </div>

      </section>


      {/* =================================================
          WHAT IS SMART API GUARD
      ================================================= */}

      <section
        className="story-section story-left"
        ref={addRef}
      >

        <div className="story-image-wrap">

          <div className="story-image story-image-wolf">
            <div className="image-glow" />

            <div className="story-wolf">
              𓃦
            </div>

            <span className="image-label">
              SECURITY CORE
            </span>
          </div>

        </div>

        <div className="story-content">

          <span className="story-number">
            01
          </span>

          <span className="story-small-title">
            THE PROJECT
          </span>

          <h2>
            What is
            <span>Smart API Guard?</span>
          </h2>

          <p>
            Smart API Guard is a security gateway created
            to sit between applications and their APIs.
          </p>

          <p>
            It watches incoming requests, validates access,
            monitors activity and helps identify requests
            that should not reach protected services.
          </p>

          <div className="story-line" />

        </div>

      </section>


      {/* =================================================
          MOTIVE
      ================================================= */}

      <section
        className="story-section story-right"
        ref={addRef}
      >

        <div className="story-content">

          <span className="story-number">
            02
          </span>

          <span className="story-small-title">
            THE MOTIVE
          </span>

          <h2>
            Protection
            <span>before damage.</span>
          </h2>

          <p>
            APIs quietly power modern applications.
            When they are exposed without proper protection,
            a single request can become a serious security
            problem.
          </p>

          <p>
            The idea behind Smart API Guard is simple:
            understand every request before trusting it.
          </p>

          <div className="story-line" />

        </div>

        <div className="story-image-wrap">

          <div className="story-image story-image-protection">

            <div className="protection-orbit orbit-one" />
            <div className="protection-orbit orbit-two" />

            <div className="protection-core">
              <span>✓</span>
            </div>

            <span className="image-label">
              ACCESS CONTROL
            </span>

          </div>

        </div>

      </section>


      {/* =================================================
          GOALS
      ================================================= */}

      <section
        className="story-section story-left"
        ref={addRef}
      >

        <div className="story-image-wrap">

          <div className="story-image story-image-goals">

            <div className="goal-grid">

              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />

            </div>

            <div className="goal-marker">
              01
            </div>

            <span className="image-label">
              SECURITY / VISIBILITY
            </span>

          </div>

        </div>

        <div className="story-content">

          <span className="story-number">
            03
          </span>

          <span className="story-small-title">
            THE GOALS
          </span>

          <h2>
            Make security
            <span>visible.</span>
          </h2>

          <p>
            The project focuses on bringing important
            security information into one clear interface.
          </p>

          <ul className="story-list">
            <li>Monitor API traffic</li>
            <li>Control access</li>
            <li>Track security events</li>
            <li>Understand usage patterns</li>
          </ul>

        </div>

      </section>


      {/* =================================================
          FEATURES
      ================================================= */}

      <section
        className="story-features"
        ref={addRef}
      >

        <div className="features-heading">

          <span>
            04 / CORE FEATURES
          </span>

          <h2>
            Built around
            <em>clarity.</em>
          </h2>

        </div>

        <div className="feature-story-grid">

          <article className="story-feature-card">

            <span>01</span>

            <div className="feature-icon">
              ◈
            </div>

            <h3>
              API Keys
            </h3>

            <p>
              Create and manage credentials that control
              access to protected APIs.
            </p>

          </article>

          <article className="story-feature-card">

            <span>02</span>

            <div className="feature-icon">
              ◉
            </div>

            <h3>
              Request Monitoring
            </h3>

            <p>
              Observe requests as they move through the
              security gateway.
            </p>

          </article>

          <article className="story-feature-card">

            <span>03</span>

            <div className="feature-icon">
              ◌
            </div>

            <h3>
              Analytics
            </h3>

            <p>
              Turn API activity into useful information
              through security and usage analytics.
            </p>

          </article>

        </div>

      </section>


      {/* =================================================
          PRODUCT MAP
      ================================================= */}

      <section
        className="product-map"
        ref={addRef}
      >

        <div className="map-heading">

          <span>
            05 / THE CONSOLE
          </span>

          <h2>
            One system.
            <span>Four perspectives.</span>
          </h2>

        </div>

        <div className="map-list">

          <div className="map-item">

            <span className="map-number">
              01
            </span>

            <div>
              <h3>
                Dashboard
              </h3>

              <p>
                A live overview of the security environment,
                activity and system health.
              </p>
            </div>

            <span className="map-arrow">
              →
            </span>

          </div>

          <div className="map-item">

            <span className="map-number">
              02
            </span>

            <div>
              <h3>
                API Keys
              </h3>

              <p>
                Manage the credentials responsible for
                controlled API access.
              </p>
            </div>

            <span className="map-arrow">
              →
            </span>

          </div>

          <div className="map-item">

            <span className="map-number">
              03
            </span>

            <div>
              <h3>
                Request Monitor
              </h3>

              <p>
                Follow incoming API requests and understand
                how the gateway responds to them.
              </p>
            </div>

            <span className="map-arrow">
              →
            </span>

          </div>

          <div className="map-item">

            <span className="map-number">
              04
            </span>

            <div>
              <h3>
                Analytics
              </h3>

              <p>
                Discover patterns and trends hidden inside
                API activity.
              </p>
            </div>

            <span className="map-arrow">
              →
            </span>

          </div>

        </div>

      </section>


      {/* =================================================
          END
      ================================================= */}

      <section className="project-ending">

        <div className="ending-wolf">
          𓃦
        </div>

        <span>
          SMART API GUARD
        </span>

        <h2>
          Security should feel
          <em>simple.</em>
        </h2>

        <p>
          A focused security layer for modern APIs.
        </p>

      </section>


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="project-footer">

        <div>
          © 2026 Smart API Guard
        </div>

        <div className="footer-links">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Security</span>
          <span>v1.0</span>
        </div>

      </footer>

    </div>
  );
}

export default ProjectIntro;