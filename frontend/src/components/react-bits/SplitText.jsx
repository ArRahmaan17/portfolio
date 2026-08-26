/**
 * SplitText – Character/word-level entrance animation using GSAP.
 * Vendored from React Bits (free JS/Tailwind variant).
 * Modified for: React VDOM purity, reduced-motion, individual unit gradient clipping.
 *
 * Attribution: reactbits.dev / MIT licence
 */
import { useEffect, useRef, memo } from "react";
import { gsap } from "gsap";

function SplitText({
  children,
  className = "",
  tag: Tag = "span",
  delay = 0,
  stagger = 0.025,
  by = "char", /* "char" | "word" */
}) {
  const containerRef = useRef(null);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const rawText = typeof children === "string" ? children : String(children || "");
  const text = rawText.replace(/\s+/g, " ").trim();
  const units = by === "char" ? Array.from(text) : text.split(" ");

  useEffect(() => {
    const el = containerRef.current;
    if (!el || prefersReducedMotion) return;

    const targets = el.querySelectorAll(".split-unit");
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger,
          delay,
          ease: "power3.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [text, by, delay, stagger, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag ref={containerRef} className="inline-block">
      {units.map((unit, i) => {
        if (unit === " ") {
          return (
            <span key={i} className={`split-unit inline-block ${className}`}>
              &nbsp;
            </span>
          );
        }
        return (
          <span key={i} className={`split-unit inline-block ${className}`}>
            {by === "word" && i < units.length - 1 ? unit + "\u00A0" : unit}
          </span>
        );
      })}
    </Tag>
  );
}

export default memo(SplitText);
