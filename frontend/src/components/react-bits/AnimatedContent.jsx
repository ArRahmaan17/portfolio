/**
 * AnimatedContent – IntersectionObserver-driven section entrance.
 * Vendored from React Bits (free JS/Tailwind variant).
 * Modified for: reduced-motion support, GSAP.
 *
 * Attribution: reactbits.dev  /  MIT licence
 */
import { useEffect, useRef, memo } from "react";
import { gsap } from "gsap";

function AnimatedContent({
  children,
  className = "",
  threshold = 0.12,
  delay = 0,
  duration = 0.7,
  from = "bottom",  /* "bottom" | "left" | "right" | "top" | "fade" */
}) {
  const ref = useRef(null);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;

    const dir = {
      bottom: { y: 32, x: 0 },
      top:    { y: -32, x: 0 },
      left:   { y: 0, x: -32 },
      right:  { y: 0, x: 32 },
      fade:   { y: 0, x: 0 },
    }[from] ?? { y: 32, x: 0 };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        gsap.fromTo(
          el,
          { opacity: 0, ...dir },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration,
            delay,
            ease: "power3.out",
            clearProps: "opacity,transform",
          }
        );
        observer.unobserve(el);
      },
      { threshold }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      gsap.killTweensOf(el);
    };
  }, [from, delay, duration, threshold, prefersReducedMotion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export default memo(AnimatedContent);
