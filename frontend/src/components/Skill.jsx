import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import "moment/locale/id";
import { Braces, Database, Layers3 } from "lucide-react";
import { backendAssetUrl, SKILLS_URL } from "../constants";
import SectionHeading from "./SectionHeading";
import AnimatedContent from "./react-bits/AnimatedContent";
import LogoLoop from "./react-bits/LogoLoop";
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
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadSkills();
    return () => { cancelled = true; };
  }, []);

  const loopItems = useMemo(() => skills.map((item) => ({ ...item, icon: item.icon ? backendAssetUrl(item.icon) : item.imageUrl })), [skills]);
  const capabilities = [
    { icon: Braces, title: t("stack_section.capabilities.interfaces.0"), copy: t("stack_section.capabilities.interfaces.1") },
    { icon: Database, title: t("stack_section.capabilities.applications.0"), copy: t("stack_section.capabilities.applications.1") },
    { icon: Layers3, title: t("stack_section.capabilities.delivery.0"), copy: t("stack_section.capabilities.delivery.1") },
  ];

  return (
    <section id="stack" className="section-shell border-y border-slate-200/70 bg-slate-50/70 dark:border-white/5 dark:bg-panel/35">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-end gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow={t("stack")}
            title={t("stack_section.title", { defaultValue: "Tools are useful. Judgment makes them matter." })}
            description={t("stack_section.description", { defaultValue: "I work across product interfaces, backend services, and delivery—choosing technology around the problem, not the trend." })}
          />
          <AnimatedContent from="right" className="grid gap-px overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-200 dark:border-white/10 dark:bg-white/10 sm:grid-cols-3">
            {capabilities.map(({ icon: Icon, title, copy }) => (
              <SpotlightCard key={title} className="rounded-none border-0 p-5 sm:p-6" spotlightColor="rgba(85,230,255,0.12)">
                <Icon className="h-5 w-5 text-electric dark:text-ion" />
                <h3 className="mt-8 font-display text-lg font-semibold text-slate-900 dark:text-cloud">{title}</h3>
                <p className="mt-2 font-body text-sm leading-6 text-slate-600 dark:text-slate-400">{copy}</p>
              </SpotlightCard>
            ))}
          </AnimatedContent>
        </div>

        <div className="mt-16">
          {loading ? (
            <div className="flex gap-3 overflow-hidden" aria-label="Loading technology stack">
              {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-16 min-w-40 animate-pulse rounded-2xl bg-slate-200 dark:bg-white/5" />)}
            </div>
          ) : loopItems.length ? <LogoLoop items={loopItems} /> : (
            <p className="rounded-2xl border border-dashed border-slate-300 px-5 py-4 font-body text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
              {t("stack_section.empty", { defaultValue: "The live technology list is temporarily unavailable." })}
            </p>
          )}
        </div>

        {!loading && skills.length > 0 ? (
          <AnimatedContent className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" delay={0.1}>
            {skills.slice(0, 6).map((item) => {
              const startDate = item.start_date ?? item.start;
              const experienceLabel = startDate ? `${moment(startDate).locale(lang).fromNow(true)} ${t("experience")}` : "";
              return (
                <div key={item.id ?? item.name} className="rounded-2xl border border-slate-200/80 bg-white/65 p-4 dark:border-white/10 dark:bg-white/[0.025]">
                  <p className="font-body text-sm font-semibold text-slate-800 dark:text-slate-200">{item.name}</p>
                  {experienceLabel ? <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-wider text-slate-400">{experienceLabel}</p> : null}
                </div>
              );
            })}
          </AnimatedContent>
        ) : null}
      </div>
    </section>
  );
}
