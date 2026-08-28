/**
 * ScrollStack – scroll-driven stacking cards.
 * Vendored from React Bits (free JavaScript/CSS variant).
 * Modified for: scoped card lookup, window-scroll integration, responsive
 * reduced-motion fallback, and complete effect cleanup.
 *
 * Attribution: reactbits.dev / MIT licence
 */
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Lenis from "lenis";
import "./ScrollStack.css";

export const ScrollStackItem = ({ children, itemClassName = "" }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

function useStaticStack() {
  const getPreference = () =>
    typeof window !== "undefined" &&
    (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(max-width: 767px)").matches);

  const [isStatic, setIsStatic] = useState(getPreference);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileViewport = window.matchMedia("(max-width: 767px)");
    const updatePreference = () => setIsStatic(getPreference());

    reducedMotion.addEventListener("change", updatePreference);
    mobileViewport.addEventListener("change", updatePreference);
    return () => {
      reducedMotion.removeEventListener("change", updatePreference);
      mobileViewport.removeEventListener("change", updatePreference);
    };
  }, []);

  return isStatic;
}

const ScrollStack = ({
  children,
  className = "",
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = "20%",
  scaleEndPosition = "10%",
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete,
}) => {
  const scrollerRef = useRef(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const lenisRef = useRef(null);
  const cardsRef = useRef([]);
  const lastTransformsRef = useRef(new Map());
  const isUpdatingRef = useRef(false);
  const isStatic = useStaticStack();

  const calculateProgress = useCallback((scrollTop, start, end) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / Math.max(end - start, 1);
  }, []);

  const parsePosition = useCallback((value, containerHeight) => {
    if (typeof value === "string" && value.includes("%")) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value) || 0;
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return { scrollTop: window.scrollY, containerHeight: window.innerHeight };
    }

    const scroller = scrollerRef.current;
    return {
      scrollTop: scroller?.scrollTop ?? 0,
      containerHeight: scroller?.clientHeight ?? 0,
    };
  }, [useWindowScroll]);

  const getElementOffset = useCallback(
    (element) => {
      if (useWindowScroll) {
        let offset = 0;
        let current = element;
        while (current) {
          offset += current.offsetTop;
          current = current.offsetParent;
        }
        return offset;
      }
      return element.offsetTop;
    },
    [useWindowScroll],
  );

  const updateCardTransforms = useCallback(() => {
    if (isStatic || !cardsRef.current.length || isUpdatingRef.current) return;

    isUpdatingRef.current = true;
    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx = parsePosition(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePosition(scaleEndPosition, containerHeight);
    const endElement = scrollerRef.current?.querySelector(".scroll-stack-end");
    const endElementTop = endElement ? getElementOffset(endElement) : 0;

    let topCardIndex = 0;
    if (blurAmount) {
      cardsRef.current.forEach((card, index) => {
        const triggerStart =
          getElementOffset(card) - stackPositionPx - itemStackDistance * index;
        if (scrollTop >= triggerStart) topCardIndex = index;
      });
    }

    cardsRef.current.forEach((card, index) => {
      const cardTop = getElementOffset(card);
      const triggerStart =
        cardTop - stackPositionPx - itemStackDistance * index;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinEnd = endElementTop - containerHeight / 2;
      const scaleProgress = calculateProgress(
        scrollTop,
        triggerStart,
        triggerEnd,
      );
      const targetScale = baseScale + index * itemScale;
      const scale = 1 - scaleProgress * (1 - Math.min(targetScale, 1));
      const rotation = rotationAmount * index * scaleProgress;
      const blur =
        blurAmount && index < topCardIndex
          ? (topCardIndex - index) * blurAmount
          : 0;

      let translateY = 0;
      if (scrollTop >= triggerStart && scrollTop <= pinEnd) {
        translateY =
          scrollTop - cardTop + stackPositionPx + itemStackDistance * index;
      } else if (scrollTop > pinEnd) {
        translateY =
          pinEnd - cardTop + stackPositionPx + itemStackDistance * index;
      }

      const nextTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
      };
      const previousTransform = lastTransformsRef.current.get(index);
      const hasChanged =
        !previousTransform ||
        Math.abs(previousTransform.translateY - nextTransform.translateY) >
          0.1 ||
        Math.abs(previousTransform.scale - nextTransform.scale) > 0.001 ||
        Math.abs(previousTransform.rotation - nextTransform.rotation) > 0.1 ||
        Math.abs(previousTransform.blur - nextTransform.blur) > 0.1;

      if (hasChanged) {
        card.style.transform = `translate3d(0, ${nextTransform.translateY}px, 0) scale(${nextTransform.scale}) rotate(${nextTransform.rotation}deg)`;
        card.style.filter = nextTransform.blur
          ? `blur(${nextTransform.blur}px)`
          : "";
        lastTransformsRef.current.set(index, nextTransform);
      }

      if (index === cardsRef.current.length - 1) {
        const isInStack = scrollTop >= triggerStart && scrollTop <= pinEnd;
        if (isInStack && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInStack) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    baseScale,
    blurAmount,
    calculateProgress,
    getElementOffset,
    getScrollData,
    isStatic,
    itemScale,
    itemStackDistance,
    onStackComplete,
    parsePosition,
    rotationAmount,
    scaleEndPosition,
    stackPosition,
  ]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const inner = scroller?.querySelector(".scroll-stack-inner");
    if (!scroller || !inner) return undefined;

    const cards = Array.from(inner.children).filter((element) =>
      element.classList.contains("scroll-stack-card"),
    );
    const transformsCache = lastTransformsRef.current;
    cardsRef.current = cards;

    cards.forEach((card, index) => {
      card.style.marginBottom =
        index < cards.length - 1 ? `${itemDistance}px` : "0px";
      card.style.transitionDuration = `${scaleDuration}s`;
      card.style.transformOrigin = "top center";
      if (!isStatic) card.style.willChange = "transform, filter";
    });

    if (!isStatic) {
      const options = {
        duration: 1.2,
        easing: (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
        smoothWheel: true,
        syncTouch: true,
        touchMultiplier: 2,
        wheelMultiplier: 1,
        lerp: 0.1,
        infinite: false,
      };

      if (!useWindowScroll) {
        options.wrapper = scroller;
        options.content = inner;
      }

      const lenis = new Lenis(options);
      const handleScroll = () => updateCardTransforms();
      lenis.on("scroll", handleScroll);

      const animate = (time) => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animationFrameRef.current = requestAnimationFrame(animate);
      lenisRef.current = lenis;
      updateCardTransforms();
    }

    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      lenisRef.current?.destroy();
      animationFrameRef.current = null;
      lenisRef.current = null;
      stackCompletedRef.current = false;
      isUpdatingRef.current = false;
      transformsCache.clear();
      cardsRef.current = [];
      cards.forEach((card) => {
        card.style.removeProperty("filter");
        card.style.removeProperty("margin-bottom");
        card.style.removeProperty("transform");
        card.style.removeProperty("transform-origin");
        card.style.removeProperty("transition-duration");
        card.style.removeProperty("will-change");
      });
    };
  }, [
    children,
    isStatic,
    itemDistance,
    scaleDuration,
    updateCardTransforms,
    useWindowScroll,
  ]);

  return (
    <div
      className={`scroll-stack-scroller ${useWindowScroll ? "scroll-stack-window" : ""} ${isStatic ? "scroll-stack-static" : ""} ${className}`.trim()}
      ref={scrollerRef}
    >
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" aria-hidden="true" />
      </div>
    </div>
  );
};

export default ScrollStack;
