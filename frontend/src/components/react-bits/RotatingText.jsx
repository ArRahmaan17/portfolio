/**
 * RotatingText – GSAP-driven word/phrase rotation (replaces typed.js).
 * Vendored from React Bits (free JS/Tailwind variant).
 * Modified for: reduced-motion support, theme tokens.
 *
 * Attribution: reactbits.dev  /  MIT licence
 */
import { useEffect, useRef, useState, memo } from "react";
import { gsap } from "gsap";

function RotatingText({
  strings = [],
  interval = 2800,
  delay = 0,
  className = "",
}) {
  const [index, setIndex] = useState(0);
  const elRef = useRef(null);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    setIndex(0);
  }, [strings]);

  useEffect(() => {
    if (prefersReducedMotion || strings.length <= 1) return;

    const el = elRef.current;
    let intervalTimer;
    const rotate = () => {
      gsap.to(el, {
        opacity: 0,
        y: -12,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setIndex((i) => (i + 1) % strings.length);
          gsap.fromTo(
            el,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
          );
        },
      });
    };

    const startTimer = setTimeout(() => {
      intervalTimer = setInterval(rotate, interval);
    }, delay);

    return () => {
      clearTimeout(startTimer);
      clearInterval(intervalTimer);
      gsap.killTweensOf(el);
    };
  }, [strings, interval, delay, prefersReducedMotion]);

  return (
    <span ref={elRef} className={`inline-block ${className}`}>
      {strings[index] ?? ""}
    </span>
  );
}

export default memo(RotatingText);
