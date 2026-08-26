import { useTranslation } from "react-i18next";
import moment from "moment/min/moment-with-locales";
import { useEffect, useState } from "react";
import { SKILLS_URL } from "../constants";
import { API_BASE_URL } from "../constants/api";
import AnimatedContent from "./react-bits/AnimatedContent";
import SpotlightCard from "./react-bits/SpotlightCard";

export default function Skill({ lang }) {
  const { t } = useTranslation();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadSkills = async () => {
      try {
        const response = await fetch(SKILLS_URL);
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.message || `Failed to fetch skills (${response.status})`);
        if (!cancelled) setSkills(Array.isArray(payload.skills) ? payload.skills : []);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadSkills();
    return () => { cancelled = true; };
  }, []);

  return (
    <section
      id="stack"
      className="relative overflow-hidden px-6 py-28 lg:px-8 lg:py-36 dark:bg-panel/50 bg-slate-50/80"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-signal-field opacity-40" aria-hidden="true" />

      <div className="mx-auto max-w-6xl">
        <AnimatedContent>
          <h2 className="font-display text-center text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-2 dark:text-cloud text-slate-900">
            {t("stack")}
          </h2>
          <p className="font-mono text-center text-sm uppercase tracking-widest text-ion mb-12">
            Technologies &amp; Tools
          </p>
        </AnimatedContent>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-200 dark:bg-white/5" />
            ))}
          </div>
        ) : skills.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-body">No skills data available.</div>
        ) : (
          <AnimatedContent delay={0.15}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {skills.map((item) => {
                const startDate = item.start_date ?? item.start;
                const experienceLabel = startDate
                  ? `${moment(startDate).locale(lang).fromNow(true)} ${t("experience")}`
                  : "";

                return (
                  <SpotlightCard
                    key={item.id ?? item.name}
                    className="group cursor-default border border-slate-200 dark:border-white/10 p-4 transition-shadow hover:shadow-lg hover:shadow-electric/10"
                    spotlightColor="rgba(139,92,246,0.12)"
                  >
                    <div className="flex flex-col items-start gap-3">
                      <img
                        loading="lazy"
                        className="h-10 w-10 object-contain scale-100 transition-transform duration-500 group-hover:scale-110"
                        src={item.icon ? `${API_BASE_URL}${item.icon}` : item.imageUrl}
                        alt={item.name}
                      />
                      <div>
                        <p className="font-body text-sm font-semibold dark:text-cloud text-slate-800">
                          {item.name}
                        </p>
                        {experienceLabel && (
                          <p className="font-mono text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                            {experienceLabel}
                          </p>
                        )}
                      </div>
                    </div>
                  </SpotlightCard>
                );
              })}
            </div>
          </AnimatedContent>
        )}
      </div>
    </section>
  );
}
