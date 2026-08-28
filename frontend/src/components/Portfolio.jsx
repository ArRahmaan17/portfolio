import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import simpkl from "../assets/portfolio/sim-pkl.webp";
import notfound from "../assets/portfolio/not-found.webp";
import todos from "../assets/portfolio/todos.webp";
import pos from "../assets/portfolio/pos.webp";
import filestream from "../assets/portfolio/file-stream.webp";
import dogTable from "../assets/portfolio/dog-table.webp";
import { backendAssetUrl, PORTFOLIOS_URL } from "../constants";
import SectionHeading from "./SectionHeading";
import SpotlightCard from "./react-bits/SpotlightCard";
import ScrollStack, { ScrollStackItem } from "./react-bits/ScrollStack";

const FALLBACK_PROJECTS = [
  {
    id: 1,
    name: "SIM PKL",
    description:
      "A practical internship management platform connecting students, supervisors, and attendance workflows.",
    link: "https://github.com/ArRahmaan17/sim_pkl",
    image: simpkl,
    types: ["Laravel", "Bootstrap"],
  },
  {
    id: 2,
    name: "Frontend Public Chat",
    description:
      "A responsive chat interface built for clear, fast public conversations.",
    link: "https://github.com/ArRahmaan17/frontend-sim-pkl",
    image: notfound,
    types: ["Node Js", "React Js"],
  },
  {
    id: 3,
    name: "Backend Public Chat",
    description:
      "The real-time service and API behind a lightweight public chat product.",
    link: "https://github.com/ArRahmaan17/backend-sim-pkl",
    image: notfound,
    types: ["Node Js", "Express Js"],
  },
  {
    id: 4,
    name: "WhatsApp Attendance Service",
    description:
      "Automated attendance notifications and operational messaging for internship teams.",
    link: "https://github.com/ArRahmaan17/simpkl-whatsappblast-services",
    image: notfound,
    types: ["Node Js", "Express Js"],
  },
  {
    id: 5,
    name: "Todos",
    description:
      "A focused task manager with a fast Laravel and Tailwind workflow.",
    link: "https://todos.rahmaanms.my.id",
    image: todos,
    types: ["Laravel", "Tailwind Css"],
  },
  {
    id: 6,
    name: "Doglexable Point of Sale",
    description:
      "A live point-of-sale system designed around everyday retail operations.",
    link: "https://dpos.rahmaanms.my.id",
    image: pos,
    types: ["Laravel", "Reverb", "Docker", "Tailwind Css"],
  },
  {
    id: 7,
    name: "Filestream",
    description:
      "A containerized file delivery product for dependable uploads and access.",
    link: "https://filestream.rahmaanms.my.id",
    image: filestream,
    types: ["Laravel", "Docker", "Tailwind Css"],
  },
  {
    id: 8,
    name: "Dog Table",
    description:
      "A small JavaScript table library exploring reusable data presentation.",
    link: "https://arrahmaan17.github.io/dog-table",
    image: dogTable,
    types: ["JavaScript", "Library", "HTML/CSS"],
  },
];

function extractPortfolioTypes(portfolio) {
  const candidates = [
    portfolio?.Skills,
    portfolio?.skills,
    portfolio?.Skill,
    portfolio?.skill,
    portfolio?.Stacks,
    portfolio?.stacks,
    portfolio?.StackPortfolios,
    portfolio?.stackPortfolios,
  ];
  const names = candidates.flatMap((candidate) => {
    if (!candidate) return [];
    if (Array.isArray(candidate))
      return candidate.flatMap((item) => {
        if (!item) return [];
        if (typeof item === "string") return [item];
        const direct = item.name ?? item.label;
        if (direct) return [direct];
        const nested =
          item.Skill?.name ??
          item.skill?.name ??
          item.Stack?.name ??
          item.stack?.name;
        return nested ? [nested] : [];
      });
    if (typeof candidate === "string")
      return candidate
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
    return [];
  });
  return [...new Set(names.map((name) => String(name).trim()).filter(Boolean))];
}

function resolveProjectImage(imagePath) {
  if (!imagePath) return notfound;
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  if (typeof imagePath === "string" && imagePath.startsWith("/storage/"))
    return backendAssetUrl(imagePath);
  return imagePath;
}

function ProjectImage({ project }) {
  const [source, setSource] = useState(() =>
    resolveProjectImage(project.image),
  );

  useEffect(() => {
    setSource(resolveProjectImage(project.image));
  }, [project.image]);

  return (
    <img
      loading="lazy"
      decoding="async"
      className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-signal group-hover:scale-[1.035]"
      src={source}
      alt=""
      onError={() => {
        if (source !== notfound) setSource(notfound);
      }}
    />
  );
}

function ProjectCard({ project, index, total }) {
  const archivePosition = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  const content = (
    <SpotlightCard
      className="group h-full rounded-[2rem] border border-slate-200/80 bg-white p-3 shadow-2xl shadow-slate-950/[0.06] dark:border-white/10 dark:bg-panel dark:shadow-black/20 sm:p-4"
      spotlightColor="rgba(139,92,246,0.12)"
    >
      <div className="grid h-full gap-5 md:grid-cols-[1.18fr_0.82fr]">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[1.4rem] bg-slate-100 dark:bg-void md:aspect-auto md:min-h-[27rem]">
          <ProjectImage project={project} />
          <div className="absolute inset-0 bg-gradient-to-t from-void/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-void/60 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-white backdrop-blur-md md:hidden">
            Project {archivePosition}
          </div>
        </div>
        <div className="flex flex-1 flex-col px-2 pb-2 pt-3 sm:px-3 sm:pb-3 md:p-5 lg:p-7">
          <div className="flex items-start justify-between gap-4">
            <p className="hidden font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary md:block">
              Project {archivePosition}
            </p>
            {project.link ? (
              <ExternalLink className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-primary" />
            ) : null}
          </div>
          <h3 className="mt-4 font-display text-2xl font-semibold leading-tight tracking-[-0.03em] text-slate-950 dark:text-cloud sm:text-3xl md:mt-10 lg:text-4xl">
            {project.name}
          </h3>
          {project.description ? (
            <p className="mt-4 font-body text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-7">
              {project.description}
            </p>
          ) : null}
          <div className="mt-auto flex flex-wrap gap-2 pt-7">
            {project.types.map((type) => (
              <span key={`${project.id}-${type}`} className="tech-tag">
                {type}
              </span>
            ))}
          </div>
          {project.link ? (
            <span className="mt-6 inline-flex items-center gap-2 font-body text-sm font-semibold text-slate-900 dark:text-cloud sm:mt-8">
              View project{" "}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          ) : null}
        </div>
      </div>
    </SpotlightCard>
  );

  return project.link ? (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full rounded-[2rem] focus-visible:outline-none"
    >
      {content}
    </a>
  ) : (
    content
  );
}

export default function Portfolio() {
  const { t } = useTranslation();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadPortfolios = async () => {
      try {
        const response = await fetch(PORTFOLIOS_URL);
        const payload = await response.json().catch(() => ({}));
        if (!response.ok)
          throw new Error(
            payload.message ||
              `Failed to fetch portfolios (${response.status})`,
          );
        if (!cancelled)
          setPortfolios(
            Array.isArray(payload.portfolios) ? payload.portfolios : [],
          );
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadPortfolios();
    return () => {
      cancelled = true;
    };
  }, []);

  const projects = useMemo(
    () =>
      portfolios.length
        ? portfolios.map((portfolio) => ({
            id: portfolio.id,
            name: portfolio.name,
            description: portfolio.description || "",
            link: portfolio.link || "",
            image: portfolio.picture,
            types: extractPortfolioTypes(portfolio),
          }))
        : FALLBACK_PROJECTS,
    [portfolios],
  );

  const isFallback = !loading && portfolios.length === 0;

  return (
    <section id="portfolio" className="section-shell relative overflow-x-clip">
      <div
        className="pointer-events-none absolute right-[-10rem] top-24 h-[32rem] w-[32rem] rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl lg:grid lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-16 xl:gap-24">
        <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <SectionHeading
            eyebrow={t("portfolio")}
            title={t("portfolio_section.title", {
              defaultValue: "Work shaped around real constraints.",
            })}
            description={t("portfolio_section.description", {
              defaultValue:
                "Selected products and experiments spanning operations, communication, commerce, and developer tooling.",
            })}
          />
          <p className="max-w-xs font-mono text-[0.68rem] uppercase leading-5 tracking-[0.14em] text-slate-400">
            {isFallback
              ? "Sample archive · live data unavailable"
              : `${projects.length} systems in the archive`}
          </p>
        </div>

        {loading ? (
          <div className="mt-14 space-y-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-[28rem] animate-pulse rounded-[2rem] bg-slate-200 dark:bg-white/5"
              />
            ))}
          </div>
        ) : (
          <ScrollStack
            className="portfolio-scroll-stack"
            itemDistance={72}
            itemScale={0.018}
            itemStackDistance={22}
            stackPosition="14%"
            scaleEndPosition="7%"
            baseScale={0.9}
            scaleDuration={0.12}
            rotationAmount={0.8}
            blurAmount={3.5}
            useWindowScroll
          >
            {projects.map((project, index) => (
              <ScrollStackItem key={project.id}>
                <ProjectCard
                  project={project}
                  index={index}
                  total={projects.length}
                />
              </ScrollStackItem>
            ))}
          </ScrollStack>
        )}
      </div>
    </section>
  );
}
