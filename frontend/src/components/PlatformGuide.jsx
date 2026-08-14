import { useEffect, useRef, useState } from "react";
import "./PlatformGuide.css";

const sections = [
  {
    number: "01",
    title: "THE DASHBOARD",
    subtitle: "Your security command center",
    description:
      "A single view of your API environment. Monitor traffic, system health, security activity and gateway performance without losing sight of what matters.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    side: "left",
  },
  {
    number: "02",
    title: "API KEYS",
    subtitle: "Control who gets access",
    description:
      "Create, manage and monitor API credentials from one secure space. Keep your integrations organized while maintaining control over access.",
    image:
      "https://images.unsplash.com/photo-1633265486064-086b219458ec?auto=format&fit=crop&w=1200&q=80",
    side: "right",
  },
  {
    number: "03",
    title: "REQUEST MONITOR",
    subtitle: "See every request",
    description:
      "Follow API activity as it happens. Inspect methods, endpoints, response status and access decisions to understand exactly what is moving through your gateway.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    side: "left",
  },
  {
    number: "04",
    title: "ANALYTICS",
    subtitle: "Turn activity into insight",
    description:
      "Understand patterns across your API traffic with clear visual information about usage, successful requests, blocked activity and security events.",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
    side: "right",
  },
];

function PlatformGuide() {
  const [visibleItems, setVisibleItems] = useState({});
  const itemRefs = useRef([]);

  useEffect(() => {
    const observers = [];

    itemRefs.current.forEach((element, index) => {
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems((current) => ({
              ...current,
              [index]: true,
            }));

            observer.disconnect();
          }
        },
        {
          threshold: 0.2,
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <section className="platform-guide">
      <div className="platform-guide-heading">
        <span className="platform-guide-eyebrow">
          INSIDE SMART API GUARD
        </span>

        <h2>
          Built around
          <span> visibility.</span>
        </h2>

        <p>
          Every part of the console has a purpose — from
          controlling access to understanding every request
          that reaches your API.
        </p>
      </div>

      <div className="platform-guide-list">
        {sections.map((item, index) => (
          <article
            key={item.number}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
            className={`
              platform-guide-item
              ${item.side === "right" ? "image-right" : "image-left"}
              ${visibleItems[index] ? "is-visible" : ""}
            `}
          >
            <div className="platform-guide-image-wrap">
              <div className="platform-guide-image-frame">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                />

                <div className="platform-guide-image-overlay" />

                <span className="platform-guide-image-number">
                  {item.number}
                </span>
              </div>
            </div>

            <div className="platform-guide-content">
              <span className="platform-guide-number">
                {item.number}
              </span>

              <span className="platform-guide-label">
                {item.subtitle}
              </span>

              <h3>{item.title}</h3>

              <p>{item.description}</p>

              <div className="platform-guide-line">
                <span />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default PlatformGuide;