/**
 * SplitText – Character/word-level entrance animation using GSAP.
 * Vendored from React Bits (free JS/Tailwind variant).
 * Modified for: reduced-motion support.
 *
 * Attribution: reactbits.dev  /  MIT licence
 */
import { useEffect, useRef, memo } from "react";
import { gsap } from "gsap";

function SplitText({
  children,
  className = "",
  tag: Tag = "span",
  delay = 0,
  stagger = 0.03,
  by = "word",  /* "char" | "word" */
}) {
  const wrapRef = useRef(null);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || prefersReducedMotion) return;

    /* Split text into spans */
    const text = el.textContent || "";
    const parts = by === "char" ? [...text] : text.split(" ").filter(Boolean);

    el.textContent = "";
    const spans = parts.map((part, i) => {
      const s = document.createElement("span");
      s.style.display = "inline-block";
      s.style.opacity = "0";
      s.style.transform = "translateY(20px)";
      s.textContent = by === "word" && i < parts.length - 1 ? part + "\u00A0" : part;
      el.appendChild(s);
      return s;
    });

    const ctx = gsap.context(() => {
      gsap.to(spans, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger,
        delay,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, [children, by, delay, stagger, prefersReducedMotion]);

  return (
    <Tag ref={wrapRef} className={className}>
      {children}
    </Tag>
  );
}

export default memo(SplitText);
