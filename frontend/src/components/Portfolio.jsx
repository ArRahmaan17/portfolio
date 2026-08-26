import simpkl from "../assets/portfolio/sim-pkl.webp";
import notfound from "../assets/portfolio/not-found.webp";
import todos from "../assets/portfolio/todos.webp";
import pos from "../assets/portfolio/pos.webp";
import filestream from "../assets/portfolio/file-stream.webp";
import dogTable from "../assets/portfolio/dog-table.webp";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { backendAssetUrl, PORTFOLIOS_URL } from "../constants";
import { ExternalLink } from "lucide-react";
import AnimatedContent from "./react-bits/AnimatedContent";
import ElectricBorder from "./react-bits/ElectricBorder";

const FALLBACK_PROJECTS = [
  { id: 1, name: "SIM PKL", link: "https://github.com/ArRahmaan17/sim_pkl", image: simpkl, types: ["Laravel", "Bootstrap"] },
  { id: 2, name: "Frontend Public Chat", link: "https://github.com/ArRahmaan17/frontend-sim-pkl", image: notfound, types: ["Node Js", "React Js"] },
  { id: 3, name: "Backend Public Chat", link: "https://github.com/ArRahmaan17/backend-sim-pkl", image: notfound, types: ["Node Js", "Express Js"] },
  { id: 4, name: "Wa Services Presensi PKL", link: "https://github.com/ArRahmaan17/simpkl-whatsappblast-services", image: notfound, types: ["Node Js", "Express Js"] },
  { id: 5, name: "Todos - Live Demo", link: "https://todos.rahmaanms.my.id", image: todos, types: ["Laravel", "Tailwind Css"] },
  { id: 6, name: "DOGLEXABLE POINT OF SALE", link: "https://dpos.rahmaanms.my.id", image: pos, types: ["Laravel", "Reverb", "Docker", "Tailwind Css"] },
  { id: 7, name: "Filestream", link: "https://filestream.rahmaanms.my.id", image: filestream, types: ["Laravel", "Docker", "Tailwind Css"] },
  { id: 8, name: "Dog Table", link: "https://arrahmaan17.github.io/dog-table", image: dogTable, types: ["JavaScript", "Library", "HTML/CSS"] },
];

function extractPortfolioTypes(portfolio) {
  const candidates = [
    portfolio?.Skills, portfolio?.skills, portfolio?.Skill, portfolio?.skill,
    portfolio?.Stacks, portfolio?.stacks, portfolio?.StackPortfolios, portfolio?.stackPortfolios,
  ];
  const names = candidates.flatMap((c) => {
    if (!c) return [];
    if (Array.isArray(c)) return c.flatMap((item) => {
      if (!item) return [];
      if (typeof item === "string") return [item];
      const direct = item.name ?? item.label;
      if (direct) return [direct];
      const nested = item.Skill?.name ?? item.skill?.name ?? item.Stack?.name ?? item.stack?.name;
      return nested ? [nested] : [];
    });
    if (typeof c === "string") return c.split(",").map((v) => v.trim()).filter(Boolean);
    return [];
  });
  return [...new Set(names.map((n) => String(n).trim()).filter(Boolean))];
}

function resolveProjectImage(imagePath) {
  if (!imagePath) return "";
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  if (typeof imagePath === "string" && imagePath.startsWith("/storage/")) return backendAssetUrl(imagePath);
  return imagePath;
}

export default function Portfolio({ theme }) {
  const { t } = useTranslation();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadPortfolios = async () => {
      try {
        const response = await fetch(PORTFOLIOS_URL);
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.message || `Failed to fetch portfolios (${response.status})`);
        if (!cancelled) setPortfolios(Array.isArray(payload.portfolios) ? payload.portfolios : []);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadPortfolios();
    return () => { cancelled = true; };
  }, []);

  const projects = useMemo(() => {
    if (!portfolios || portfolios.length === 0) return FALLBACK_PROJECTS;
    return portfolios.map((p) => ({
      id: p.id,
      name: p.name,
      link: p.link || "",
      image: p.picture,
      types: extractPortfolioTypes(p),
    }));
  }, [portfolios]);

  const isFallback = !loading && portfolios.length === 0;

  return (
    <section
      id="portfolio"
      className="relative overflow-hidden px-6 py-28 lg:px-8 lg:py-36 bg-white/50 dark:bg-void/80"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-signal-field opacity-30 dark:opacity-60" aria-hidden="true" />

      <div className="mx-auto max-w-7xl">
        <AnimatedContent>
          <h2 className="font-display text-center text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-2 dark:text-cloud text-slate-900">
            {t("portfolio")}
          </h2>
          <p className="font-mono text-center text-sm uppercase tracking-widest text-plasma mb-4">
            Selected Work
          </p>
          {isFallback && (
            <p className="font-body text-center text-xs text-slate-400 mb-8">
              Showing sample projects — live data unavailable.
            </p>
          )}
        </AnimatedContent>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[1200/630] animate-pulse rounded-3xl bg-slate-200 dark:bg-white/5" />
            ))}
          </div>
        ) : (
          <AnimatedContent delay={0.15}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-12">
              {projects.map((project, idx) => {
                const card = (
                  <a
                    href={project.link || undefined}
                    target={project.link ? "_blank" : undefined}
                    rel={project.link ? "noopener noreferrer" : undefined}
                    onClick={(e) => { if (!project.link) e.preventDefault(); }}
                    className="group block overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-panel transition-all duration-400 hover:shadow-2xl hover:shadow-electric/10 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-electric"
                  >
                    <div className="relative overflow-hidden aspect-[1200/630]">
                      <img
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 md:grayscale md:group-hover:grayscale-0"
                        src={resolveProjectImage(project.image)}
                        alt={project.name}
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-display text-base font-semibold dark:text-cloud text-slate-900 leading-snug">
                          {project.name}
                        </p>
                        {project.link && (
                          <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-electric transition-colors" />
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {project.types.map((type) => (
                          <span
                            key={`${project.id}-${type}`}
                            className="inline-block rounded-full bg-slate-100 dark:bg-white/10 px-2 py-0.5 font-mono text-[0.65rem] font-medium text-slate-600 dark:text-slate-300"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </a>
                );

                /* First card gets the featured ElectricBorder treatment */
                return idx === 0 ? (
                  <ElectricBorder key={project.id} radius="1.5rem">
                    {card}
                  </ElectricBorder>
                ) : (
                  <div key={project.id}>{card}</div>
                );
              })}
            </div>
          </AnimatedContent>
        )}
      </div>
    </section>
  );
}
