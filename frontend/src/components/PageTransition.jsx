import { useEffect, useState } from "react";

function PageTransition({ children, pageKey }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);

    const frame = requestAnimationFrame(() => {
      setVisible(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [pageKey]);

  return (
    <div
      className={`page-transition ${
        visible ? "page-transition-visible" : ""
      }`}
    >
      {children}
    </div>
  );
}

export default PageTransition;