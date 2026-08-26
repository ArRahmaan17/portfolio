import { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-scroll";
import RotatingText from "./react-bits/RotatingText";
import SplitText from "./react-bits/SplitText";
import AnimatedContent from "./react-bits/AnimatedContent";

const DarkVeil = lazy(() => import("./react-bits/DarkVeil"));

const HeroFallback = ({ isDark }) => (
  <div
    className="absolute inset-0 bg-signal-field"
    style={{ opacity: isDark ? 1 : 0.4 }}
    aria-hidden="true"
  />
);

export default function Hero({ theme }) {
  const { t } = useTranslation();
  const isDark = theme === "Dark";

  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24"
    >
      {/* WebGL backdrop – lazy loaded */}
      <Suspense fallback={<HeroFallback isDark={isDark} />}>
        <DarkVeil isDark={isDark} className="absolute inset-0 h-full w-full" />
      </Suspense>

      {/* Content */}
      <AnimatedContent className="relative z-10 mx-auto max-w-4xl text-center" delay={0.1}>
        {/* Greeting */}
        <p className="font-mono text-sm font-medium uppercase tracking-[0.3em] text-ion mb-4">
          {t("im")}
        </p>

        {/* Name */}
        <h1 className="font-display text-5xl font-bold leading-tight tracking-tight sm:text-7xl lg:text-8xl dark:text-cloud text-slate-900 mb-4">
          <SplitText by="char" stagger={0.025} className="signal-gradient">
            Ardhi Rahmaan
          </SplitText>
        </h1>

        {/* Role cycling (replaces typed.js) */}
        <div className="font-display text-2xl font-semibold sm:text-3xl min-h-[2.5rem] mb-8 text-electric dark:text-electric">
          <RotatingText
            strings={["Software Engineer", "Full-Stack Developer", "Open Source Enthusiast"]}
            interval={3000}
          />
        </div>

        {/* Short intro */}
        <p className="font-body mx-auto max-w-xl text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300 mb-12">
          {t("short_intro")}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="portfolio"
            smooth
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-electric px-7 py-3 font-body text-sm font-semibold text-white shadow-lg shadow-electric/30 transition-all duration-300 hover:bg-violet-500 hover:shadow-violet-400/40 focus-visible:outline-electric"
          >
            {t("portfolio")}
          </Link>
          <Link
            to="contact"
            smooth
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-ion/40 bg-white/10 px-7 py-3 font-body text-sm font-semibold text-ion backdrop-blur-sm transition-all duration-300 hover:border-ion hover:bg-ion/10 focus-visible:outline-ion dark:bg-void/20"
          >
            {t("contact")}
          </Link>
        </div>
      </AnimatedContent>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 animate-bounce opacity-50" aria-hidden="true">
        <div className="h-6 w-px bg-gradient-to-b from-ion to-transparent mx-auto" />
        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-ion mx-auto" />
      </div>
    </section>
  );
}
