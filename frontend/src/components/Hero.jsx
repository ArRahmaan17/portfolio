import { Suspense, lazy, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-scroll";
import { ArrowDownRight, MapPin, TerminalSquare } from "lucide-react";
import AnimatedContent from "./react-bits/AnimatedContent";
import RotatingText from "./react-bits/RotatingText";
import SplitText from "./react-bits/SplitText";

const Topography = lazy(() => import("./react-bits/Topography"));

function HeroFallback({ isDark }) {
  return <div className={`absolute inset-0 ${isDark ? "bg-[#071020]" : "bg-[#eaf2fb]"}`} aria-hidden="true" />;
}

export default function Hero({ theme, currentFocusCategories }) {
  const { t, i18n } = useTranslation();
  const isDark = theme === "Dark";

  const focusCategories = useMemo(() => {
    const localeField = (i18n.resolvedLanguage || i18n.language || "en").startsWith("id") ? "title_id" : "title_en";
    if (currentFocusCategories === null) {
      return [{
        id: "fallback-programming",
        key: "programming",
        title: t("hero.programming"),
        strings: [t("hero.focuses.0"), t("hero.focuses.1"), t("hero.focuses.2")],
      }];
    }
    return currentFocusCategories.map((category) => {
      const strings = (category.currentFocuses || []).map((focus) => focus[localeField]).filter(Boolean);
      return {
        id: category.id,
        key: category.key,
        title: category[localeField] || category.title_en || category.key,
        strings: strings.length ? strings : [t("hero.focuses_empty")],
      };
    });
  }, [currentFocusCategories, i18n.language, i18n.resolvedLanguage, t]);

  return (
    <section id="home" className="relative min-h-screen overflow-hidden px-5 pb-14 pt-28 sm:px-8 lg:px-12 lg:pb-10 lg:pt-32">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,250,252,0)_70%,#f8fafc_100%)] dark:bg-[linear-gradient(180deg,rgba(5,8,22,0)_68%,#050816_100%)]" aria-hidden="true" />

      <div className="relative mx-auto grid min-h-[calc(100vh-10rem)] max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <AnimatedContent className="relative z-10" delay={0.05}>
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <span className="status-chip"><span className="status-dot" />{t("hero.available", { defaultValue: "Available for thoughtful work" })}</span>
            <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              <MapPin className="h-3.5 w-3.5" /> Indonesia · UTC+7
            </span>
          </div>

          <p className="section-kicker mb-5">{t("hero.eyebrow", { defaultValue: "Full-stack software engineer" })}</p>
          <h1 className="max-w-4xl font-display text-[clamp(3.4rem,8vw,7.6rem)] font-bold leading-[0.88] tracking-[-0.065em] text-slate-950 dark:text-cloud">
            <span className="block">Ardhi</span>
            <SplitText by="word" stagger={0.08} className="signal-gradient">Rahmaan.</SplitText>
          </h1>

          <p className="mt-8 max-w-xl font-body text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
            {t("hero.summary", { defaultValue: "I design and build dependable web products—from the interface people use to the systems that keep them running." })}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link to="portfolio" smooth className="primary-action group">
              {t("hero.view_work", { defaultValue: "Explore selected work" })}
              <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </Link>
            <Link to="contact" smooth className="secondary-action">
              {t("hero.start_conversation", { defaultValue: "Start a conversation" })}
            </Link>
          </div>
        </AnimatedContent>

        <AnimatedContent from="right" delay={0.15} className="relative min-h-[30rem] lg:min-h-[42rem]">
          <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/40 shadow-[0_40px_100px_-45px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-white/[0.025]">
            <Suspense fallback={<HeroFallback isDark={isDark} />}>
              <Topography isDark={isDark} color={isDark ? "#55E6FF" : "#0369A1"} bgColor={isDark ? "#071020" : "#EAF2FB"} speed={0.55} linesCount={20} className="absolute inset-0 h-full w-full" />
            </Suspense>
            <div className="absolute inset-0 bg-[linear-gradient(145deg,transparent_35%,rgba(139,92,246,0.18)_100%)]" aria-hidden="true" />
            <div className="absolute inset-x-5 top-5 flex items-center justify-between rounded-2xl border border-white/30 bg-white/55 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-void/45">
              <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-slate-600 dark:text-slate-300">
                <TerminalSquare className="h-4 w-4 text-primary" /> {t("hero.current_focus")}
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_5px_rgba(52,211,153,0.12)]" />
            </div>
            <div className="absolute inset-x-5 bottom-5 rounded-[1.75rem] border border-white/30 bg-white/70 p-5 backdrop-blur-2xl dark:border-white/10 dark:bg-void/60 sm:p-6">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{t("hero.activity_board", { defaultValue: "Active threads" })}</p>
              <div
                className="mt-4 max-h-[18rem] overflow-y-auto overscroll-contain pr-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                role="list"
                tabIndex={focusCategories.length > 3 ? 0 : -1}
                aria-label={t("hero.current_focus")}
              >
                {focusCategories.length ? focusCategories.map((category, index) => (
                  <div key={category.id || category.key} role="listitem" className="grid gap-1 border-t border-slate-200/70 py-4 first:border-t-0 first:pt-0 last:pb-0 dark:border-white/10 sm:grid-cols-[minmax(7rem,0.72fr)_1.28fr] sm:items-center sm:gap-5">
                    <p className="truncate font-mono text-[0.62rem] uppercase tracking-[0.15em] text-sky-700 dark:text-cyan-300">{category.title}</p>
                    <div className="min-h-7 overflow-hidden font-display text-lg font-semibold leading-7 text-slate-900 dark:text-cloud sm:text-xl">
                      <RotatingText strings={category.strings} interval={3200} delay={index * 260} />
                    </div>
                  </div>
                )) : (
                  <p className="border-t border-slate-200/70 pt-4 font-display text-lg font-semibold text-slate-900 dark:border-white/10 dark:text-cloud">{t("hero.focuses_empty")}</p>
                )}
              </div>
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
