import { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-scroll";
import RotatingText from "./react-bits/RotatingText";
import SplitText from "./react-bits/SplitText";
import AnimatedContent from "./react-bits/AnimatedContent";

const Aurora = lazy(() => import("./react-bits/Aurora"));

const HeroFallback = ({ isDark }) => (
  <div
    className="absolute inset-0 bg-signal-field"
    style={{ opacity: isDark ? 0.9 : 0.4 }}
    aria-hidden="true"
  />
);

export default function Hero({ theme }) {
  const { t } = useTranslation();
  const isDark = theme === "Dark";

  const auroraColors = isDark
    ? ["#55E6FF", "#8B5CF6", "#D946EF"] // ion, electric, plasma
    : ["#0284c7", "#7c3aed", "#c026d3"]; // cyan-600, violet-600, magenta-600

  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24"
    >
      {/* WebGL Soft Aurora backdrop – lazy loaded */}
      <Suspense fallback={<HeroFallback isDark={isDark} />}>
        <Aurora
          isDark={isDark}
          colorStops={auroraColors}
          speed={1.0}
          amplitude={1.0}
          blend={0.8}
          className="absolute inset-0 h-full w-full"
        />
      </Suspense>

      {/* Content */}
      <AnimatedContent className="relative z-10 mx-auto max-w-4xl text-center" delay={0.1}>
        {/* Greeting */}
        <p className="font-mono text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600 dark:text-ion mb-4">
          {t("im")}
        </p>

        {/* Name */}
        <h1 className="font-display text-5xl font-bold leading-tight tracking-tight sm:text-7xl lg:text-8xl mb-4 text-slate-900 dark:text-cloud">
          <SplitText by="word" stagger={0.08} className="signal-gradient">Ardhi Rahmaan</SplitText>
        </h1>

        {/* Role cycling */}
        <div className="font-display text-2xl font-semibold sm:text-3xl min-h-[2.5rem] mb-8 text-violet-600 dark:text-electric">
          <RotatingText
            strings={["Software Engineer", "Full-Stack Developer", "Open Source Enthusiast"]}
            interval={3000}
          />
        </div>

        {/* Short intro */}
        <p className="font-body mx-auto max-w-xl text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-12">
          {t("short_intro")}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="portfolio"
            smooth
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-electric px-7 py-3 font-body text-sm font-semibold text-white shadow-lg shadow-electric/30 transition-all duration-300 hover:bg-violet-600 hover:shadow-violet-500/40 focus-visible:outline-electric"
          >
            {t("portfolio")}
          </Link>
          <Link
            to="contact"
            smooth
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-cyan-500/40 bg-white/80 px-7 py-3 font-body text-sm font-semibold text-cyan-700 backdrop-blur-sm transition-all duration-300 hover:border-cyan-600 hover:bg-cyan-50 focus-visible:outline-cyan-500 dark:border-ion/40 dark:bg-void/20 dark:text-ion dark:hover:border-ion dark:hover:bg-ion/10"
          >
            {t("contact")}
          </Link>
        </div>
      </AnimatedContent>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 animate-bounce opacity-70" aria-hidden="true">
        <div className="h-6 w-px bg-gradient-to-b from-cyan-500 to-transparent dark:from-ion mx-auto" />
        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-500 dark:bg-ion mx-auto" />
      </div>
    </section>
  );
}

