import React from "react";
import tailwindcss from "../assets/stack-logos/tailwindcss.svg";
import laravel from "../assets/stack-logos/laravel.svg";
import expressjs from "../assets/stack-logos/expressjs.svg";
import react from "../assets/stack-logos/react.svg";
import nodejs from "../assets/stack-logos/nodejs.svg";
import docker from "../assets/stack-logos/docker.svg";
import bootstrap from "../assets/stack-logos/bootstrap.svg";
import { useTranslation } from "react-i18next";
const Skill = (props) => {
  const { t } = useTranslation();
  const skills = [
    {
      name: "Laravel",
      level: t("intermediate"),
      experience: "2 " + t("years"),
      imageUrl: laravel,
    },
    {
      name: "Tailwind Css",
      level: t("beginner"),
      experience: "5 " + t("month"),
      imageUrl: tailwindcss,
    },
    {
      name: "Express Js",
      level: t("beginner"),
      experience: "5 " + t("month"),
      imageUrl: expressjs,
    },
    {
      name: "React Js",
      level: t("beginner"),
      experience: "5 " + t("month"),
      imageUrl: react,
    },
    {
      name: "Node Js",
      level: t("beginner"),
      experience: "7 " + t("month"),
      imageUrl: nodejs,
    },
    {
      name: "Docker",
      level: t("beginner"),
      experience: "3 " + t("month"),
      imageUrl: docker,
    },
    {
      name: "Bootstrap",
      level: t("intermediate"),
      experience: "2 " + t("years"),
      imageUrl: bootstrap,
    },
  ];
  return (
    <div className="bg-black" id="stack">
      <div className="relative isolate px-6 py-16 lg:px-8 lg:py-56">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={props.customStyle}
          ></div>
        </div>
        <div className="mx-50 max-w-auto py-8 md:mx-20 md:py-16 lg:mx-5">
          <p className="pb-10 pt-8 text-center text-2xl text-white md:text-4xl lg:text-6xl">
            {t("stack")}
          </p>
          <div className="grid grid-cols-1 gap-x-4 gap-y-10 pb-36 pt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {skills.map((skill) => (
              <div
                key={skill.name}
                className="delay-50 group cursor-pointer rounded-md bg-slate-700/60 p-3 transition-all duration-300 ease-out hover:bg-slate-500/80 hover:outline hover:outline-offset-4 hover:outline-indigo-500"
              >
                <div className="flex min-w-0 gap-x-4">
                  <img
                    className="h-12 w-12 flex-none scale-100 transition duration-75 group-hover:scale-125"
                    src={skill.imageUrl}
                    alt={skill.name}
                  />
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-gray-300">
                      {skill.name}
                    </p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-300 transition-all delay-100 duration-300 ease-in group-hover:hidden group-hover:scale-y-0 group-hover:delay-300 group-hover:duration-300 group-hover:ease-out">
                      {skill.level}
                    </p>
                    <p className="mt-1 hidden truncate text-xs leading-5 text-gray-300 transition-all delay-100 duration-300 ease-out group-hover:block group-hover:scale-y-100 group-hover:delay-300 group-hover:duration-300 group-hover:ease-out">
                      {skill.experience} {t("experience")}
                    </p>
                  </div>
                </div>
              </div>
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
};
export default Skill;
