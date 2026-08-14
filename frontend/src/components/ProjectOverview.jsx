import "./ProjectOverview.css";

function ProjectOverview() {
  const slides = [
    {
      number: "01",
      title: "SMART API GUARD",
      text: "A security-focused API gateway designed to protect, monitor and control API traffic from one intelligent console.",
      image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=85",
      side: "left",
      className: "overview-intro",
    },
    {
      number: "02",
      title: "THE PURPOSE",
      text: "Bring authentication, request protection, API access control and traffic visibility together in a single security layer.",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=85",
      side: "right",
    },
    {
      number: "03",
      title: "THE GOAL",
      text: "Make API security easier to understand, easier to control and easier to monitor without losing the elegance of a professional security system.",
      image:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=85",
      side: "left",
    },
    {
      number: "04",
      title: "REAL-TIME PROTECTION",
      text: "Every request becomes visible. Successful traffic, blocked requests, unauthorized access and rate limits can be monitored as they happen.",
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=85",
      side: "right",
    },
    {
      number: "05",
      title: "API KEYS",
      text: "API keys provide controlled access to protected services while giving the security layer a clear way to identify and manage clients.",
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1400&q=85",
      side: "left",
    },
    {
      number: "06",
      title: "REQUEST MONITOR",
      text: "The request monitor gives a clear view of incoming API traffic, methods, endpoints, status codes and access decisions.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=85",
      side: "right",
    },
    {
      number: "07",
      title: "ANALYTICS",
      text: "Turn API traffic into useful security intelligence through patterns, statistics and activity insights.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=85",
      side: "left",
    },
    {
      number: "08",
      title: "SECURITY WITH IDENTITY",
      text: "The wolf represents the identity of Smart API Guard — alert, controlled and always watching over the gateway.",
      image:
        "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1400&q=85",
      side: "right",
      wolf: true,
    },
  ];

  const features = [
    "API protection",
    "Authentication",
    "API key management",
    "Request monitoring",
    "Rate limiting",
    "Access control",
    "Security analytics",
    "Live gateway status",
  ];

  return (
    <section className="project-overview">

      {/* =====================================================
          INTRO
          ===================================================== */}

      <div className="overview-heading">
        <span className="overview-eyebrow">
          SMART API GUARD / PROJECT
        </span>

        <h1>
          Security,
          <span> explained beautifully.</span>
        </h1>

        <p>
          A visual introduction to the idea, purpose and
          capabilities behind Smart API Guard.
        </p>
      </div>

      {/* =====================================================
          FEATURE STRIP
          ===================================================== */}

      <div className="overview-feature-strip">
        {features.map((feature, index) => (
          <div
            className="overview-feature"
            key={feature}
          >
            <span>
              {String(index + 1).padStart(2, "0")}
            </span>

            <strong>{feature}</strong>
          </div>
        ))}
      </div>

      {/* =====================================================
          IMAGE STORY
          ===================================================== */}

      <div className="overview-story">

        {slides.map((slide, index) => (
          <article
            className={`overview-slide ${slide.side} ${
              slide.wolf ? "wolf-slide" : ""
            }`}
            key={slide.number}
          >

            <div className="overview-image-wrap">

              <div className="overview-image-frame">

                <img
                  src={slide.image}
                  alt={slide.title}
                  loading={
                    index < 2
                      ? "eager"
                      : "lazy"
                  }
                />

                <div className="overview-image-overlay" />

                {slide.wolf && (
                  <div className="overview-wolf">
                    𓃦
                  </div>
                )}

                <span className="overview-image-number">
                  {slide.number}
                </span>

              </div>

            </div>

            <div className="overview-slide-content">

              <span className="overview-slide-number">
                {slide.number} / 08
              </span>

              <div className="overview-title-line" />

              <h2>{slide.title}</h2>

              <p>{slide.text}</p>

            </div>

          </article>
        ))}

      </div>

      {/* =====================================================
          CAPABILITIES
          ===================================================== */}

      <section className="overview-capabilities">

        <div className="capabilities-heading">

          <span className="overview-eyebrow">
            CORE CAPABILITIES
          </span>

          <h2>
            Built around
            <span> protection.</span>
          </h2>

        </div>

        <div className="capabilities-grid">

          <div className="capability-card">
            <span>01</span>
            <h3>Protect</h3>
            <p>
              Protect APIs from unauthorized and
              unwanted traffic.
            </p>
          </div>

          <div className="capability-card">
            <span>02</span>
            <h3>Control</h3>
            <p>
              Control who can access your protected
              API resources.
            </p>
          </div>

          <div className="capability-card">
            <span>03</span>
            <h3>Monitor</h3>
            <p>
              Observe requests and security events
              through a live monitoring layer.
            </p>
          </div>

          <div className="capability-card">
            <span>04</span>
            <h3>Understand</h3>
            <p>
              Convert API activity into meaningful
              security and performance insight.
            </p>
          </div>

        </div>
      </section>

      {/* =====================================================
          WOLF STATEMENT
          ===================================================== */}

      <section className="overview-wolf-section">

        <div className="wolf-background">
          𓃦
        </div>

        <div className="wolf-section-content">

          <span className="overview-eyebrow">
            THE IDENTITY
          </span>

          <h2>
            Always watching.
            <br />
            Always protecting.
          </h2>

          <p>
            The wolf is more than a visual element.
            It represents the character of Smart API Guard:
            awareness, protection, precision and control.
          </p>

        </div>

      </section>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <footer className="overview-footer">

        <div className="overview-footer-brand">

          <div className="footer-wolf">
            𓃦
          </div>

          <div>
            <strong>SMART API GUARD</strong>
            <span>SECURITY CORE</span>
          </div>

        </div>

        <div className="overview-footer-links">

          <span>Privacy Policy</span>
          <span>Terms & Conditions</span>
          <span>Copyright © 2026</span>
          <span>Version 1.0</span>

        </div>

      </footer>

    </section>
  );
}

export default ProjectOverview;