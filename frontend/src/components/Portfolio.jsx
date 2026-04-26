import simpkl from "../assets/portfolio/sim-pkl.webp";
import notfound from "../assets/portfolio/not-found.webp";
import todos from "../assets/portfolio/todos.webp";
import pos from "../assets/portfolio/pos.webp";
import filestream from "../assets/portfolio/file-stream.webp";
import dogTable from "../assets/portfolio/dog-table.webp";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { backendAssetUrl, PORTFOLIOS_URL } from "../constants";

const FALLBACK_PROJECTS = [
  {
    id: 1,
    name: "SIM PKL",
    link: "https://github.com/ArRahmaan17/sim_pkl",
    image: simpkl,
    types: ["Laravel", "Bootstrap"],
  },
  {
    id: 2,
    name: "Frontend Public Chat",
    link: "https://github.com/ArRahmaan17/frontend-sim-pkl",
    image: notfound,
    types: ["Node Js", "React Js"],
  },
  {
    id: 3,
    name: "Backend Public Chat",
    link: "https://github.com/ArRahmaan17/backend-sim-pkl",
    image: notfound,
    types: ["Node Js", "Express Js"],
  },
  {
    id: 4,
    name: "Wa Services Presensi PKL",
    link: "https://github.com/ArRahmaan17/simpkl-whatsappblast-services",
    image: notfound,
    types: ["Node Js", "Express Js"],
  },
  {
    id: 5,
    name: "Todos - Live Demo",
    link: "https://todos.rahmaanms.my.id",
    image: todos,
    types: ["Laravel", "Tailwind Css"],
  },
  {
    id: 6,
    name: "DOGLEXABLE POINT OF SALE",
    link: "https://dpos.rahmaanms.my.id",
    image: pos,
    types: ["Laravel", "Reverb", "Docker", "Tailwind Css"],
  },
  {
    id: 7,
    name: "Filestream",
    link: "https://filestream.rahmaanms.my.id",
    image: filestream,
    types: ["Laravel", "Docker", "Tailwind Css"],
  },
  {
    id: 8,
    name: "Dog Table",
    link: "https://arrahmaan17.github.io/dog-table",
    image: dogTable,
    types: ["JavaScript", "Library", "HTML/CSS"],
  },
];

export default function Portfolio(props) {
  const { t } = useTranslation();
  const [portfolios, setPortfolios] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const loadPortfolios = async () => {
      try {
        const response = await fetch(PORTFOLIOS_URL);
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload.message || `Failed to fetch portfolios (${response.status})`);
        }

        const nextPortfolios = Array.isArray(payload.portfolios) ? payload.portfolios : [];
        if (!cancelled) {
          setPortfolios(nextPortfolios);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadPortfolios();
    return () => {
      cancelled = true;
    };
  }, []);

  const projects = useMemo(() => {
    if (!portfolios || portfolios.length === 0) {
      return FALLBACK_PROJECTS;
    }

    return portfolios.map((portfolio) => {
      const skills = portfolio.Skills ?? portfolio.skills ?? [];
      const types = Array.isArray(skills) ? skills.map((skill) => skill.name).filter(Boolean) : [];

      return {
        id: portfolio.id,
        name: portfolio.name,
        link: portfolio.link || "",
        image: portfolio.picture,
        types,
      };
    });
  }, [portfolios]);

  const resolveProjectImage = (imagePath) => {
    if (!imagePath) {
      return "";
    }

    if (/^https?:\/\//i.test(imagePath)) {
      return imagePath;
    }

    // API-managed assets are persisted under /storage; fallback assets are local imports.
    if (typeof imagePath === "string" && imagePath.startsWith("/storage/")) {
      return backendAssetUrl(imagePath);
    }

    return imagePath;
  };

  return (
    <div className="dark:bg-black" id="portfolio">
      <div className="relative isolate px-6 py-16 lg:px-8 lg:py-56">
        <div
          className="absolute inset-x-0 -top-40 -z-5 transform-gpu overflow-hidden blur-3xl sm:-top-70"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={props.customStyle}
          ></div>
        </div>
        <div className="mx-50 max-w-auto py-8 md:mx-20 md:py-16 lg:mx-5">
          <p className="pb-10 pt-8 text-center text-2xl dark:text-white md:text-4xl lg:text-6xl">
            {t("portfolio")}
          </p>
          <div className="grid grid-cols-1 gap-x-4 gap-y-5 pb-36 pt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {projects.map((project) => (
              <a
                key={project.id}
                href={project.link || undefined}
                target={project.link ? "_blank" : undefined}
                rel={project.link ? "noopener noreferrer" : undefined}
                onClick={(e) => {
                  if (!project.link) {
                    e.preventDefault();
                  }
                }}
                className="delay-50 group min-w-32 basis-full sm:basis-1/5 shrink cursor-pointer rounded-md bg-slate-100 p-0 outline outline-offset-0 outline-slate-300 transition-all duration-100 ease-out dark:bg-slate-700/60 dark:outline-slate-700/60 hover:dark:bg-slate-700/80"
              >
                <div className="flex min-w-0 flex-col gap-x-1">
                  <img
                    loading="lazy"
                    decoding="async"
                    className="aspect-[1200/630] h-auto w-full rounded-md object-cover object-center md:grayscale md:group-hover:grayscale-0"
                    src={resolveProjectImage(project.image)}
                    alt={project.name}
                  />
                  <div className="md:min-h-20 flex-auto">
                    <p className="md:translate-y-5 group-hover:md:translate-y-0 transition-all duration-500 text-lg md:text-lg lg:text-xl xl:text-3xl group-hover:md:text-md font-semibold leading-6 dark:text-gray-100 md:dark:text-gray-600 dark:group-hover:text-gray-100">
                      {project.name}
                    </p>
                    <div className="md:translate-y-0 group-hover:md:translate-y-15 transition-all duration-500 flex flex-row flex-wrap gap-2 truncate text-xs leading-5">
                      {project.types.map((type) => (
                        <p
                          className="font-sx mt-1 basis-1 text-sm text-gray-400 dark:text-gray-300 group-hover:text-black md:dark:text-gray-500 group-hover:dark:text-gray-100 opacity-60 md:opacity-0 group-hover:opacity-100 transform-gpu transition-all group-hover:transition-all duration-100 ease-in-out delay-100 group-hover:duration-500 group-hover:ease-in-out group-hover:transform-gpu"
                          key={`${project.id}-${type}`}
                        >
                          {type}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={props.customStyle}
          ></div>
        </div>
      </div>
    </div>
  );
}
