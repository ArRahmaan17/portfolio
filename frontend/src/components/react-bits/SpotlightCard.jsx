/**
 * SpotlightCard – card with a radial spotlight that follows the pointer.
 * Vendored from React Bits (free JS/Tailwind variant).
 * Modified for: theme tokens, reduced-motion, coarse pointer skip.
 *
 * Attribution: reactbits.dev  /  MIT licence
 */
import { useRef, useCallback, memo } from "react";

function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(85,230,255,0.10)",
}) {
  const cardRef = useRef(null);
  const isCoarsePointer =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleMouseMove = useCallback(
    (e) => {
      if (isCoarsePointer || prefersReducedMotion) return;
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--spotlight-x", `${x}px`);
      card.style.setProperty("--spotlight-y", `${y}px`);
      card.style.setProperty("--spotlight-color", spotlightColor);
      card.style.setProperty("--spotlight-opacity", "1");
    },
    [isCoarsePointer, prefersReducedMotion, spotlightColor]
  );

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (card) card.style.setProperty("--spotlight-opacity", "0");
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`spotlight-card ${className}`}
      style={{
        "--spotlight-x": "50%",
        "--spotlight-y": "50%",
        "--spotlight-opacity": "0",
        "--spotlight-color": spotlightColor,
      }}
    >
      {/* spotlight radial layer */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          borderRadius: "inherit",
          background: `radial-gradient(320px circle at var(--spotlight-x) var(--spotlight-y), var(--spotlight-color), transparent 70%)`,
          opacity: "var(--spotlight-opacity)",
          transition: "opacity 0.3s ease",
          zIndex: 0,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default memo(SpotlightCard);
