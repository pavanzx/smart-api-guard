import "./AnimatedBackground.css";

function AnimatedBackground({ variant = "dashboard" }) {
  return (
    <div
      className={`animated-background animated-${variant}`}
      aria-hidden="true"
    >
      <div className="background-grid" />

      <div className="wolf-orbit wolf-orbit-one" />
      <div className="wolf-orbit wolf-orbit-two" />

      <div className="wolf-mark">
        𓃦
      </div>

      <div className="wolf-scan" />

      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <div className="orb orb-three" />

      <div className="scan-line" />

      <div className="security-pulse pulse-one" />
      <div className="security-pulse pulse-two" />
    </div>
  );
}

export default AnimatedBackground;