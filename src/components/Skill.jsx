import React from "react";
import tailwindcss from "../assets/stack-logos/tailwindcss.svg";
import laravel from "../assets/stack-logos/laravel.svg";
import expressjs from "../assets/stack-logos/expressjs.svg";
import react from "../assets/stack-logos/react.svg";
import nodejs from "../assets/stack-logos/nodejs.svg";
import docker from "../assets/stack-logos/docker.svg";
import bootstrap from "../assets/stack-logos/bootstrap.svg";
const Skill = (props) => {
  const skills = [
    {
      name: "Laravel",
      level: "Intermediate",
      experience: "2 years",
      imageUrl: laravel,
    },
    {
      name: "Tailwind Css",
      level: "Elementary",
      experience: "5 months",
      imageUrl: tailwindcss,
    },
    {
      name: "Express Js",
      level: "Beginner",
      experience: "5 months",
      imageUrl: expressjs,
    },
    {
      name: "React Js",
      level: "Beginner",
      experience: "5 months",
      imageUrl: react,
    },
    {
      name: "Node Js",
      level: "Beginner",
      experience: "7 months",
      imageUrl: nodejs,
    },
    {
      name: "Docker",
      level: "Beginner",
      experience: "3 months",
      imageUrl: docker,
    },
    {
      name: "Bootstrap",
      level: "Intermediate",
      experience: "2 years",
      imageUrl: bootstrap,
    },
  ];
  return (
    <div className="bg-black" id="stack">
      <div className="relative isolate px-6 py-28 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={props.customStyle}
          ></div>
        </div>
        <div className="mx-50 md:mx-20 lg:mx-5 max-w-auto py-8 md:py-16">
          <p className="text-center pt-8 pb-10 text-2xl md:text-4xl lg:text-6xl text-white">
            Tech Stack
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-10 gap-x-4 pt-10 pb-8">
            {skills.map((skill) => (
              <div
                key={skill.name}
                className="bg-slate-700/60 p-3 rounded-md hover:bg-slate-500/80 cursor-pointer group transition-all delay-50 duration-300 ease-in-out"
              >
                <div className="flex min-w-0 gap-x-4">
                  <img
                    className="h-12 w-12 flex-none group-hover:scale-125 transition duration-75 scale-100"
                    src={skill.imageUrl}
                    alt={skill.name}
                  />
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300">
                      {skill.name}
                    </p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-300 group-hover:hidden ease-in group-hover:ease-out group-hover:scale-y-0 transition-all delay-100 group-hover:delay-300 group-hover:duration-300 duration-300">
                      {skill.level}
                    </p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-300 hidden group-hover:block ease-out group-hover:ease-out group-hover:scale-y-100 transition-all delay-100 group-hover:delay-300 group-hover:duration-300 duration-300">
                      {skill.experience} experience
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
